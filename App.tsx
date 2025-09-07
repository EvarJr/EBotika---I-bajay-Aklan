import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { AppContext } from './contexts/AppContext.ts';
import type { Role, User, Screen, Language, Consultation, ForumPost, PrivateChatMessage, Prescription, DoctorProfile, PatientDoctorChatMessage, ConsultationStatus, ResidentRecord, Medicine, PharmacyStats, RhwStats, BhwStats, StructuredAddress, BhwNotification, PatientNotification } from './types';
import { Screens, CHAT_HISTORY_KEY } from './constants';
import { translations } from './translations';

import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import PatientHomeScreen from './screens/patient/PatientHomeScreen';
import SymptomCheckScreen from './screens/patient/SymptomCheckScreen';
import ConsultsScreen from './screens/patient/ConsultsScreen';
import PrescriptionsScreen from './screens/patient/PrescriptionsScreen';
import ProfileScreen from './screens/patient/ProfileScreen';
import DoctorDashboard from './screens/doctor/DoctorDashboard';
import DoctorInboxScreen from './screens/doctor/DoctorInboxScreen';
import PrescriptionFormScreen from './screens/doctor/PrescriptionFormScreen';
import PharmacyDashboard from './screens/pharmacy/PharmacyDashboard';
import RHUDashboard from './screens/rhu/RHUDashboard';
import BHWDashboard from './screens/bhw/BHWDashboard';
import ForumScreen from './screens/shared/ForumScreen';
import ProfessionalsDirectoryScreen from './screens/shared/ProfessionalsDirectoryScreen';
import PrivateChatScreen from './screens/shared/PrivateChatScreen';
import ConsultationDetailScreen from './screens/doctor/ConsultationDetailScreen';
import PharmacyScanScreen from './screens/pharmacy/PharmacyScanScreen';
import QRDisplayScreen from './screens/patient/QRDisplayScreen';
import ChatBubbleFAB from './components/ChatBubbleFAB';
import DoctorChatScreen from './screens/patient/DoctorChatScreen';
import PatientConsultationDetailScreen from './screens/patient/PatientConsultationDetailScreen';
import ProfessionalProfileEditScreen from './screens/shared/ProfessionalProfileEditScreen';
import PatientDetailScreen from './screens/rhu/PatientDetailScreen';
import { useTranslation } from './hooks/useTranslation';
import * as firebaseService from './services/firebaseService';


const GuestExitModal = ({ isOpen, onConfirm, onClose, onSaveAndRegister }: { isOpen: boolean; onConfirm: () => void; onClose: () => void; onSaveAndRegister: () => void; }) => {
    const { t } = useTranslation();
    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
                <h2 className="text-xl font-bold mb-2 text-gray-800">{t('guest_exit_title')}</h2>
                <p className="text-sm text-gray-600 mb-4">{t('guest_exit_warning')}</p>
                <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-lg text-center mb-6">
                    <p className="font-semibold text-sm">{t('guest_exit_save_prompt')}</p>
                </div>
                <div className="flex flex-col space-y-2">
                     <button onClick={onSaveAndRegister} className="w-full bg-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-600">
                        {t('guest_exit_save_button')}
                    </button>
                    <button onClick={onConfirm} className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700">
                        {t('guest_exit_confirm_button')}
                    </button>
                    <button onClick={onClose} className="w-full bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">
                        {t('guest_exit_stay_button')}
                    </button>
                </div>
            </div>
        </div>
    );
};

const LogoutConfirmationModal = ({ isOpen, onConfirm, onClose }: { isOpen: boolean; onConfirm: () => void; onClose: () => void; }) => {
    const { t } = useTranslation();
    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
                <h2 className="text-xl font-bold mb-2 text-gray-800">{t('logout_confirm_title')}</h2>
                <p className="text-sm text-gray-600 mb-6">{t('logout_confirm_text')}</p>
                <div className="flex justify-end space-x-2">
                    <button onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">
                        {t('cancel')}
                    </button>
                    <button onClick={onConfirm} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700">
                        {t('confirm')}
                    </button>
                </div>
            </div>
        </div>
    );
};


