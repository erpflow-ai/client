import React, { useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  NodeProps,
  Handle,
  Position,
} from 'reactflow';
import { X } from 'lucide-react';
import 'reactflow/dist/style.css';

type NodeData = {
  label: string;
  details: {
    duration: string;
    cost: string;
    resources: string;
    status: string;
  };
};

const CustomNode: React.FC<NodeProps<NodeData>> = ({ data }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      <div
        className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 shadow-lg cursor-pointer hover:bg-gray-700 transition-colors duration-200"
        onClick={() => setShowDetails(true)}
      >
        <div className="text-sm font-medium text-white">{data.label}</div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />

      {showDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 relative border border-gray-600">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDetails(false);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-4 text-white">{data.label}</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-400">Duration:</label>
                <p className="text-white">{data.details.duration}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Estimated Cost:</label>
                <p className="text-white">{data.details.cost}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Required Resources:</label>
                <p className="text-white">{data.details.resources}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Status:</label>
                <p className="text-white">{data.details.status}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

type ProjectGraphProps = {
  nodes: Node[];
  edges: Edge[];
};

const ProjectGraph: React.FC<ProjectGraphProps> = ({ nodes, edges }) => {
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      fitView
      className="bg-gray-900"
    >
      <Background color="#374151" gap={16} />
      <Controls />
    </ReactFlow>
  );
};

export default ProjectGraph;