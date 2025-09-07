import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { Screens } from '../../constants';
import type { PatientDoctorChatMessage } from '../../types';
import { ArrowLeftIcon, SendIcon } from '../../components/Icons';
import { useTranslation } from '../../hooks/useTranslation';

const ChatBubble: React.FC<{ message: PatientDoctorChatMessage }> = ({ message }) => {
  const { t } = useTranslation();
  const isPatient = message.sender === 'patient';
  const messageContent = message.content.startsWith('doctor_chat_mock') ? t(message.content) : message.content;
  return (
    <div className={`flex ${isPatient ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${
          isPatient
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        }`}
      >
        <p className="whitespace-pre-wrap">{messageContent}</p>
        <p className={`text-xs mt-1 ${isPatient ? 'text-blue-100' : 'text-gray-500'} text-right`}>
            {message.timestamp.substring(message.timestamp.indexOf(',') + 2)}
        </p>
      </div>
    </div>
  );
};


const DoctorChatScreen: React.FC = () => {
    const { 
        user,
        navigateTo, 
        activeDoctorChatRecipient, 
        patientDoctorChats, 
        sendPatientDoctorMessage, 
        setActiveDoctorChatRecipient,
    } = useAppContext();
    const { t } = useTranslation();
    const [newMessage, setNewMessage] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);
    const [isLocked, setIsLocked] = useState(true);
    const [statusMessage, setStatusMessage] = useState('');
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

    const conversationId = user && activeDoctorChatRecipient ? [user.id, activeDoctorChatRecipient.userId].sort().join('-') : null;

    useEffect(() => {
        if (timer) clearInterval(timer);
        if (!user || !activeDoctorChatRecipient) return;

        if (user.isPremium) {
            setIsLocked(false);
            setStatusMessage(t('chat_premium_status'));
            return;
        }

        const doctorId = activeDoctorChatRecipient.userId;
        const passExpiry = user.chatAccessPasses?.[doctorId];

        const updateStatus = () => {
            const now = Date.now();
            if (passExpiry && passExpiry > now) {
                setIsLocked(false);
                const remaining = passExpiry - now;
                const hours = Math.floor(remaining / (1000 * 60 * 60));
                const minutes = Math.floor((remaining / 1000 / 60) % 60);
                setStatusMessage(t('chat_pass_active_status', { time: `${hours}h ${minutes}m` }));
            } else if ((user.weeklyChatCredits || 0) > 0) {
                setIsLocked(false);
                setStatusMessage(t('chat_credit_available_status'));
            } else {
                setIsLocked(true);
                const oneWeek = 7 * 24 * 60 * 60 * 1000;
                const resetTime = (user.lastCreditReset || now) + oneWeek;
                const remaining = resetTime - now;
                if (remaining > 0) {
                    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    setStatusMessage(t('chat_no_credit_status', { days, hours }));
                } else {
                    // This case means credits should have reset.
                    setIsLocked(false);
                    setStatusMessage(t('chat_credit_available_status'));
                }
            }
        };

        updateStatus(); // Initial check
        const newTimer = setInterval(updateStatus, 1000 * 30); // Update every 30 seconds
        setTimer(newTimer);

        return () => {
            if (newTimer) clearInterval(newTimer);
        };

    }, [user, activeDoctorChatRecipient, t]);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    
    const messages = useMemo(() => {
        return conversationId ? patientDoctorChats[conversationId] || [] : [];
    }, [conversationId, patientDoctorChats]);
    
    useEffect(scrollToBottom, [messages]);
    
    const handleBack = () => {
        setActiveDoctorChatRecipient(null); // Clear the recipient when leaving
        navigateTo(Screens.PATIENT_HOME);
    };
    
    const handleSend = () => {
        if (!newMessage.trim() || !activeDoctorChatRecipient) return;
        sendPatientDoctorMessage(activeDoctorChatRecipient.userId, newMessage);
        setNewMessage('');
    };
    
    if (!activeDoctorChatRecipient) {
        return (
             <div className="flex flex-col h-full items-center justify-center">
                <p className="text-red-500">{t('doctor_chat_error_title')}</p>
                <button onClick={handleBack} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg">
                    {t('doctor_chat_error_button')}
                </button>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col h-full bg-gray-100">
            <header className="bg-white p-4 shadow-md z-10 flex items-center">
                <button onClick={handleBack} className="text-gray-600 hover:text-gray-800 mr-4">
                    <ArrowLeftIcon />
                </button>
                <img src={activeDoctorChatRecipient.avatarUrl} alt={activeDoctorChatRecipient.name} className="w-10 h-10 rounded-full mr-3" />
                <div>
                    <h1 className="text-xl font-bold text-gray-800">{activeDoctorChatRecipient.name}</h1>
                    <p className="text-xs text-gray-500 capitalize">{t(activeDoctorChatRecipient.specialty)}</p>
                </div>
            </header>

            {statusMessage && (
                <div className="p-2 text-center text-xs font-semibold text-white bg-teal-500 z-10">
                    {statusMessage}
                </div>
            )}

            <main className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                 <div className="space-y-4">
                    {messages.map(msg => <ChatBubble key={msg.id} message={msg} />)}
                    <div ref={chatEndRef} />
                 </div>
            </main>
            <footer className="bg-white p-2 border-t border-gray-200">
                 <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={t('doctor_chat_placeholder', { name: activeDoctorChatRecipient.name })}
                        className="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100"
                        disabled={isLocked}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLocked || !newMessage.trim()}
                        className="bg-teal-500 text-white rounded-full p-3 disabled:bg-gray-300 hover:bg-teal-600 transition"
                    >
                        <SendIcon />
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default DoctorChatScreen;