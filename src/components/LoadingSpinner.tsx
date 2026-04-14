import { COMPANIES } from "../constants/companies";

interface LoadingSpinnerProps {
  companyId?: string;
  message?: string;
}

export function LoadingSpinner({ companyId, message }: LoadingSpinnerProps) {
  const company = COMPANIES[companyId || "segal-build"] ?? COMPANIES["segal-build"];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
      <div className="relative">
        <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
        <div className="h-24 w-24 animate-spin rounded-full border-4 border-transparent border-t-red-800 border-r-red-800"></div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center text-xl font-bold animate-pulse text-red-800">
            {company.name.charAt(0)}
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm font-bold text-slate-700">{company.name}</p>
      {message && (
        <p className="mt-1 text-xs text-slate-500 animate-pulse">{message}</p>
      )}
    </div>
  );
}