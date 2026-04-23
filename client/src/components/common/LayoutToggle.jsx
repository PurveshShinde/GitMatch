import React from "react";
import { LayoutGrid, List as ListIcon, AlignJustify } from "lucide-react";

const LayoutToggle = ({ layout, setLayout }) => (
  <div className="flex bg-[#0f111a] border border-slate-800 rounded-lg p-1">
    <button
      onClick={() => setLayout("grid")}
      className={`p-1.5 rounded ${
        layout === "grid"
          ? "bg-slate-800 text-white"
          : "text-slate-500 hover:text-slate-300"
      }`}
      title="Grid View"
    >
      <LayoutGrid className="w-4 h-4" />
    </button>
    <button
      onClick={() => setLayout("list")}
      className={`p-1.5 rounded ${
        layout === "list"
          ? "bg-slate-800 text-white"
          : "text-slate-500 hover:text-slate-300"
      }`}
      title="List View"
    >
      <ListIcon className="w-4 h-4" />
    </button>
    <button
      onClick={() => setLayout("compact")}
      className={`p-1.5 rounded ${
        layout === "compact"
          ? "bg-slate-800 text-white"
          : "text-slate-500 hover:text-slate-300"
      }`}
      title="Compact View"
    >
      <AlignJustify className="w-4 h-4" />
    </button>
  </div>
);

export default LayoutToggle;
