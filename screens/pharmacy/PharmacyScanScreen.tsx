import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { Screens } from '../../constants';
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon, QRIcon } from '../../components/Icons';

const ScanResultModal: React.FC<{ result: 'valid' | 'invalid'; onClose: () => void; }> = ({ result, onClose }) => (
    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center flex flex-col items-center w-full max-w-sm">
            {result === 'valid' ? <CheckCircleIcon /> : <XCircleIcon />}
            <h2 className={`mt-4 text-2xl font-bold ${result === 'valid' ? 'text-green-600' : 'text-red-600'}`}>
                {result === 'valid' ? 'Prescription Validated' : 'Invalid QR Code'}
            </h2>
            <p className="text-gray-600 mt-2 text-sm">
                {result === 'valid' ? 'The prescription is authentic and has been marked as remitted.' : 'This QR code is not recognized or has already been used.'}
            </p>
            <button onClick={onClose} className="mt-6 bg-teal-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-teal-600">
                Scan Again
            </button>
        </div>
    </div>
);

const PharmacyScanScreen: React.FC = () => {
    const { navigateTo, user } = useAppContext();
    const [scanResult, setScanResult] = useState<'valid' | 'invalid' | null>(null);

    const handleBack = () => {
        if (user?.role === 'bhw') {
            navigateTo(Screens.BHW_DASHBOARD);
        } else {
            navigateTo(Screens.PHARMACY_DASHBOARD);
        }
    };

    const handleScan = (result: 'valid' | 'invalid') => {
        setScanResult(result);
    };

    return (
        <div className="relative flex flex-col h-full bg-gray-900 text-white">
            {scanResult && <ScanResultModal result={scanResult} onClose={() => setScanResult(null)} />}
            <header className="bg-black bg-opacity-30 p-4 z-10 flex items-center">
                <button onClick={handleBack} className="text-white hover:text-gray-300 mr-4">
                    <ArrowLeftIcon />
                </button>
                <h1 className="text-xl font-bold">Scan QR Code</h1>
            </header>
            <main className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="w-64 h-64 bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-500">
                    <QRIcon />
                    <p className="sr-only">Camera View Finder</p>
                </div>
                <p className="mt-4 text-gray-300">Point your camera at the prescription QR code.</p>
            </main>
            <footer className="bg-black bg-opacity-30 p-4 z-10">
                <p className="text-center text-xs text-gray-400 mb-2">For Demonstration</p>
                <div className="flex justify-around space-x-2">
                    <button onClick={() => handleScan('valid')} className="flex-1 bg-green-600 font-semibold py-3 rounded-lg">
                        Simulate Valid Scan
                    </button>
                     <button onClick={() => handleScan('invalid')} className="flex-1 bg-red-600 font-semibold py-3 rounded-lg">
                        Simulate Invalid Scan
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default PharmacyScanScreen;