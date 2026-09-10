import { Handle, Position } from '@xyflow/react';
import type { NodeProps, Node } from '@xyflow/react';
import type { UMLClassData } from '../types';

export type UMLClassNodeType = Node<UMLClassData, 'umlClass'>;

export function UMLClassNode({ data, selected }: NodeProps<UMLClassNodeType>) {
  return (
    <div className={`glass-node min-w-[200px] font-mono text-sm ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-indigo-500" />
      
      {/* Header */}
      <div className="bg-opacity-20 bg-indigo-500 border-b border-indigo-500/30 p-2 text-center">
        {data.type !== 'class' && (
          <div className="text-xs italic text-indigo-300">
            &lt;&lt;{data.type}&gt;&gt;
          </div>
        )}
        <div className="font-bold text-white tracking-wide">
          {data.name}
        </div>
      </div>

      {/* Attributes */}
      <div className="p-2 border-b border-white/10 min-h-[30px]">
        {data.attributes.map((attr) => (
          <div key={attr.id} className="text-gray-300 whitespace-nowrap">
            {attr.visibility} {attr.name}: {attr.type}
          </div>
        ))}
      </div>

      {/* Methods */}
      <div className="p-2 min-h-[30px]">
        {data.methods.map((method) => (
          <div key={method.id} className="text-gray-300 whitespace-nowrap">
            {method.visibility} {method.name}({method.parameters.map(p => `${p.name}: ${p.type}`).join(', ')}): {method.returnType}
          </div>
        ))}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-indigo-500" />
      <Handle type="source" position={Position.Left} id="left" className="w-3 h-3 bg-indigo-500" />
      <Handle type="source" position={Position.Right} id="right" className="w-3 h-3 bg-indigo-500" />
      <Handle type="target" position={Position.Left} id="target-left" className="w-3 h-3 bg-indigo-500" />
      <Handle type="target" position={Position.Right} id="target-right" className="w-3 h-3 bg-indigo-500" />
    </div>
  );
}
