import type { UMLClassData, ClassType, Visibility, RelationData, RelationType } from '../types';
import type { Node, Edge } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import { Trash2, Plus } from 'lucide-react';

interface Props {
  selectedNode?: Node<UMLClassData>;
  selectedEdge?: Edge<RelationData>;
  onUpdateNode: (id: string, data: UMLClassData) => void;
  onUpdateEdge: (id: string, data: RelationData) => void;
  onDeleteNode: (id: string) => void;
  onDeleteEdge: (id: string) => void;
}

export function PropertiesPanel({ selectedNode, selectedEdge, onUpdateNode, onUpdateEdge, onDeleteNode, onDeleteEdge }: Props) {
  if (!selectedNode && !selectedEdge) {
    return (
      <div className="p-4 text-center text-muted h-full flex items-center justify-center">
        Select a class or connection to edit its properties
      </div>
    );
  }

  if (selectedEdge) {
    const edgeData = selectedEdge.data || { type: 'association' };
    return (
      <div className="h-full flex flex-col overflow-hidden">
        <div className="p-4 border-b border-white/10 font-bold text-lg bg-white/5 flex justify-between items-center">
          <span>Relationship</span>
          <button 
            className="icon-btn text-red-400 hover:text-red-300"
            onClick={() => onDeleteEdge(selectedEdge.id)}
            title="Delete Relationship"
          >
            <Trash2 size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <label className="text-xs text-muted mb-1 block">Type</label>
            <select 
              value={edgeData.type} 
              onChange={(e) => onUpdateEdge(selectedEdge.id, { ...edgeData, type: e.target.value as RelationType })}
              className="w-full"
            >
              <option value="association">Association</option>
              <option value="inheritance">Inheritance (Extends)</option>
              <option value="implementation">Implementation (Implements)</option>
              <option value="composition">Composition</option>
              <option value="aggregation">Aggregation</option>
              <option value="dependency">Dependency</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  const { id, data } = selectedNode!;

  const updateData = (newData: Partial<UMLClassData>) => {
    onUpdateNode(id, { ...data, ...newData });
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-white/10 font-bold text-lg bg-white/5 flex justify-between items-center">
        <span>Class Properties</span>
        <button 
          className="icon-btn text-red-400 hover:text-red-300"
          onClick={() => onDeleteNode(id)}
          title="Delete Class"
        >
          <Trash2 size={16} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted mb-1 block">Name</label>
            <input 
              type="text" 
              value={data.name} 
              onChange={(e) => updateData({ name: e.target.value })}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-xs text-muted mb-1 block">Type</label>
            <select 
              value={data.type} 
              onChange={(e) => updateData({ type: e.target.value as ClassType })}
              className="w-full"
            >
              <option value="class">Class</option>
              <option value="interface">Interface</option>
              <option value="abstract">Abstract Class</option>
              <option value="enum">Enum</option>
            </select>
          </div>
        </div>

        <div className="h-px bg-white/10 w-full" />

        {/* Attributes */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-sm">Attributes</h3>
            <button 
              className="icon-btn"
              onClick={() => updateData({
                attributes: [...data.attributes, { id: uuidv4(), name: 'newAttr', type: 'String', visibility: '-' }]
              })}
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="space-y-2">
            {data.attributes.map((attr, index) => (
              <div key={attr.id} className="flex gap-2 items-center bg-black/20 p-2 rounded">
                <select 
                  value={attr.visibility}
                  onChange={(e) => {
                    const newAttrs = [...data.attributes];
                    newAttrs[index].visibility = e.target.value as Visibility;
                    updateData({ attributes: newAttrs });
                  }}
                  className="w-16 p-1 text-xs"
                >
                  <option value="+">+</option>
                  <option value="-">-</option>
                  <option value="#">#</option>
                  <option value="~">~</option>
                </select>
                <input 
                  type="text" 
                  value={attr.name}
                  onChange={(e) => {
                    const newAttrs = [...data.attributes];
                    newAttrs[index].name = e.target.value;
                    updateData({ attributes: newAttrs });
                  }}
                  className="flex-1 p-1 text-xs"
                  placeholder="name"
                />
                <input 
                  type="text" 
                  value={attr.type}
                  onChange={(e) => {
                    const newAttrs = [...data.attributes];
                    newAttrs[index].type = e.target.value;
                    updateData({ attributes: newAttrs });
                  }}
                  className="w-20 p-1 text-xs"
                  placeholder="type"
                />
                <button 
                  className="icon-btn text-red-400 hover:text-red-300"
                  onClick={() => {
                    updateData({ attributes: data.attributes.filter(a => a.id !== attr.id) });
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px bg-white/10 w-full" />

        {/* Methods */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-sm">Methods</h3>
            <button 
              className="icon-btn"
              onClick={() => updateData({
                methods: [...data.methods, { id: uuidv4(), name: 'newMethod', returnType: 'void', parameters: [], visibility: '+' }]
              })}
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="space-y-2">
            {data.methods.map((method, index) => (
              <div key={method.id} className="flex flex-col gap-2 bg-black/20 p-2 rounded">
                <div className="flex gap-2 items-center">
                  <select 
                    value={method.visibility}
                    onChange={(e) => {
                      const newMethods = [...data.methods];
                      newMethods[index].visibility = e.target.value as Visibility;
                      updateData({ methods: newMethods });
                    }}
                    className="w-16 p-1 text-xs"
                  >
                    <option value="+">+</option>
                    <option value="-">-</option>
                    <option value="#">#</option>
                    <option value="~">~</option>
                  </select>
                  <input 
                    type="text" 
                    value={method.name}
                    onChange={(e) => {
                      const newMethods = [...data.methods];
                      newMethods[index].name = e.target.value;
                      updateData({ methods: newMethods });
                    }}
                    className="flex-1 p-1 text-xs"
                    placeholder="name"
                  />
                  <input 
                    type="text" 
                    value={method.returnType}
                    onChange={(e) => {
                      const newMethods = [...data.methods];
                      newMethods[index].returnType = e.target.value;
                      updateData({ methods: newMethods });
                    }}
                    className="w-20 p-1 text-xs"
                    placeholder="return"
                  />
                  <button 
                    className="icon-btn text-red-400 hover:text-red-300"
                    onClick={() => {
                      updateData({ methods: data.methods.filter(m => m.id !== method.id) });
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                {/* Method Parameters Simple Input */}
                <input 
                  type="text" 
                  value={method.parameters.map(p => `${p.name}:${p.type}`).join(', ')}
                  onChange={(e) => {
                    const newMethods = [...data.methods];
                    // Parse "name:type, name:type" simple format
                    const paramsStr = e.target.value;
                    if (!paramsStr.trim()) {
                      newMethods[index].parameters = [];
                    } else {
                      newMethods[index].parameters = paramsStr.split(',').map(p => {
                        const [name, type] = p.split(':').map(s => s.trim());
                        return { name: name || 'param', type: type || 'any' };
                      });
                    }
                    updateData({ methods: newMethods });
                  }}
                  className="w-full p-1 text-xs"
                  placeholder="params (e.g. arg1:int, arg2:String)"
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
