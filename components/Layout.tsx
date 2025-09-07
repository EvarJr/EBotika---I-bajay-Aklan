import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Screens } from '../constants';
import { HomeIcon, ConsultsIcon, PrescriptionsIcon, ProfileIcon } from './Icons';
import { useTranslation } from '../hooks/useTranslation';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Header = ({ title }: { title: string }) => {
    const { user, role, promptGuestExit } = useAppContext();
    const { t } = useTranslation();
    const displayName = user?.name?.split(' ')[0] || (role === 'guest' ? 'Guest' : '');
    const initial = displayName ? displayName.charAt(0).toUpperCase() : 'G';

    return (
        <header className="bg-white p-4 shadow-md z-10">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800 truncate pr-4">{title}</h1>
                {role === 'guest' ? (
                    <button 
                        onClick={promptGuestExit}
                        className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors text-sm flex-shrink-0"
                    >
                        {t('exit_button')}
                    </button>
                ) : (
                     <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        {initial}
                    </div>
                )}
            </div>
        </header>
    );
};


const BottomNav = () => {
  const { activePatientScreen, navigateTo, role } = useAppContext();
  const { t } = useTranslation();

  const allNavItems = [
    { screen: Screens.PATIENT_HOME, icon: <HomeIcon />, label: t('nav_home') },
    { screen: Screens.CONSULTATIONS, icon: <ConsultsIcon />, label: t('nav_consults') },
    { screen: Screens.PRESCRIPTIONS, icon: <PrescriptionsIcon />, label: t('nav_rx') },
    { screen: Screens.PROFILE, icon: <ProfileIcon />, label: t('nav_profile') },
  ];

  const navItems = role === 'guest'
    ? allNavItems.filter(item => item.screen !== Screens.PROFILE)
    : allNavItems;

  return (
    <nav className="bg-white shadow-t-md border-t border-gray-200">
      <div className="flex justify-around py-2">
        {navItems.map((item) => (
          <button
            key={item.screen}
            onClick={() => navigateTo(item.screen)}
            className={`flex flex-col items-center justify-center w-20 transition-colors duration-200 ${
              activePatientScreen === item.screen ? 'text-teal-500' : 'text-gray-500 hover:text-teal-500'
            }`}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export const PatientLayout: React.FC<LayoutProps> = ({ children, title }) => {
  return (
    <>
      <Header title={title} />
      <main className="flex-1 overflow-y-auto bg-gray-50 p-4 custom-scrollbar">
        {children}
      </main>
      <BottomNav />
    </>
  );
};