import { useState } from 'react';
import { getCategoryById, searchCategories, CATEGORY_GROUPS, ALL_CATEGORIES } from '../utils/pricing/categories';
import { getRelatedCategories, getAutoAddCategories } from '../utils/pricing/categoryRelations';
import { getDefaultPCItems, getDefaultInclusions, getDefaultExclusions } from '../utils/pricing/quoteDefaults';
import { recogniseScope } from '../utils/pricing/scopeRecogniser';
import { suggestContingency } from '../utils/pricing/quoteCalculator';
import { generateId } from '../utils/id';
import type { Variation, PCItem, InclusionItem, ExclusionItem } from '../types/domain';
import type { WorkCategory, StageTemplate } from '../utils/pricing/categories/types';
import type { CategoryRelation } from '../utils/pricing/categoryRelations';

interface ScopeEntry {
  id: string;
  description: string;
  categoryId: string;
  categoryLabel: string;
  category: WorkCategory | null;
  dimensions: { width: number; length: number; height: number };
  answers: Record<string, string>;
  stages: StageTemplate[];
  pcItems: PCItem[];
  inclusions: InclusionItem[];
  exclusions: ExclusionItem[];
}

interface Props {
  onSave: (data: Partial<Variation>) => void;
  onCancel: () => void;
  editingVariation?: Variation;
  geminiApiKey?: string;
  documentType?: 'quote' | 'variation';
  existingQuotes?: Variation[];
}

