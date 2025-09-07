import React from 'react';
import { PatientLayout } from '../../components/Layout';
import { useAppContext } from '../../hooks/useAppContext';
import type { Consultation } from '../../types';
import { Screens } from '../../constants';
import { useTranslation } from '../../hooks/useTranslation';

const ConsultationCard: React.FC<{ consultation: Consultation }> = ({ consultation }) => {
    const { navigateTo, setActiveConsultation } = useAppContext();
    const { t } = useTranslation();
    
    const statusColors: { [key in Consultation['status']]: string } = {
        'AI Triage': 'bg-blue-100 text-blue-800',
        'Pending Doctor': 'bg-yellow-100 text-yellow-800',
        'Completed': 'bg-green-100 text-green-800'
    };
    
    const statusTranslations: { [key in Consultation['status']]: string } = {
        'AI Triage': 'AI Triage', // System state
        'Pending Doctor': t('consultation_status_pending'),
        'Completed': t('consultation_status_completed'),
    };

    const handleReview = () => {
        setActiveConsultation(consultation);
        navigateTo(Screens.PATIENT_CONSULTATION_DETAIL);
    };

    return (
        <button onClick={handleReview} className="w-full text-left bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-gray-800">
                        {consultation.symptoms.join(', ')}
                    </h3>
                    <p className="text-sm text-gray-500">{consultation.date}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[consultation.status]}`}>
                    {statusTranslations[consultation.status]}
                </span>
            </div>
            {consultation.aiSummary && (
                 <p className="text-sm text-gray-600 mt-2 border-l-4 border-teal-300 pl-2">
                    {t('consultation_card_ai_suggestion', { suggestion: consultation.aiSummary.diagnosis_suggestion })}
                </p>
            )}
        </button>
    )
};

const ConsultsScreen: React.FC = () => {
    const { consultations, user } = useAppContext();
    const { t } = useTranslation();
    const userConsultations = consultations.filter(c => c.patientId === user?.id);

  return (
    <PatientLayout title={t('consultations_title')}>
      <div className="space-y-4">
        {userConsultations.length > 0 ? (
            userConsultations.map((consult) => (
                <ConsultationCard key={consult.id} consultation={consult}/>
            ))
        ) : (
            <div className="text-center pt-16">
                <p className="text-gray-500">{t('consultations_empty')}</p>
                <p className="text-sm text-gray-400 mt-2">{t('consultations_empty_prompt')}</p>
            </div>
        )}
      </div>
    </PatientLayout>
  );
};

export default ConsultsScreen;
