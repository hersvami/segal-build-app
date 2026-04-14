import { GoogleGenerativeAI } from "@google/generative-ai";

const FALLBACK_GEMINI_KEY = "PASTE_YOUR_API_KEY_HERE";

const MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash",
];

function getApiKey(): string {
  if (typeof window === "undefined") return FALLBACK_GEMINI_KEY;
  return localStorage.getItem("geminiApiKey") || FALLBACK_GEMINI_KEY;
}

function getClient(): GoogleGenerativeAI {
  const key = getApiKey();
  if (!key || key.length < 10) {
    throw new Error("Gemini API key missing");
  }
  return new GoogleGenerativeAI(key);
}

async function withTimeout<T>(promise: Promise<T>, ms = 120000): Promise<T> {
  let timeoutId: number | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = window.setTimeout(() => {
      reject(new Error("AI request timed out"));
    }, ms);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId) window.clearTimeout(timeoutId);
  }
}

async function generateWithFallback(
  prompt: string,
  inlineData?: { data: string; mimeType: string }
): Promise<string> {
  const genAI = getClient();
  let lastError: any = null;

  for (const modelName of MODELS) {
    try {
      console.log(`Trying model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });

      const parts: any[] = [prompt];
      if (inlineData) {
        parts.push({ inlineData });
      }

      const result = await withTimeout(model.generateContent(parts), 120000);
      const response = await result.response;
      const text = response.text()?.trim();

      if (!text) {
        throw new Error("AI returned empty response");
      }

      console.log(`Success with model: ${modelName}`);
      return text;
    } catch (error: any) {
      lastError = error;
      const errorMsg = error?.message || "";
      const isRateLimit = errorMsg.includes("429") || errorMsg.includes("quota") || errorMsg.includes("rate");
      const isTimeout = errorMsg.includes("timed out");

      console.warn(`Model ${modelName} failed: ${errorMsg}`);

      if (isRateLimit || isTimeout) {
        console.log(`Falling back to next model...`);
        continue;
      }

      // For non-rate-limit errors, still try next model
      continue;
    }
  }

  throw lastError || new Error("All AI models failed");
}

export function hasGeminiApiKey(): boolean {
  return !!getApiKey();
}

export function getGeminiApiKey(): string {
  return getApiKey();
}

export function setGeminiApiKey(key: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("geminiApiKey", key);
  }
}

export async function elaborateWithAI(
  text: string,
  roomType: string,
  dims?: { length: number; width: number; height: number },
  photos?: Array<{ description?: string; aiAnalysis?: string }>,
  scopeItems?: string[],
  answers?: Array<{ question: string; answer: string }>,
  projectInfo?: { projectName?: string; customerName?: string; address?: string }
): Promise<string> {
  try {
    const prompt = `You are a professional builder in Victoria, Australia writing a construction scope of works.

PROJECT:
- Room/Area: ${roomType}
- Project Name: ${projectInfo?.projectName || "N/A"}
- Client: ${projectInfo?.customerName || "N/A"}
- Address: ${projectInfo?.address || "N/A"}
- Dimensions: ${dims ? `${dims.length}m x ${dims.width}m x ${dims.height}m` : "Not specified"}

RAW NOTES:
${text}

SCOPE ITEMS:
${scopeItems?.join(", ") || "General works"}

Q&A:
${answers?.map((a) => `- ${a.question}: ${a.answer}`).join("\n") || "None"}

PHOTO NOTES:
${
  photos?.map((p, i) => `Photo ${i + 1}: ${p.description || "No description"} ${p.aiAnalysis ? `| Analysis: ${p.aiAnalysis}` : ""}`).join("\n") ||
  "No photos"
}

Rewrite this into a professional, practical construction scope:
- Australian spelling
- Clear staged works
- Suitable for quote/variation report

Output only the final scope text.`;

    return await generateWithFallback(prompt);
  } catch (error: any) {
    console.error("Gemini elaboration error:", error);

    return `Scope of Works (Draft)

Area: ${roomType}
Builder Notes:
${text}

Recommended Works:
- Site setup and protection
- Demolition/strip-out as required
- Trade-specific rectification and installation
- Final fit-off, testing and clean

This draft was generated without live AI due to timeout.`;
  }
}

export async function analyzePhotoWithAI(
  imageData: string,
  description: string,
  roomType: string,
  variationTitle: string,
  variationDesc: string
): Promise<string> {
  try {
    const base64Data = imageData.includes(",") ? imageData.split(",")[1] : imageData;
    if (!base64Data) throw new Error("Invalid image format");

    const prompt = `You are a building inspector analysing a construction photo in Victoria, Australia.

CONTEXT:
- Room/Area: ${roomType}
- Job Title: ${variationTitle}
- Job Description: ${variationDesc}
- Photo Description: ${description}

Provide:
1) Visible issues
2) Likely cause
3) Recommended remedial works
4) Relevant Australian Standards where applicable

Keep concise and practical.`;

    return await generateWithFallback(prompt, {
      data: base64Data,
      mimeType: "image/jpeg",
    });
  } catch (error: any) {
    console.error("Gemini photo analysis error:", error);
    return "Photo analysis unavailable right now. Please proceed with manual assessment notes.";
  }
}

export async function generateSummaryWithAI(
  fullReport: string,
  projectInfo?: { projectName: string; customerName: string; address: string },
  solution?: { title: string; clientCost: number; stages: { name: string; clientCost: number }[] }
): Promise<string> {
  try {
    const prompt = `Write a short, warm client summary from James Segal of Segal Build Pty Ltd.

Client: ${projectInfo?.customerName || "Client"}
Project: ${projectInfo?.projectName || "Project"}
Address: ${projectInfo?.address || "N/A"}
Total: $${solution?.clientCost?.toLocaleString() || "0"} inc GST

Stages:
${solution?.stages.map((s) => `- ${s.name}: $${s.clientCost.toLocaleString()}`).join("\n") || "Custom works"}

Technical scope excerpt:
${fullReport.substring(0, 1000)}

Requirements:
- under 250 words
- plain English
- include portal review instruction
- finish with James Segal contact details

Output summary text only.`;

    return await generateWithFallback(prompt);
  } catch (error: any) {
    console.error("Gemini summary error:", error);
    return "Professional summary unavailable right now. Please review the full report details.";
  }
}

export async function enhanceTextWithAI(
  text: string,
  contextType: "scope" | "description" | "exclusions" | "assumptions" = "description",
  projectContext?: string
): Promise<string> {
  try {
    const prompt = `Rewrite these builder notes into clear professional Australian construction language.

Context: ${contextType}
Project context: ${projectContext || "General building work"}

Raw text:
${text}

Rules:
- Keep meaning accurate
- Use Australian spelling
- Keep concise and professional
- No headings

Output only improved text.`;

    return await generateWithFallback(prompt);
  } catch (error: any) {
    console.error("Gemini enhance error:", error);
    return text;
  }
}