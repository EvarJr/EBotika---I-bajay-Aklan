import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { Screens } from '../../constants';
import { ArrowLeftIcon } from '../../components/Icons';
import { useTranslation } from '../../hooks/useTranslation';

const ConfirmationModal: React.FC<{
    title: string;
    text: string;
    confirmText: string;
    onConfirm: () => void;
    onClose: () => void;
}> = ({ title, text, confirmText, onConfirm, onClose }) => (
    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
            <h2 className="text-xl font-bold mb-2 text-gray-800">{title}</h2>
            <p className="text-sm text-gray-600 mb-6">{text}</p>
            <div className="flex justify-end space-x-2">
                <button onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">
                    Cancel
                </button>
                <button onClick={onConfirm} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700">
                    {confirmText}
                </button>
            </div>
        </div>
    </div>
);

const PatientDetailScreen: React.FC = () => {
    const { 
        navigateTo, 
        activePatientForManagement, 
        setActivePatientForManagement,
        updateUserStatus,
        deleteUser,
        prescriptions,
        t 
    } = useAppContext();
    const [modalType, setModalType] = useState<'ban' | 'unban' | 'delete' | null>(null);

    const handleBack = () => {
        setActivePatientForManagement(null);
        navigateTo(Screens.RHU_DASHBOARD);
    };

    if (!activePatientForManagement) {
        return (
            <div className="flex flex-col h-full items-center justify-center text-center p-4">
                <p className="text-red-500 font-semibold">No patient selected.</p>
                <button onClick={handleBack} className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg">
                    Back to Dashboard
                </button>
            </div>
        );
    }
    
    const patient = activePatientForManagement;
    const isBanned = patient.status === 'banned';

    const patientPrescriptionCount = prescriptions.filter(p => p.patient.id === patient.id).length;

    const handleBanToggle = () => {
        const newStatus = isBanned ? 'active' : 'banned';
        updateUserStatus(patient.id, newStatus);
        // Also update the active patient in context to reflect the change immediately on this screen
        setActivePatientForManagement({ ...patient, status: newStatus });
        setModalType(null);
    };

    const handleDelete = () => {
        deleteUser(patient.id);
        setModalType(null);
        handleBack();
    };

    const modalContent = {
        ban: { 
            title: t('patient_detail_ban_confirm_title'), 
            text: t('patient_detail_ban_confirm_text'),
            confirmText: t('confirm'),
            action: handleBanToggle
        },
        unban: { 
            title: t('patient_detail_unban_confirm_title'), 
            text: t('patient_detail_unban_confirm_text'),
            confirmText: t('confirm'),
            action: handleBanToggle
        },
        delete: {
            title: t('patient_detail_delete_confirm_title'),
            text: t('patient_detail_delete_confirm_text'),
            confirmText: t('confirm'),
            action: handleDelete
        },
    };

    const displayAddress = patient.address ? `${patient.address.streetAddress}, ${patient.address.purok}, ${patient.address.barangay}` : 'Not set';

    return (
        <div className="relative flex flex-col h-full bg-gray-50">
            {modalType && (
                <ConfirmationModal 
                    title={modalContent[modalType].title}
                    text={modalContent[modalType].text}
                    confirmText={modalContent[modalType].confirmText}
                    onConfirm={modalContent[modalType].action}
                    onClose={() => setModalType(null)}
                />
            )}
            <header className="bg-white p-4 shadow-md z-10 flex items-center">
                <button onClick={handleBack} className="text-gray-600 hover:text-gray-800 mr-4">
                    <ArrowLeftIcon />
                </button>
                <h1 className="text-xl font-bold text-gray-800">{t('patient_detail_title')}</h1>
            </header>
            <main className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="font-bold text-lg text-gray-800 mb-2">{t('patient_detail_info')}</h2>
                    <div className="flex items-center space-x-4">
                        <img src={patient.avatarUrl || `https://ui-avatars.com/api/?name=${patient.name.replace(' ', '+')}&background=random`} alt={patient.name} className="w-16 h-16 rounded-full object-cover" />
                        <div>
                            <p className="font-bold text-xl text-gray-900">{patient.name}</p>
                            <p className="text-sm text-gray-600">{patient.email}</p>
                            <p className="text-sm text-gray-600">{patient.contactNumber}</p>
                            <p className="text-sm text-gray-600">{displayAddress}</p>
                        </div>
                    </div>
                    <div className="mt-4 border-t pt-4 space-y-3">
                         {patient.validIdUrl ? (
                            <a 
                                href={patient.validIdUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full text-center bg-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition"
                            >
                                {t('rhu_view_id_button')}
                            </a>
                        ) : (
                            <div className="text-center text-sm text-gray-500 bg-gray-100 p-2 rounded-md">
                                {t('rhu_no_id_submitted')}
                            </div>
                        )}
                        <div className="bg-gray-50 p-3 rounded-md text-center">
                            <p className="text-sm font-medium text-gray-500">{t('patient_detail_prescriptions_received')}</p>
                            <p className="text-2xl font-bold text-teal-600">{patientPrescriptionCount}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="font-bold text-lg text-gray-800 mb-2">{t('patient_detail_reports')}</h2>
                    {patient.reports && patient.reports.length > 0 ? (
                        <div className="space-y-3">
                            {patient.reports.map((report, index) => (
                                <div key={index} className="bg-red-50 border-l-4 border-red-400 p-3 rounded-md">
                                    <p className="text-sm text-red-800">{report.reason}</p>
                                    <p className="text-xs text-red-600 mt-1 font-semibold">{t('patient_detail_report_by', {name: report.doctorName, date: report.date})}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">{t('patient_detail_no_reports')}</p>
                    )}
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="font-bold text-lg text-gray-800 mb-4">{t('patient_detail_actions')}</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                            <div>
                                <p className="font-semibold text-gray-800">{isBanned ? t('patient_detail_unban_button') : t('patient_detail_ban_button')}</p>
                                <p className="text-xs text-gray-500">{isBanned ? 'User is currently banned.' : 'User is currently active.'}</p>
                            </div>
                            <label htmlFor="banToggle" className="flex items-center cursor-pointer">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        id="banToggle"
                                        className="sr-only peer"
                                        checked={!isBanned}
                                        onChange={() => setModalType(isBanned ? 'unban' : 'ban')}
                                    />
                                    <div className="block bg-red-500 w-12 h-7 rounded-full peer-checked:bg-teal-500 transition"></div>
                                    <div className="dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition transform peer-checked:translate-x-full"></div>
                                </div>
                            </label>
                        </div>
                        <button 
                            onClick={() => setModalType('delete')}
                            className="w-full bg-red-600 text-white font-bold py-3 rounded-lg shadow hover:bg-red-700 transition"
                        >
                            {t('patient_detail_delete_button')}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PatientDetailScreen;