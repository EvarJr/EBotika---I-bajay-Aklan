import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { Screens } from '../../constants';
import { ArrowLeftIcon, ChevronDownIcon, SendIcon } from '../../components/Icons';
import type { User, PatientDoctorChatMessage } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

interface Conversation {
    convoId: string;
    messages: PatientDoctorChatMessage[];
    patient: User;
    unreadCount: number;
}

const ChatWindow: React.FC<{ conversation: Conversation, onBack: () => void }> = ({ conversation, onBack }) => {
    const { user, t, sendDoctorPatientMessage } = useAppContext();
    const [newMessage, setNewMessage] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    useEffect(scrollToBottom, [conversation.messages]);

    const handleSend = () => {
        if (!newMessage.trim()) return;
        sendDoctorPatientMessage(conversation.patient.id, newMessage);
        setNewMessage('');
    };
    
    const displayAddress = `${conversation.patient.address.barangay}, ${conversation.patient.address.purok}`;

    const ChatBubble: React.FC<{ message: PatientDoctorChatMessage }> = ({ message }) => {
        const isDoctor = message.sender === 'doctor';
        const content = message.content.startsWith('doctor_chat_mock') ? t(message.content) : message.content;
        return (
            <div className={`flex ${isDoctor ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-4 py-2 rounded-2xl ${isDoctor ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                    <p className="whitespace-pre-wrap">{content}</p>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-gray-100">
            <header className="bg-white p-4 shadow-md z-10 flex items-center">
                <button onClick={onBack} className="text-gray-600 hover:text-gray-800 mr-4"><ArrowLeftIcon /></button>
                <img src={conversation.patient.avatarUrl} alt={conversation.patient.name} className="w-10 h-10 rounded-full mr-3 object-cover" />
                <div>
                    <h1 className="text-lg font-bold text-gray-800">{conversation.patient.name}</h1>
                    <p className="text-xs text-gray-500">{displayAddress}</p>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {conversation.messages.map(msg => <ChatBubble key={msg.id} message={msg} />)}
                <div ref={chatEndRef} />
            </main>
            <footer className="bg-white p-2 border-t">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleSend()}
                        placeholder={`Message ${conversation.patient.name.split(' ')[0]}`}
                        className="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <button onClick={handleSend} disabled={!newMessage.trim()} className="bg-teal-500 text-white rounded-full p-3 disabled:bg-gray-300 hover:bg-teal-600 transition"><SendIcon /></button>
                </div>
            </footer>
        </div>
    );
};

const ConversationListItem: React.FC<{ convo: Conversation; onClick: () => void }> = ({ convo, onClick }) => {
    const lastMessage = convo.messages[convo.messages.length - 1];
    return (
        <button onClick={onClick} className="w-full text-left p-3 flex items-center space-x-3 hover:bg-gray-100 transition border-b">
            <img src={convo.patient.avatarUrl} alt={convo.patient.name} className="w-12 h-12 rounded-full object-cover" />
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                    <p className="font-bold text-gray-800 truncate">{convo.patient.name}</p>
                    {convo.unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0">
                            {convo.unreadCount}
                        </span>
                    )}
                </div>
                <p className="text-sm text-gray-500 truncate">{lastMessage?.content}</p>
            </div>
        </button>
    );
};

const BarangayAccordion: React.FC<{ barangay: string; convos: Conversation[]; onSelect: (convo: Conversation) => void; }> = ({ barangay, convos, onSelect }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const totalUnread = convos.reduce((sum, c) => sum + c.unreadCount, 0);

    return (
        <div className="border-b">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100">
                <div className="flex items-center">
                    <span className="font-semibold text-gray-700">{t('doctor_inbox_barangay_header', { name: barangay })}</span>
                    {totalUnread > 0 && (
                        <span className="ml-2 bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">{totalUnread}</span>
                    )}
                </div>
                <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div>
                    {convos.map(convo => <ConversationListItem key={convo.convoId} convo={convo} onClick={() => onSelect(convo)} />)}
                </div>
            )}
        </div>
    );
};

const DoctorInboxScreen: React.FC = () => {
    const { user, users, navigateTo, patientDoctorChats, markDoctorChatAsRead, t } = useAppContext();
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);

    const conversations = useMemo(() => {
        if (!user) return [];
        return Object.entries(patientDoctorChats)
            .filter(([convoId]) => convoId.includes(user.id))
            .map(([convoId, messages]) => {
                const patientId = convoId.replace(user.id, '').replace('-', '');
                const patient = users.find(u => u.id === patientId);
                const unreadCount = messages.filter(m => m.sender === 'patient' && !m.readByDoctor).length;
                return { convoId, messages, patient, unreadCount };
            })
            .filter((c): c is Conversation => !!c.patient)
            .sort((a, b) => {
                const lastMsgA = new Date(a.messages[a.messages.length - 1]?.timestamp || 0).getTime();
                const lastMsgB = new Date(b.messages[b.messages.length - 1]?.timestamp || 0).getTime();
                return lastMsgB - lastMsgA;
            });
    }, [patientDoctorChats, user, users]);

    const groupedConversations = useMemo(() => {
        return conversations.reduce<Record<string, Conversation[]>>((acc, convo) => {
            const barangay = convo.patient.address?.barangay || t('doctor_inbox_unknown_barangay');
            if (!acc[barangay]) acc[barangay] = [];
            acc[barangay].push(convo);
            return acc;
        }, {});
    }, [conversations, t]);
    
    useEffect(() => {
        if (activeConversation) {
            markDoctorChatAsRead(activeConversation.convoId);
        }
    }, [activeConversation, markDoctorChatAsRead]);

    // When the component re-renders (e.g., after sending a message),
    // find the latest version of the active conversation from the re-calculated list.
    const currentActiveConvoData = activeConversation
        ? conversations.find(c => c.convoId === activeConversation.convoId)
        : null;

    if (currentActiveConvoData) {
        return <ChatWindow conversation={currentActiveConvoData} onBack={() => setActiveConversation(null)} />;
    }

    return (
        <div className="flex flex-col h-full">
            <header className="bg-white p-4 shadow-md z-10 flex items-center">
                <button onClick={() => navigateTo(Screens.DOCTOR_DASHBOARD)} className="text-gray-600 hover:text-gray-800 mr-4">
                    <ArrowLeftIcon />
                </button>
                <h1 className="text-xl font-bold text-gray-800">{t('doctor_inbox_title')}</h1>
            </header>
            <main className="flex-1 overflow-y-auto bg-white custom-scrollbar">
                {conversations.length > 0 ? (
                    Object.entries(groupedConversations).map(([barangay, convos]) => (
                        <BarangayAccordion key={barangay} barangay={barangay} convos={convos} onSelect={setActiveConversation} />
                    ))
                ) : (
                    <div className="text-center pt-16">
                        <p className="text-gray-500">{t('doctor_inbox_empty')}</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default DoctorInboxScreen;