

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { Screens } from '../../constants';
import type { Consultation } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import { StatCard } from '../../components/Dashboard';
import { ConsultsIcon, CheckBadgeIcon, ChatBubbleIcon } from '../../components/Icons';


const ConsultationQueueCard: React.FC<{ consultation: Consultation }> = ({ consultation }) => {
    const { navigateTo, setActiveConsultation } = useAppContext();
    if (!consultation.aiSummary) return null;
    const { urgency_level, diagnosis_suggestion } = consultation.aiSummary;
    const urgencyColors = {
        Low: 'border-green-500',
        Medium: 'border-yellow-500',
        High: 'border-orange-500',
        Critical: 'border-red-500',
    };

    const handleReview = () => {
        setActiveConsultation(consultation);
        navigateTo(Screens.CONSULTATION_DETAIL);
    };

    return (
        <div className={`bg-white p-4 rounded-lg shadow border-l-4 ${urgencyColors[urgency_level]}`}>
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-800">{consultation.patient.name}</h3>
                <p className="text-sm text-gray-500">{consultation.date}</p>
            </div>
            <p className="text-sm text-gray-600 mt-1">Symptoms: {consultation.symptoms.join(', ')}</p>
            <div className="mt-2 bg-gray-50 p-2 rounded-md">
                <p className="text-xs font-semibold text-gray-500">AI Triage Suggestion</p>
                <p className="text-sm text-gray-700">{diagnosis_suggestion}</p>
            </div>
             <div className="mt-3">
                <button onClick={handleReview} className="w-full bg-blue-500 text-white px-3 py-2 rounded-md text-sm font-semibold hover:bg-blue-600">Review Details</button>
            </div>
        </div>
    );
};

const CompletedConsultationCard: React.FC<{ consultation: Consultation }> = ({ consultation }) => {
    const { navigateTo, setActiveConsultation } = useAppContext();

    const handleReview = () => {
        setActiveConsultation(consultation);
        navigateTo(Screens.CONSULTATION_DETAIL);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow opacity-80">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-gray-600">{consultation.patient.name}</h3>
                    <p className="text-sm text-gray-500">{consultation.date}</p>
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    Completed
                </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Symptoms: {consultation.symptoms.join(', ')}</p>
            <button onClick={handleReview} className="mt-3 text-sm text-blue-600 hover:underline">View Summary</button>
        </div>
    );
}

