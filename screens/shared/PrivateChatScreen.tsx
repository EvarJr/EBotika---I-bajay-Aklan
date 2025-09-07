import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { Screens } from '../../constants';
import type { PrivateChatMessage } from '../../types';
import { ArrowLeftIcon, SendIcon } from '../../components/Icons';

const ChatBubble: React.FC<{ message: PrivateChatMessage, currentUserId: string }> = ({ message, currentUserId }) => {
  const isCurrentUser = message.senderId === currentUserId;
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${
          isCurrentUser
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        <p className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'} text-right`}>
            {message.timestamp.split(' ')[1]} {message.timestamp.split(' ')[2]}
        </p>
      </div>
    </div>
  );
};


const PrivateChatScreen: React.FC = () => {
    const { user, navigateTo, activePrivateChatRecipient, privateChats, sendPrivateMessage, setActivePrivateChatRecipient, t } = useAppContext();
    const [newMessage, setNewMessage] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const conversationId = user && activePrivateChatRecipient ? [user.id, activePrivateChatRecipient.id].sort().join('-') : null;
    const messages = conversationId ? privateChats[conversationId] || [] : [];
    
    useEffect(scrollToBottom, [messages]);
    
    const handleBack = () => {
        setActivePrivateChatRecipient(null); // Clear the recipient when leaving
        navigateTo(Screens.PROFESSIONALS_DIRECTORY);
    };
    
    const handleSend = () => {
        if (!newMessage.trim() || !activePrivateChatRecipient) return;
        sendPrivateMessage(activePrivateChatRecipient.id, newMessage);
        setNewMessage('');
    };
    
    if (!activePrivateChatRecipient || !user) {
        return (
             <div className="flex flex-col h-full items-center justify-center">
                <p className="text-red-500">Error: No recipient selected.</p>
                <button onClick={handleBack} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg">
                    Back to Directory
                </button>
            </div>
        );
    }

    const isOnline = activePrivateChatRecipient.isOnline;
    
    return (
        <div className="flex flex-col h-full bg-gray-100">
            <header className="bg-white p-4 shadow-md z-10 flex items-center">
                <button onClick={handleBack} className="text-gray-600 hover:text-gray-800 mr-4">
                    <ArrowLeftIcon />
                </button>
                 <img 
                    src={activePrivateChatRecipient.avatarUrl || `https://ui-avatars.com/api/?name=${activePrivateChatRecipient.name.replace(' ', '+')}&background=random`} 
                    alt={activePrivateChatRecipient.name} 
                    className="w-10 h-10 rounded-full mr-3 object-cover" 
                />
                <div>
                    <h1 className="text-xl font-bold text-gray-800">{activePrivateChatRecipient.name}</h1>
                    <div className="flex items-center text-xs text-gray-500 capitalize">
                        <span>{activePrivateChatRecipient.role}</span>
                        <span className="mx-1.5 text-gray-400">&bull;</span>
                        <div className="flex items-center">
                            <span className={`w-2 h-2 rounded-full mr-1 ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                            <span className={`font-semibold ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                                {isOnline ? t('status_online') : t('status_offline')}
                            </span>
                        </div>
                    </div>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                 <div className="space-y-4">
                    {messages.map(msg => <ChatBubble key={msg.id} message={msg} currentUserId={user.id} />)}
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
                        placeholder={`Message ${activePrivateChatRecipient.name}`}
                        className="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!newMessage.trim()}
                        className="bg-teal-500 text-white rounded-full p-3 disabled:bg-gray-300 hover:bg-teal-600 transition"
                    >
                        <SendIcon />
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default PrivateChatScreen;