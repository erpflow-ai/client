import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { ApiResponse } from "../utils/api";

type NodeData = {
    label: string;
    details: {
        id: string;
        duration: string;
        cost: string;
        resources: string;
        status: string;
    };
    setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedNode: React.Dispatch<React.SetStateAction<string | null>>;
};

const CustomNode: React.FC<NodeProps<NodeData>> = ({ data }) => {
    const { setSelectedNode, setShowDetails } = data;

    const handleClick = () => {
        setShowDetails(true);
        setSelectedNode(data.details.id);
    };
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
                onClick={handleClick}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-2 w-2 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path d="M17.414 2.586a2 2 0 00-2.828 0l-10 10A2 2 0 004 14v2a2 2 0 002 2h2a2 2 0 001.414-.586l10-10a2 2 0 000-2.828l-2-2zM6 16H5v-1l8-8 1 1-8 8z" />
                </svg>
            </div>
        </div>
    );
};

type ProjectGraphProps = {
    projectData: ApiResponse;
    setProjectData: React.Dispatch<React.SetStateAction<any>>;
    setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedNode: React.Dispatch<React.SetStateAction<string | null>>;
};

const panOnDrag = [1, 2];

const ProjectGraph: React.FC<ProjectGraphProps> = ({
    projectData,
    setProjectData,
    setShowDetails,
    setSelectedNode,
}) => {
    const [nodes, setNodes, onNodesChange] = useNodesState(projectData.nodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(projectData.edges);

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
                label: "New Node",
                details: {
                    id: `${Date.now()}`,
                    duration: "",
                    cost: "",
                    resources: "",
                    status: "",
                },
                setShowDetails,
                setSelectedNode,
            },
        };
        setNodes((nodes) => [...nodes, new_node]);
    };
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (loading) {
            setLoading(false);
            return;
        }
        setProjectData({ nodes, edges });
        setLoading(true);
    }, [nodes, edges]);
    useEffect(() => {
        if (loading) {
            setLoading(false);
            return;
        }
        setNodes(projectData.nodes);
        setEdges(projectData.edges);
        setLoading(true);
    }, [projectData]);

    useEffect(() => {
        nodes.forEach((node) => {
            node.data.setShowDetails = setShowDetails;
            node.data.setSelectedNode = setSelectedNode;
        });
    }, []);

    useEffect(() => {
        nodes.forEach((node) => {
            node.data.setShowDetails = setShowDetails;
            node.data.setSelectedNode = setSelectedNode;
        });
    }, []);

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
