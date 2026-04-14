import type { Company } from "../../types/domain";

interface ReportLetterheadProps {
  company: Company;
}

export function ReportLetterhead({ company }: ReportLetterheadProps) {
  return (
    <header className="border-b-2 border-red-800 pb-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-lg bg-slate-100 flex items-center justify-center font-black text-2xl text-red-800">
            {company.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-red-900">
              {company.name}
            </h2>
            <p className="text-sm text-slate-600 italic">{company.tagline}</p>
          </div>
        </div>
        <div className="text-right text-xs text-slate-600 space-y-0.5">
          <p className="font-bold text-slate-800">ABN: {company.abn}</p>
          <p>Ph: {company.phone}</p>
          <p>{company.email}</p>
          <p className="font-semibold text-red-800">
            Registered Building Practitioner — Vic
          </p>
        </div>
      </div>
    </header>
  );
}