import React, { useState } from "react";
import { X } from "lucide-react";
import { ApiResponse } from "../utils/api";

export type NodeDetailsProps = {
    data:
        | {
              label: string;
              details: {
                  id: string;
                  duration: string;
                  cost: string;
                  bom: string;
                  stakeholders: string;
                  bom_full: { item: string; price: number; vendor: string }[];
                  subworkers: Node[];
                  status: string;
              };
          }
        | undefined;
    setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
    setProjectData: React.Dispatch<React.SetStateAction<ApiResponse | null>>;
};

const NodeDetails: React.FC<NodeDetailsProps> = ({
    data,
    setShowDetails,
    setProjectData,
}) => {
    if (!data) {
        return null;
    }

    const [editableData, setEditableData] = useState(data);

    const handleInputChange = (
        field: keyof typeof editableData.details,
        value: string
    ) => {
        setEditableData((prev) => ({
            ...prev,
            details: {
                ...prev.details,
                [field]: value,
            },
        }));
    };

    const handleLabelChange = (value: string) => {
        setEditableData((prev) => ({
            ...prev,
            label: value,
        }));
    };

    const handleSave = () => {
        setProjectData((prev) => {
            if (!prev) return prev;

            const updatedNodes = prev.nodes.map((node) =>
                node.data.details.id === editableData.details.id
                    ? { ...node, data: editableData }
                    : node
            );
            return {
                ...prev,
                nodes: updatedNodes,
            };
        });

        setShowDetails(false);
    };

    return (
        <div className="absolute top-0 inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
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
                <h3 className="text-xl font-bold mb-4 text-white">
                    <input
                        type="text"
                        value={editableData.label}
                        onChange={(e) => handleLabelChange(e.target.value)}
                        className="w-full p-2 mt-1 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </h3>
                <div className="space-y-3">
                    <div>
                        <label className="text-sm text-gray-400">
                            Duration:
                        </label>
                        <input
                            type="text"
                            value={editableData.details.duration}
                            onChange={(e) =>
                                handleInputChange("duration", e.target.value)
                            }
                            className="w-full p-2 mt-1 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400">
                            Estimated Cost:
                        </label>
                        <input
                            type="text"
                            value={editableData.details.cost}
                            onChange={(e) =>
                                handleInputChange("cost", e.target.value)
                            }
                            className="w-full p-2 mt-1 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-400">BOM:</label>
                        <input
                            type="text"
                            value={editableData.details.bom}
                            onChange={(e) =>
                                handleInputChange("bom", e.target.value)
                            }
                            className="w-full p-2 mt-1 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-400">
                            StakeHolders:
                        </label>
                        <input
                            type="text"
                            value={editableData.details.stakeholders}
                            onChange={(e) =>
                                handleInputChange(
                                    "stakeholders",
                                    e.target.value
                                )
                            }
                            className="w-full p-2 mt-1 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400">Status:</label>
                        <input
                            type="text"
                            value={editableData.details.status}
                            onChange={(e) =>
                                handleInputChange("status", e.target.value)
                            }
                            className="w-full p-2 mt-1 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        onClick={() => setShowDetails(false)}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NodeDetails;
