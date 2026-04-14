import type { Solution } from "../../../types/domain";

interface QuoteOptionsProps {
  solutions: Solution[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onAdd: () => void;
  onDelete: (index: number) => void;
  onRename: (index: number, newTitle: string) => void;
  isLocked: boolean;
}

export function QuoteOptions({
  solutions,
  selectedIndex,
  onSelect,
  onAdd,
  onDelete,
  onRename,
  isLocked,
}: QuoteOptionsProps) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-600">Quote Options</h4>
        {!isLocked && (
          <button
            onClick={onAdd}
            className="rounded-lg bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 hover:bg-blue-200"
          >
            ➕ Add Option
          </button>
        )}
      </div>

      <div className="space-y-2">
        {solutions.map((solution, index) => (
          <div
            key={solution.id}
            onClick={() => onSelect(index)}
            className={`cursor-pointer rounded-lg border p-3 transition ${
              selectedIndex === index
                ? "border-red-300 bg-red-50"
                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`h-4 w-4 rounded-full border-2 ${
                    selectedIndex === index ? "border-red-600 bg-red-600" : "border-slate-300"
                  }`}
                />
                <span className="font-bold text-slate-900">{solution.title}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">${solution.clientCost.toLocaleString()}</p>
                <p className="text-xs text-slate-500">{solution.timelineDays} days</p>
              </div>
            </div>

            {!isLocked && (
              <div className="mt-2 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const newTitle = prompt("Rename option:", solution.title);
                    if (newTitle) onRename(index, newTitle);
                  }}
                  className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600 hover:bg-slate-200"
                >
                  Rename
                </button>
                {solutions.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(index);
                    }}
                    className="rounded bg-red-100 px-2 py-1 text-xs text-red-600 hover:bg-red-200"
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}