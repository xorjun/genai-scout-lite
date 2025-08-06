'use client';

import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface AnalysisData {
  topic: string;
  summary: string;
  marketTrends: string;
  keyPlayers: string;
  useCases: string;
  challenges: string;
}

interface TopicInputProps {
  onAnalysisComplete: (data: AnalysisData) => void;
}

export default function TopicInput({ onAnalysisComplete }: TopicInputProps) {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!topic.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/analyze-topic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: topic.trim() }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      onAnalysisComplete(data);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze topic. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAnalyze();
    }
  };

  const exampleTopics = [
    'Digital Twins',
    'Predictive Maintenance',
    'Edge Computing',
    'Quantum Computing',
    'Autonomous Vehicles',
    'Blockchain in Supply Chain'
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
          Technology Topic
        </label>
        <div className="relative">
          <textarea
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter a technology topic to analyze (e.g., 'Digital twins in manufacturing', 'AI in healthcare', 'Sustainable energy solutions')..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-24 text-sm text-gray-800 placeholder-gray-500"
            disabled={isLoading}
          />
          <div className="absolute bottom-3 right-3">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      <button
        onClick={handleAnalyze}
        disabled={!topic.trim() || isLoading}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Analyzing...</span>
          </>
        ) : (
          <>
            <Search className="w-5 h-5" />
            <span>Analyze Topic</span>
          </>
        )}
      </button>

      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700">Try these examples:</p>
        <div className="flex flex-wrap gap-2">
          {exampleTopics.map((example) => (
            <button
              key={example}
              onClick={() => setTopic(example)}
              disabled={isLoading}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 disabled:opacity-50 transition-colors duration-200"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
