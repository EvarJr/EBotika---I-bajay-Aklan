import { Screens } from './constants';

export type Role = 'patient' | 'guest' | 'doctor' | 'pharmacy' | 'admin' | 'unauthenticated' | 'bhw';

export type Language = 'English' | 'Aklanon';

export interface StructuredAddress {
  barangay: string;
  purok: string;
  streetAddress: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  password?: string;
  contactNumber?: string;
  address: StructuredAddress;
  validIdUrl?: string;
  isOnline?: boolean;
  status: 'active' | 'banned';
  reports?: { doctorId: string; doctorName: string; reason: string; date: string }[];
  isPremium?: boolean;
  subscriptionType?: 'individual' | 'family';
  familyId?: string | null;
  weeklyChatCredits?: number;
  chatAccessPasses?: { [doctorId: string]: number }; // Pass expires at this timestamp
  lastCreditReset?: number; // Timestamp when credits were last reset
  isVerifiedByBhw?: boolean;
  idRejectionReason?: string | null;
  assignedBarangay?: string;
}

export interface ResidentRecord {
  id: string;
  name: string;
  contactNumber: string;
  address: StructuredAddress;
  validIdUrl?: string;
  createdAt: number;
}

export interface BhwNotification {
    id: string;
    userId: string;
    userName: string;
    validIdUrl: string;
    timestamp: number;
    barangay: string;
}

export interface PatientNotification {
    id: string;
    userId: string;
    message: string;
    isRead: boolean;
    timestamp: number;
}

export type Screen = typeof Screens[keyof typeof Screens];

export interface PrivateChatMessage {
    id: string;
    senderId: string;
    recipientId: string;
    content: string;
    timestamp: string;
}

export interface PatientDoctorChatMessage {
    id: string;
    sender: 'patient' | 'doctor';
    content: string;
    timestamp: string;
    readByPatient: boolean;
    readByDoctor: boolean;
}

export interface PharmacyStats {
  weeklyValidations: { name: string, uv: number }[];
  topMeds: { name: string, count: number }[];
}

export interface RhwStats {
    weeklyConsultations: { name: string; uv: number }[];
    urgencyBreakdown: { name: string; count: number }[];
    topPrescribed: { name: string; count: number }[];
}

export interface BhwStats {
    weeklyRecordsAdded: { name: string; uv: number }[];
    residentDistribution: { name: string; count: number }[];
}

export interface IAppContext {
  role: Role;
  user: User | null;
  users: User[];
  screen: Screen;
  activePatientScreen: Screen;
  language: Language;
  t: (key: string, params?: { [key: string]: string | number }) => string;
  isGuestUpgrading: boolean;
  setIsGuestUpgrading: (isUpgrading: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (details: { name: string, email: string, password: string, contactNumber: string, address: StructuredAddress, validIdFile: File }) => Promise<void>;
  loginAsGuest: () => void;
  logout: () => void;
  promptGuestExit: () => void;
  navigateTo: (screen: Screen) => void;
  setLanguage: (language: Language) => void;
  startSymptomCheck: (initialSymptom: string) => void;
  symptom: string | null;
  updateGuestDetails: (details: { name: string, contactNumber: string, address: StructuredAddress, validIdFile: File }) => User;
  updateUserProfile: (updatedUser: Partial<User>) => void;
  addProfessionalUser: (user: Omit<User, 'id' | 'status'>) => void;
  addResidentRecord: (details: Omit<ResidentRecord, 'id' | 'createdAt'>) => void;
  deleteResidentRecord: (recordId: string) => void;
  updateResidentRecord: (recordId: string, details: Partial<Omit<ResidentRecord, 'id' | 'createdAt'>>) => void;
  residentRecords: ResidentRecord[];
  updateUserStatus: (userId: string, status: 'active' | 'banned') => void;
  deleteUser: (userId: string) => void;
  addReportToUser: (userId: string, report: { doctorId: string; doctorName: string; reason: string; date: string }) => void;
  activeConsultation: Consultation | null;
  setActiveConsultation: (consultation: Consultation | null) => void;
  consultations: Consultation[];
  addConsultation: (consultation: Omit<Consultation, 'id' | 'patient' | 'doctor'>) => void;
  updateConsultationStatus: (consultationId: string, status: ConsultationStatus, doctorId: string) => void;
  activePrescription: Prescription | null;
  setActivePrescription: (prescription: Prescription | null) => void;
  prescriptions: Prescription[];
  medicines: Medicine[];
  addPrescription: (prescription: Omit<Prescription, 'id' | 'patient' | 'doctorName'>) => void;
  updatePrescription: (prescriptionId: string, details: Partial<Omit<Prescription, 'id'>>) => void;
  activePatientForManagement: User | null;
  setActivePatientForManagement: (user: User | null) => void;
  forumPosts: ForumPost[];
  addForumPost: (content: string) => void;
  activePrivateChatRecipient: User | null;
  setActivePrivateChatRecipient: (user: User | null) => void;
  privateChats: { [conversationId: string]: PrivateChatMessage[] };
  sendPrivateMessage: (recipientId: string, content: string) => void;
  activeDoctorChatRecipient: DoctorProfile | null;
  setActiveDoctorChatRecipient: (doctor: DoctorProfile | null) => void;
  patientDoctorChats: { [conversationId: string]: PatientDoctorChatMessage[] };
  sendPatientDoctorMessage: (doctorId: string, content: string) => void;
  sendDoctorPatientMessage: (patientId: string, content: string) => void;
  markDoctorChatAsRead: (conversationId: string) => void;
  doctorProfiles: DoctorProfile[];
  updateDoctorAvailability: (doctorId: string, availability: 'Available' | 'On Leave') => void;
  upgradeUserSubscription: (userId: string, plan: 'individual' | 'family') => void;
  pharmacyStats: PharmacyStats | null;
  rhuStats: RhwStats | null;
  bhwStats: BhwStats | null;
  bhwNotifications: BhwNotification[];
  approveIdVerification: (notificationId: string) => void;
  rejectIdVerification: (notificationId: string, reason: string) => void;
  patientNotifications: PatientNotification[];
  markPatientNotificationAsRead: (notificationId: string) => void;
  updateValidId: (file: File) => Promise<void>;
}

export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

export interface AISummary {
    diagnosis_suggestion: string;
    urgency_level: 'Low' | 'Medium' | 'High' | 'Critical';
    recommendation: string;
}

export interface DoctorProfile {
    id: string;
    userId: string;
    name: string;
    specialty: string;
    avatarUrl: string;
    availability: 'Available' | 'On Leave';
}

export type ConsultationStatus = 'AI Triage' | 'Pending Doctor' | 'Completed';

export interface Consultation {
    id: string;
    patientId: string;
    patient: User;
    doctorId?: string | null;
    doctor?: DoctorProfile | null;
    date: string;
    symptoms: string[];
    aiSummary: AISummary | null;
    doctorNotes?: string;
    status: ConsultationStatus;
    chatHistory?: ChatMessage[];
}

export type PrescriptionStatus = 'Pending' | 'Approved' | 'Remitted' | 'Denied';

export interface Prescription {
    id: string;
    consultationId: string;
    patientId: string;
    patient: User;
    doctorId?: string;
    doctor?: DoctorProfile;
    medicine?: string;
    dosage?: string;
    aiSummary?: AISummary;
    dateIssued: string;
    doctorName: string;
    doctorNotes?: string;
    status: PrescriptionStatus;
}

export interface Medicine {
    id: string;
    name: string;
}

export interface ForumPost {
    id: string;
    authorId: string;
    author: User;
    timestamp: string;
    content: string;
}