import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        total: 0,
        unique: 0,
        nearDuplicate: 0,
        duplicate: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const data = await api.get('/grievances');
            const grievances = data.grievances || [];
            setStats({
                total: grievances.length,
                unique: grievances.filter(g => g.duplicate_status === 'UNIQUE').length,
                nearDuplicate: grievances.filter(g => g.duplicate_status === 'NEAR_DUPLICATE').length,
                duplicate: grievances.filter(g => g.duplicate_status === 'DUPLICATE').length
            });
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        }
    };

    const cards = [
        {
            title: 'Submit Text Grievance',
            description: 'Submit a new grievance by entering text directly',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            ),
            link: '/submit-text'
        },
        {
            title: 'Submit PDF Grievance',
            description: 'Upload a PDF document containing grievances',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
            ),
            link: '/submit-pdf'
        },
        {
            title: 'View Grievances',
            description: 'View all your submitted grievances',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            link: '/grievances'
        }
    ];

    if (user?.role === 'admin') {
        cards.push({
            title: 'Admin Dashboard',
            description: 'Manage all grievances and users',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            link: '/admin'
        });
    }

    const statCards = [
        { label: 'Total Grievances', value: stats.total },
        { label: 'Unique', value: stats.unique },
        { label: 'Near Duplicate', value: stats.nearDuplicate },
        { label: 'Duplicate', value: stats.duplicate }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="header-section">
                <div className="content-section py-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome back, {user?.name}
                    </h1>
                    <p className="text-gray-600">
                        Manage your grievances with AI-powered duplicate detection
                    </p>
                </div>
            </div>

            <div className="content-section py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {statCards.map((stat, index) => (
                        <div key={index} className="stat-card">
                            <div className="text-sm font-medium text-gray-600 mb-1">{stat.label}</div>
                            <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                        </div>
                    ))}
                </div>

                {/* Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                    {cards.map((card, index) => (
                        <Link
                            key={index}
                            to={card.link}
                            className="card group hover:border-gray-300 transition-all duration-150"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center text-white flex-shrink-0 group-hover:bg-gray-800 transition-colors duration-150">
                                    {card.icon}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1.5 group-hover:text-gray-700 transition-colors duration-150">
                                        {card.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {card.description}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Quick Tips */}
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Tips</h3>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-sm font-medium">1</span>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 mb-0.5">Be Descriptive</h4>
                                <p className="text-sm text-gray-600">Provide detailed information for better duplicate detection</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-sm font-medium">2</span>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 mb-0.5">Check Duplicates</h4>
                                <p className="text-sm text-gray-600">Our AI automatically identifies similar grievances</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-sm font-medium">3</span>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 mb-0.5">Track Progress</h4>
                                <p className="text-sm text-gray-600">Monitor your submitted grievances easily</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
