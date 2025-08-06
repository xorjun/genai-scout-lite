'use client';

import { useState } from 'react';
import { Upload, FileText, Sparkles, Download, Edit3, RefreshCw } from 'lucide-react';
import TopicInput from './TopicInput';
import FileUpload from './FileUpload';
import AnalysisResults from './AnalysisResults';
import ExportOptions from './ExportOptions';

interface AnalysisData {
  topic: string;
  summary: string;
  marketTrends: string;
  keyPlayers: string;
  useCases: string;
  challenges: string;
}

export default function TechScoutApp() {
  const [currentStep, setCurrentStep] = useState<'input' | 'analysis' | 'results'>('input');
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  const handleAnalysisComplete = (data: AnalysisData) => {
    setAnalysisData(data);
    setCurrentStep('results');
  };

  const handleNewAnalysis = () => {
    setCurrentStep('input');
    setAnalysisData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  GenAI-Scout Lite
                </h1>
                <p className="text-sm text-gray-600">Technology Intelligence Assistant</p>
              </div>
            </div>
            {currentStep === 'results' && (
              <button
                onClick={handleNewAnalysis}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                <RefreshCw className="w-4 h-4" />
                <span>New Analysis</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {currentStep === 'input' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-gray-900">
                Discover Technology Insights
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get AI-powered analysis of technology trends, market insights, and competitive intelligence 
                in seconds. Perfect for innovation teams and technology scouts.
              </p>
            </div>

            {/* Input Options */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Topic Analysis</h3>
                </div>
                <TopicInput onAnalysisComplete={handleAnalysisComplete} />
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Upload className="w-6 h-6 text-purple-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Document Upload</h3>
                </div>
                <FileUpload onAnalysisComplete={handleAnalysisComplete} />
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">What You&apos;ll Get</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
                    <Sparkles className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">AI Summary</h4>
                  <p className="text-sm text-gray-600">Comprehensive technology overview</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Market Trends</h4>
                  <p className="text-sm text-gray-600">Current industry developments</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
                    <Edit3 className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Key Players</h4>
                  <p className="text-sm text-gray-600">Industry leaders and competitors</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto">
                    <Download className="w-6 h-6 text-orange-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Export Ready</h4>
                  <p className="text-sm text-gray-600">PDF and Markdown formats</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'results' && analysisData && (
          <div className="space-y-8">
            <AnalysisResults data={analysisData} onDataUpdate={setAnalysisData} />
            <ExportOptions data={analysisData} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>© 2025 GenAI-Scout Lite. Powered by Groq AI.</p>
            <p className="text-sm mt-2">Fast, curated technology intelligence for innovation teams.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
