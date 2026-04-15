import { useState } from 'react';
import { usePersistedAppState } from './logic/usePersistedAppState';
import { useProjectWorkspace } from './logic/useProjectWorkspace';
import { COMPANIES } from './constants/companies';
import { VariationReport } from './components/report/VariationReport';
import { Sidebar } from './components/Sidebar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ProjectForm } from './components/ProjectForm';
import { SendWelcomeEmailModal } from './components/SendWelcomeEmailModal';
import { VariationBuilder } from './components/VariationBuilder';
import { downloadProjectExport } from './utils/exportProject';
import { Download, Edit, FileText, RefreshCw } from 'lucide-react';
import type { Variation, Project } from './types/domain';

export default function App() {
  const { appState, setAppState } = usePersistedAppState();
  const workspace = useProjectWorkspace(appState, setAppState);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showWelcomeEmail, setShowWelcomeEmail] = useState(false);
  const [createdProject, setCreatedProject] = useState<Project | null>(null);
  const [showVariationBuilder, setShowVariationBuilder] = useState(false);
  const [editingVariation, setEditingVariation] = useState<Variation | null>(null);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [newDocType, setNewDocType] = useState<'quote' | 'variation'>('quote');

  const currentCompany = COMPANIES.find(c => c.id === appState.activeCompanyId) || COMPANIES[0];
  const activeProject = appState.projects.find(p => p.id === appState.activeProjectId);
  const projectVariations = Object.values(appState.variations).filter(v => activeProject && v.projectId === activeProject.id);
  const activeVariation = projectVariations.find(v => v.id === appState.activeVariationId);
  const quotes = projectVariations.filter(v => !v.documentType || v.documentType === 'quote');
  const hasApprovedQuote = quotes.some(q => q.status === 'approved');

  const handleCreateProject = (data: { name: string; address: string; customerName: string; customerEmail: string }) => {
    const project = workspace.createProject(data.name, data.address, { name: data.customerName, email: data.customerEmail });
    setCreatedProject(project);
    setShowProjectForm(false);
    setShowWelcomeEmail(true);
  };

  const handleSaveVariation = (data: Partial<Variation>) => {
    if (editingVariation) {
      setAppState(prev => ({
        ...prev,
        variations: {
          ...prev.variations,
          [editingVariation.id]: { ...prev.variations[editingVariation.id], ...data },
        },
      }));
      setEditingVariation(null);
    } else {
      workspace.createVariation({
        title: data.title || 'Untitled',
        description: data.description || '',
        roomType: data.roomType || 'general',
        dimensions: data.dimensions || { width: 0, length: 0, height: 0 },
        answers: [],
        solutions: data.solutions || [],
        selectedSolution: data.selectedSolution || 0,
        scopes: data.scopes,
        pricing: data.pricing,
        globalInclusions: data.globalInclusions,
        globalExclusions: data.globalExclusions,
        globalPCItems: data.globalPCItems,
        documentType: data.documentType,
        referenceQuoteId: data.referenceQuoteId,
        reasonForChange: data.reasonForChange,
      });
    }
    setShowVariationBuilder(false);
  };

  const handleStatusChange = (status: string) => {
    if (activeVariation) {
      workspace.setVariationStatus(activeVariation.id, status as Variation['status']);
    }
  };

  const handleSignature = (sig: { name: string; date: string; dataUrl?: string }) => {
    if (activeVariation) {
      workspace.addSignature(activeVariation.id, sig);
    }
  };

  const handleAddLog = (entry: { action: string; details?: string }) => {
    if (activeVariation) {
      workspace.addChangeLog(activeVariation.id, entry.action, entry.details);
    }
  };

  const handleExportProject = () => {
    if (activeProject) {
      downloadProjectExport(activeProject, currentCompany);
    }
  };

  const handleDeleteProject = (projectId: string) => {
    if (confirm('Delete this project and all its quotes/variations? Make sure to download project data first if you need records.')) {
      workspace.deleteProject(projectId);
    }
  };

  if (showVariationBuilder) {
    return (
      <VariationBuilder
        onSave={handleSaveVariation}
        onCancel={() => { setShowVariationBuilder(false); setEditingVariation(null); }}
        editingVariation={editingVariation || undefined}
        geminiApiKey={geminiApiKey}
        documentType={newDocType}
        existingQuotes={quotes}
      />
    );
  }

  return (
    <>
      <Sidebar
        companies={COMPANIES}
        currentCompany={currentCompany}
        projects={appState.projects}
        activeProjectId={appState.activeProjectId}
        onSelectCompany={(id) => setAppState(prev => ({ ...prev, activeCompanyId: id }))}
        onSelectProject={(id) => workspace.selectProject(id)}
        onNewProject={() => setShowProjectForm(true)}
        onDeleteProject={handleDeleteProject}
        onExportProject={(id) => {
          const proj = appState.projects.find(p => p.id === id);
          if (proj) {
            downloadProjectExport(proj, currentCompany);
          }
        }}
      />

      <div className="flex-1 flex flex-col ml-72">
        <div className="bg-gray-100 border-b px-4 py-2 flex items-center gap-2">
          <span className="text-xs text-gray-500">Gemini API Key:</span>
          <input type="password" className="text-xs border rounded px-2 py-1 w-64" value={geminiApiKey} onChange={e => setGeminiApiKey(e.target.value)} placeholder="Paste API key for AI features..." />
        </div>

        {showProjectForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <ProjectForm onSubmit={handleCreateProject} onCancel={() => setShowProjectForm(false)} />
            </div>
          </div>
        )}

        {showWelcomeEmail && createdProject && (
          <SendWelcomeEmailModal
            project={createdProject}
            company={currentCompany}
            onClose={() => setShowWelcomeEmail(false)}
          />
        )}

        {!activeProject ? (
          <WelcomeScreen
            companyName={currentCompany.name}
            companyLogo={currentCompany.logo}
            onCreateProject={() => setShowProjectForm(true)}
          />
        ) : (
          <div className="flex-1 overflow-auto">
            <div className="p-4 bg-white border-b flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold">{activeProject.name}</h1>
                <p className="text-sm text-gray-500">{activeProject.customer?.name} — {activeProject.address}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={handleExportProject} className="flex items-center gap-1 text-sm bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200">
                  <Download size={14} /> Export
                </button>
                <button onClick={() => { setNewDocType('quote'); setEditingVariation(null); setShowVariationBuilder(true); }} className="flex items-center gap-1 text-sm bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700">
                  <FileText size={14} /> New Quote
                </button>
                {hasApprovedQuote && (
                  <button onClick={() => { setNewDocType('variation'); setEditingVariation(null); setShowVariationBuilder(true); }} className="flex items-center gap-1 text-sm bg-amber-500 text-white px-3 py-2 rounded-lg hover:bg-amber-600">
                    <RefreshCw size={14} /> New Variation
                  </button>
                )}
              </div>
            </div>

            <div className="flex">
              <div className="w-80 border-r bg-gray-50 p-4">
                <h3 className="text-sm font-semibold text-gray-500 mb-3">QUOTES / VARIATIONS</h3>
                {projectVariations.length === 0 && (
                  <p className="text-sm text-gray-400">No variations found for this project.</p>
                )}
                {projectVariations.map(v => (
                  <div
                    key={v.id}
                    onClick={() => workspace.selectVariation(v.id)}
                    className={`p-3 rounded-lg mb-2 cursor-pointer border ${v.id === appState.activeVariationId ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white hover:bg-gray-100'}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">{v.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${v.documentType === 'variation' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                        {v.documentType === 'variation' ? 'VAR' : 'QTE'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{v.status} — {new Date(v.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>

              <div className="flex-1 p-4">
                {activeVariation ? (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-bold">{activeVariation.title}</h2>
                      <button onClick={() => { setEditingVariation(activeVariation); setNewDocType(activeVariation.documentType || 'quote'); setShowVariationBuilder(true); }} className="flex items-center gap-1 text-sm bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200">
                        <Edit size={14} /> Edit Quote
                      </button>
                    </div>
                    <VariationReport
                      variation={activeVariation}
                      project={activeProject}
                      onStatusChange={handleStatusChange}
                      onSignature={handleSignature}
                      onAddLog={handleAddLog}
                      companyName={currentCompany.name}
                      companyLogo={currentCompany.logo}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-400">
                    Select a variation to view its breakdown or add a new one.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}