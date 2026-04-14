interface DimensionsStepProps {
  roomType: string;
  dimensions: { length: string; width: string; height: string };
  onRoomTypeChange: (value: string) => void;
  onDimensionChange: (field: "length" | "width" | "height", value: string) => void;
}

export function DimensionsStep({ roomType, dimensions, onRoomTypeChange, onDimensionChange }: DimensionsStepProps) {
  return (
    <section className="space-y-4">
      <h4 className="text-lg font-bold text-slate-900">Dimensions</h4>
      <select
        value={roomType}
        onChange={(event) => onRoomTypeChange(event.target.value)}
        className="w-full rounded-lg border border-slate-200 px-3 py-2"
      >
        {["general", "kitchen", "bathroom", "laundry", "flooring", "windows", "structural"].map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div className="grid gap-3 sm:grid-cols-3">
        {([
          ["length", "Length (m)"],
          ["width", "Width (m)"],
          ["height", "Height (m)"],
        ] as const).map(([field, label]) => (
          <label key={field} className="space-y-1 text-sm font-semibold text-slate-700">
            <span>{label}</span>
            <input
              type="number"
              value={dimensions[field]}
              onChange={(event) => onDimensionChange(field, event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </label>
        ))}
      </div>
    </section>
  );
}