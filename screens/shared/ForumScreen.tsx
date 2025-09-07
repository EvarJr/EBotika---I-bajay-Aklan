import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { Screens } from '../../constants';
import type { ForumPost, Role } from '../../types';
import { ArrowLeftIcon, SendIcon } from '../../components/Icons';

const PostCard: React.FC<{ post: ForumPost }> = ({ post }) => {
    const { user, t } = useAppContext();
    const isCurrentUser = user?.id === post.author.id;
    const isOnline = post.author.isOnline;
    
    const roleColors: { [key in Role]: string } = {
        doctor: 'bg-blue-100 text-blue-800',
        pharmacy: 'bg-green-100 text-green-800',
        admin: 'bg-purple-100 text-purple-800',
        bhw: 'bg-orange-100 text-orange-800',
        patient: 'bg-gray-100 text-gray-800',
        guest: 'bg-gray-100 text-gray-800',
        unauthenticated: 'bg-gray-100 text-gray-800',
    };

    return (
        <div className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${isCurrentUser ? 'border-teal-500' : 'border-gray-300'}`}>
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-2">
                    <span className="font-bold text-gray-800">{post.author.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${roleColors[post.author.role]}`}>
                        {post.author.role}
                    </span>
                     <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} title={isOnline ? t('status_online') : t('status_offline')}></span>
                </div>
                <span className="text-xs text-gray-500">{post.timestamp}</span>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
        </div>
    );
};


const ForumScreen: React.FC = () => {
    const { user, navigateTo, forumPosts, addForumPost } = useAppContext();
    const [newPostContent, setNewPostContent] = useState('');

    const handleBack = () => {
        switch (user?.role) {
            case 'doctor':
                navigateTo(Screens.DOCTOR_DASHBOARD);
                break;
            case 'pharmacy':
                navigateTo(Screens.PHARMACY_DASHBOARD);
                break;
            case 'admin':
                navigateTo(Screens.RHU_DASHBOARD);
                break;
            case 'bhw':
                navigateTo(Screens.BHW_DASHBOARD);
                break;
            default:
                navigateTo(Screens.WELCOME); // Fallback
        }
    };

    const handlePost = () => {
        if (!newPostContent.trim()) return;
        addForumPost(newPostContent);
        setNewPostContent('');
    };

    return (
        <div className="flex flex-col h-full bg-gray-100">
            <header className="bg-white p-4 shadow-md z-10 flex items-center">
                <button onClick={handleBack} className="text-gray-600 hover:text-gray-800 mr-4">
                    <ArrowLeftIcon />
                </button>
                <h1 className="text-xl font-bold text-gray-800">Professionals Forum</h1>
            </header>
            <main className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="space-y-4">
                    {forumPosts.map(post => <PostCard key={post.id} post={post} />)}
                </div>
            </main>
            <footer className="bg-white p-2 border-t border-gray-200">
                 <div className="flex items-center space-x-2">
                    <textarea
                        rows={1}
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                    />
                    <button
                        onClick={handlePost}
                        disabled={!newPostContent.trim()}
                        className="bg-teal-500 text-white rounded-full p-3 disabled:bg-gray-300 hover:bg-teal-600 transition"
                    >
                        <SendIcon />
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default ForumScreen;