const DoctorDashboard: React.FC = () => {
    const { user, logout, navigateTo, doctorProfiles, updateDoctorAvailability, consultations, patientDoctorChats, t } = useAppContext();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'queue' | 'history'>('queue');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const pendingConsultations = consultations.filter(c => c.status === 'Pending Doctor');
    const completedConsultations = consultations.filter(c => c.status === 'Completed');
    
    const completedTodayCount = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        return consultations.filter(c => c.status === 'Completed' && c.date === today).length;
    }, [consultations]);
    
    const doctorProfile = doctorProfiles.find(d => d.userId === user?.id);
    const isAvailable = doctorProfile?.availability === 'Available';

    const unreadMessagesCount = useMemo(() => {
        if (!user) return 0;
        return Object.values(patientDoctorChats)
            .flat()
            .filter(msg => msg.sender === 'patient' && !msg.readByDoctor).length;
    }, [patientDoctorChats, user]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleAvailabilityChange = () => {
        if (doctorProfile) {
            const newStatus = isAvailable ? 'On Leave' : 'Available';
            updateDoctorAvailability(doctorProfile.id, newStatus);
        }
    };
    
    const renderContent = () => {
        if (activeTab === 'queue') {
            return (
                 <div className="space-y-4">
                    {pendingConsultations.length > 0 ? (
                        pendingConsultations.map(c => <ConsultationQueueCard key={c.id} consultation={c} />)
                    ) : (
                        <p className="text-center text-gray-500 mt-8">The consultation queue is empty.</p>
                    )}
                </div>
            )
        }
        if (activeTab === 'history') {
            return (
                 <div className="space-y-4">
                    {completedConsultations.length > 0 ? (
                        completedConsultations.map(c => <CompletedConsultationCard key={c.id} consultation={c} />)
                    ) : (
                        <p className="text-center text-gray-500 mt-8">No completed consultations found.</p>
                    )}
                </div>
            )
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <header className="bg-white p-4 shadow-md z-10">
                <div className="flex justify-between items-center">
                    <div className="relative" ref={dropdownRef}>
                        <button onClick={() => setIsDropdownOpen(prev => !prev)} className="flex-shrink-0 block">
                            {user?.avatarUrl ? (
                                <img src={user.avatarUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                                <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-xl font-bold">
                                    {user?.name?.charAt(0) || 'D'}
                                </div>
                            )}
                        </button>
                        {pendingConsultations.length > 0 && (
                             <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                                {pendingConsultations.length}
                            </span>
                        )}
                        {isDropdownOpen && (
                            <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-100">
                                <button
                                    onClick={() => { navigateTo(Screens.PROFESSIONAL_PROFILE_EDIT); setIsDropdownOpen(false); }}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    {t('profile_edit_button')}
                                </button>
                                <button
                                    onClick={logout}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                    {t('profile_logout_button')}
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="text-right">
                        <h1 className="text-2xl font-bold text-gray-800">Doctor Dashboard</h1>
                        <p className="text-sm text-gray-500">Welcome, {user?.name || 'Doctor'}</p>
                    </div>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <StatCard title={t('doctor_stat_pending')} value={pendingConsultations.length} icon={<ConsultsIcon />} />
                    <StatCard title={t('doctor_stat_completed_today')} value={completedTodayCount} icon={<CheckBadgeIcon />} />
                </div>

                {doctorProfile && (
                    <div className="bg-white rounded-lg shadow p-3 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{t('doctor_status_label')}</span>
                        <div className="flex items-center">
                             <span className={`mr-3 text-sm font-semibold ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                                {isAvailable ? t('doctor_status_available') : t('doctor_status_on_leave')}
                            </span>
                            <label htmlFor="availabilityToggle" className="flex items-center cursor-pointer">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        id="availabilityToggle"
                                        className="sr-only peer"
                                        checked={isAvailable}
                                        onChange={handleAvailabilityChange}
                                    />
                                    <div className="block bg-gray-300 w-12 h-7 rounded-full peer-checked:bg-teal-500 transition"></div>
                                    <div className="dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition transform peer-checked:translate-x-full"></div>
                                </div>
                            </label>
                        </div>
                    </div>
                )}
                 
                 <div className="bg-white rounded-lg shadow p-3 grid grid-cols-2 gap-3">
                    <button 
                        onClick={() => navigateTo(Screens.FORUM)}
                        className="w-full bg-teal-500 text-white text-sm font-bold py-2 px-4 rounded-lg shadow hover:bg-teal-600 transition"
                    >
                        Professionals Forum
                    </button>
                    <button 
                        onClick={() => navigateTo(Screens.PROFESSIONALS_DIRECTORY)}
                        className="w-full bg-blue-500 text-white text-sm font-bold py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition"
                    >
                        Private Chat
                    </button>
                 </div>

                <div className="bg-white rounded-lg shadow">
                    <div className="border-b border-gray-200 px-4">
                        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                            <button
                                onClick={() => setActiveTab('queue')}
                                className={`${ activeTab === 'queue' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300' } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
                            >
                                {t('doctor_dashboard_queue')} ({pendingConsultations.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('history')}
                                className={`${ activeTab === 'history' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300' } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
                            >
                                {t('doctor_dashboard_history')}
                            </button>
                        </nav>
                    </div>
                    <div className="p-4">
                        {renderContent()}
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow text-center">
                    <div className="flex justify-center items-center">
                         <div className="mr-4 text-gray-500"><ChatBubbleIcon /></div>
                        <div>
                             <p className="font-semibold text-gray-700">{t('doctor_dashboard_messages_title')}</p>
                             <p className="text-sm text-gray-500 mt-1">{t('doctor_dashboard_messages_prompt')}</p>
                        </div>
                    </div>
                    <button 
                      onClick={() => navigateTo(Screens.DOCTOR_INBOX)}
                      className="relative mt-3 bg-gray-200 text-gray-700 px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-gray-300 transition"
                    >
                      {t('doctor_dashboard_messages_button')}
                      {unreadMessagesCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {unreadMessagesCount}
                        </span>
                      )}
                    </button>
                </div>
            </main>
        </div>
    );
};

export default DoctorDashboard;
