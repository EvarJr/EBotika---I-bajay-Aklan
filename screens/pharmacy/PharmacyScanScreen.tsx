import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { Screens } from '../../constants';
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon } from '../../components/Icons';
// jsQR will be available globally from the script tag in index.html
declare const jsQR: any;

const ScanResultModal: React.FC<{ result: 'valid' | 'invalid'; message: string; onClose: () => void; }> = ({ result, message, onClose }) => (
    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center flex flex-col items-center w-full max-w-sm">
            {result === 'valid' ? <CheckCircleIcon /> : <XCircleIcon />}
            <h2 className={`mt-4 text-2xl font-bold ${result === 'valid' ? 'text-green-600' : 'text-red-600'}`}>
                {result === 'valid' ? 'Prescription Validated' : 'Invalid QR Code'}
            </h2>
            <p className="text-gray-600 mt-2 text-sm">
                {message}
            </p>
            <button onClick={onClose} className="mt-6 bg-teal-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-teal-600">
                Scan Again
            </button>
        </div>
    </div>
);

const PharmacyScanScreen: React.FC = () => {
    const { navigateTo, validateAndRemitPrescription } = useAppContext();
    const [scanResult, setScanResult] = useState<{ status: 'valid' | 'invalid'; message: string } | null>(null);
    const [loadingMessage, setLoadingMessage] = useState('Initializing camera...');
    const [scanError, setScanError] = useState<string | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameId = useRef<number | null>(null);

    const tick = () => {
        if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (context) {
                setLoadingMessage('Looking for a QR code...');
                setScanError(null);
                
                canvas.height = video.videoHeight;
                canvas.width = video.videoWidth;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height, {
                    inversionAttempts: "dontInvert",
                });

                if (code) {
                    handleQrCode(code.data);
                    return; // Stop scanning
                }
            }
        }
        animationFrameId.current = requestAnimationFrame(tick);
    };

    const handleQrCode = async (data: string) => {
        // Stop the video stream
        if (videoRef.current && videoRef.current.srcObject) {
             const stream = videoRef.current.srcObject as MediaStream;
             stream.getTracks().forEach(track => track.stop());
        }

        try {
            setLoadingMessage('Verifying prescription...');
            const qrData = JSON.parse(data);
            if (!qrData.prescriptionId) {
                setScanResult({ status: 'invalid', message: 'The QR code does not contain valid prescription data.' });
                return;
            }

            const result = await validateAndRemitPrescription(qrData.prescriptionId);
            setScanResult({
                status: result.success ? 'valid' : 'invalid',
                message: result.message
            });

        } catch (e) {
            setScanResult({ status: 'invalid', message: 'The QR code is malformed or not recognized by the system.' });
        }
    };
    
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(stream => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.setAttribute("playsinline", "true"); // required for iOS
                    videoRef.current.play();
                    animationFrameId.current = requestAnimationFrame(tick);
                }
            })
            .catch(err => {
                console.error("Camera access error:", err);
                if (err.name === "NotAllowedError") {
                    setScanError("Camera access denied. Please grant permission in your browser settings to scan QR codes.");
                } else if (err.name === "NotFoundError") {
                    setScanError("No camera found on your device. Unable to scan QR codes.");
                } else {
                    setScanError("An error occurred while accessing the camera. Please ensure it's not in use by another app.");
                }
            });
        
        return () => {
            // Cleanup: stop video stream and animation frame
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
            if (videoRef.current && videoRef.current.srcObject) {
                 const stream = videoRef.current.srcObject as MediaStream;
                 stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleBack = () => {
        navigateTo(Screens.WELCOME);
    };

    const resetScanner = () => {
        setScanResult(null);
        setLoadingMessage('Initializing camera...');
        setScanError(null);
        // Restart the camera stream and scanning loop
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(stream => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                    animationFrameId.current = requestAnimationFrame(tick);
                }
            })
            .catch(err => {
                setScanError('Could not access the camera. Please check permissions.');
            });
    };

    return (
        <div className="relative flex flex-col h-full bg-black text-white">
            {scanResult && <ScanResultModal result={scanResult.status} message={scanResult.message} onClose={resetScanner} />}
            <header className="absolute top-0 left-0 w-full bg-black bg-opacity-50 p-4 z-20 flex items-center">
                <button onClick={handleBack} className="text-white hover:text-gray-300 mr-4">
                    <ArrowLeftIcon />
                </button>
                <h1 className="text-xl font-bold">Scan QR Code</h1>
            </header>
            
            <main className="flex-1 flex flex-col items-center justify-center relative">
                <video ref={videoRef} className="absolute top-0 left-0 w-full h-full object-cover z-0" />
                <canvas ref={canvasRef} className="hidden" />

                <div className="relative z-10 w-64 h-64">
                    <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-white rounded-br-lg"></div>
                </div>

                <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 p-4 z-20 text-center">
                    {scanError ? (
                        <p className="text-red-400 font-semibold">{scanError}</p>
                    ) : (
                        <p className="text-gray-300">{loadingMessage}</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default PharmacyScanScreen;