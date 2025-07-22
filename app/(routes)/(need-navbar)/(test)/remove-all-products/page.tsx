'use client';

import { useState } from 'react';
import { Trash2, RefreshCw, AlertTriangle, CheckCircle, XCircle, Clock, Database, Zap } from 'lucide-react';

export default function DeleteAllProductsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteAll = async () => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    
    try {
      const response = await fetch('/api/remove-all-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete products');
      }

      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setShowConfirm(false);
    }
  };

  const resetResults = () => {
    setResults(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 to-orange-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-red-100">
          {/* Header */}
          <div className="bg-linear-to-r from-red-600 to-orange-600 text-white p-8 rounded-t-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Trash2 className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Delete All Products</h1>
                <p className="text-red-100 text-lg">Manage your DodoPayments product catalog</p>
              </div>
            </div>
            <div className="bg-red-500/30 border border-red-400/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-300 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-100">⚠️ Warning: This action is irreversible</p>
                  <p className="text-red-100 mt-1">All products in your DodoPayments account will be permanently deleted with a 3-second delay between each deletion.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {!isLoading && !results && !error && (
              <div className="text-center">
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6">
                    <Database className="w-4 h-4" />
                    Ready to delete all products
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Deletion Tool</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    This tool will fetch all products from your DodoPayments account and delete them one by one with a 3-second delay between deletions. 
                    The process includes detailed logging and progress tracking.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 mb-8">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-500" />
                    How it works:
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">1</div>
                      <div>
                        <p className="font-medium text-gray-900">Fetch Products</p>
                        <p>Automatically paginate through all products</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">2</div>
                      <div>
                        <p className="font-medium text-gray-900">Delete with Delay</p>
                        <p>3-second delay between each deletion</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">3</div>
                      <div>
                        <p className="font-medium text-gray-900">Show Results</p>
                        <p>Detailed report with success/failure rates</p>
                      </div>
                    </div>
                  </div>
                </div>

                {!showConfirm ? (
                  <button
                    onClick={() => setShowConfirm(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                  >
                    Delete All Products
                  </button>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
                    <h3 className="text-lg font-semibold text-red-800 mb-3">Are you absolutely sure?</h3>
                    <p className="text-red-700 text-sm mb-6">This will permanently delete ALL products from your account. This action cannot be undone.</p>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => setShowConfirm(false)}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDeleteAll}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                      >
                        Yes, Delete All
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {isLoading && (
              <div className="text-center py-12">
                <div className="inline-flex items-center gap-3 px-6 py-4 bg-blue-50 rounded-xl mb-6">
                  <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
                  <span className="text-blue-700 font-semibold">Processing deletion request...</span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>⏱️ Fetching all products from your account</p>
                  <p>🗑️ Deleting products with 3-second delays</p>
                  <p>📊 Generating detailed report</p>
                  <p className="text-xs text-gray-500 mt-4">Check your server console for real-time logs</p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <XCircle className="w-6 h-6 text-red-500 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-red-800 mb-2">Error occurred</h3>
                    <p className="text-red-700 mb-4">{error}</p>
                    <button
                      onClick={resetResults}
                      className="text-red-600 hover:text-red-700 font-medium text-sm"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {results && (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <Database className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="text-2xl font-bold text-blue-900">{results.totalProducts}</p>
                        <p className="text-blue-700 text-sm">Total Products</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="text-2xl font-bold text-green-900">{results.deletedProducts}</p>
                        <p className="text-green-700 text-sm">Deleted</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <XCircle className="w-8 h-8 text-red-600" />
                      <div>
                        <p className="text-2xl font-bold text-red-900">{results.failedDeletes}</p>
                        <p className="text-red-700 text-sm">Failed</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <Clock className="w-8 h-8 text-purple-600" />
                      <div>
                        <p className="text-2xl font-bold text-purple-900">{results.executionTimeFormatted}</p>
                        <p className="text-purple-700 text-sm">Duration</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Execution Summary</h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Success Rate:</span>
                      <span className="ml-2 font-semibold text-green-700">{results.summary?.successRate}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Avg Time/Product:</span>
                      <span className="ml-2 font-semibold text-blue-700">{results.summary?.averageTimePerDeletion}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Total with Delays:</span>
                      <span className="ml-2 font-semibold text-purple-700">{results.summary?.totalTimeWithDelays}</span>
                    </div>
                  </div>
                </div>

                {/* Results Table */}
                {results.results && results.results.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">Detailed Results</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {results.results.map((result, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 text-sm text-gray-500">{result.attemptNumber}</td>
                              <td className="px-6 py-4">
                                <div>
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {result.productName || 'Unnamed Product'}
                                  </p>
                                  <p className="text-xs text-gray-500 truncate">{result.productId}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                {result.success ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                    <CheckCircle className="w-3 h-3" />
                                    Success
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                    <XCircle className="w-3 h-3" />
                                    Failed
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-xs text-gray-600">
                                {result.success ? (result.message || 'Deleted successfully') : result.error}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <button
                    onClick={resetResults}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium"
                  >
                    Run Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}