"use client";

const SHAPES = [
  { id: "all", label: "Semua Shape", icon: "👓" },
  { id: "round", label: "Round", svg: "M12 21a9 9 0 100-18 9 9 0 000 18z" },
  { id: "square", label: "Square", svg: "M5 4h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z" },
  { id: "cat-eye", label: "Cat Eye", svg: "M3 8c2-4 6-5 9-2 3-3 7-2 9 2-1 6-4 9-9 9s-8-3-9-9z" },
  { id: "aviator", label: "Aviator", svg: "M4 6h16l-2 10a4 4 0 01-4 3h-4a4 4 0 01-4-3L4 6z" },
  { id: "geometric", label: "Geometric", svg: "M12 3l8 5v8l-8 5-8-5V8l8-5z" },
];

export default function FrameShapeFilter({ selectedShape, onSelectShape }) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center gap-2 min-w-max">
        <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 mr-2">
          Bentuk Frame:
        </span>
        {SHAPES.map((shape) => {
          const isActive = selectedShape === shape.id;
          return (
            <button
              key={shape.id}
              onClick={() => onSelectShape(shape.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                isActive
                  ? "bg-obsidian text-white shadow-lg shadow-obsidian/20 scale-105 border border-obsidian"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-champagne hover:text-obsidian hover:shadow-sm"
              }`}
            >
              {shape.svg ? (
                <svg
                  className={`w-3.5 h-3.5 ${isActive ? "text-champagne-gold" : "text-slate-400"}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={shape.svg} />
                </svg>
              ) : (
                <span>{shape.icon}</span>
              )}
              {shape.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
