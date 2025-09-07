import React from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { Screens } from '../../constants';
import { ArrowLeftIcon } from '../../components/Icons';
import { AISummaryCard } from '../../components/AISummaryCard';
import { useTranslation } from '../../hooks/useTranslation';

const InfoSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-bold text-gray-700 border-b pb-2 mb-2">{title}</h3>
        <div className="text-sm text-gray-800 space-y-1">
            {children}
        </div>
    </div>
);

const PatientConsultationDetailScreen: React.FC = () => {
    const { navigateTo, activeConsultation, setActiveConsultation } = useAppContext();
    const { t } = useTranslation();

    const handleBack = () => {
        setActiveConsultation(null); // Clear active consultation on back
        navigateTo(Screens.CONSULTATIONS);
    };

    if (!activeConsultation) {
        return (
            <div className="flex flex-col h-full items-center justify-center text-center p-4">
                <p className="text-red-500 font-semibold">No consultation selected.</p>
                <button onClick={handleBack} className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg">
                    Back to Consultations
                </button>
            </div>
        );
    }

    const { date, status, symptoms, aiSummary } = activeConsultation;
    const statusColors = {
        'AI Triage': 'bg-blue-100 text-blue-800',
        'Pending Doctor': 'bg-yellow-100 text-yellow-800',
        'Completed': 'bg-green-100 text-green-800'
    };


    return (
        <div className="flex flex-col h-full bg-gray-50">
            <header className="bg-white p-4 shadow-md z-10 flex items-center">
                <button onClick={handleBack} className="text-gray-600 hover:text-gray-800 mr-4">
                    <ArrowLeftIcon />
                </button>
                <h1 className="text-xl font-bold text-gray-800">{t('patient_consult_detail_title')}</h1>
            </header>
            <main className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                <InfoSection title={t('patient_consult_detail_info_title')}>
                    <p><strong>{t('patient_consult_detail_date')}:</strong> {date}</p>
                    <p><strong>{t('patient_consult_detail_status')}:</strong> <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}>{status}</span></p>
                </InfoSection>

                <InfoSection title={t('patient_consult_detail_symptoms_title')}>
                    <ul className="list-disc list-inside">
                        {symptoms.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </InfoSection>

                {aiSummary ? (
                    <AISummaryCard summary={aiSummary} />
                ) : (
                    <InfoSection title={t('ai_summary_title')}>
                        <p>No AI summary was generated for this consultation.</p>
                    </InfoSection>
                )}
            </main>
        </div>
    );
};

export default PatientConsultationDetailScreen;