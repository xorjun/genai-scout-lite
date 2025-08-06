'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, Loader2 } from 'lucide-react';

interface AnalysisData {
  topic: string;
  summary: string;
  marketTrends: string;
  keyPlayers: string;
  useCases: string;
  challenges: string;
}

interface FileUploadProps {
  onAnalysisComplete: (data: AnalysisData) => void;
}

export default function FileUpload({ onAnalysisComplete }: FileUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    maxSize: 10485760, // 10MB
  });

  const removeFile = () => {
    setUploadedFile(null);
  };

  const handleAnalyzeFile = async () => {
    if (!uploadedFile) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);

      const response = await fetch('/api/analyze-file', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('File analysis failed');
      }

      const data = await response.json();
      onAnalysisComplete(data);
    } catch (error) {
      console.error('File analysis error:', error);
      alert('Failed to analyze file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeUrl = async () => {
    if (!urlInput.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/analyze-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: urlInput.trim() }),
      });

      if (!response.ok) {
        throw new Error('URL analysis failed');
      }

      const data = await response.json();
      onAnalysisComplete(data);
    } catch (error) {
      console.error('URL analysis error:', error);
      alert('Failed to analyze URL. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* File Upload Area */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Upload Document
        </label>
        
        {!uploadedFile ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ${
              isDragActive
                ? 'border-purple-400 bg-purple-50'
                : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              {isDragActive ? 'Drop your file here' : 'Drop your file here, or click to browse'}
            </p>
            <p className="text-sm text-gray-500">
              PDF, DOC, DOCX, TXT files up to 10MB
            </p>
          </div>
        ) : (
          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <File className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="p-1 hover:bg-gray-200 rounded"
                disabled={isLoading}
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        )}

        {uploadedFile && (
          <button
            onClick={handleAnalyzeFile}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing File...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span>Analyze Document</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* URL Input */}
      <div className="border-t pt-6">
        <div className="space-y-4">
          <label htmlFor="url" className="block text-sm font-medium text-gray-700">
            Or Analyze URL
          </label>
          <div className="flex space-x-3">
            <input
              type="url"
              id="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/article"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm text-gray-800 placeholder-gray-500"
              disabled={isLoading}
            />
            <button
              onClick={handleAnalyzeUrl}
              disabled={!urlInput.trim() || isLoading}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Analyze</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
