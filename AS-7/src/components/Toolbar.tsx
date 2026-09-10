import { Plus, Download, FileArchive, Trash2, RotateCcw, Code } from 'lucide-react';
import type { RelationType } from '../types';

interface ToolbarProps {
  onAddClass: () => void;
  onExportPng: () => void;
  onExportZip: () => void;
  activeTool: RelationType;
  setActiveTool: (tool: RelationType) => void;
  onDelete: () => void;
  onReset: () => void;
}

export function Toolbar({ 
  onAddClass, 
  onExportPng, 
  onExportZip, 
  activeTool, 
  setActiveTool,
  onDelete,
  onReset
}: ToolbarProps) {
  
  const tools: { id: RelationType; label: string; icon: string }[] = [
    { id: 'association', label: 'Association', icon: '→' },
    { id: 'inheritance', label: 'Inheritance', icon: '▷' },
    { id: 'implementation', label: 'Implementation', icon: '⤏' },
    { id: 'composition', label: 'Composition', icon: '◆' },
    { id: 'aggregation', label: 'Aggregation', icon: '◇' },
    { id: 'dependency', label: 'Dependency', icon: '⇢' },
  ];

  return (
    <div className="toolbar glass-panel flex justify-between items-center w-full z-10 px-4 bg-[#0f172a] border-b border-[#1e293b]">
      {/* Left side: Branding */}
      <div className="flex items-center gap-3">
        <div className="bg-indigo-600 p-1.5 rounded-md flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        </div>
        <h1 className="text-sm font-bold text-white tracking-wide">
          UML Studio
        </h1>
        <span className="text-xs bg-[#1e293b] text-indigo-300 px-2 py-1 rounded font-mono border border-[#334155]">
          Java Architecture
        </span>
      </div>

      {/* Center: Tools */}
      <div className="flex items-center gap-1 bg-[#1e293b] rounded-lg p-1 border border-[#334155]">
        <span className="text-xs text-gray-400 font-semibold px-2">TOOL:</span>
        {tools.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTool(t.id)}
            className={`text-xs px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTool === t.id 
                ? 'bg-[#334155] text-white shadow-sm' 
                : 'bg-transparent text-gray-400 hover:text-gray-200 hover:bg-[#334155]/50'
            }`}
            style={{ fontWeight: activeTool === t.id ? 600 : 400 }}
          >
            <span className={activeTool === t.id ? 'text-indigo-400' : 'text-gray-500'}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-2">
        <button onClick={onAddClass} className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 border border-blue-500">
          <Plus size={14} />
          Add Class
        </button>
        <button onClick={onExportZip} className="text-xs bg-[#1e293b] hover:bg-[#334155] text-gray-300 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 border border-[#334155]">
          <Code size={14} />
          Java Source
        </button>
        <button onClick={onExportPng} className="text-xs bg-[#1e293b] hover:bg-[#334155] text-gray-300 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 border border-[#334155]">
          <Download size={14} />
          Export
        </button>
        
        <div className="w-px h-6 bg-[#334155] mx-1"></div>

        <button onClick={onDelete} className="text-gray-400 hover:text-red-400 p-1.5 rounded-md hover:bg-red-500/10 transition-colors" title="Delete Selected">
          <Trash2 size={16} />
        </button>
        <button onClick={onReset} className="text-gray-400 hover:text-white p-1.5 rounded-md hover:bg-[#334155] transition-colors" title="Reset Canvas">
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
}
