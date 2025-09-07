import React, { useState } from 'react';
import { PatientLayout } from '../../components/Layout';
import { useAppContext } from '../../hooks/useAppContext';
import { Screens } from '../../constants';
import type { Prescription, PrescriptionStatus } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

const PrescriptionCard: React.FC<{ prescription: Prescription; onClick: () => void }> = ({ prescription, onClick }) => {
    const { t } = useTranslation();
    const statusColors = {
        Pending: 'border-yellow-400',
        Approved: 'border-green-400',
        Remitted: 'border-gray-400 text-gray-500',
        Denied: 'border-red-400'
    };
    const isDeniedOrRemitted = prescription.status === 'Remitted' || prescription.status === 'Denied';
    const isClickable = prescription.status === 'Approved';

    return (
        <button 
            onClick={onClick} 
            disabled={!isClickable}
            className={`w-full text-left bg-white p-4 rounded-lg shadow border-l-4 ${statusColors[prescription.status]} ${isDeniedOrRemitted ? 'opacity-75' : ''} hover:shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed`}
        >
            <h3 className="font-bold text-gray-800">{prescription.medicine || prescription.aiSummary?.diagnosis_suggestion || 'Pending Review'}</h3>
            {prescription.dosage && <p className="text-sm text-gray-600 truncate">{prescription.dosage}</p>}
            
            {prescription.status === 'Denied' && prescription.doctorNotes && (
                 <div className="mt-2 p-2 bg-red-50 border-l-4 border-red-300">
                    <p className="text-sm font-semibold text-red-800">{t('prescription_card_denial_reason')}</p> 
                    <p className="text-sm text-red-700">{prescription.doctorNotes}</p>
                 </div>
            )}

            <p className="text-xs text-gray-500 mt-2">{t('prescription_card_issued_by', { name: prescription.doctorName, date: prescription.dateIssued })}</p>
        </button>
    )
};


const PrescriptionsScreen: React.FC = () => {
  const { navigateTo, setActivePrescription, user, role, prescriptions } = useAppContext();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<PrescriptionStatus>('Approved');
  
  const tabs: { key: PrescriptionStatus, label: string }[] = [
      { key: 'Approved', label: t('prescriptions_tab_approved') },
      { key: 'Pending', label: t('prescriptions_tab_pending') },
      { key: 'Denied', label: t('prescriptions_tab_denied') },
      { key: 'Remitted', label: t('prescriptions_tab_remitted') },
  ];

  const userPrescriptions = prescriptions.filter(p => p.patient.id === user?.id);
  const filteredPrescriptions = userPrescriptions.filter(p => p.status === activeTab);

  const handleSelectPrescription = (prescription: Prescription) => {
    if (prescription.status !== 'Approved') return;
    setActivePrescription(prescription);
    navigateTo(Screens.QR_DISPLAY);
  };
  
  const renderEmptyState = () => {
    if (role === 'guest' && userPrescriptions.length === 0) {
        return (
            <div className="text-center pt-12 px-4">
                <h3 className="text-lg font-semibold text-gray-700">{t('prescriptions_guest_empty_title')}</h3>
                <p className="text-gray-500 mt-2">
                    {t('prescriptions_guest_empty_prompt')}
                </p>
                <p className="text-sm text-gray-400 mt-4">
                    {t('prescriptions_guest_empty_next_step')}
                </p>
            </div>
        );
    }
    return (
        <p className="text-center text-gray-500 mt-8">{t('prescriptions_empty')}</p>
    );
  };

  return (
    <PatientLayout title={t('prescriptions_title')}>
      <div>
        <div className="border-b border-gray-200 mb-4">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`${
                  activeTab === tab.key
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm capitalize`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="space-y-4">
            {filteredPrescriptions.length > 0 ? (
                filteredPrescriptions.map(p => <PrescriptionCard key={p.id} prescription={p} onClick={() => handleSelectPrescription(p)} />)
            ) : (
                renderEmptyState()
            )}
        </div>
      </div>
    </PatientLayout>
  );
};

export default PrescriptionsScreen;