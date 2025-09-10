import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { AppContext } from './contexts/AppContext.ts';
import type { Role, User, Screen, Language, Consultation, ForumPost, PrivateChatMessage, Prescription, DoctorProfile, PatientDoctorChatMessage, ConsultationStatus, ResidentRecord, Medicine, RhwStats, BhwStats, StructuredAddress, BhwNotification, PatientNotification, PharmacyStats, ChatMessage, AISummary } from './types';
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
import RHUDashboard from './screens/rhu/RHUDashboard';
import BHWDashboard from './screens/bhw/BHWDashboard';
import ForumScreen from './screens/shared/ForumScreen';
import ProfessionalsDirectoryScreen from './screens/shared/ProfessionalsDirectoryScreen';
import PrivateChatScreen from './screens/shared/PrivateChatScreen';
import ConsultationDetailScreen from './screens/doctor/ConsultationDetailScreen';
import PharmacyScanScreen from './screens/pharmacy/PharmacyScanScreen';
import PharmacyDashboard from './screens/pharmacy/PharmacyDashboard';
import QRDisplayScreen from './screens/patient/QRDisplayScreen';
import ChatBubbleFAB from './components/ChatBubbleFAB';
import DoctorChatScreen from './screens/patient/DoctorChatScreen';
import PatientConsultationDetailScreen from './screens/patient/PatientConsultationDetailScreen';
import ProfessionalProfileEditScreen from './screens/shared/ProfessionalProfileEditScreen';
import PatientDetailScreen from './screens/rhu/PatientDetailScreen';
import { useTranslation } from './hooks/useTranslation';
import * as db from './services/localDB';
import { resetChatSession } from './services/geminiService';


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
  const [authLoading, setAuthLoading] = useState(false); // No longer needed for auth, but good for initial load
  const [rhuStats, setRhuStats] = useState<RhwStats | null>(null);
  const [bhwStats, setBhwStats] = useState<BhwStats | null>(null);
  const [pharmacyStats, setPharmacyStats] = useState<PharmacyStats | null>(null);
  const [bhwNotifications, setBhwNotifications] = useState<BhwNotification[]>([]);
  const [patientNotifications, setPatientNotifications] = useState<PatientNotification[]>([]);
  const [pendingConsultationForGuest, setPendingConsultationForGuest] = useState<{ messages: ChatMessage[], summary: AISummary } | null>(null);

  // --- DATA SEEDING ---
  useEffect(() => {
    db.seedInitialData();
  }, []);

  const t = useCallback((key: string, params: { [key: string]: string | number } = {}) => {
    const langKey = language === 'Filipino' ? 'fil' : 'en';
    let str = translations[langKey][key] || key;
    
    Object.keys(params).forEach(pKey => {
      str = str.replace(`{${pKey}}`, String(params[pKey]));
    });
    
    return str;
  }, [language]);
  
    const navigateTo = useCallback((newScreen: Screen) => {
    const patientScreens: Screen[] = [Screens.PATIENT_HOME, Screens.CONSULTATIONS, Screens.PRESCRIPTIONS, Screens.PROFILE];
    if (patientScreens.includes(newScreen)) {
        setActivePatientScreen(newScreen);
    }
    setScreen(newScreen);
  }, []);

  // --- DATA FETCHING (LOCAL) ---
  const fetchData = useCallback(async () => {
      if (!user) return;
      setUsers(await db.getUsers());
      setConsultations(await db.getConsultations(user));
      setPrescriptions(await db.getPrescriptions(user));
      setForumPosts(await db.getForumPosts());
      setDoctorProfiles(await db.getDoctorProfiles());
      setMedicines(await db.getMedicines());
      setResidentRecords(await db.getResidentRecords(user));
      setBhwNotifications(await db.getBhwNotifications(user));
      setPatientNotifications(await db.getPatientNotifications(user.id));
      setPrivateChats(await db.getPrivateChats(user.id));
      setPatientDoctorChats(await db.getPatientDoctorChats(user.id));
      setRhuStats(await db.getRhuStats());
      setBhwStats(await db.getBhwStats(user));
      setPharmacyStats(await db.getPharmacyStats());
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [user, fetchData]);

  // Keep the current user object in sync with the master user list
  useEffect(() => {
    if (user) {
        const updatedUserInList = users.find(u => u.id === user.id);
        if (updatedUserInList && JSON.stringify(user) !== JSON.stringify(updatedUserInList)) {
            setUser(updatedUserInList);
        }
    }
  }, [users, user]);
  
  const handleUserLogin = useCallback((loggedInUser: User) => {
        let justCreatedPendingConsultation = false;

        // If a guest just registered and has a pending consultation, create it now.
        if (pendingConsultationForGuest && loggedInUser.role === 'patient') {
            const consultationData = { ...pendingConsultationForGuest };
            setPendingConsultationForGuest(null);
            localStorage.removeItem(CHAT_HISTORY_KEY);

            try {
                db.addConsultation({
                    patientId: loggedInUser.id,
                    date: new Date().toISOString().split('T')[0],
                    symptoms: consultationData.messages.filter(m => m.sender === 'user').map(m => m.text),
                    aiSummary: consultationData.summary,
                    chatHistory: consultationData.messages,
                });
                alert(t('pending_prescription_alert'));
                justCreatedPendingConsultation = true;
            } catch (error: any) {
                alert(error.message);
            }
        }
        
        setUser(loggedInUser);
        setRole(loggedInUser.role);
        // Navigate based on role
        switch (loggedInUser.role) {
            case 'patient': 
                if (justCreatedPendingConsultation) {
                    setScreen(Screens.PRESCRIPTIONS);
                    setActivePatientScreen(Screens.PRESCRIPTIONS);
                } else {
                    setScreen(Screens.PATIENT_HOME);
                }
                break;
            case 'doctor': setScreen(Screens.DOCTOR_DASHBOARD); break;
            case 'pharmacy': setScreen(Screens.PHARMACY_DASHBOARD); break;
            case 'admin': setScreen(Screens.RHU_DASHBOARD); break;
            case 'bhw': setScreen(Screens.BHW_DASHBOARD); break;
            default: setScreen(Screens.WELCOME);
        }
    }, [pendingConsultationForGuest, t]);

  // --- AUTH ACTIONS ---
  const login = useCallback(async (email: string, password: string) => {
      const loggedInUser = await db.signIn(email, password);
      handleUserLogin(loggedInUser);
  }, [handleUserLogin]);

  const register = useCallback(async (details: { name: string, email: string, password: string, contactNumber: string, address: StructuredAddress, validIdFile: File }) => {
      const newUser = await db.signUp(details);
      // Immediately log in the new user
      handleUserLogin(newUser);
  }, [handleUserLogin]);

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
    await db.signOut();
    // Clear all local state
    setUser(null);
    setRole('unauthenticated');
    setScreen(Screens.WELCOME);
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
  }, [navigateTo]);


  const startSymptomCheck = useCallback((initialSymptom: string) => {
      localStorage.removeItem(CHAT_HISTORY_KEY);
      resetChatSession();
      setSymptom(initialSymptom);
      navigateTo(Screens.SYMPTOM_CHECK);
  }, [navigateTo]);
  
  const updateGuestDetails = useCallback((details: { name: string; contactNumber: string; address: StructuredAddress; validIdFile: File }): User => {
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
  
  const updateUserProfile = useCallback(async (updatedDetails: Partial<User>) => {
    if(!user) return;
    await db.updateUserProfile(user.id, updatedDetails);
    fetchData(); // Refresh data
  }, [user, fetchData]);

  const updateUserStatus = useCallback(async (userId: string, status: 'active' | 'banned') => {
    await db.updateUserStatus(userId, status);
    fetchData();
  }, [fetchData]);

  const deleteUser = useCallback(async (userId: string) => {
    await db.deleteUserAccount(userId);
    fetchData();
  }, [fetchData]);

  const addReportToUser = useCallback(async (userId: string, report: { doctorId: string; doctorName: string; reason: string; date: string }) => {
    await db.addReportToUser(userId, report);
    fetchData();
  }, [fetchData]);

  const addProfessionalUser = useCallback(async (newUser: Omit<User, 'id'|'status'>) => {
    await db.createProfessionalUser(newUser);
    fetchData();
  }, [fetchData]);

  const updateProfessionalProfile = useCallback(async (userId: string, userUpdates: Partial<User>, profileUpdates: Partial<DoctorProfile>) => {
    await db.updateProfessionalProfile(userId, userUpdates, profileUpdates);
    fetchData();
  }, [fetchData]);

  const addResidentRecord = useCallback(async (details: Omit<ResidentRecord, 'id' | 'createdAt'>) => {
    await db.addResidentRecord(details);
    fetchData();
  }, [fetchData]);

  const deleteResidentRecord = useCallback(async (recordId: string) => {
    await db.deleteResidentRecord(recordId);
    fetchData();
  }, [fetchData]);

  const updateResidentRecord = useCallback(async (recordId: string, details: Partial<Omit<ResidentRecord, 'id' | 'createdAt'>>) => {
    await db.updateResidentRecord(recordId, details);
    fetchData();
  }, [fetchData]);

  const addConsultation = useCallback(async (consultation: Omit<Consultation, 'id' | 'patient' | 'doctor' | 'patientId' | 'status'>) => {
    if (!user) return;
    try {
      await db.addConsultation({ ...consultation, patientId: user.id });
      alert(t('pending_prescription_alert'));
      navigateTo(Screens.CONSULTATIONS);
    } catch (error: any) {
      alert(error.message);
    }
    fetchData();
  }, [user, fetchData, navigateTo, t]);

  const updateConsultationStatus = useCallback(async (consultationId: string, status: ConsultationStatus, doctorId: string) => {
    await db.updateConsultationStatus(consultationId, status, doctorId);
    fetchData();
  }, [fetchData]);

  const addPrescription = useCallback(async (prescription: Omit<Prescription, 'id' | 'patient' | 'doctorName'>) => {
    await db.addPrescription(prescription);
    fetchData();
  }, [fetchData]);

  const updatePrescription = useCallback(async (prescriptionId: string, details: Partial<Omit<Prescription, 'id'>>) => {
    await db.updatePrescription(prescriptionId, details);
    fetchData();
  }, [fetchData]);

  const addForumPost = useCallback(async (content: string) => {
    if (!user) return;
    await db.addForumPost(user.id, content);
    fetchData();
  }, [user, fetchData]);

  const sendPrivateMessage = useCallback(async (recipientId: string, content: string) => {
    if (!user) return;
    await db.sendPrivateMessage(user.id, recipientId, content);
    fetchData();
  }, [user, fetchData]);

  const sendPatientDoctorMessage = useCallback(async (doctorId: string, content: string) => {
    if (!user) return;
    await db.sendPatientDoctorMessage(user.id, doctorId, content);
    fetchData();
  }, [user, fetchData]);

  const sendDoctorPatientMessage = useCallback(async (patientId: string, content: string) => {
    if (!user) return;
    await db.sendDoctorPatientMessage(user.id, patientId, content);
    fetchData();
  }, [user, fetchData]);

  const markDoctorChatAsRead = useCallback(async (conversationId: string) => {
    await db.markDoctorChatAsRead(conversationId);
    fetchData();
  }, [fetchData]);

  const updateDoctorAvailability = useCallback(async (doctorId: string, availability: 'Available' | 'On Leave') => {
    await db.updateDoctorAvailability(doctorId, availability);
    fetchData();
  }, [fetchData]);

  const upgradeUserSubscription = useCallback(async (userId: string, plan: 'individual' | 'family') => {
    await db.upgradeUserSubscription(userId, plan);
    fetchData();
  }, [fetchData]);

  const grantPremiumSubscription = useCallback(async (userId: string) => {
    await db.grantPremiumSubscription(userId);
    fetchData();
  }, [fetchData]);

  const approveIdVerification = useCallback(async (notificationId: string) => {
    await db.approveIdVerification(notificationId);
    fetchData();
  }, [fetchData]);

  const rejectIdVerification = useCallback(async (notificationId: string, reason: string) => {
    await db.rejectIdVerification(notificationId, reason);
    fetchData();
  }, [fetchData]);

  const markPatientNotificationAsRead = useCallback(async (notificationId: string) => {
    await db.markPatientNotificationAsRead(notificationId);
    fetchData();
  }, [fetchData]);
  
  const updateValidId = useCallback(async (file: File) => {
    if (!user) return;
    await db.updateValidId(user.id, file);
    alert('Your new ID has been submitted for verification.');
    fetchData();
  }, [user, fetchData]);

  const validateAndRemitPrescription = useCallback(async (prescriptionId: string) => {
    const result = await db.validateAndRemitPrescription(prescriptionId);
    fetchData();
    return result;
  }, [fetchData]);


    const contextValue = useMemo(() => ({
        role, user, users, screen, activePatientScreen, language, t, isGuestUpgrading,
        login, register, loginAsGuest, logout, promptGuestExit, navigateTo, setLanguage, startSymptomCheck,
        symptom, updateGuestDetails, updateUserProfile, addProfessionalUser, updateProfessionalProfile,
        addResidentRecord, deleteResidentRecord, updateResidentRecord, residentRecords, updateUserStatus,
        deleteUser, addReportToUser, activeConsultation, setActiveConsultation, consultations, addConsultation,
        updateConsultationStatus, activePrescription, setActivePrescription, prescriptions, medicines,
        addPrescription, updatePrescription, activePatientForManagement, setActivePatientForManagement,
        forumPosts, addForumPost, activePrivateChatRecipient, setActivePrivateChatRecipient, privateChats,
        sendPrivateMessage, activeDoctorChatRecipient, setActiveDoctorChatRecipient, patientDoctorChats,
        sendPatientDoctorMessage, sendDoctorPatientMessage, markDoctorChatAsRead, doctorProfiles, updateDoctorAvailability,
        upgradeUserSubscription, grantPremiumSubscription, rhuStats, bhwStats, pharmacyStats, bhwNotifications,
        approveIdVerification, rejectIdVerification, patientNotifications, markPatientNotificationAsRead, updateValidId,
        pendingConsultationForGuest, setPendingConsultationForGuest, validateAndRemitPrescription,
        setIsGuestUpgrading
    }), [
        role, user, users, screen, activePatientScreen, language, t, isGuestUpgrading,
        login, register, loginAsGuest, logout, promptGuestExit, navigateTo, setLanguage, startSymptomCheck,
        symptom, updateGuestDetails, updateUserProfile, addProfessionalUser, updateProfessionalProfile,
        addResidentRecord, deleteResidentRecord, updateResidentRecord, residentRecords, updateUserStatus,
        deleteUser, addReportToUser, activeConsultation, setActiveConsultation, consultations, addConsultation,
        updateConsultationStatus, activePrescription, setActivePrescription, prescriptions, medicines,
        addPrescription, updatePrescription, activePatientForManagement, setActivePatientForManagement,
        forumPosts, addForumPost, activePrivateChatRecipient, setActivePrivateChatRecipient, privateChats,
        sendPrivateMessage, activeDoctorChatRecipient, setActiveDoctorChatRecipient, patientDoctorChats,
        sendPatientDoctorMessage, sendDoctorPatientMessage, markDoctorChatAsRead, doctorProfiles, updateDoctorAvailability,
        upgradeUserSubscription, grantPremiumSubscription, rhuStats, bhwStats, pharmacyStats, bhwNotifications,
        approveIdVerification, rejectIdVerification, patientNotifications, markPatientNotificationAsRead, updateValidId,
        pendingConsultationForGuest, setPendingConsultationForGuest, validateAndRemitPrescription,
    ]);

    const renderScreen = () => {
        switch (screen) {
            case Screens.WELCOME: return <WelcomeScreen />;
            case Screens.LOGIN: return <LoginScreen />;
            case Screens.REGISTER: return <RegisterScreen />;
            case Screens.PATIENT_HOME: return <PatientHomeScreen />;
            case Screens.SYMPTOM_CHECK: return <SymptomCheckScreen />;
            case Screens.CONSULTATIONS: return <ConsultsScreen />;
            case Screens.PRESCRIPTIONS: return <PrescriptionsScreen />;
            case Screens.PROFILE: return <ProfileScreen />;
            case Screens.QR_DISPLAY: return <QRDisplayScreen />;
            case Screens.DOCTOR_CHAT: return <DoctorChatScreen />;
            case Screens.PATIENT_CONSULTATION_DETAIL: return <PatientConsultationDetailScreen />;
            case Screens.DOCTOR_DASHBOARD: return <DoctorDashboard />;
            case Screens.DOCTOR_INBOX: return <DoctorInboxScreen />;
            case Screens.CONSULTATION_DETAIL: return <ConsultationDetailScreen />;
            case Screens.PRESCRIPTION_FORM: return <PrescriptionFormScreen />;
            case Screens.PHARMACY_DASHBOARD: return <PharmacyDashboard />;
            case Screens.PHARMACY_SCAN: return <PharmacyScanScreen />;
            case Screens.RHU_DASHBOARD: return <RHUDashboard />;
            case Screens.BHW_DASHBOARD: return <BHWDashboard />;
            case Screens.PATIENT_DETAIL_MANAGEMENT: return <PatientDetailScreen />;
            case Screens.FORUM: return <ForumScreen />;
            case Screens.PROFESSIONALS_DIRECTORY: return <ProfessionalsDirectoryScreen />;
            case Screens.PRIVATE_CHAT: return <PrivateChatScreen />;
            case Screens.PROFESSIONAL_PROFILE_EDIT: return <ProfessionalProfileEditScreen />;
            default: return <WelcomeScreen />;
        }
    };

    return (
        <AppContext.Provider value={contextValue}>
            <div className="relative w-full h-full max-w-md mx-auto bg-white shadow-lg flex flex-col overflow-hidden font-sans">
                {renderScreen()}
                {(role === 'patient' || role === 'guest') && ![Screens.SYMPTOM_CHECK, Screens.DOCTOR_CHAT].includes(screen) && <ChatBubbleFAB />}
            </div>
            <GuestExitModal
                isOpen={isGuestExitModalOpen}
                onClose={() => setIsGuestExitModalOpen(false)}
                onConfirm={handleConfirmGuestExit}
                onSaveAndRegister={handleGuestUpgrade}
            />
            <LogoutConfirmationModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleConfirmLogout}
            />
        </AppContext.Provider>
    );
}
