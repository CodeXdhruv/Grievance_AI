import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

function GrievanceList() {
    const navigate = useNavigate();
    const [grievances, setGrievances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchGrievances();
    }, []);

    const fetchGrievances = async () => {
        try {
            setLoading(true);
            const data = await api.get('/grievances');
            setGrievances(data.grievances || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            'UNIQUE': 'bg-green-100 text-green-800',
            'NEAR_DUPLICATE': 'bg-yellow-100 text-yellow-800',
            'DUPLICATE': 'bg-red-100 text-red-800'
        };
        return styles[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusIcon = (status) => {
        const icons = {
            'UNIQUE': '✓',
            'NEAR_DUPLICATE': '⚠',
            'DUPLICATE': '×'
        };
        return icons[status] || '?';
    };

    const filteredGrievances = filter === 'all' 
        ? grievances 
        : grievances.filter(g => g.duplicate_status === filter);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="header-section">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-1">Your Grievances</h1>
                            <p className="text-gray-600">
                                {grievances.length} {grievances.length === 1 ? 'grievance' : 'grievances'} submitted
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/submit-text')}
                            className="btn-primary px-6 py-3 font-medium whitespace-nowrap"
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Submit New
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                {/* Filter Tabs */}
                <div className="mb-6 bg-white border border-gray-200 rounded-lg p-2">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded font-medium transition-colors text-sm ${
                                filter === 'all' 
                                    ? 'bg-gray-900 text-white' 
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            All <span className={`ml-1.5 px-1.5 py-0.5 rounded text-xs ${filter === 'all' ? 'bg-white/20' : 'bg-gray-200'}`}>{grievances.length}</span>
                        </button>
                        <button
                            onClick={() => setFilter('UNIQUE')}
                            className={`px-4 py-2 rounded font-medium transition-colors text-sm ${
                                filter === 'UNIQUE' 
                                    ? 'bg-gray-900 text-white' 
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            Unique <span className={`ml-1.5 px-1.5 py-0.5 rounded text-xs ${filter === 'UNIQUE' ? 'bg-white/20' : 'bg-gray-200'}`}>{grievances.filter(g => g.duplicate_status === 'UNIQUE').length}</span>
                        </button>
                        <button
                            onClick={() => setFilter('NEAR_DUPLICATE')}
                            className={`px-4 py-2 rounded font-medium transition-colors text-sm ${
                                filter === 'NEAR_DUPLICATE' 
                                    ? 'bg-gray-900 text-white' 
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            Near Duplicate <span className={`ml-1.5 px-1.5 py-0.5 rounded text-xs ${filter === 'NEAR_DUPLICATE' ? 'bg-white/20' : 'bg-gray-200'}`}>{grievances.filter(g => g.duplicate_status === 'NEAR_DUPLICATE').length}</span>
                        </button>
                        <button
                            onClick={() => setFilter('DUPLICATE')}
                            className={`px-4 py-2 rounded font-medium transition-colors text-sm ${
                                filter === 'DUPLICATE' 
                                    ? 'bg-gray-900 text-white' 
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            Duplicate <span className={`ml-1.5 px-1.5 py-0.5 rounded text-xs ${filter === 'DUPLICATE' ? 'bg-white/20' : 'bg-gray-200'}`}>{grievances.filter(g => g.duplicate_status === 'DUPLICATE').length}</span>
                        </button>
                    </div>
                </div>

                {/* Grievances List */}
                {filteredGrievances.length === 0 ? (
                    <div className="card text-center py-12">
                        <div className="text-6xl mb-4">📝</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Grievances Found</h3>
                        <p className="text-gray-600 mb-6">
                            {filter === 'all' 
                                ? "You haven't submitted any grievances yet."
                                : `No ${filter.toLowerCase().replace('_', ' ')} grievances found.`
                            }
                        </p>
                        <button
                            onClick={() => navigate('/submit-text')}
                            className="btn-primary px-6 py-3 font-medium"
                        >
                            Submit Your First Grievance
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredGrievances.map((grievance) => (
                            <div key={grievance.id} className="card hover:shadow-md transition-shadow">
                                <div className="mb-3">
                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                        <span className={`badge-${grievance.duplicate_status === 'UNIQUE' ? 'unique' : grievance.duplicate_status === 'NEAR_DUPLICATE' ? 'near' : 'duplicate'} text-xs px-3 py-1`}>
                                            {grievance.duplicate_status.replace('_', ' ')}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-xs text-gray-600">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {new Date(grievance.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                        {grievance.submission_type && (
                                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                                {grievance.submission_type.toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <p className="text-gray-900 text-sm leading-relaxed">
                                            {grievance.original_text.length > 300 
                                                ? `${grievance.original_text.substring(0, 300)}...` 
                                                : grievance.original_text
                                            }
                                        </p>
                                    </div>
                                </div>
                                
                                {grievance.similarity_score > 0 && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3">
                                                <div className="w-10 h-10 bg-gray-900 rounded flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-600">Similarity Score</p>
                                                    <p className="text-lg font-semibold text-gray-900">{(grievance.similarity_score * 100).toFixed(1)}%</p>
                                                </div>
                                            </div>
                                            {grievance.matched_grievance_id && (
                                                <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3">
                                                    <div className="w-10 h-10 bg-gray-900 rounded flex items-center justify-center flex-shrink-0">
                                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-600">Matched Grievance</p>
                                                        <p className="text-lg font-semibold text-gray-900">#{grievance.matched_grievance_id}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default GrievanceList;