export function VariationBuilder({ onSave, onCancel, editingVariation, geminiApiKey, documentType = 'quote', existingQuotes = [] }: Props) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState(editingVariation?.title || '');
  const [scopeText, setScopeText] = useState('');
  const [scopes, setScopes] = useState<ScopeEntry[]>([]);
  const [overheadPercent, setOverheadPercent] = useState(12);
  const [profitPercent, setProfitPercent] = useState(15);
  const [contingencyPercent, setContingencyPercent] = useState(5);
  const [suggestions, setSuggestions] = useState<CategoryRelation[]>([]);
  const [showBrowser, setShowBrowser] = useState(false);
  const [referenceQuoteId, setReferenceQuoteId] = useState('');
  const [reasonForChange, setReasonForChange] = useState('');
  const [polishingId, setPolishingId] = useState<string | null>(null);
  const isVariation = documentType === 'variation';
  const docLabel = isVariation ? 'Variation' : 'Quote';

  const handleRecognise = () => {
    if (!scopeText.trim()) return;
    const result = recogniseScope(scopeText);
    if (result.category) {
      addScopeFromCategory(result.category, scopeText);
    }
  };

  const addScopeFromCategory = (cat: WorkCategory, desc: string = '') => {
    if (scopes.find(s => s.categoryId === cat.id)) return;
    const newScope: ScopeEntry = {
      id: generateId(),
      description: desc || cat.label,
      categoryId: cat.id,
      categoryLabel: cat.label,
      category: cat,
      dimensions: { width: 3, length: 3, height: 2.4 },
      answers: {},
      stages: [...cat.stages],
      pcItems: getDefaultPCItems(cat.id),
      inclusions: getDefaultInclusions(cat.id),
      exclusions: getDefaultExclusions(cat.id),
    };
    setScopes(prev => [...prev, newScope]);
    setScopeText('');
    const related = getRelatedCategories(cat.id);
    setSuggestions(related.filter(r => !scopes.find(s => s.categoryId === r.categoryId)));
    const autoSuggest = suggestContingency([cat.id]);
    if (autoSuggest) setContingencyPercent(autoSuggest);
  };

  const handleAcceptSuggestion = (rel: CategoryRelation) => {
    const cat = getCategoryById(rel.categoryId);
    if (cat) addScopeFromCategory(cat);
    setSuggestions(prev => prev.filter(s => s.categoryId !== rel.categoryId));
  };

  const handleAcceptAllAuto = () => {
    const autoSuggestions = suggestions.filter(s => s.priority === 'auto');
    autoSuggestions.forEach(s => {
      const cat = getCategoryById(s.categoryId);
      if (cat && !scopes.find(sc => sc.categoryId === s.categoryId)) {
        addScopeFromCategory(cat);
      }
    });
    setSuggestions(prev => prev.filter(s => s.priority !== 'auto'));
  };

  const removeScope = (id: string) => {
    setScopes(prev => prev.filter(s => s.id !== id));
  };

  const handlePolish = async (scopeId: string, description: string) => {
    if (!geminiApiKey) return;
    setPolishingId(scopeId);
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Rewrite this construction scope description to sound professional and technical. Keep it concise, use Australian construction terminology. Return only the rewritten text, nothing else.\n\nOriginal: "${description}"` }] }]
        })
      });
      const data = await res.json();
      const polished = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (polished) {
        setScopes(prev => prev.map(s => s.id === scopeId ? { ...s, description: polished.trim() } : s));
      }
    } catch (e) { console.error(e); }
    setPolishingId(null);
  };

  const handleSave = () => {
    const area = scopes.reduce((sum, s) => sum + s.dimensions.width * s.dimensions.length, 0);
    const tradeCost = scopes.reduce((sum, s) => {
      return sum + s.stages.reduce((stageSum, st) => {
        const qty = st.unitType === 'allow' ? 1 : st.unitType === 'item' ? (st.defaultQty || 1) : s.dimensions.width * s.dimensions.length;
        return stageSum + st.unitRate * qty;
      }, 0);
    }, 0);
    const overhead = tradeCost * overheadPercent / 100;
    const profit = (tradeCost + overhead) * profitPercent / 100;
    const subtotal = tradeCost + overhead + profit;
    const contingency = subtotal * contingencyPercent / 100;
    const beforeGst = subtotal + contingency;
    const gst = beforeGst * 0.1;

    const variation: Partial<Variation> = {
      title: title || scopes.map(s => s.categoryLabel).join(' + '),
      description: scopes.map(s => s.description).join('. '),
      roomType: scopes[0]?.categoryId || 'general',
      dimensions: scopes[0]?.dimensions || { width: 0, length: 0, height: 0 },
      documentType,
      referenceQuoteId: isVariation ? referenceQuoteId : undefined,
      reasonForChange: isVariation ? reasonForChange : undefined,
      scopes: scopes.map(s => ({
        categoryId: s.categoryId,
        categoryLabel: s.categoryLabel,
        description: s.description,
        dimensions: s.dimensions,
        answers: Object.entries(s.answers).map(([k, v]) => ({ questionId: k, label: k, value: v })),
        stages: s.stages.map(st => ({
          id: generateId(),
          name: st.name,
          trade: st.trade,
          cost: Math.round(st.unitRate * (st.unitType === 'allow' ? 1 : s.dimensions.width * s.dimensions.length)),
          duration: st.duration,
          description: st.description || st.name,
          status: 'not-started' as const,
        })),
        pcItems: s.pcItems,
      })),
      pricing: {
        overheadPercent,
        profitPercent,
        contingencyPercent,
        gstPercent: 10,
        tradeCost: Math.round(tradeCost),
        overhead: Math.round(overhead),
        profit: Math.round(profit),
        contingency: Math.round(contingency),
        gst: Math.round(gst),
        clientTotal: Math.round(beforeGst),
        totalIncGst: Math.round(beforeGst + gst),
        totalBeforeGst: Math.round(beforeGst),
      },
      globalInclusions: scopes.flatMap(s => s.inclusions),
      globalExclusions: scopes.flatMap(s => s.exclusions),
      globalPCItems: scopes.flatMap(s => s.pcItems),
    };
    onSave(variation);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-2xl p-6">
        <h2 className="text-2xl font-bold">📋 New {docLabel} Builder</h2>
        <p className="text-indigo-100">Step {step} of 4</p>
      </div>
      <div className="bg-white rounded-b-2xl shadow-xl p-6">

        {/* Step 1: Scope Input */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{docLabel} Title</label>
              <input className="w-full border rounded-lg p-3" value={title} onChange={e => setTitle(e.target.value)} placeholder={`e.g., Bathroom Renovation`} />
            </div>

            {isVariation && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-amber-800">🔄 Variation Details</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reference Quote</label>
                  <select className="w-full border rounded-lg p-2" value={referenceQuoteId} onChange={e => setReferenceQuoteId(e.target.value)}>
                    <option value="">Select original quote...</option>
                    {existingQuotes.filter(q => q.status === 'approved').map(q => (
                      <option key={q.id} value={q.id}>{q.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reason for Change</label>
                  <select className="w-full border rounded-lg p-2" value={reasonForChange} onChange={e => setReasonForChange(e.target.value)}>
                    <option value="">Select reason...</option>
                    <option value="Client Request">Client Request</option>
                    <option value="Site Condition">Site Condition</option>
                    <option value="Design Change">Design Change</option>
                    <option value="Compliance">Compliance Requirement</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Describe the scope of work</label>
              <div className="flex gap-2">
                <input className="flex-1 border rounded-lg p-3" value={scopeText} onChange={e => setScopeText(e.target.value)} placeholder="e.g., bathroom renovation 3x2.5m full gut and redo" onKeyDown={e => e.key === 'Enter' && handleRecognise()} />
                <button onClick={handleRecognise} className="bg-indigo-600 text-white px-4 rounded-lg font-semibold hover:bg-indigo-700">+ Add Scope</button>
              </div>
              <button onClick={() => setShowBrowser(!showBrowser)} className="text-sm text-indigo-600 mt-2 hover:underline">
                {showBrowser ? '✕ Hide' : '📂 Browse'} all 43 categories
              </button>
            </div>

            {showBrowser && (
              <div className="border rounded-lg p-4 max-h-60 overflow-y-auto bg-gray-50">
                {CATEGORY_GROUPS.map(group => (
                  <div key={group.label} className="mb-3">
                    <h4 className="font-semibold text-sm text-gray-500 mb-1">{group.label}</h4>
                    <div className="flex flex-wrap gap-1">
                      {group.categories.map(cat => (
                        <button key={cat.id} onClick={() => addScopeFromCategory(cat)} className="text-xs bg-white border rounded px-2 py-1 hover:bg-indigo-50 hover:border-indigo-300">
                          {cat.icon} {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Scopes added */}
            {scopes.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-700">Scopes ({scopes.length})</h3>
                {scopes.map(scope => (
                  <div key={scope.id} className="flex items-center justify-between bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                    <div>
                      <span className="font-medium">{scope.category?.icon} {scope.categoryLabel}</span>
                      <p className="text-sm text-gray-500">{scope.description}</p>
                    </div>
                    <div className="flex gap-2">
                      {geminiApiKey && (
                        <button onClick={() => handlePolish(scope.id, scope.description)} disabled={polishingId === scope.id} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200">
                          {polishingId === scope.id ? '⏳' : '✨'} Polish
                        </button>
                      )}
                      <button onClick={() => removeScope(scope.id)} className="text-red-500 hover:text-red-700 text-sm">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-blue-800">🔗 Related Categories Detected</h3>
                  {suggestions.some(s => s.priority === 'auto') && (
                    <button onClick={handleAcceptAllAuto} className="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700">Accept All Recommended</button>
                  )}
                </div>
                {suggestions.map(s => (
                  <div key={s.categoryId} className={`flex items-center justify-between p-2 rounded ${s.priority === 'auto' ? 'bg-blue-100' : 'bg-amber-50'}`}>
                    <div>
                      <span className="font-medium text-sm">{s.priority === 'auto' ? '🔗' : '💡'} {getCategoryById(s.categoryId)?.label}</span>
                      <p className="text-xs text-gray-500">{s.reason}</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => handleAcceptSuggestion(s)} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">✓ Add</button>
                      <button onClick={() => setSuggestions(prev => prev.filter(x => x.categoryId !== s.categoryId))} className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Dimensions & Questions */}
        {step === 2 && (
          <div className="space-y-6">
            {scopes.map((scope, idx) => (
              <div key={scope.id} className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">{scope.category?.icon} {scope.categoryLabel}</h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-gray-600">Width (m)</label>
                    <input type="number" className="w-full border rounded p-2" value={scope.dimensions.width}
                      onChange={e => setScopes(prev => prev.map((s, i) => i === idx ? { ...s, dimensions: { ...s.dimensions, width: +e.target.value } } : s))} />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Length (m)</label>
                    <input type="number" className="w-full border rounded p-2" value={scope.dimensions.length}
                      onChange={e => setScopes(prev => prev.map((s, i) => i === idx ? { ...s, dimensions: { ...s.dimensions, length: +e.target.value } } : s))} />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Height (m)</label>
                    <input type="number" className="w-full border rounded p-2" value={scope.dimensions.height}
                      onChange={e => setScopes(prev => prev.map((s, i) => i === idx ? { ...s, dimensions: { ...s.dimensions, height: +e.target.value } } : s))} />
                  </div>
                </div>
                {scope.category?.questions && scope.category.questions.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-gray-700">Questions</h4>
                    {scope.category.questions.map(q => (
                      <div key={q.id}>
                        <label className="block text-sm text-gray-600">{q.label}</label>
                        {q.options ? (
                          <select className="w-full border rounded p-2" value={scope.answers[q.id] || ''} onChange={e => setScopes(prev => prev.map((s, i) => i === idx ? { ...s, answers: { ...s.answers, [q.id]: e.target.value } } : s))}>
                            <option value="">Select...</option>
                            {q.options.map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        ) : (
                          <input className="w-full border rounded p-2" value={scope.answers[q.id] || ''} onChange={e => setScopes(prev => prev.map((s, i) => i === idx ? { ...s, answers: { ...s.answers, [q.id]: e.target.value } } : s))} />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Step 3: Pricing & Items */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Overhead %</label>
                <input type="number" className="w-full border rounded p-2" value={overheadPercent} onChange={e => setOverheadPercent(+e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Profit %</label>
                <input type="number" className="w-full border rounded p-2" value={profitPercent} onChange={e => setProfitPercent(+e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contingency %</label>
                <input type="number" className="w-full border rounded p-2" value={contingencyPercent} onChange={e => setContingencyPercent(+e.target.value)} />
              </div>
            </div>

            {scopes.map((scope, idx) => (
              <div key={scope.id} className="border rounded-lg p-4 space-y-4">
                <h3 className="font-semibold">{scope.category?.icon} {scope.categoryLabel} — Items</h3>

                {/* PC Items */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">PC Items (Prime Cost Allowances)</h4>
                  {scope.pcItems.map((item, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-2 mb-1">
                      <span className="flex-1 text-sm">{item.description}</span>
                      <span className="text-sm text-gray-500">${item.allowance}/{item.unit}</span>
                      <button onClick={() => setScopes(prev => prev.map((s, i) => i === idx ? { ...s, pcItems: s.pcItems.filter((_, pi) => pi !== pIdx) } : s))} className="text-red-400 text-xs">✕</button>
                    </div>
                  ))}
                </div>

                {/* Inclusions */}
                <div>
                  <h4 className="text-sm font-medium text-green-700 mb-2">✓ Inclusions</h4>
                  {scope.inclusions.map((item, iIdx) => (
                    <div key={iIdx} className="flex items-center gap-2 mb-1">
                      <span className="flex-1 text-sm text-green-700">✓ {item.text}</span>
                      <button onClick={() => setScopes(prev => prev.map((s, i) => i === idx ? { ...s, inclusions: s.inclusions.filter((_, ii) => ii !== iIdx) } : s))} className="text-red-400 text-xs">✕</button>
                    </div>
                  ))}
                </div>

                {/* Exclusions */}
                <div>
                  <h4 className="text-sm font-medium text-red-700 mb-2">✗ Exclusions</h4>
                  {scope.exclusions.map((item, eIdx) => (
                    <div key={eIdx} className="flex items-center gap-2 mb-1">
                      <span className="flex-1 text-sm text-red-700">✗ {item.text}</span>
                      <button onClick={() => setScopes(prev => prev.map((s, i) => i === idx ? { ...s, exclusions: s.exclusions.filter((_, ei) => ei !== eIdx) } : s))} className="text-red-400 text-xs">✕</button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold">{docLabel} Summary</h3>
            {scopes.map(scope => {
              const area = scope.dimensions.width * scope.dimensions.length;
              const scopeCost = scope.stages.reduce((sum, st) => {
                const qty = st.unitType === 'allow' ? 1 : st.unitType === 'item' ? (st.defaultQty || 1) : area;
                return sum + st.unitRate * qty;
              }, 0);
              return (
                <div key={scope.id} className="border rounded-lg p-4">
                  <div className="flex justify-between">
                    <span className="font-semibold">{scope.category?.icon} {scope.categoryLabel}</span>
                    <span className="font-bold">${Math.round(scopeCost).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-500">{scope.dimensions.width}m × {scope.dimensions.length}m — {scope.stages.length} stages</p>
                </div>
              );
            })}
            <div className="bg-gray-50 rounded-lg p-4 space-y-1 text-right">
              {(() => {
                const tradeCost = scopes.reduce((sum, s) => {
                  const area = s.dimensions.width * s.dimensions.length;
                  return sum + s.stages.reduce((ss, st) => {
                    const qty = st.unitType === 'allow' ? 1 : st.unitType === 'item' ? (st.defaultQty || 1) : area;
                    return ss + st.unitRate * qty;
                  }, 0);
                }, 0);
                const oh = tradeCost * overheadPercent / 100;
                const pr = (tradeCost + oh) * profitPercent / 100;
                const sub = tradeCost + oh + pr;
                const cont = sub * contingencyPercent / 100;
                const bGst = sub + cont;
                const g = bGst * 0.1;
                return (
                  <>
                    <p>Trade Cost: <strong>${Math.round(tradeCost).toLocaleString()}</strong></p>
                    <p>Overhead ({overheadPercent}%): <strong>${Math.round(oh).toLocaleString()}</strong></p>
                    <p>Profit ({profitPercent}%): <strong>${Math.round(pr).toLocaleString()}</strong></p>
                    <p>Contingency ({contingencyPercent}%): <strong>${Math.round(cont).toLocaleString()}</strong></p>
                    <hr className="my-2" />
                    <p>Subtotal: <strong>${Math.round(bGst).toLocaleString()}</strong></p>
                    <p>GST (10%): <strong>${Math.round(g).toLocaleString()}</strong></p>
                    <p className="text-xl font-bold text-indigo-700">Total Inc GST: ${Math.round(bGst + g).toLocaleString()}</p>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button onClick={step === 1 ? onCancel : () => setStep(step - 1)} className="px-6 py-2 border rounded-lg text-gray-600 hover:bg-gray-50">
            {step === 1 ? 'Cancel' : '← Back'}
          </button>
          {step < 4 ? (
            <button onClick={() => setStep(step + 1)} disabled={step === 1 && scopes.length === 0} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50">
              Next →
            </button>
          ) : (
            <button onClick={handleSave} className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700">
              💾 Save {docLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}