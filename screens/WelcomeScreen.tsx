import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { CameraIcon, MedicalIllustrationIcon } from '../components/Icons';
import { Screens } from '../constants';
import { useTranslation } from '../hooks/useTranslation';


const WelcomeScreen: React.FC = () => {
  const { loginAsGuest, language, setLanguage, navigateTo } = useAppContext();
  const { t } = useTranslation();

  const handleLogin = () => navigateTo(Screens.LOGIN);
  const handleRegister = () => navigateTo(Screens.REGISTER);
  const handleScanQR = () => navigateTo(Screens.PHARMACY_SCAN);
  
  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Top Section */}
      <div className="relative flex-grow flex flex-col items-center justify-center text-center text-white bg-gradient-to-br from-teal-500 to-teal-600 px-6 pt-10 pb-24 overflow-hidden">
        {/* Floating Buttons */}
        <div className="absolute top-4 left-4 z-20">
          <button 
            onClick={() => setLanguage(language === 'English' ? 'Filipino' : 'English')}
            className="text-white bg-white/20 hover:bg-white/30 font-semibold py-1.5 px-3 rounded-full text-sm transition-colors"
          >
            {language === 'English' ? 'Filipino' : 'English'}
          </button>
        </div>
        <button
          onClick={handleScanQR}
          className="absolute top-4 right-4 z-20 flex flex-col items-center text-white bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors duration-300"
          aria-label={t('welcome_scan_qr_button')}
        >
          <CameraIcon />
          <span className="text-xs font-bold mt-0.5">{t('scan_qr_label')}</span>
        </button>

        {/* Animated Content */}
        <div className="opacity-0 animate-fade-in-up">
          <MedicalIllustrationIcon />
        </div>
        <h1 className="text-4xl font-extrabold mt-6 drop-shadow-md opacity-0 animate-fade-in-up animation-delay-200">{t('welcome_main_title')}</h1>
        <p className="mt-2 max-w-xs text-teal-100 opacity-0 animate-fade-in-up animation-delay-400">{t('welcome_main_subtitle')}</p>
      </div>

      {/* Bottom Section */}
      <div className="relative bg-gray-50 pt-12 p-8 rounded-t-[40px] -mt-16 z-10 flex-shrink-0">
        <div className="w-full max-w-xs mx-auto space-y-4 opacity-0 animate-fade-in-up animation-delay-600">
          <button
            onClick={handleRegister}
            className="w-full bg-teal-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
          >
            {t('welcome_create_account_button')}
          </button>
          <button
            onClick={loginAsGuest}
            className="w-full bg-transparent border-2 border-gray-300 text-gray-700 font-bold py-3 px-4 rounded-xl hover:bg-gray-100 transition duration-300"
          >
            {t('welcome_guest_button')}
          </button>
          <div className="text-center pt-2">
            <span className="text-gray-500 text-sm">{t('welcome_login_prompt')} </span>
            <button
              onClick={handleLogin}
              className="font-semibold text-teal-600 hover:underline text-sm focus:outline-none"
            >
              {t('welcome_login_button')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;