'use client';

import { useState } from 'react';
import { Edit3, Save, Loader2, TrendingUp, Users, Target, AlertTriangle } from 'lucide-react';

interface AnalysisData {
  topic: string;
  summary: string;
  marketTrends: string;
  keyPlayers: string;
  useCases: string;
  challenges: string;
}

interface AnalysisResultsProps {
  data: AnalysisData;
  onDataUpdate: (data: AnalysisData) => void;
}

export default function AnalysisResults({ data, onDataUpdate }: AnalysisResultsProps) {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [isRefining, setIsRefining] = useState<string | null>(null);

  const startEditing = (section: keyof AnalysisData, content: string) => {
    setEditingSection(section);
    setEditingContent(content);
  };

  const saveEdit = () => {
    if (editingSection) {
      onDataUpdate({
        ...data,
        [editingSection]: editingContent,
      });
    }
    setEditingSection(null);
    setEditingContent('');
  };

  const cancelEdit = () => {
    setEditingSection(null);
    setEditingContent('');
  };

  const refineSection = async (section: keyof AnalysisData, action: 'refine' | 'simplify' | 'expand') => {
    setIsRefining(section);
    try {
      const response = await fetch('/api/refine-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: data[section],
          action,
          context: data.topic,
        }),
      });

      if (!response.ok) {
        throw new Error('Refinement failed');
      }

      const result = await response.json();
      onDataUpdate({
        ...data,
        [section]: result.refinedContent,
      });
    } catch (error) {
      console.error('Refinement error:', error);
      alert('Failed to refine content. Please try again.');
    } finally {
      setIsRefining(null);
    }
  };

  const sections = [
    {
      key: 'summary' as keyof AnalysisData,
      title: 'Technology Overview',
      icon: Target,
      color: 'blue',
    },
    {
      key: 'marketTrends' as keyof AnalysisData,
      title: 'Market Trends',
      icon: TrendingUp,
      color: 'green',
    },
    {
      key: 'keyPlayers' as keyof AnalysisData,
      title: 'Key Players',
      icon: Users,
      color: 'purple',
    },
    {
      key: 'useCases' as keyof AnalysisData,
      title: 'Use Cases',
      icon: Target,
      color: 'orange',
    },
    {
      key: 'challenges' as keyof AnalysisData,
      title: 'Challenges',
      icon: AlertTriangle,
      color: 'red',
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'border-blue-200 bg-blue-50',
      green: 'border-green-200 bg-green-50',
      purple: 'border-purple-200 bg-purple-50',
      orange: 'border-orange-200 bg-orange-50',
      red: 'border-red-200 bg-red-50',
    };
    return colorMap[color as keyof typeof colorMap] || 'border-gray-200 bg-gray-50';
  };

  const getIconColorClasses = (color: string) => {
    const colorMap = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      orange: 'text-orange-600',
      red: 'text-red-600',
    };
    return colorMap[color as keyof typeof colorMap] || 'text-gray-600';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Analysis Results</h2>
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-lg font-medium text-gray-700">Topic: {data.topic}</span>
        </div>
      </div>

      {/* Analysis Sections */}
      <div className="grid gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          const isEditing = editingSection === section.key;
          const isCurrentlyRefining = isRefining === section.key;
          
          return (
            <div
              key={section.key}
              className={`bg-white rounded-2xl shadow-lg border border-gray-200 p-6 ${getColorClasses(section.color)}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Icon className={`w-6 h-6 ${getIconColorClasses(section.color)}`} />
                  <h3 className="text-xl font-semibold text-gray-900">{section.title}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  {!isEditing && (
                    <>
                      <button
                        onClick={() => refineSection(section.key, 'refine')}
                        disabled={isCurrentlyRefining}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 disabled:opacity-50 transition-colors duration-200"
                      >
                        {isCurrentlyRefining ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Refine'}
                      </button>
                      <button
                        onClick={() => refineSection(section.key, 'simplify')}
                        disabled={isCurrentlyRefining}
                        className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 disabled:opacity-50 transition-colors duration-200"
                      >
                        Simplify
                      </button>
                      <button
                        onClick={() => refineSection(section.key, 'expand')}
                        disabled={isCurrentlyRefining}
                        className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 disabled:opacity-50 transition-colors duration-200"
                      >
                        Expand
                      </button>
                      <button
                        onClick={() => startEditing(section.key, data[section.key])}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={saveEdit}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="prose prose-gray max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {data[section.key]}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
