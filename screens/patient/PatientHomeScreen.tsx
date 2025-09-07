import React from 'react';
import { PatientLayout } from '../../components/Layout';
import { useAppContext } from '../../hooks/useAppContext';
import { MOCK_SYMPTOMS, Screens } from '../../constants';
import type { DoctorProfile, Prescription, Consultation, PatientNotification } from '../../types';
import { PrescriptionsIcon, ConsultsIcon } from '../../components/Icons';
import { useTranslation } from '../../hooks/useTranslation';

interface Symptom {
    key: string;
    emoji: string;
}

const PatientNotificationBanner: React.FC<{ notification: PatientNotification }> = ({ notification }) => {
    const { markPatientNotificationAsRead, t } = useAppContext();
    const [message, reason] = notification.message.split('|');

    const formattedMessage = reason 
        ? `${t(message)}: "${reason}"`
        : t(message);

    return (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-3 rounded-md mb-6 shadow-sm" role="alert">
            <div className="flex">
                <div className="py-1"><svg className="fill-current h-6 w-6 text-blue-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
                <div>
                    <p className="font-bold">{t('notification_title')}</p>
                    <p className="text-sm">{formattedMessage}</p>
                    <button onClick={() => markPatientNotificationAsRead(notification.id)} className="text-xs font-semibold text-blue-600 hover:underline mt-1">
                        {t('notification_dismiss_button')}
                    </button>
                </div>
            </div>
        </div>
    );
};


const SymptomCard: React.FC<{ symptom: Symptom }> = ({ symptom }) => {
    const { startSymptomCheck } = useAppContext();
    const { t } = useTranslation();
    const symptomName = t(symptom.key);
    return (
        <button 
            onClick={() => startSymptomCheck(symptomName)} 
            className="bg-white p-3 rounded-lg shadow hover:shadow-md transition-shadow text-center flex flex-col items-center justify-center space-y-2 h-24"
        >
            <span className="text-3xl" role="img" aria-label={symptomName}>{symptom.emoji}</span>
            <p className="font-semibold text-gray-700 text-sm">{symptomName}</p>
        </button>
    );
};

