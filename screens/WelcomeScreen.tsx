import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { LogoIcon } from '../components/Icons';
import { Screens } from '../constants';
import { useTranslation } from '../hooks/useTranslation';


const WelcomeScreen: React.FC = () => {
  const { loginAsGuest, language, setLanguage, navigateTo } = useAppContext();
  const { t } = useTranslation();

  const handleLogin = () => {
    navigateTo(Screens.LOGIN);
  };
  
  const handleRegister = () => {
    navigateTo(Screens.REGISTER);
  };
  
  const handleScanQR = () => {
    navigateTo(Screens.PHARMACY_SCAN);
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-full bg-teal-50 p-8 text-center">
      <LogoIcon />
      <h1 className="text-5xl font-extrabold text-teal-600 mt-4">Ebotika+</h1>
      <p className="text-gray-600 mt-2">{t('welcome_tagline')}</p>

      <div className="mt-16 w-full space-y-4">
        <button
          onClick={loginAsGuest}
          className="w-full bg-teal-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-teal-600 transition duration-300"
        >
          {t('welcome_guest_button')}
        </button>
        <button
          onClick={handleLogin}
          className="w-full bg-white text-teal-500 border-2 border-teal-500 font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-teal-50 transition duration-300"
        >
          {t('welcome_login_button')}
        </button>
        <button
          onClick={handleRegister}
          className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
        >
          {t('welcome_register_button')}
        </button>
        <button
          onClick={handleScanQR}
          className="w-full bg-gray-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-gray-700 transition duration-300"
        >
          {t('welcome_scan_qr_button')}
        </button>
      </div>

      <div className="mt-8">
        <span className="text-gray-500 text-sm">{t('welcome_language_label')}: </span>
        <button 
          onClick={() => setLanguage('English')} 
          className={`font-semibold ${language === 'English' ? 'text-teal-600 underline' : 'text-gray-500'}`}
        >
          English
        </button>
        <span className="text-gray-500 mx-1">/</span>
        <button 
          onClick={() => setLanguage('Tagalog')}
          className={`font-semibold ${language === 'Tagalog' ? 'text-teal-600 underline' : 'text-gray-500'}`}
        >
          Tagalog
        </button>
      </div>

      <div className="absolute bottom-4 text-center text-xs text-gray-400">
         <p>Login to access patient, doctor, pharmacy, or admin dashboards.</p>
         <p>Use "Register" to create a new patient account.</p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
