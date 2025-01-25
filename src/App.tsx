import React, { useState } from 'react';
import { Bot, Send, Building2, Sparkles, Loader2, X } from 'lucide-react';
import ProjectGraph from './components/ProjectGraph';
import LoadingScreen from './components/LoadingScreen';

// Mock API response type
type ApiResponse = {
  nodes: Array<{
    id: string;
    type: string;
    position: { x: number; y: number };
    data: {
      label: string;
      details: {
        duration: string;
        cost: string;
        resources: string;
        status: string;
      };
    };
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
  }>;
};

function App() {
  const [order, setOrder] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [projectData, setProjectData] = useState<ApiResponse | null>(null);

  const mockApiCall = async (orderText: string): Promise<ApiResponse> => {
    // Simulate API call with mock data
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      nodes: [
        {
          id: '1',
          type: 'custom',
          position: { x: 250, y: 100 },
          data: {
            label: 'Project Initiation',
            details: {
              duration: '2 weeks',
              cost: '$50,000',
              resources: 'Project Manager, Architects',
              status: 'In Progress'
            }
          }
        },
        {
          id: '2',
          type: 'custom',
          position: { x: 250, y: 200 },
          data: {
            label: 'Design Phase',
            details: {
              duration: '6 weeks',
              cost: '$150,000',
              resources: 'Design Team, Engineers',
              status: 'Pending'
            }
          }
        },
        {
          id: '3',
          type: 'custom',
          position: { x: 100, y: 300 },
          data: {
            label: 'Material Procurement',
            details: {
              duration: '4 weeks',
              cost: '$300,000',
              resources: 'Procurement Team',
              status: 'Pending'
            }
          }
        },
        {
          id: '4',
          type: 'custom',
          position: { x: 400, y: 300 },
          data: {
            label: 'Construction Phase',
            details: {
              duration: '12 weeks',
              cost: '$800,000',
              resources: 'Construction Team',
              status: 'Pending'
            }
          }
        }
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-3', source: '2', target: '3' },
        { id: 'e2-4', source: '2', target: '4' }
      ]
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShowSuccessMessage(false);
    setProjectData(null);
    
    try {
      const response = await mockApiCall(order);
      setProjectData(response);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } finally {
      setIsLoading(false);
      setOrder('');
    }
  };

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
        <div className="flex items-center justify-center mb-12 animate-fade-in">
          <div className="relative">
            <Building2 className="w-16 h-16 text-blue-400 mr-4" />
            <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
          </div>
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            BuildAI
          </h1>
        </div>

        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-6xl font-bold mb-8 leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
            Transform Your Construction Projects with AI
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Simply describe your construction needs, and our advanced AI will create detailed plans, 
            cost estimates, and timelines. From bridges to buildings, we make your vision a reality.
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
                placeholder="Describe your construction project (e.g., 200ft bridge in Mumbai)"
                className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-gray-400 text-lg py-4 px-4 transition-all duration-200"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !order.trim()}
                className={`px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-300 ${
                  isLoading || !order.trim()
                    ? 'bg-gray-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg hover:shadow-blue-500/25'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Submit</span>
                    <Send className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className={`mt-4 transition-all duration-300 ${showSuccessMessage ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2'}`}>
            <div className="bg-green-500/20 text-green-300 px-4 py-2 rounded-lg backdrop-blur-sm">
              Project analysis complete! View the project timeline below.
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
                {[
                  "200ft bridge in Mumbai",
                  "Shopping mall in Delhi",
                  "Residential complex in Bangalore",
                  "Smart city infrastructure in Hyderabad"
                ].map((example) => (
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
            <div className="h-[600px] w-full">
              <ProjectGraph nodes={projectData.nodes} edges={projectData.edges} />
            </div>
          </div>
        )}

        {!projectData && (
          <div className="max-w-5xl mx-auto mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
            {[
              {
                title: "AI-Powered Analysis",
                description: "Our advanced algorithms analyze your requirements in real-time to provide optimal construction solutions",
                icon: <Bot className="w-8 h-8 text-blue-400" />
              },
              {
                title: "Instant Processing",
                description: "Get immediate responses and preliminary assessments for your construction projects",
                icon: <Sparkles className="w-8 h-8 text-purple-400" />
              },
              {
                title: "Expert Validation",
                description: "Every proposal is thoroughly validated by our team of construction experts",
                icon: <Building2 className="w-8 h-8 text-pink-400" />
              }
            ].map((feature) => (
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
    </div>
  );
}

export default App;