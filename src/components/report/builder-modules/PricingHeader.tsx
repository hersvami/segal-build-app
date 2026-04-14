interface PricingHeaderProps {
  builderCost: number;
  clientCost: number;
}

export function PricingHeader({ builderCost, clientCost }: PricingHeaderProps) {
  const grossMargin = clientCost - builderCost;
  const marginPct = clientCost ? Math.round((grossMargin / clientCost) * 100) : 0;

  return (
    <section className="grid gap-3 md:grid-cols-3">
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-bold uppercase text-slate-500">Builder Cost</p>
        <p className="mt-1 text-2xl font-black text-slate-900">${builderCost.toLocaleString()}</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-bold uppercase text-slate-500">Client Price</p>
        <p className="mt-1 text-2xl font-black text-red-800">${clientCost.toLocaleString()}</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-bold uppercase text-slate-500">Margin</p>
        <p className="mt-1 text-2xl font-black text-green-700">
          ${grossMargin.toLocaleString()} ({marginPct}%)
        </p>
      </div>
    </section>
  );
}