import { useCallback, useState, useRef } from 'react';
import type {
  Connection,
  Edge,
  Node,
} from '@xyflow/react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { v4 as uuidv4 } from 'uuid';

import { UMLClassNode } from './components/UMLClassNode';
import { UMLEdge } from './components/UMLEdge';
import type { UMLClassData, RelationData } from './types';
import { PropertiesPanel } from './components/PropertiesPanel';
import { Toolbar } from './components/Toolbar';
import { generateJavaCode } from './utils/javaGenerator';
import { exportToPng, exportToZip } from './utils/exportUtils';

const nodeTypes = {
  umlClass: UMLClassNode,
};

const edgeTypes = {
  umlEdge: UMLEdge,
};

const initialNodes: Node<UMLClassData>[] = [
  {
    id: '1',
    type: 'umlClass',
    position: { x: 250, y: 100 },
    data: {
      name: 'User',
      type: 'class',
      attributes: [
        { id: 'a1', visibility: '-', name: 'id', type: 'int' },
        { id: 'a2', visibility: '-', name: 'username', type: 'String' },
        { id: 'a3', visibility: '-', name: 'email', type: 'String' }
      ],
      methods: [
        { id: 'm1', visibility: '+', name: 'login', parameters: [], returnType: 'boolean' },
        { id: 'm2', visibility: '+', name: 'logout', parameters: [], returnType: 'void' }
      ],
    },
  },
];

const initialEdges: Edge[] = [];

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<RelationType>('association');

  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge({ ...params, type: 'umlEdge', data: { type: activeTool } }, eds)),
    [setEdges, activeTool],
  );

  const onAddClass = () => {
    const newNode: Node<UMLClassData> = {
      id: uuidv4(),
      type: 'umlClass',
      position: { x: 100 + Math.random() * 200, y: 100 + Math.random() * 200 },
      data: {
        name: 'NewClass',
        type: 'class',
        attributes: [],
        methods: [],
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const handleNodeUpdate = (id: string, data: UMLClassData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data };
        }
        return node;
      })
    );
  };

  const handleEdgeUpdate = (id: string, data: RelationData) => {
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === id) {
          return { ...edge, data };
        }
        return edge;
      })
    );
  };

  const handleDeleteNode = (id: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
    setSelectedNodeId(null);
  };

  const handleDeleteEdge = (id: string) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== id));
    setSelectedEdgeId(null);
  };

  const handleExportPng = () => {
    if (reactFlowWrapper.current) {
      exportToPng(reactFlowWrapper.current);
    }
  };

  const handleExportZip = () => {
    const codeMap = generateJavaCode(nodes, edges);
    exportToZip(codeMap);
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <Toolbar 
          onAddClass={onAddClass} 
          onExportPng={handleExportPng}
          onExportZip={handleExportZip}
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          onDelete={() => {
            if (selectedNodeId) handleDeleteNode(selectedNodeId);
            else if (selectedEdgeId) handleDeleteEdge(selectedEdgeId);
          }}
          onReset={() => {
            setNodes([]);
            setEdges([]);
          }}
        />
        <div className="canvas-container" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onSelectionChange={(params) => {
              setSelectedNodeId(params.nodes[0]?.id || null);
              setSelectedEdgeId(params.edges[0]?.id || null);
            }}
            fitView
            className="bg-slate-900"
          >
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="#334155" />
            <Controls />
            <MiniMap nodeStrokeColor="#6366f1" nodeColor="#1e293b" maskColor="rgba(15, 23, 42, 0.8)" />
          </ReactFlow>
        </div>
      </div>
      <div className="sidebar glass-panel">
        <PropertiesPanel 
          selectedNode={nodes.find(n => n.id === selectedNodeId) as Node<UMLClassData> | undefined}
          selectedEdge={edges.find(e => e.id === selectedEdgeId) as Edge<RelationData> | undefined}
          onUpdateNode={handleNodeUpdate}
          onUpdateEdge={handleEdgeUpdate}
          onDeleteNode={handleDeleteNode}
          onDeleteEdge={handleDeleteEdge}
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <marker id="inheritance-arrow" markerWidth="20" markerHeight="20" refX="20" refY="10" orient="auto">
            <polygon points="0,0 20,10 0,20" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
          </marker>
          <marker id="dependency-arrow" markerWidth="20" markerHeight="20" refX="15" refY="10" orient="auto">
            <polyline points="0,0 15,10 0,20" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
          </marker>
          <marker id="composition-diamond" markerWidth="25" markerHeight="25" refX="25" refY="12.5" orient="auto">
            <polygon points="0,12.5 12.5,0 25,12.5 12.5,25" fill="#94a3b8" stroke="#94a3b8" strokeWidth="1.5" />
          </marker>
          <marker id="aggregation-diamond" markerWidth="25" markerHeight="25" refX="25" refY="12.5" orient="auto">
            <polygon points="0,12.5 12.5,0 25,12.5 12.5,25" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
          </marker>
        </defs>
      </svg>
      <ReactFlowProvider>
        <Flow />
      </ReactFlowProvider>
    </>
  );
}

export default App;
