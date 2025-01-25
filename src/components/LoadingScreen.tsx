import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-16 h-16 text-blue-400 animate-spin mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Analyzing Your Project</h2>
        <p className="text-gray-300">Our AI is processing your construction requirements...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;