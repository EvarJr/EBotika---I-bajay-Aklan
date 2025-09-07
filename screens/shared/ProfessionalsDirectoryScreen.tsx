import React from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { Screens } from '../../constants';
import type { User, Role } from '../../types';
import { ArrowLeftIcon } from '../../components/Icons';

const roleColors: { [key in Role]: string } = {
    doctor: 'bg-blue-100 text-blue-800',
    pharmacy: 'bg-green-100 text-green-800',
    admin: 'bg-purple-100 text-purple-800',
    bhw: 'bg-orange-100 text-orange-800',
    patient: 'bg-gray-100 text-gray-800',
    guest: 'bg-gray-100 text-gray-800',
    unauthenticated: 'bg-gray-100 text-gray-800',
};


const ProfessionalCard: React.FC<{ professional: User }> = ({ professional }) => {
    const { navigateTo, setActivePrivateChatRecipient, t } = useAppContext();
    
    const startChat = () => {
        setActivePrivateChatRecipient(professional);
        navigateTo(Screens.PRIVATE_CHAT);
    };

    const isOnline = professional.isOnline;

    return (
        <div className="bg-white p-3 rounded-lg shadow-sm flex justify-between items-center">
             <div className="flex items-center space-x-3">
                 <img src={professional.avatarUrl || `https://ui-avatars.com/api/?name=${professional.name.replace(' ', '+')}&background=random`} alt={professional.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                    <p className="font-bold text-gray-800">{professional.name}</p>
                    <div className="flex items-center space-x-2 mt-1 text-xs">
                         <span className={`px-2 py-0.5 rounded-full font-semibold ${roleColors[professional.role]}`}>
                            {professional.role}
                        </span>
                        <div className="flex items-center">
                            <span className={`w-2 h-2 rounded-full mr-1.5 ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                            <p className={`font-semibold ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                                {isOnline ? t('status_online') : t('status_offline')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <button
                onClick={startChat}
                className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold hover:bg-blue-600 transition"
            >
                Chat
            </button>
        </div>
    );
};

const ProfessionalsDirectoryScreen: React.FC = () => {
    const { user, navigateTo, users } = useAppContext();
    
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
                navigateTo(Screens.WELCOME);
        }
    };
    
    const professionalUsers = users.filter(u => 
        (u.role === 'doctor' || u.role === 'pharmacy' || u.role === 'admin' || u.role === 'bhw') && u.id !== user?.id
    );

    return (
        <div className="flex flex-col h-full bg-gray-100">
            <header className="bg-white p-4 shadow-md z-10 flex items-center">
                <button onClick={handleBack} className="text-gray-600 hover:text-gray-800 mr-4">
                    <ArrowLeftIcon />
                </button>
                <h1 className="text-xl font-bold text-gray-800">Professionals Directory</h1>
            </header>
            <main className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="space-y-3">
                    {professionalUsers.map(prof => <ProfessionalCard key={prof.id} professional={prof} />)}
                </div>
            </main>
        </div>
    );
};

export default ProfessionalsDirectoryScreen;