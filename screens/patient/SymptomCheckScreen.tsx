import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { streamChatResponse } from '../../services/geminiService';
import type { ChatMessage, AISummary, Consultation, User, Prescription, StructuredAddress } from '../../types';
import { SendIcon, ArrowLeftIcon } from '../../components/Icons';
import { Screens, CHAT_HISTORY_KEY, IBAJAY_ADDRESS_DATA } from '../../constants';
import { AISummaryCard } from '../../components/AISummaryCard';
import { useTranslation } from '../../hooks/useTranslation';

const barangayOptions = Object.keys(IBAJAY_ADDRESS_DATA);

const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.sender === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${
          isUser
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-teal-500 text-white rounded-bl-none'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.text}</p>
      </div>
    </div>
  );
};

const GuestDetailsModal: React.FC<{ onClose: () => void; onSubmit: (details: { name: string, contactNumber: string, address: StructuredAddress, validIdFile: File }) => void; }> = ({ onClose, onSubmit }) => {
    const [name, setName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [selectedBarangay, setSelectedBarangay] = useState(barangayOptions[0]);
    const [selectedPurok, setSelectedPurok] = useState(IBAJAY_ADDRESS_DATA[barangayOptions[0]][0]);
    const [streetAddress, setStreetAddress] = useState('');
    const [validIdFile, setValidIdFile] = useState<File | null>(null);
    const { t } = useTranslation();

    const purokOptions = useMemo(() => {
        return IBAJAY_ADDRESS_DATA[selectedBarangay] || [];
    }, [selectedBarangay]);

    const handleBarangayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newBarangay = e.target.value;
        setSelectedBarangay(newBarangay);
        setSelectedPurok(IBAJAY_ADDRESS_DATA[newBarangay][0]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !contactNumber.trim() || !streetAddress.trim()) {
            alert("Please fill in all details.");
            return;
        }
        if (!validIdFile) {
            alert(t('guest_modal_id_required_alert'));
            return;
        }
        const address: StructuredAddress = {
            barangay: selectedBarangay,
            purok: selectedPurok,
            streetAddress
        };
        onSubmit({ name, contactNumber, address, validIdFile });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setValidIdFile(e.target.files[0]);
        }
    };

    return (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
                <h2 className="text-xl font-bold mb-2 text-gray-800">{t('guest_modal_title')}</h2>
                <p className="text-sm text-gray-600 mb-4">{t('guest_modal_prompt')}</p>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label htmlFor="name" className="block text-xs font-medium text-gray-700">{t('register_fullname_label')}</label>
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-sm" required />
                    </div>
                    <div>
                        <label htmlFor="contact" className="block text-xs font-medium text-gray-700">{t('guest_modal_contact_label')}</label>
                        <input type="tel" id="contact" value={contactNumber} onChange={e => setContactNumber(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-sm" required />
                    </div>
                     <div>
                        <label htmlFor="barangay" className="block text-xs font-medium text-gray-700">{t('register_barangay_label')}</label>
                        <select id="barangay" value={selectedBarangay} onChange={handleBarangayChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-sm">
                            {barangayOptions.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="purok" className="block text-xs font-medium text-gray-700">{t('register_purok_label')}</label>
                        <select id="purok" value={selectedPurok} onChange={e => setSelectedPurok(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-sm">
                            {purokOptions.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="streetAddress" className="block text-xs font-medium text-gray-700">{t('register_street_address_label')}</label>
                        <input type="text" id="streetAddress" value={streetAddress} onChange={e => setStreetAddress(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-sm" required />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700">{t('register_valid_id_label')}</label>
                         <p className="text-xs text-gray-500 mb-1">{t('register_valid_id_prompt')}</p>
                        <label htmlFor="id-upload-modal" className="w-full text-center cursor-pointer bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 inline-flex justify-center text-sm font-medium text-gray-700 hover:bg-gray-50">
                            {t('register_upload_button')}
                            <input id="id-upload-modal" name="id-upload-modal" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                        </label>
                        <p className="text-xs text-center text-gray-500 mt-1 truncate">
                            {validIdFile ? t('register_file_chosen', { fileName: validIdFile.name }) : t('register_no_file_chosen')}
                        </p>
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">{t('guest_modal_cancel')}</button>
                        <button type="submit" className="bg-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-600">{t('guest_modal_save')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const SymptomCheckScreen: React.FC = () => {
    const { navigateTo, symptom, user, role, updateGuestDetails, addConsultation, language, residentRecords } = useAppContext();
    const { t } = useTranslation();
    const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
    
    const [messages, setMessages] = useState<ChatMessage[]>(() => {
        try {
            const saved = localStorage.getItem(CHAT_HISTORY_KEY);
            return saved ? JSON.parse(saved).messages || [] : [];
        } catch (e) { return []; }
    });
    const [summary, setSummary] = useState<AISummary | null>(() => {
        try {
            const saved = localStorage.getItem(CHAT_HISTORY_KEY);
            return saved ? JSON.parse(saved).summary || null : null;
        } catch (e) { return null; }
    });
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    useEffect(() => {
        localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify({ messages, summary }));
    }, [messages, summary]);

    useEffect(scrollToBottom, [messages, isLoading, summary]);
    
    useEffect(() => {
        if(symptom && messages.length === 0) {
            handleSend(symptom);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const createAndSubmitConsultation = (currentUser: User) => {
        if (!summary) return;
        
        // The service now handles ID, doctor assignment, status, and prescription creation
        addConsultation({
            patientId: currentUser.id,
            date: new Date().toISOString().split('T')[0],
            symptoms: messages.filter(m => m.sender === 'user').map(m => m.text),
            aiSummary: summary,
            status: 'Pending Doctor', // This will be confirmed by the service.
            chatHistory: messages,
        });

        alert(t('consultation_sent_alert'));
        navigateTo(Screens.CONSULTATIONS);
    };

    const handleSendToDoctor = () => {
        if (role === 'guest') {
            setIsGuestModalOpen(true);
            return;
        }

        if (user) {
            createAndSubmitConsultation(user);
        }
    };

    const handleGuestSubmit = (details: { name: string; contactNumber: string; address: StructuredAddress; validIdFile: File }) => {
        const isVerified = residentRecords.some(record =>
            record.name.trim().toLowerCase() === details.name.trim().toLowerCase() &&
            record.address.barangay === details.address.barangay &&
            record.address.purok === details.address.purok
        );

        if (!isVerified) {
            alert(t('guest_not_verified_error'));
            return;
        }
        
        // For guests, upgrading is the only path to consult a doctor.
        // This UX can be improved later, but for now, we alert them.
        alert(t('upgrade_for_consultation_alert_non_premium'));
        const newPatientUser = updateGuestDetails(details);
        setIsGuestModalOpen(false);
        // We don't submit the consultation, just save their details and let them upgrade from profile.
        navigateTo(Screens.PROFILE);
    };

    const handleSend = async (prefilledSymptom?: string) => {
        const textToSend = prefilledSymptom || input;
        if (!textToSend.trim() || isLoading) return;
        const newUserMessage: ChatMessage = { id: `user-${Date.now()}`, text: textToSend, sender: 'user', timestamp: new Date() };
        const updatedMessages = [...messages, newUserMessage];
        setMessages(updatedMessages);
        setInput('');
        setIsLoading(true);

        const aiMessageId = `ai-${Date.now()}`;
        setMessages(prev => [...prev, { id: aiMessageId, text: '...', sender: 'ai', timestamp: new Date() }]);
        
        let aiResponseText = '';
        try {
            const stream = streamChatResponse(updatedMessages, language);
            for await (const chunk of stream) {
                aiResponseText += chunk;
                setMessages(prev => prev.map(m => m.id === aiMessageId ? {...m, text: aiResponseText} : m));
            }

            try {
                const parsedSummary = JSON.parse(aiResponseText);
                if (parsedSummary.diagnosis_suggestion) {
                    setSummary(parsedSummary);
                    setMessages(prev => prev.filter(m => m.id !== aiMessageId));
                }
            } catch (e) { /* Not a JSON summary */ }

        } catch (error) {
            setMessages(prev => prev.map(m => m.id === aiMessageId ? {...m, text: 'Sorry, I encountered an error.'} : m));
        } finally {
            setIsLoading(false);
        }
    };

  return (
    <div className="relative flex flex-col h-full bg-gray-50">
        {isGuestModalOpen && <GuestDetailsModal onClose={() => setIsGuestModalOpen(false)} onSubmit={handleGuestSubmit} />}
        <header className="bg-white p-4 shadow-md z-10 flex items-center">
            <button onClick={() => navigateTo(Screens.PATIENT_HOME)} className="text-gray-600 hover:text-gray-800 mr-4">
                <ArrowLeftIcon />
            </button>
            <h1 className="text-xl font-bold text-gray-800">{t('symptom_check_title')}</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="space-y-4">
                {messages.map((msg) => <ChatBubble key={msg.id} message={msg} />)}
                {summary && <AISummaryCard summary={summary} />}
                <div ref={chatEndRef} />
            </div>
        </main>
        <footer className="bg-white p-2 border-t border-gray-200">
            {summary ? (
                <button
                    onClick={handleSendToDoctor}
                    className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-orange-600 transition duration-300"
                >
                    {t('symptom_check_send_to_doctor')}
                </button>
            ) : (
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={t('symptom_check_placeholder')}
                        className="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
                        disabled={isLoading}
                    />
                    <button
                        onClick={() => handleSend()}
                        disabled={isLoading || !input.trim()}
                        className="bg-teal-500 text-white rounded-full p-3 disabled:bg-gray-300 hover:bg-teal-600 transition"
                    >
                        <SendIcon />
                    </button>
                </div>
            )}
        </footer>
    </div>
  );
};

export default SymptomCheckScreen;