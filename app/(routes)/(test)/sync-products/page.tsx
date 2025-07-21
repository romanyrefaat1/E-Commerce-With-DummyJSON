'use client';

import { useState, useRef } from 'react';
import { Play, Download, AlertCircle, CheckCircle, SkipForward, X, Clock, Database, Square } from 'lucide-react';

export default function SyncProductsPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const abortControllerRef = useRef(null);

  const startSync = async () => {
    setIsRunning(true);
    setResults(null);
    setError(null);
    setStartTime(new Date());
    setEndTime(null);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      console.log('🚀 Starting product sync from frontend...');

      const response = await fetch('/api/sync-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sync products');
      }

      console.log('✅ Sync completed successfully:', data);
      setResults(data.data);
      setEndTime(new Date());

    } catch (err) {
      if (err.name === 'AbortError') {
        console.warn('⏹️ Sync was cancelled by user.');
        setError('Sync was cancelled.');
      } else {
        console.error('❌ Sync failed:', err);
        setError(err.message);
      }
      setEndTime(new Date());
    } finally {
      setIsRunning(false);
      abortControllerRef.current = null;
    }
  };

  const stopSync = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const downloadResults = () => {
    if (!results) return;

    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `product-sync-results-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const getDuration = () => {
    if (!startTime) return null;
    const end = endTime || new Date();
    return Math.round((end - startTime) / 1000);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'created':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'skipped':
        return <SkipForward className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Product Sync Tool
              </h1>
              <p className="text-gray-600">
                Sync products from DummyJSON API to DodoPayments
              </p>
            </div>
            <Database className="w-12 h-12 text-indigo-600" />
          </div>

          {/* Action Buttons */}
          <div className="mb-8 flex space-x-4">
            <button
              onClick={startSync}
              disabled={isRunning}
              className={`
                flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all
                ${isRunning 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-105'
                }
                text-white shadow-lg
              `}
            >
              {isRunning ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  <span>Syncing Products...</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>Start Product Sync</span>
                </>
              )}
            </button>

            {isRunning && (
              <button
                onClick={stopSync}
                className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium bg-red-600 hover:bg-red-700 text-white shadow-lg hover:scale-105"
              >
                <Square className="w-5 h-5" />
                <span>Stop Sync</span>
              </button>
            )}
          </div>

          {/* Status */}
          {(isRunning || results || error) && (
            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {isRunning ? (
                    `Running for ${getDuration()}s...`
                  ) : results ? (
                    `Completed in ${getDuration()}s`
                  ) : error ? (
                    `Stopped after ${getDuration()}s`
                  ) : null}
                </span>
              </div>

              {isRunning && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <div className="animate-pulse w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-blue-700 font-medium">
                      Syncing products... Check the browser console for detailed logs.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error, Results, etc. -- Keep your existing sections unchanged */}

        </div>
      </div>
    </div>
  );
}