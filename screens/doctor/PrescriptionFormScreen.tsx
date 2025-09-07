import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { Screens } from '../../constants';
import { ArrowLeftIcon } from '../../components/Icons';
import { useTranslation } from '../../hooks/useTranslation';

const FormLabel: React.FC<{ htmlFor: string, children: React.ReactNode }> = ({ htmlFor, children }) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
        {children}
    </label>
);

const PrescriptionFormScreen: React.FC = () => {
    const { navigateTo, activeConsultation, prescriptions, medicines, updatePrescription, updateConsultationStatus, user } = useAppContext();
    const { t } = useTranslation();
    const [medicine, setMedicine] = useState(medicines.length > 0 ? medicines[0].id : '');
    const [dosage, setDosage] = useState('');
    const [validity, setValidity] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    
    const patient = activeConsultation?.patient;
    const aiSummary = activeConsultation?.aiSummary;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!dosage.trim() || !validity.trim() || !user || !activeConsultation){
            alert("Please fill out all fields.");
            return;
        }

        setIsGenerating(true);

        // Simulate backend processing
        setTimeout(() => {
            const selectedMedicine = medicines.find(m => m.id === medicine);
            const prescriptionToUpdate = prescriptions.find(p => p.consultationId === activeConsultation.id && p.status === 'Pending');

            if (prescriptionToUpdate && selectedMedicine) {
                updatePrescription(prescriptionToUpdate.id, {
                    medicine: selectedMedicine.name,
                    dosage: `${dosage} (Valid for: ${validity})`,
                    status: 'Approved',
                    doctorName: user.name,
                });
                
                // FIX: Add missing doctorId argument
                updateConsultationStatus(activeConsultation.id, 'Completed', user.id);

                // Navigate back to the dashboard seamlessly
                navigateTo(Screens.DOCTOR_DASHBOARD);
            } else {
                alert("Error: Could not find a pending prescription for this consultation.");
                setIsGenerating(false);
            }
        }, 1500); // 1.5 second delay
    };

    if (!patient) {
        return (
             <div className="flex flex-col h-full bg-gray-50">
                 <header className="bg-white p-4 shadow-md z-10 flex items-center">
                    <button onClick={() => navigateTo(Screens.CONSULTATION_DETAIL)} className="text-gray-600 hover:text-gray-800 mr-4">
                        <ArrowLeftIcon />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">Error</h1>
                </header>
                <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                    <p className="text-red-600 font-semibold">No patient consultation selected.</p>
                    <p className="text-gray-600 mt-2">Please go back to the dashboard and select a consultation to issue a prescription for.</p>
                    <button onClick={() => navigateTo(Screens.DOCTOR_DASHBOARD)} className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg">
                        Back to Dashboard
                    </button>
                </main>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <header className="bg-white p-4 shadow-md z-10 flex items-center">
                <button onClick={() => navigateTo(Screens.CONSULTATION_DETAIL)} className="text-gray-600 hover:text-gray-800 mr-4">
                    <ArrowLeftIcon />
                </button>
                <h1 className="text-xl font-bold text-gray-800">Issue Prescription</h1>
            </header>
            <main className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-3 rounded-md mb-6">
                    <p className="font-bold text-sm">For Patient:</p>
                    <p className="text-base font-semibold">{patient.name}</p>
                    {patient.contactNumber && <p className="text-xs text-blue-700">Contact: {patient.contactNumber}</p>}
                </div>

                {aiSummary && (
                    <div className="bg-gray-50 border-l-4 border-gray-300 p-4 rounded-md mb-6">
                        <h3 className="text-sm font-bold text-gray-700 mb-2">AI Triage Summary</h3>
                        <div className="space-y-2 text-sm">
                            <div>
                                <p className="font-semibold text-gray-600">Suggestion</p>
                                <p className="text-gray-800">{aiSummary.diagnosis_suggestion}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-600">Urgency</p>
                                <p className="font-bold text-gray-800">{aiSummary.urgency_level}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-600">Recommendation</p>
                                <p className="text-gray-800 whitespace-pre-wrap">{aiSummary.recommendation}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <FormLabel htmlFor="medicine">Medicine</FormLabel>
                        <select
                            id="medicine"
                            value={medicine}
                            onChange={(e) => setMedicine(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                            {medicines.map((med) => (
                                <option key={med.id} value={med.id}>{med.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <FormLabel htmlFor="dosage">Dosage & Instructions</FormLabel>
                        <textarea
                            id="dosage"
                            rows={4}
                            value={dosage}
                            onChange={(e) => setDosage(e.target.value)}
                            placeholder="e.g., 1 tablet every 8 hours for 7 days"
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>
                    <div>
                        <FormLabel htmlFor="validity">Validity</FormLabel>
                        <input
                            type="text"
                            id="validity"
                            value={validity}
                            onChange={(e) => setValidity(e.target.value)}
                            placeholder="e.g., 7 days, 1 month"
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>
                    <div className="pt-4">
                         <button
                            type="submit"
                            disabled={isGenerating}
                            className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 disabled:bg-blue-300"
                        >
                            {isGenerating ? t('prescription_form_generating_button') : t('prescription_form_generate_button')}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default PrescriptionFormScreen;