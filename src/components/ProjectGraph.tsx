import React, { useCallback, useMemo, useState } from "react";
import ReactFlow, {
    Node,
    Edge,
    Background,
    Controls,
    NodeProps,
    Handle,
    Position,
    useNodesState,
    useEdgesState,
    addEdge,
    ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import NodeDetails from "./NodeDetails";

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
            <div className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 shadow-lg cursor-pointer hover:bg-gray-700 transition-colors duration-200">
                <div className="text-sm font-medium text-white">
                    {data.label}
                </div>
            </div>
            <Handle
                type="source"
                position={Position.Bottom}
                className="w-2 h-2"
            />
            <div
                className="absolute bottom-[-5px] right-[-5px] bg-gray-900 border border-gray-600 rounded-full p-1 cursor-pointer hover:bg-gray-700 transition-colors duration-200"
                onClick={() => setShowDetails(true)}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-1 w-1 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path d="M17.414 2.586a2 2 0 00-2.828 0l-10 10A2 2 0 004 14v2a2 2 0 002 2h2a2 2 0 001.414-.586l10-10a2 2 0 000-2.828l-2-2zM6 16H5v-1l8-8 1 1-8 8z" />
                </svg>
            </div>

            {showDetails && NodeDetails({ data, setShowDetails })}
        </div>
    );
};

type ProjectGraphProps = {
    initialNodes: Node[];
    initialEdges: Edge[];
};

const panOnDrag = [1, 2];

const ProjectGraph: React.FC<ProjectGraphProps> = ({
    initialNodes,
    initialEdges,
}) => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const nodeTypes = useMemo(
        () => ({
            custom: CustomNode,
        }),
        []
    );

    const onConnect = useCallback(
        (connection: any) => setEdges((eds) => addEdge(connection, eds)),
        [setEdges]
    );

    const addNode = () => {
        const new_node: Node = {
            id: `${Date.now()}`,
            type: "custom",
            position: { x: 10, y: 10 },
            data: {
                label: "Project Initiation",
                details: {
                    duration: "2 weeks",
                    cost: "$50,000",
                    resources: "Project Manager, Architects",
                    status: "In Progress",
                },
            },
        };
        setNodes((nodes) => [...nodes, new_node]);
    };

    const onNodesDelete = useCallback(
        (deletedNodes: Node[]) => {
            console.log("Deleted Nodes:", deletedNodes);
            const deletedNodeIds = new Set(deletedNodes.map((node) => node.id));
            setNodes((nodes) =>
                nodes.filter((node) => !deletedNodeIds.has(node.id))
            );
        },
        [setNodes]
    );

    const onEdgesDelete = useCallback(
        (deletedEdges: Edge[]) => {
            console.log("Deleted Edges:", deletedEdges);
            const deletedEdgeIds = new Set(deletedEdges.map((edge) => edge.id));
            setEdges((edges) =>
                edges.filter((edge) => !deletedEdgeIds.has(edge.id))
            );
        },
        [setEdges]
    );

    return (
        <>
            <ReactFlowProvider>
                <div className="relative h-full w-full">
                    <button
                        onClick={addNode}
                        className="absolute top-4 left-4 z-[500] bg-white text-black px-4 py-2 rounded-md shadow-md hover:bg-gray-300"
                    >
                        Add Node
                    </button>
                    <button
                        // onClick={handleSubmit}
                        className="absolute top-4 right-4 z-[500] bg-white text-black px-4 py-2 rounded-md shadow-md hover:bg-gray-300"
                    >
                        Submit
                    </button>

                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onNodesDelete={onNodesDelete}
                        onEdgesDelete={onEdgesDelete}
                        onConnect={onConnect}
                        panOnScroll
                        selectionOnDrag
                        panOnDrag={panOnDrag}
                        nodeTypes={nodeTypes}
                        fitView
                        className="bg-gray-900"
                    >
                        <Background color="#374151" gap={16} />
                        <Controls />
                    </ReactFlow>
                </div>
            </ReactFlowProvider>
        </>
    );
};

export default ProjectGraph;
