import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { Screens, MOCK_AVATARS } from '../../constants';
import { ArrowLeftIcon } from '../../components/Icons';
import { useTranslation } from '../../hooks/useTranslation';

const AvatarSelectionModal: React.FC<{ onSelect: (url: string) => void; onClose: () => void; }> = ({ onSelect, onClose }) => (
    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">Select an Avatar</h3>
            <div className="grid grid-cols-4 gap-4">
                {MOCK_AVATARS.map(url => (
                    <button key={url} onClick={() => onSelect(url)} className="rounded-full overflow-hidden w-16 h-16 ring-2 ring-transparent hover:ring-teal-500 transition">
                        <img src={url} alt="Avatar option" className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>
        </div>
    </div>
);


const ProfessionalProfileEditScreen: React.FC = () => {
    const { user, navigateTo, updateUserProfile, t } = useAppContext();
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    
    // Initialize editableUser from the context, or handle the case where user is null
    const [editableUser, setEditableUser] = useState(user);

    const handleBack = () => {
        if (!user) {
            navigateTo(Screens.WELCOME);
            return;
        }
        switch (user.role) {
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
                navigateTo(Screens.WELCOME);
        }
    };

    if (!editableUser) {
        return (
            <div className="flex flex-col h-full items-center justify-center">
                <p className="text-red-500 font-semibold">User not found.</p>
                <button onClick={handleBack} className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg">
                    Return
                </button>
            </div>
        );
    }
    
    const handleSave = () => {
        updateUserProfile(editableUser);
        alert(t('profile_updated_alert'));
        handleBack();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditableUser(prev => prev ? ({ ...prev, [name]: value }) : null);
    };

    const handleAvatarSelect = (url: string) => {
        setEditableUser(prev => prev ? ({ ...prev, avatarUrl: url }) : null);
        setIsAvatarModalOpen(false);
    };

    return (
        <div className="flex flex-col h-full bg-gray-50">
             {isAvatarModalOpen && <AvatarSelectionModal onSelect={handleAvatarSelect} onClose={() => setIsAvatarModalOpen(false)} />}
            <header className="bg-white p-4 shadow-md z-10 flex items-center">
                <button onClick={handleBack} className="text-gray-600 hover:text-gray-800 mr-4">
                    <ArrowLeftIcon />
                </button>
                <h1 className="text-xl font-bold text-gray-800">{t('professional_edit_profile_title')}</h1>
            </header>
            <main className="flex-1 overflow-y-auto p-6 space-y-6">
                 <div className="bg-white p-6 rounded-lg shadow text-center">
                    <div className="relative w-24 h-24 mx-auto">
                        {editableUser.avatarUrl ? (
                             <img src={editableUser.avatarUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover ring-4 ring-white" />
                        ) : (
                            <div className="w-24 h-24 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-4xl font-bold ring-4 ring-white">
                                {editableUser.name.charAt(0)}
                            </div>
                        )}
                        <button 
                            onClick={() => setIsAvatarModalOpen(true)}
                            className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white text-xs font-bold hover:bg-opacity-60 transition"
                        >
                            {t('profile_change_avatar_button')}
                        </button>
                    </div>
                    
                    <div className="mt-4 space-y-2 max-w-xs mx-auto">
                        <div>
                             <label htmlFor="name" className="sr-only">{t('register_fullname_label')}</label>
                             <input
                                type="text"
                                name="name"
                                id="name"
                                value={editableUser.name}
                                onChange={handleChange}
                                className="text-2xl font-bold text-gray-800 text-center w-full bg-gray-50 border rounded-md p-1"
                                aria-label="Full Name"
                            />
                        </div>
                        <div>
                             <label htmlFor="email" className="sr-only">{t('login_email_label')}</label>
                             <input
                                type="email"
                                name="email"
                                id="email"
                                value={editableUser.email}
                                onChange={handleChange}
                                className="text-gray-500 text-center w-full bg-gray-50 border rounded-md p-1"
                                aria-label="Email Address"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={handleBack}
                        className="w-full flex items-center justify-center bg-white text-gray-700 font-bold py-3 px-4 rounded-lg shadow hover:bg-gray-100 transition border"
                    >
                        {t('profile_cancel_button')}
                    </button>
                    <button
                        onClick={handleSave}
                        className="w-full flex items-center justify-center bg-teal-500 text-white font-bold py-3 px-4 rounded-lg shadow hover:bg-teal-600 transition"
                    >
                        {t('profile_save_button')}
                    </button>
                </div>
            </main>
        </div>
    );
};

export default ProfessionalProfileEditScreen;