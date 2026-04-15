import { ALL_CATEGORIES, searchCategories, getCategoryById } from './categories';
import type { WorkCategory } from './categories/types';

export interface RecognisedScope {
  category: WorkCategory | null;
  confidence: number;
  relatedIds: string[];
}

export function recogniseScope(input: string): RecognisedScope {
  if (!input.trim()) return { category: null, confidence: 0, relatedIds: [] };

  const results = searchCategories(input.toLowerCase());
  if (results.length > 0) {
    return {
      category: results[0],
      confidence: 0.8,
      relatedIds: results.slice(1, 4).map(r => r.id),
    };
  }

  // Fallback to general
  const general = getCategoryById('general');
  return {
    category: general || ALL_CATEGORIES[0],
    confidence: 0.3,
    relatedIds: [],
  };
}

export async function recogniseScopeWithAI(
  input: string,
  apiKey: string
): Promise<RecognisedScope> {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a construction scope classifier. Given this description, identify the most appropriate construction category ID from this list: ${ALL_CATEGORIES.map(c => c.id).join(', ')}.\n\nDescription: "${input}"\n\nRespond with ONLY the category ID, nothing else.`
            }]
          }]
        })
      }
    );
    const data = await res.json();
    const catId = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (catId) {
      const cat = getCategoryById(catId);
      if (cat) return { category: cat, confidence: 0.95, relatedIds: [] };
    }
  } catch (e) {
    console.error('AI recognition failed:', e);
  }
  return recogniseScope(input);
}