export default function App() {
  const [role, setRole] = useState<Role>('unauthenticated');
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [screen, setScreen] = useState<Screen>(Screens.WELCOME);
  const [activePatientScreen, setActivePatientScreen] = useState<Screen>(Screens.PATIENT_HOME);
  const [language, setLanguage] = useState<Language>('English');
  const [symptom, setSymptom] = useState<string | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [activeConsultation, setActiveConsultation] = useState<Consultation | null>(null);
  const [activePrescription, setActivePrescription] = useState<Prescription | null>(null);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [activePrivateChatRecipient, setActivePrivateChatRecipient] = useState<User | null>(null);
  const [privateChats, setPrivateChats] = useState<{ [conversationId: string]: PrivateChatMessage[] }>({});
  const [activeDoctorChatRecipient, setActiveDoctorChatRecipient] = useState<DoctorProfile | null>(null);
  const [patientDoctorChats, setPatientDoctorChats] = useState<{ [conversationId: string]: PatientDoctorChatMessage[] }>({});
  const [doctorProfiles, setDoctorProfiles] = useState<DoctorProfile[]>([]);
  const [activePatientForManagement, setActivePatientForManagement] = useState<User | null>(null);
  const [isGuestExitModalOpen, setIsGuestExitModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isGuestUpgrading, setIsGuestUpgrading] = useState(false);
  const [residentRecords, setResidentRecords] = useState<ResidentRecord[]>([]);
  const [authLoading, setAuthLoading] = useState(true);
  const [pharmacyStats, setPharmacyStats] = useState<PharmacyStats | null>(null);
  const [rhuStats, setRhuStats] = useState<RhwStats | null>(null);
  const [bhwStats, setBhwStats] = useState<BhwStats | null>(null);
  const [bhwNotifications, setBhwNotifications] = useState<BhwNotification[]>([]);
  const [patientNotifications, setPatientNotifications] = useState<PatientNotification[]>([]);

  const t = useCallback((key: string, params: { [key: string]: string | number } = {}) => {
    const langKey = language === 'Aklanon' ? 'ak' : 'en';
    let str = translations[langKey][key] || key;
    
    Object.keys(params).forEach(pKey => {
      str = str.replace(`{${pKey}}`, String(params[pKey]));
    });
    
    return str;
  }, [language]);

  // --- DATA FETCHING & REALTIME LISTENERS ---
  useEffect(() => {
    // Auth Listener
    const unsubscribe = firebaseService.onAuthChange(async (firebaseUser) => {
        if (firebaseUser) {
            const userProfile = await firebaseService.getUserProfile(firebaseUser.uid);
            if (userProfile) {
                setUser(userProfile);
                setRole(userProfile.role);
                // Navigate based on role
                switch (userProfile.role) {
                    case 'patient': setScreen(Screens.PATIENT_HOME); break;
                    case 'doctor': setScreen(Screens.DOCTOR_DASHBOARD); break;
                    case 'pharmacy': setScreen(Screens.PHARMACY_DASHBOARD); break;
                    case 'admin': setScreen(Screens.RHU_DASHBOARD); break;
                    case 'bhw': setScreen(Screens.BHW_DASHBOARD); break;
                    default: setScreen(Screens.WELCOME);
                }
            } else {
                // This case can happen if a user is created in Auth but their Firestore doc isn't ready.
                // For now, we log them out.
                await firebaseService.signOut();
            }
        } else {
            setUser(null);
            setRole('unauthenticated');
            setScreen(Screens.WELCOME);
        }
        setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  // Fetch data when user logs in
  useEffect(() => {
    if (user) {
        const unsubs: (()=>void)[] = [];
        // Base Data
        firebaseService.getUsers(setUsers).then(u => unsubs.push(u));
        firebaseService.getConsultations(user, setConsultations).then(u => unsubs.push(u));
        firebaseService.getPrescriptions(user, setPrescriptions).then(u => unsubs.push(u));
        firebaseService.getForumPosts(setForumPosts).then(u => unsubs.push(u));
        firebaseService.getDoctorProfiles(setDoctorProfiles).then(u => unsubs.push(u));
        firebaseService.getMedicines(setMedicines).then(u => unsubs.push(u));
        
        // Role-specific data
        firebaseService.getResidentRecords(user, setResidentRecords).then(u => unsubs.push(u));
        if (user.role === 'bhw') {
            firebaseService.getBhwNotifications(user, setBhwNotifications).then(u => unsubs.push(u));
        }
        if (user.role === 'patient') {
            firebaseService.getPatientNotifications(user.id, setPatientNotifications).then(u => unsubs.push(u));
        }

        // Analytics
        firebaseService.getPharmacyStats(setPharmacyStats).then(u => unsubs.push(u));
        firebaseService.getRhuStats(setRhuStats).then(u => unsubs.push(u));
        firebaseService.getBhwStats(user, setBhwStats).then(u => unsubs.push(u));
        
        // Real-time chats
        firebaseService.getPrivateChats(user.id, setPrivateChats).then(u => unsubs.push(u));
        firebaseService.getPatientDoctorChats(user.id, setPatientDoctorChats).then(u => unsubs.push(u));

        return () => unsubs.forEach(unsub => unsub());
    }
  }, [user]);

  // Keep the current user object in sync with the master user list
  useEffect(() => {
    if (user) {
        const updatedUserInList = users.find(u => u.id === user.id);
        if (updatedUserInList && JSON.stringify(user) !== JSON.stringify(updatedUserInList)) {
            setUser(updatedUserInList);
        }
    }
  }, [users, user]);


  // --- AUTH ACTIONS ---
  const login = useCallback(async (email: string, password: string) => {
      await firebaseService.signIn(email, password);
      // onAuthChange listener will handle the rest
  }, []);

  const register = useCallback(async (details: { name: string, email: string, password: string, contactNumber: string, address: StructuredAddress, validIdFile: File }) => {
      await firebaseService.signUp(details);
      // onAuthChange listener will handle the rest
  }, []);

  const loginAsGuest = useCallback(() => {
    setRole('guest');
    setUser({
        id: `guest-${Date.now()}`,
        name: 'Guest User',
        email: 'guest@ebotika.ph',
        role: 'guest',
        status: 'active',
        address: { barangay: '', purok: '', streetAddress: ''},
    });
    setScreen(Screens.PATIENT_HOME);
    setActivePatientScreen(Screens.PATIENT_HOME);
  }, []);

  const handleConfirmLogout = useCallback(async () => {
    await firebaseService.signOut();
    // Clear all local state
    setActiveConsultation(null);
    setActivePrescription(null);
    setActivePrivateChatRecipient(null);
    setActiveDoctorChatRecipient(null);
    setActivePatientForManagement(null);
    setIsGuestUpgrading(false);
    localStorage.removeItem(CHAT_HISTORY_KEY);
    setIsLogoutModalOpen(false);
  }, []);

  const logout = useCallback(() => {
    setIsLogoutModalOpen(true);
  }, []);

  // --- GUEST FLOW ---
  const promptGuestExit = useCallback(() => {
    setIsGuestExitModalOpen(true);
  }, []);

  const handleConfirmGuestExit = useCallback(() => {
    setIsGuestExitModalOpen(false);
    // Mimic logout for guest
    setUser(null);
    setRole('unauthenticated');
    setScreen(Screens.WELCOME);
    localStorage.removeItem(CHAT_HISTORY_KEY);
  }, []);
  
  const handleGuestUpgrade = useCallback(() => {
      setIsGuestUpgrading(true);
      setIsGuestExitModalOpen(false);
      navigateTo(Screens.REGISTER);
  }, []);

  // --- NAVIGATION ---
  const navigateTo = useCallback((newScreen: Screen) => {
    const patientScreens: Screen[] = [Screens.PATIENT_HOME, Screens.CONSULTATIONS, Screens.PRESCRIPTIONS, Screens.PROFILE];
    if (patientScreens.includes(newScreen)) {
        setActivePatientScreen(newScreen);
    }
    setScreen(newScreen);
  }, []);

  const startSymptomCheck = useCallback((initialSymptom: string) => {
      localStorage.removeItem(CHAT_HISTORY_KEY);
      setSymptom(initialSymptom);
      navigateTo(Screens.SYMPTOM_CHECK);
  }, [navigateTo]);
  
  // --- DATA MUTATIONS (delegated to firebaseService) ---
  const updateGuestDetails = useCallback((details: { name: string; contactNumber: string; address: StructuredAddress; validIdFile: File }): User => {
    // This function's purpose changes. It's now just for updating local state before registration.
    const guestUser: User = {
      id: user?.id || `guest-${Date.now()}`,
      name: details.name,
      email: `${details.name.split(' ').join('.').toLowerCase()}@guest.ebotika.ph`,
      role: 'patient',
      contactNumber: details.contactNumber,
      address: details.address,
      validIdUrl: URL.createObjectURL(details.validIdFile),
      status: 'active',
    };
    setUser(guestUser);
    setRole('patient');
    return guestUser;
  }, [user]);
  
  const updateUserProfile = useCallback((updatedDetails: Partial<User>) => {
    if(!user) return;
    firebaseService.updateUserProfile(user.id, updatedDetails);
  }, [user]);

  const updateUserStatus = useCallback((userId: string, status: 'active' | 'banned') => {
    firebaseService.updateUserStatus(userId, status);
  }, []);

  const deleteUser = useCallback((userId: string) => {
    firebaseService.deleteUserAccount(userId);
  }, []);

  const addReportToUser = useCallback((userId: string, report: { doctorId: string; doctorName: string; reason: string; date: string }) => {
    firebaseService.addUserReport(userId, report);
  }, []);

  const addProfessionalUser = useCallback((newUser: Omit<User, 'id'|'status'>) => {
    firebaseService.createProfessionalUser(newUser);
  }, []);

  const addResidentRecord = useCallback((details: Omit<ResidentRecord, 'id' | 'createdAt'>) => {
    firebaseService.addResident(details);
  }, []);

  const deleteResidentRecord = useCallback((recordId: string) => {
    firebaseService.deleteResident(recordId);
  }, []);

  const updateResidentRecord = useCallback((recordId: string, details: Partial<Omit<ResidentRecord, 'id' | 'createdAt'>>) => {
    firebaseService.updateResidentRecord(recordId, details);
  }, []);

  const approveIdVerification = useCallback((notificationId: string) => {
    firebaseService.approveIdVerification(notificationId);
  }, []);

  const rejectIdVerification = useCallback((notificationId: string, reason: string) => {
    firebaseService.rejectIdVerification(notificationId, reason);
  }, []);
  
  const markPatientNotificationAsRead = useCallback((notificationId: string) => {
    firebaseService.markPatientNotificationAsRead(notificationId);
  }, []);

  const updateValidId = useCallback(async (file: File) => {
    if (!user) return;
    await firebaseService.updateValidId(user.id, file);
    alert('Your new ID has been submitted for verification.');
  }, [user]);

  const addConsultation = useCallback((consultation: Omit<Consultation, 'id' | 'patient' | 'doctor'>) => {
    if (!user) return;
    const fullConsultation = { ...consultation, patientId: user.id };
    firebaseService.addConsultation(fullConsultation);
  }, [user]);

  const updateConsultationStatus = useCallback((consultationId: string, status: ConsultationStatus, doctorId: string) => {
    firebaseService.updateConsultationStatus(consultationId, status, doctorId);
  }, []);
  
  const addPrescription = useCallback((prescription: Omit<Prescription, 'id' | 'patient' | 'doctorName'>) => {
     if (!user) return;
     firebaseService.addPrescription(prescription);
  }, [user]);
  
  const updatePrescription = useCallback((prescriptionId: string, details: Partial<Omit<Prescription, 'id'>>) => {
     if (!user || user.role !== 'doctor') return;
     const payload = { ...details, doctorId: user.id };
     firebaseService.updatePrescription(prescriptionId, payload);
  }, [user]);

  const addForumPost = useCallback((content: string) => {
    if (!user) return;
    const newPost = { authorId: user.id, timestamp: new Date().toLocaleString(), content };
    firebaseService.addForumPost(newPost);
  }, [user]);

  const sendPrivateMessage = useCallback((recipientId: string, content: string) => {
    if (!user) return;
    firebaseService.sendPrivateMessage(user.id, recipientId, content);
  }, [user]);

  const sendPatientDoctorMessage = useCallback((doctorId: string, content: string) => {
    if (!user || user.role !== 'patient') return;
    firebaseService.sendPatientDoctorMessage(user.id, doctorId, content);
  }, [user]);

  const sendDoctorPatientMessage = useCallback((patientId: string, content: string) => {
    if (!user || user.role !== 'doctor') return;
    firebaseService.sendDoctorPatientMessage(user.id, patientId, content);
  }, [user]);
  
  const markDoctorChatAsRead = useCallback((conversationId: string) => {
    firebaseService.markDoctorChatAsRead(conversationId);
  }, []);

  const updateDoctorAvailability = useCallback((doctorId: string, availability: 'Available' | 'On Leave') => {
    firebaseService.updateDoctorAvailability(doctorId, availability);
  }, []);

  const upgradeUserSubscription = useCallback((userId: string, plan: 'individual' | 'family') => {
    firebaseService.upgradeUserSubscription(userId, plan);
  }, []);

  const value = useMemo(() => ({
    role,
    user,
    users,
    screen,
    activePatientScreen,
    language,
    t,
    isGuestUpgrading,
    setIsGuestUpgrading,
    login,
    register,
    loginAsGuest,
    logout,
    promptGuestExit,
    navigateTo,
    setLanguage,
    startSymptomCheck,
    symptom,
    updateGuestDetails,
    updateUserProfile,
    updateUserStatus,
    deleteUser,
    addReportToUser,
    addProfessionalUser,
    residentRecords,
    addResidentRecord,
    deleteResidentRecord,
    updateResidentRecord,
    bhwNotifications,
    approveIdVerification,
    rejectIdVerification,
    patientNotifications,
    markPatientNotificationAsRead,
    updateValidId,
    consultations,
    addConsultation,
    updateConsultationStatus,
    prescriptions,
    medicines,
    addPrescription,
    updatePrescription,
    activeConsultation,
    setActiveConsultation,
    activePrescription,
    setActivePrescription,
    activePatientForManagement,
    setActivePatientForManagement,
    forumPosts,
    addForumPost,
    activePrivateChatRecipient,
    setActivePrivateChatRecipient,
    privateChats,
    sendPrivateMessage,
    activeDoctorChatRecipient,
    setActiveDoctorChatRecipient,
    patientDoctorChats,
    sendPatientDoctorMessage,
    sendDoctorPatientMessage,
    markDoctorChatAsRead,
    doctorProfiles,
    updateDoctorAvailability,
    upgradeUserSubscription,
    pharmacyStats,
    rhuStats,
    bhwStats,
  }), [role, user, users, screen, activePatientScreen, language, t, isGuestUpgrading, login, register, loginAsGuest, logout, promptGuestExit, navigateTo, startSymptomCheck, symptom, updateGuestDetails, updateUserProfile, updateUserStatus, deleteUser, addReportToUser, addProfessionalUser, residentRecords, addResidentRecord, deleteResidentRecord, updateResidentRecord, bhwNotifications, approveIdVerification, rejectIdVerification, patientNotifications, markPatientNotificationAsRead, updateValidId, consultations, addConsultation, updateConsultationStatus, prescriptions, medicines, addPrescription, updatePrescription, activeConsultation, activePrescription, activePatientForManagement, forumPosts, addForumPost, activePrivateChatRecipient, privateChats, sendPrivateMessage, activeDoctorChatRecipient, patientDoctorChats, sendPatientDoctorMessage, sendDoctorPatientMessage, markDoctorChatAsRead, doctorProfiles, updateDoctorAvailability, upgradeUserSubscription, pharmacyStats, rhuStats, bhwStats]);
  
  if (authLoading) {
      return (
          <div className="h-screen w-screen flex items-center justify-center font-sans">
              <div className="relative w-full max-w-sm h-full sm:h-[95vh] sm:max-h-[840px] bg-white shadow-2xl rounded-lg overflow-hidden flex flex-col items-center justify-center">
                  <p className="text-gray-600 animate-pulse">Initializing Ebotika+...</p>
              </div>
          </div>
      );
  }

  const renderScreen = () => {
    switch (screen) {
      case Screens.WELCOME:
        return <WelcomeScreen />;
      case Screens.LOGIN:
        return <LoginScreen />;
      case Screens.REGISTER:
        return <RegisterScreen />;
      case Screens.PATIENT_HOME:
      case Screens.CONSULTATIONS:
      case Screens.PRESCRIPTIONS:
      case Screens.PROFILE:
        const PatientScreensMap: { [key: string]: React.ReactElement } = {
          [Screens.PATIENT_HOME]: <PatientHomeScreen />,
          [Screens.CONSULTATIONS]: <ConsultsScreen />,
          [Screens.PRESCRIPTIONS]: <PrescriptionsScreen />,
          [Screens.PROFILE]: <ProfileScreen />,
        };
        return PatientScreensMap[activePatientScreen];
      case Screens.SYMPTOM_CHECK:
          return <SymptomCheckScreen />;
      case Screens.QR_DISPLAY:
          return <QRDisplayScreen />;
      case Screens.DOCTOR_CHAT:
          return <DoctorChatScreen />;
      case Screens.PATIENT_CONSULTATION_DETAIL:
          return <PatientConsultationDetailScreen />;
      case Screens.DOCTOR_DASHBOARD:
        return <DoctorDashboard />;
      case Screens.DOCTOR_INBOX:
        return <DoctorInboxScreen />;
      case Screens.CONSULTATION_DETAIL:
        return <ConsultationDetailScreen />;
      case Screens.PRESCRIPTION_FORM:
        return <PrescriptionFormScreen />;
      case Screens.PHARMACY_DASHBOARD:
        return <PharmacyDashboard />;
      case Screens.PHARMACY_SCAN:
        return <PharmacyScanScreen />;
      case Screens.RHU_DASHBOARD:
        return <RHUDashboard />;
      case Screens.BHW_DASHBOARD:
        return <BHWDashboard />;
      case Screens.PATIENT_DETAIL_MANAGEMENT:
        return <PatientDetailScreen />;
      case Screens.FORUM:
        return <ForumScreen />;
      case Screens.PROFESSIONALS_DIRECTORY:
        return <ProfessionalsDirectoryScreen />;
      case Screens.PRIVATE_CHAT:
        return <PrivateChatScreen />;
      case Screens.PROFESSIONAL_PROFILE_EDIT:
        return <ProfessionalProfileEditScreen />;
      default:
        return <WelcomeScreen />;
    }
  };
  
  const showChatBubble = (role === 'patient' || role === 'guest') && screen === Screens.PATIENT_HOME;

  return (
    <AppContext.Provider value={value}>
      <div className="h-screen w-screen flex items-center justify-center font-sans">
        <div className="relative w-full max-w-sm h-full sm:h-[95vh] sm:max-h-[840px] bg-white shadow-2xl rounded-lg overflow-hidden flex flex-col">
          <GuestExitModal 
            isOpen={isGuestExitModalOpen}
            onConfirm={handleConfirmGuestExit}
            onClose={() => setIsGuestExitModalOpen(false)}
            onSaveAndRegister={handleGuestUpgrade}
          />
          <LogoutConfirmationModal
            isOpen={isLogoutModalOpen}
            onConfirm={handleConfirmLogout}
            onClose={() => setIsLogoutModalOpen(false)}
          />
          {renderScreen()}
          {showChatBubble && <ChatBubbleFAB />}
        </div>
      </div>
    </AppContext.Provider>
  );
}