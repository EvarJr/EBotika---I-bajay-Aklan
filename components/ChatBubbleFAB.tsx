import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { ChatBubbleIcon } from './Icons';
import { useTranslation } from '../hooks/useTranslation';

const ChatBubbleFAB: React.FC = () => {
    const { startSymptomCheck } = useAppContext();
    const { t } = useTranslation();
    
    // Start a new chat session. The user can type their initial symptom.
    const handlePress = () => {
        // Pass an empty string because the user will start typing on the screen.
        startSymptomCheck(''); 
    };

    const label = t('fab_chat_with_bot');

    return (
        <button
            onClick={handlePress}
            className="absolute bottom-20 right-4 bg-teal-500 text-white h-14 rounded-full shadow-lg flex items-center justify-center px-4 space-x-2 hover:bg-teal-600 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 z-50"
            aria-label={label}
        >
            <ChatBubbleIcon />
            <span className="font-semibold text-sm">{label}</span>
        </button>
    );
};

export default ChatBubbleFAB;