const DoctorCard: React.FC<{ doctor: DoctorProfile }> = ({ doctor }) => {
  const { role, navigateTo, setActiveDoctorChatRecipient } = useAppContext();
  const { t } = useTranslation();
  const isAvailable = doctor.availability === 'Available';
  const isGuest = role === 'guest';

  const handleChat = () => {
    setActiveDoctorChatRecipient(doctor);
    navigateTo(Screens.DOCTOR_CHAT);
  };

  return (
    <div className="flex-shrink-0 w-48 bg-white rounded-xl shadow-lg p-4 text-center mr-4 flex flex-col">
      <div className="flex-grow">
        <img src={doctor.avatarUrl} alt={doctor.name} className="w-20 h-20 rounded-full mx-auto border-4 border-teal-100" />
        <h3 className="font-bold text-gray-800 mt-2 truncate">{doctor.name}</h3>
        <p className="text-xs text-gray-500">{t(doctor.specialty)}</p>
        
        <div className="flex items-center justify-center mt-2">
            <span className={`w-2.5 h-2.5 rounded-full mr-1.5 ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <p className={`text-xs font-semibold ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                {isAvailable ? t('doctor_status_available') : t('doctor_status_on_leave')}
            </p>
        </div>
      </div>
      
      <div className="mt-3">
        <button 
          onClick={handleChat} 
          disabled={!isAvailable || isGuest}
          className="bg-blue-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-blue-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
            {t('doctor_chat_button')}
        </button>
        {isGuest && (
          <p className="text-xs text-gray-500 mt-2">
              {t('guest_chat_disabled_prompt')}
          </p>
        )}
      </div>
    </div>
  );
};

// Dashboard Card Components for Registered Patients
const RecentPrescriptionCard: React.FC<{ prescription: Prescription }> = ({ prescription }) => {
    const { navigateTo, setActivePrescription } = useAppContext();
    const { t } = useTranslation();

    const handleClick = () => {
        setActivePrescription(prescription);
        navigateTo(Screens.QR_DISPLAY);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
            <div className="flex items-center min-w-0">
                <div className="bg-green-100 text-green-600 p-2 rounded-full mr-4">
                    <PrescriptionsIcon />
                </div>
                <div className="min-w-0">
                    <p className="text-xs text-gray-500">{t('dashboard_recent_rx')}</p>
                    <h3 className="font-bold text-gray-800 truncate">{prescription.medicine}</h3>
                </div>
            </div>
            <button onClick={handleClick} className="bg-teal-500 text-white px-3 py-1 rounded-full text-sm font-semibold hover:bg-teal-600 transition flex-shrink-0 ml-2">
                {t('dashboard_view_qr')}
            </button>
        </div>
    );
};

const LastConsultationCard: React.FC<{ consultation: Consultation }> = ({ consultation }) => {
    const { navigateTo } = useAppContext();
    const { t } = useTranslation();

    const statusColors: { [key in Consultation['status']]: string } = {
        'AI Triage': 'bg-blue-100 text-blue-800',
        'Pending Doctor': 'bg-yellow-100 text-yellow-800',
        'Completed': 'bg-green-100 text-green-800'
    };
    
    const statusTranslations: { [key in Consultation['status']]: string } = {
        'AI Triage': 'AI Triage', // This is more of a system state
        'Pending Doctor': t('consultation_status_pending'),
        'Completed': t('consultation_status_completed'),
    };

    return (
        <button className="w-full text-left bg-white p-4 rounded-lg shadow flex items-center justify-between hover:shadow-md transition" onClick={() => navigateTo(Screens.CONSULTATIONS)}>
            <div className="flex items-center min-w-0">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-full mr-4">
                    <ConsultsIcon />
                </div>
                <div className="min-w-0">
                    <p className="text-xs text-gray-500">{t('dashboard_last_consult')}</p>
                    <h3 className="font-bold text-gray-800 truncate">{consultation.symptoms.join(', ')}</h3>
                </div>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[consultation.status]} flex-shrink-0 ml-2`}>
                {statusTranslations[consultation.status]}
            </span>
        </button>
    );
};


const PatientHomeScreen: React.FC = () => {
    const { user, role, consultations, prescriptions, doctorProfiles, patientNotifications } = useAppContext();
    const { t } = useTranslation();
    const greeting = user ? (role === 'patient' ? t('greeting_user', { name: user.name.split(' ')[0] }) : t('greeting_guest')) : t('greeting_guest');

    // Find recent data for the logged-in user.
    const lastConsultation = user ? consultations.find(c => c.patientId === user.id) : null;
    const recentPrescription = user ? prescriptions
        .filter(p => p.patientId === user.id && p.status === 'Approved')
        .sort((a, b) => new Date(b.dateIssued).getTime() - new Date(a.dateIssued).getTime())[0] : null;

    const unreadNotifications = patientNotifications.filter(n => !n.isRead);

  return (
    <PatientLayout title={greeting}>
      <div className="space-y-6">
        
        {unreadNotifications.map(n => <PatientNotificationBanner key={n.id} notification={n} />)}

        {role === 'patient' && user && (
            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-3">{t('dashboard_title')}</h2>
                <div className="space-y-4">
                    {recentPrescription && <RecentPrescriptionCard prescription={recentPrescription} />}
                    {lastConsultation && <LastConsultationCard consultation={lastConsultation} />}
                    {!recentPrescription && !lastConsultation && (
                        <div className="bg-white p-4 rounded-lg shadow text-center text-gray-500">
                            <p>{t('dashboard_no_activity')}</p>
                            <p className="text-sm mt-1">{t('dashboard_no_activity_prompt')}</p>
                        </div>
                    )}
                </div>
            </div>
        )}
        
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-3">{t('symptoms_title')}</h2>
          <div className="grid grid-cols-2 gap-4">
            {MOCK_SYMPTOMS.map((symptom) => <SymptomCard key={symptom.key} symptom={symptom} />)}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-3">{t('doctors_title')}</h2>
          <div className="flex overflow-x-auto -mx-4 px-4 pb-4 custom-scrollbar">
            {doctorProfiles.map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} />)}
          </div>
        </div>
      </div>
    </PatientLayout>
  );
};

export default PatientHomeScreen;