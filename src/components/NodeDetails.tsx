import React from "react";
import { X } from "lucide-react";

type NodeDetailsProps = {
    data: {
        label: string;
        details: {
            duration: string;
            cost: string;
            resources: string;
            status: string;
        };
    };
    setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
};

const NodeDetails: React.FC<NodeDetailsProps> = ({ data, setShowDetails }) => {
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
                    {data.label}
                </h3>
                <div className="space-y-3">
                    <div>
                        <label className="text-sm text-gray-400">
                            Duration:
                        </label>
                        <p className="text-white">{data.details.duration}</p>
                    </div>
                    <div>
                        <label className="text-sm text-gray-400">
                            Estimated Cost:
                        </label>
                        <p className="text-white">{data.details.cost}</p>
                    </div>
                    <div>
                        <label className="text-sm text-gray-400">
                            Required Resources:
                        </label>
                        <p className="text-white">{data.details.resources}</p>
                    </div>
                    <div>
                        <label className="text-sm text-gray-400">Status:</label>
                        <p className="text-white">{data.details.status}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NodeDetails;
