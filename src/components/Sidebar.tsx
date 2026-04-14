import React from "react";
import { FolderKanban, Plus, Trash2 } from "lucide-react";
import type { AppState } from "../types/appState";
import { COMPANIES } from "../constants/companies";

interface SidebarProps {
  state: AppState;
  selectedProjectId: string | null;
  onSelectProject: (id: string | null) => void;
  onDeleteProject: (id: string) => void;
  onCreateProjectClick: () => void;
  onChangeCompany: (companyId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  state,
  selectedProjectId,
  onSelectProject,
  onDeleteProject,
  onCreateProjectClick,
  onChangeCompany,
}) => {
  const currentCompany = COMPANIES[state.companyId] ?? Object.values(COMPANIES)[0];

  return (
    <aside className="w-80 border-r border-slate-200 bg-white flex flex-col h-screen select-none">
      {/* Branding / Company Switcher */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className={`flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold shadow-md overflow-hidden ${currentCompany.color}`}>
            {currentCompany.logo ? (
              <img src={currentCompany.logo} alt={currentCompany.name} className="h-full w-full object-contain p-1" />
            ) : (
              currentCompany.name.slice(0, 2).toUpperCase()
            )}
          </div>
          <div className="overflow-hidden">
            <h2 className="font-semibold text-slate-800 text-sm truncate">{currentCompany.name}</h2>
            <p className="text-xs text-slate-500 truncate">{currentCompany.tagline}</p>
          </div>
        </div>
        <select
          value={state.companyId}
          onChange={(e) => onChangeCompany(e.target.value)}
          className="text-xs border border-slate-200 rounded-lg p-1 bg-slate-50 text-slate-600 focus:outline-none"
        >
          {Object.keys(COMPANIES).map((id) => (
            <option key={id} value={id}>
              {COMPANIES[id].name}
            </option>
          ))}
        </select>
      </div>

      {/* Title & Add Button */}
      <div className="px-4 py-3 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Projects</span>
        <button
          onClick={onCreateProjectClick}
          className="flex items-center gap-1 text-xs font-medium bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          <Plus size={14} /> New
        </button>
      </div>

      {/* Project List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {state.projects.length === 0 && (
          <div className="text-center py-8 text-sm text-slate-400">
            No projects yet. Create one!
          </div>
        )}
        {state.projects.map((project) => {
          const isActive = project.id === selectedProjectId;
          return (
            <div
              key={project.id}
              className={`group flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all ${
                isActive
                  ? "bg-indigo-50 text-indigo-900 font-medium"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
              onClick={() => onSelectProject(project.id)}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <FolderKanban
                  size={18}
                  className={`flex-shrink-0 ${isActive ? "text-indigo-600" : "text-slate-400"}`}
                />
                <div className="overflow-hidden">
                  <div className="text-sm truncate">{project.name}</div>
                  <div className="text-xs text-slate-400 truncate">{project.customerName}</div>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm("Delete this project?")) onDeleteProject(project.id);
                }}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity p-1"
                title="Delete project"
              >
                <Trash2 size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
