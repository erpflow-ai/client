import React, { useEffect, useState } from "react";
import { Bot, Send, Building2, Sparkles, X } from "lucide-react";
import ProjectGraph from "./components/ProjectGraph";
import LoadingScreen from "./components/LoadingScreen";
import { ApiResponse, apiCall } from "./utils/api";
import NodeDetails from "./components/NodeDetails";

const exampleOrders = [
    "200ft bridge in Mumbai",
    "Shopping mall in Delhi",
    "Residential complex in Bangalore",
    "Smart city infrastructure in Hyderabad",
];

const featureList = [
    {
        title: "AI-Powered Analysis",
        description:
            "Our advanced algorithms analyze your requirements in real-time to provide optimal construction solutions",
        icon: <Bot className="w-8 h-8 text-blue-400" />,
    },
    {
        title: "Instant Processing",
        description:
            "Get immediate responses and preliminary assessments for your construction projects",
        icon: <Sparkles className="w-8 h-8 text-purple-400" />,
    },
    {
        title: "Expert Validation",
        description:
            "Every proposal is thoroughly validated by our team of construction experts",
        icon: <Building2 className="w-8 h-8 text-pink-400" />,
    },
];

function App() {
    const [order, setOrder] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [projectData, setProjectData] = useState<ApiResponse | null>(null);
    const [showNodeDetails, setShowNodeDetails] = useState(false);
    const [selectedNode, setSelectedNode] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setShowSuccessMessage(false);
        setProjectData(null);

        try {
            const response: any = await apiCall(order);
            setProjectData(response);
            console.log(response);
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);
        } finally {
            setIsLoading(false);
            setOrder("");
        }
    };

    useEffect(() => {
        if (projectData) {
            console.log("projectData changed");
        }
    }, [projectData]);

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-slate-900 to-black text-white overflow-hidden relative">
            {isLoading && <LoadingScreen />}

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -inset-[10px] opacity-50">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-[120px]" />
                    <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[120px]" />
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 relative z-10">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-6xl font-bold mb-8 leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                        Transform Your Project Planning
                    </h2>
                    <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                        Describe your construction needs, and our model will
                        create detailed plans, cost estimates, and timelines.
                        From bridges to buildings, we make your vision a
                        reality.
                    </p>
                </div>

                <div className="max-w-2xl mx-auto relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl -z-10 transform scale-105" />
                    <form onSubmit={handleSubmit} className="relative">
                        <div className="flex items-center space-x-2 p-3 bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl">
                            <Bot className="w-6 h-6 text-blue-400 ml-4" />
                            <input
                                type="text"
                                value={order}
                                onChange={(e) => setOrder(e.target.value)}
                                placeholder="describe your project here"
                                className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-gray-400 text-lg py-4 px-4 transition-all duration-200"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !order.trim()}
                                className={`px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-300 ${
                                    isLoading || !order.trim()
                                        ? "bg-gray-700 cursor-not-allowed"
                                        : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg hover:shadow-blue-500/25"
                                }`}
                            >
                                {!isLoading && (
                                    <>
                                        <span>Submit</span>
                                        <Send className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div
                        className={`mt-4 transition-all duration-300 ${
                            showSuccessMessage
                                ? "opacity-100 transform translate-y-0"
                                : "opacity-0 transform -translate-y-2"
                        }`}
                    >
                        <div className="bg-green-500/20 text-green-300 px-4 py-2 rounded-lg backdrop-blur-sm">
                            Project analysis complete! View the project timeline
                            below.
                        </div>
                    </div>

                    {!isLoading && !projectData && (
                        <div className="mt-12 text-center">
                            <p className="text-gray-400 mb-6 flex items-center justify-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                Try these examples
                                <Sparkles className="w-4 h-4" />
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                {exampleOrders.map((example) => (
                                    <button
                                        key={example}
                                        onClick={() => setOrder(example)}
                                        className="px-6 py-3 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 text-sm transition-all duration-200 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 backdrop-blur-sm"
                                    >
                                        {example}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {projectData && (
                    <div className="mt-16 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
                        <div className="h-[900px] w-full">
                            <ProjectGraph
                                projectData={projectData}
                                setProjectData={setProjectData}
                                setShowDetails={setShowNodeDetails}
                                setSelectedNode={setSelectedNode}
                            />
                        </div>
                    </div>
                )}

                {!projectData && (
                    <div className="max-w-5xl mx-auto mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                        {featureList.map((feature) => (
                            <div
                                key={feature.title}
                                className="p-8 rounded-2xl bg-gray-800/30 border border-gray-700/50 backdrop-blur-sm hover:border-gray-600/50 transition-all duration-300 hover:shadow-xl group"
                            >
                                <div className="mb-4 transform transition-transform duration-300 group-hover:scale-110">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {showNodeDetails && projectData && (
                <NodeDetails
                    data={
                        projectData.nodes.find(
                            (node) => node.id === selectedNode
                        )?.data
                    }
                    setShowDetails={setShowNodeDetails}
                    setProjectData={setProjectData}
                />
            )}
        </div>
    );
}

export default App;
