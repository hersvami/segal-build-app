import type { Project, Company } from '../types/domain';

interface ExportData {
  exportDate: string;
  appVersion: string;
  project: {
    name: string;
    address: string;
    customerName: string;
    customerEmail: string;
    createdAt: string;
  };
  company: {
    name: string;
    abn: string;
  };
  variations: Array<{
    title: string;
    description: string;
    status: string;
    mode: string;
    createdAt: string;
    roomType: string;
    scopes?: Array<{
      categoryId: string;
      description: string;
      stages: Array<{
        name: string;
        trade: string;
        cost: number;
      }>;
      pcItems?: Array<{
        description: string;
        allowance: number;
        unit: string;
      }>;
      inclusions?: Array<{ text: string }>;
      exclusions?: Array<{ text: string }>;
    }>;
    pricing?: {
      overheadPercent: number;
      profitPercent: number;
      contingencyPercent: number;
      tradeCost: number;
      overheadAmount: number;
      profitAmount: number;
      contingencyAmount: number;
      subtotalBeforeGst: number;
      gstAmount: number;
      totalIncGst: number;
    };
    solutions: Array<{
      title: string;
      clientCost: number;
      stages: Array<{
        name: string;
        trade: string;
        cost: number;
      }>;
    }>;
    selectedSolution: number;
    signature: string;
    customerComment: string;
    changeLog: Array<{
      action: string;
      note: string;
      timestamp: string;
    }>;
  }>;
  notes: Array<{
    text: string;
    sender: string;
    timestamp: string;
  }>;
}

export function exportProjectData(project: Project, company: Company): ExportData {
  return {
    exportDate: new Date().toISOString(),
    appVersion: '2.0.0',
    project: {
      name: project.name,
      address: project.address,
      customerName: project.customerName || '',
      customerEmail: project.customerEmail || '',
      createdAt: project.createdAt,
    },
    company: {
      name: company.name,
      abn: company.abn || '',
    },
    variations: project.variations.map(v => ({
      title: v.title,
      description: v.description,
      status: v.status,
      mode: v.mode,
      createdAt: v.createdAt,
      roomType: v.roomType,
      scopes: v.scopes?.map(s => ({
        categoryId: s.categoryId,
        description: s.description || '',
        stages: s.stages.map(st => ({
          name: st.name,
          trade: st.trade,
          cost: st.clientCost,
        })),
        pcItems: s.pcItems?.map(pc => ({
          description: pc.description,
          allowance: pc.allowance,
          unit: pc.unit,
        })),
        inclusions: s.inclusions?.map(inc => ({
          text: typeof inc === 'string' ? inc : inc.text,
        })),
        exclusions: s.exclusions?.map(exc => ({
          text: typeof exc === 'string' ? exc : exc.text,
        })),
      })),
      pricing: v.pricing ? {
        overheadPercent: v.pricing.overheadPercent,
        profitPercent: v.pricing.profitPercent,
        contingencyPercent: v.pricing.contingencyPercent,
        tradeCost: v.pricing.totalTradeCost,
        overheadAmount: v.pricing.totalOverhead,
        profitAmount: v.pricing.totalProfit,
        contingencyAmount: v.pricing.contingencyAmount,
        subtotalBeforeGst: v.pricing.totalBeforeGst,
        gstAmount: v.pricing.gstAmount,
        totalIncGst: v.pricing.totalIncGst,
      } : undefined,
      solutions: (v.solutions || []).map(sol => ({
        title: sol.title,
        clientCost: sol.clientCost,
        stages: sol.stages.map(st => ({
          name: st.name,
          trade: st.trade,
          cost: st.clientCost,
        })),
      })),
      selectedSolution: v.selectedSolution ?? 0,
      signature: v.customerSignature || '',
      customerComment: v.customerComment || '',
      changeLog: (v.changeLog || []).map(cl => ({
        action: cl.action,
        note: cl.detail || '',
        timestamp: cl.timestamp,
      })),
    })),
    notes: (project.messages || []).map((n: { text: string; sender: string; timestamp: string }) => ({
      text: n.text,
      sender: n.sender,
      timestamp: n.timestamp,
    })),
  };
}

export function downloadProjectExport(project: Project, company: Company): void {
  const data = exportProjectData(project, company);
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const datePart = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `${project.name.replace(/\s+/g, '_')}_export_${datePart}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
