import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { Screens } from '../../constants';
import { ArrowLeftIcon } from '../../components/Icons';
import { useTranslation } from '../../hooks/useTranslation';

const DetailRow: React.FC<{ label: string, value: string }> = ({ label, value }) => (
    <div className="py-2">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-semibold text-gray-800">{value}</p>
    </div>
);

const QRDisplayScreen: React.FC = () => {
    const { navigateTo, activePrescription, user } = useAppContext();
    const { t } = useTranslation();
    const [isDownloading, setIsDownloading] = useState(false);

    if (!activePrescription) {
        return (
            <div className="flex flex-col h-full items-center justify-center text-center p-4">
                 <p className="text-red-500 font-semibold">No prescription selected.</p>
                 <button onClick={() => navigateTo(Screens.PRESCRIPTIONS)} className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg">
                    Back to Prescriptions
                </button>
            </div>
        );
    }
    
    const statusColors: { [key in typeof activePrescription.status]: string } = {
        Pending: 'bg-yellow-100 text-yellow-800',
        Approved: 'bg-green-100 text-green-800',
        Remitted: 'bg-gray-100 text-gray-800',
        Denied: 'bg-red-100 text-red-800',
    };

    const qrData = encodeURIComponent(JSON.stringify({
        prescriptionId: activePrescription.id,
        patientId: user?.id,
        medicine: activePrescription.medicine
    }));

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=${qrData}`);
            if (!response.ok) throw new Error('QR code fetch failed');
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `ebotika-prescription-${activePrescription.id}.png`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        } catch (error) {
            console.error("Failed to download QR code:", error);
            alert("Sorry, the QR code could not be downloaded.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <header className="bg-white p-4 shadow-md z-10 flex items-center">
                <button onClick={() => navigateTo(Screens.PRESCRIPTIONS)} className="text-gray-600 hover:text-gray-800 mr-4">
                    <ArrowLeftIcon />
                </button>
                <h1 className="text-xl font-bold text-gray-800">{t('qr_display_title')}</h1>
            </header>
            <main className="flex-1 overflow-y-auto p-6 flex flex-col items-center custom-scrollbar">
                <div className="w-full bg-white p-6 rounded-lg shadow-md">
                     <div className="flex justify-center mb-6">
                        <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrData}`} 
                            alt="Prescription QR Code"
                            className="w-48 h-48 rounded-lg border-4 border-gray-200"
                        />
                    </div>
                    <div className="text-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">{activePrescription.medicine}</h2>
                        <span className={`mt-1 inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusColors[activePrescription.status]}`}>
                            {t('qr_display_status')}: {activePrescription.status}
                        </span>
                    </div>

                    <div className="divide-y divide-gray-200">
                        <DetailRow label={t('qr_display_patient')} value={activePrescription.patient.name} />
                        <DetailRow label={t('qr_display_dosage')} value={activePrescription.dosage || 'N/A'} />
                        <DetailRow label={t('qr_display_doctor')} value={activePrescription.doctorName} />
                        <DetailRow label={t('qr_display_date')} value={activePrescription.dateIssued} />
                    </div>
                </div>
                <button 
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="mt-6 w-full max-w-xs bg-blue-500 text-white font-bold py-3 rounded-lg shadow hover:bg-blue-600 disabled:bg-blue-300 transition"
                >
                    {isDownloading ? t('qr_display_downloading_button') : t('qr_display_download_button')}
                </button>
            </main>
        </div>
    );
};

export default QRDisplayScreen;