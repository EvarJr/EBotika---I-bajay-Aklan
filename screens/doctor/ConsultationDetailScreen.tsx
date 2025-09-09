import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { Screens } from '../../constants';
import { ArrowLeftIcon } from '../../components/Icons';
import { AISummaryCard } from '../../components/AISummaryCard';
import type { ChatMessage } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

const InfoSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-bold text-gray-700 border-b pb-2 mb-2">{title}</h3>
        <div className="text-sm text-gray-800 space-y-1">
            {children}
        </div>
    </div>
);

const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isUser = message.sender === 'user';
    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-xs md:max-w-sm px-3 py-2 rounded-xl text-sm ${
                isUser
                    ? 'bg-blue-100 text-blue-900 rounded-br-none'
                    : 'bg-teal-100 text-teal-900 rounded-bl-none'
                }`}
            >
                <p>{message.text}</p>
            </div>
        </div>
    );
};

const DenyModal: React.FC<{ onClose: () => void; onSubmit: (reason: string) => void; }> = ({ onClose, onSubmit }) => {
    const [reason, setReason] = useState('');
    const { t } = useTranslation();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason.trim()) {
            alert("Please provide a reason.");
            return;
        }
        onSubmit(reason);
    };

    return (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
                <h2 className="text-xl font-bold mb-2 text-gray-800">{t('deny_modal_title')}</h2>
                <p className="text-sm text-gray-600 mb-4">{t('deny_modal_prompt')}</p>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label htmlFor="reason" className="sr-only">{t('deny_modal_placeholder')}</label>
                        <textarea
                            id="reason"
                            rows={4}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-sm"
                            placeholder={t('deny_modal_placeholder')}
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">{t('guest_modal_cancel')}</button>
                        <button type="submit" className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600">{t('deny_modal_submit_button')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ReportModal: React.FC<{ onClose: () => void; onSubmit: (reason: string) => void; }> = ({ onClose, onSubmit }) => {
    const [reason, setReason] = useState('');
    const { t } = useTranslation();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason.trim()) {
            alert("Please provide a reason for the report.");
            return;
        }
        onSubmit(reason);
    };

    return (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
                <h2 className="text-xl font-bold mb-2 text-gray-800">{t('report_modal_title')}</h2>
                <p className="text-sm text-gray-600 mb-4">{t('report_modal_prompt')}</p>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label htmlFor="report_reason" className="sr-only">{t('report_modal_placeholder')}</label>
                        <textarea
                            id="report_reason"
                            rows={4}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-sm"
                            placeholder={t('report_modal_placeholder')}
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">{t('guest_modal_cancel')}</button>
                        <button type="submit" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">{t('report_modal_submit_button')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const ConsultationDetailScreen: React.FC = () => {
    const { navigateTo, activeConsultation, setActiveConsultation, user, prescriptions, updatePrescription, updateConsultationStatus, addReportToUser } = useAppContext();
    const { t } = useTranslation();
    const [isDenyModalOpen, setIsDenyModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    const handleIssuePrescription = () => {
        navigateTo(Screens.PRESCRIPTION_FORM);
    };

    const handleSubmitDenial = (reason: string) => {
        if (!activeConsultation || !user) return;

        const prescriptionToDeny = prescriptions.find(p => p.consultationId === activeConsultation.id);
        
        if (prescriptionToDeny) {
            updatePrescription(prescriptionToDeny.id, {
                status: 'Denied',
                doctorNotes: reason,
                doctorName: user.name,
            });
            updateConsultationStatus(activeConsultation.id, 'Completed', user.id);
            alert('Suggestion has been denied and patient has been notified.');
            navigateTo(Screens.DOCTOR_DASHBOARD);
        } else {
            alert('No pending prescription found for this consultation.');
        }
        setIsDenyModalOpen(false);
    };

    const handleSubmitReport = (reason: string) => {
        if (!activeConsultation || !user) return;
        
        const report = {
            doctorId: user.id,
            doctorName: user.name,
            reason,
            date: new Date().toISOString().split('T')[0]
        };
        addReportToUser(activeConsultation.patient.id, report);
        alert(t('report_success_alert'));
        setIsReportModalOpen(false);
    };

    const handleBack = () => {
        setActiveConsultation(null);
        navigateTo(Screens.DOCTOR_DASHBOARD);
    };

    if (!activeConsultation || !activeConsultation.aiSummary) {
        return (
            <div className="flex flex-col h-full items-center justify-center text-center p-4">
                <p className="text-red-500 font-semibold">No consultation data found.</p>
                <button onClick={handleBack} className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg">
                    Back to Dashboard
                </button>
            </div>
        );
    }

    const { patient, symptoms, aiSummary, chatHistory, status } = activeConsultation;
    const isCompleted = status === 'Completed';
    const finalPrescription = prescriptions.find(p => p.consultationId === activeConsultation.id);
    const isPendingPrescription = finalPrescription?.status === 'Pending';

    return (
        <div className="relative flex flex-col h-full bg-gray-50">
            {isDenyModalOpen && <DenyModal onClose={() => setIsDenyModalOpen(false)} onSubmit={handleSubmitDenial} />}
            {isReportModalOpen && <ReportModal onClose={() => setIsReportModalOpen(false)} onSubmit={handleSubmitReport} />}
            <header className="bg-white p-4 shadow-md z-10 flex items-center">
                <button onClick={handleBack} className="text-gray-600 hover:text-gray-800 mr-4">
                    <ArrowLeftIcon />
                </button>
                <h1 className="text-xl font-bold text-gray-800">Consultation Review</h1>
            </header>
            <main className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                <InfoSection title="Patient Details">
                    <div className="flex justify-between items-start">
                        <div>
                            <p><strong>Name:</strong> {patient.name}</p>
                            {patient.contactNumber && <p><strong>Contact:</strong> {patient.contactNumber}</p>}
                            {patient.address && <p><strong>Address:</strong> {`${patient.address.streetAddress}, ${patient.address.purok}, ${patient.address.barangay}`}</p>}
                        </div>
                        <button 
                            onClick={() => setIsReportModalOpen(true)}
                            className="bg-orange-100 text-orange-700 text-xs font-bold py-1 px-3 rounded-full hover:bg-orange-200 transition"
                        >
                            {t('doctor_report_patient_button')}
                        </button>
                    </div>
                </InfoSection>

                <InfoSection title="Reported Symptoms">
                    <ul className="list-disc list-inside">
                        {symptoms.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </InfoSection>

                {chatHistory && chatHistory.length > 0 && (
                    <InfoSection title={t('ai_chat_transcript_title')}>
                        <div className="space-y-3 max-h-60 overflow-y-auto p-2 bg-gray-50 rounded-md custom-scrollbar">
                           {chatHistory.map((msg) => <ChatBubble key={msg.id} message={msg} />)}
                        </div>
                    </InfoSection>
                )}

                {isPendingPrescription ? (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg shadow-sm">
                        <h3 className="font-bold text-yellow-800 text-lg mb-2">Action Required: Prescription Request</h3>
                        <p className="text-sm text-yellow-700 mb-4">
                            The patient has submitted this AI triage summary for your review. Please issue a formal prescription or deny the request with notes.
                        </p>
                        <AISummaryCard summary={aiSummary} />
                    </div>
                ) : !isCompleted ? (
                    <AISummaryCard summary={aiSummary} />
                ) : null}


                {isCompleted && finalPrescription && (
                     <InfoSection title={t('final_outcome_title')}>
                        <p><strong>{t('final_outcome_action_taken')}:</strong> 
                            <span className={`font-bold ml-2 ${finalPrescription.status === 'Approved' ? 'text-green-600' : 'text-red-600'}`}>
                                {finalPrescription.status === 'Approved' ? t('final_outcome_rx_issued') : t('final_outcome_suggestion_denied')}
                            </span>
                        </p>
                        {finalPrescription.status === 'Approved' && (
                            <>
                                <p><strong>{t('final_outcome_medicine')}:</strong> {finalPrescription.medicine}</p>
                                <p><strong>{t('final_outcome_dosage')}:</strong> {finalPrescription.dosage}</p>
                            </>
                        )}
                        {finalPrescription.status === 'Denied' && finalPrescription.doctorNotes && (
                             <p><strong>{t('final_outcome_doctor_notes')}:</strong> {finalPrescription.doctorNotes}</p>
                        )}
                    </InfoSection>
                )}

            </main>
            {!isCompleted && (
                 <footer className="bg-white p-3 border-t grid grid-cols-2 gap-3">
                     <button 
                        onClick={() => setIsDenyModalOpen(true)}
                        className="w-full bg-red-500 text-white font-bold py-3 rounded-lg shadow hover:bg-red-600"
                    >
                        {t('doctor_deny_request_button')}
                    </button>
                    <button 
                        onClick={handleIssuePrescription}
                        className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg shadow hover:bg-blue-600"
                    >
                        {t('doctor_correct_issue_button')}
                    </button>
                </footer>
            )}
        </div>
    );
};

export default ConsultationDetailScreen;