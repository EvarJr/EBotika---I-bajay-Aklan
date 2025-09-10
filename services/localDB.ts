
import { MOCK_AVATARS, DOCTOR_SPECIALIZATIONS } from '../constants';
import type {
    User, Role, Consultation, Prescription, ForumPost, DoctorProfile, ResidentRecord,
    PrivateChatMessage, PatientDoctorChatMessage, ConsultationStatus, Medicine, RhwStats, BhwStats,
    AISummary, StructuredAddress, BhwNotification, PatientNotification, PharmacyStats, DoctorSpecialty
} from '../types';

// --- DATABASE STATE ---
// This object holds the entire state of our application's data.
const dbState = {
    users: [] as User[],
    consultations: [] as Consultation[],
    prescriptions: [] as Prescription[],
    medicines: [] as Medicine[],
    doctorProfiles: [] as DoctorProfile[],
    forumPosts: [] as ForumPost[],
    privateChats: {} as { [conversationId: string]: PrivateChatMessage[] },
    patientDoctorChats: {} as { [conversationId: string]: PatientDoctorChatMessage[] },
    residentRecords: [] as ResidentRecord[],
    bhwNotifications: [] as BhwNotification[],
    patientNotifications: [] as PatientNotification[],
    rhuStats: null as RhwStats | null,
    bhwStats: null as BhwStats | null,
    pharmacyStats: null as PharmacyStats | null,
};

let isSeeded = false;

// --- UTILITY FUNCTIONS ---
const generateId = () => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// --- DATA SEEDING ---
export const seedInitialData = () => {
    if (isSeeded) return;

    // 1. Medicines
    dbState.medicines = [
        { id: 'med-1', name: 'Paracetamol 500mg' },
        { id: 'med-2', name: 'Amoxicillin 500mg' },
        { id: 'med-3', name: 'Salbutamol 2mg' },
        { id: 'med-4', name: 'Loratadine 10mg' },
        { id: 'med-5', name: 'Mefenamic Acid 500mg' },
    ];

    // 2. Initial Users
    const users: User[] = [
        // Patient
        { id: 'user-patient-1', name: 'Juan Dela Cruz', email: 'patient@ebotika.ph', role: 'patient', password: 'password', contactNumber: '09123456789', address: { barangay: 'Poblacion', purok: 'Purok 1', streetAddress: '123 Main St' }, status: 'active', isVerifiedByBhw: true, avatarUrl: MOCK_AVATARS[0], hasUsedFreeConsultation: false, isPremium: false },
        // Doctor
        { id: 'user-doctor-1', name: 'Dr. Maria Santos', email: 'doctor@ebotika.ph', role: 'doctor', password: 'password', address: { barangay: 'Poblacion', purok: 'Purok 1', streetAddress: ''}, status: 'active', avatarUrl: MOCK_AVATARS[1], isOnline: true },
        // Pharmacy
        { id: 'user-pharmacy-1', name: 'Rose Pharmacy', email: 'pharmacy@ebotika.ph', role: 'pharmacy', password: 'password', address: { barangay: 'Poblacion', purok: 'Purok 1', streetAddress: ''}, status: 'active', avatarUrl: MOCK_AVATARS[2] },
        // Admin
        { id: 'user-admin-1', name: 'RHU Administrator', email: 'admin@ebotika.ph', role: 'admin', password: 'password', address: { barangay: 'Poblacion', purok: 'Purok 1', streetAddress: ''}, status: 'active', avatarUrl: MOCK_AVATARS[3] },
        // BHW
        { id: 'user-bhw-1', name: 'BHW Poblacion', email: 'bhw@ebotika.ph', role: 'bhw', password: 'password', address: { barangay: 'Poblacion', purok: 'Purok 1', streetAddress: ''}, status: 'active', avatarUrl: MOCK_AVATARS[4], assignedBarangay: 'Poblacion' },
    ];
    dbState.users = users;

    // 3. Doctor Profiles
    dbState.doctorProfiles = [
        { id: 'docprof-1', userId: 'user-doctor-1', name: 'Dr. Maria Santos', specialty: 'General Physician', avatarUrl: MOCK_AVATARS[1], availability: 'Available' },
        { id: 'docprof-2', userId: 'user-doctor-2', name: 'Dr. Jose Rizal', specialty: 'Pediatrician', avatarUrl: MOCK_AVATARS[5], availability: 'Available' },
    ];

    // 4. Resident Records (for BHW)
    dbState.residentRecords = [
        { id: 'res-1', name: 'Juan Dela Cruz', contactNumber: '09123456789', address: { barangay: 'Poblacion', purok: 'Purok 1', streetAddress: '123 Main St' }, createdAt: Date.now() },
        { id: 'res-2', name: 'Maria Clara', contactNumber: '09987654321', address: { barangay: 'Poblacion', purok: 'Purok 2', streetAddress: '456 Side St' }, createdAt: Date.now() },
    ];
    
    // 5. Mock AI Summary
    const mockAiSummary: AISummary = {
        diagnosis_suggestion: 'Common Cold',
        urgency_level: 'Low',
        recommendation: 'Rest, drink plenty of fluids, and take over-the-counter pain relievers if necessary. Consult a doctor if symptoms persist for more than a week.'
    };
    
    // 6. Consultations & Prescriptions
    dbState.consultations = [
        { id: 'consult-1', patientId: 'user-patient-1', patient: users[0], date: '2023-10-26', symptoms: ['Fever', 'Cough'], aiSummary: mockAiSummary, status: 'Completed', doctorId: 'user-doctor-1', doctor: dbState.doctorProfiles[0] }
    ];
    dbState.prescriptions = [
        { id: 'rx-1', consultationId: 'consult-1', patientId: 'user-patient-1', patient: users[0], doctorId: 'user-doctor-1', doctor: dbState.doctorProfiles[0], medicine: 'Paracetamol 500mg', dosage: '1 tablet every 6 hours', dateIssued: '2023-10-26', doctorName: 'Dr. Maria Santos', status: 'Approved' }
    ];
    
    // 7. Forum Posts
     dbState.forumPosts = [
        { id: 'post-1', authorId: 'user-doctor-1', author: users[1], timestamp: new Date().toLocaleString(), content: 'Reminder to all professionals: please update your availability status regularly.' }
    ];

    // 8. Stats
    dbState.rhuStats = { weeklyConsultations: [{ name: 'Mon', uv: 12 }, { name: 'Tue', uv: 19 }, { name: 'Wed', uv: 10 }, { name: 'Thu', uv: 25 }, { name: 'Fri', uv: 20 }, { name: 'Sat', uv: 11 }, { name: 'Sun', uv: 6 }], urgencyBreakdown: [{ name: 'Low', count: 55 }, { name: 'Medium', count: 32 }, { name: 'High', count: 12 }, { name: 'Critical', count: 4 }], topPrescribed: [{ name: 'Paracetamol', count: 45 }, { name: 'Amoxicillin', count: 28 }, { name: 'Salbutamol', count: 19 }, { name: 'Loratadine', count: 15 }, { name: 'Mefenamic Acid', count: 11 }] };
    dbState.bhwStats = { weeklyRecordsAdded: [{ name: 'Mon', uv: 5 }, { name: 'Tue', uv: 8 }, { name: 'Wed', uv: 12 }, { name: 'Thu', uv: 7 }, { name: 'Fri', uv: 15 }, { name: 'Sat', uv: 4 }, { name: 'Sun', uv: 2 }], residentDistribution: [{ name: 'Poblacion', count: 150 }, { name: 'Laguinbanua', count: 80 }, { name: 'Naisud', count: 120 }] };
    dbState.pharmacyStats = { weeklyValidations: [{ name: 'Mon', uv: 22 }, { name: 'Tue', uv: 28 }, { name: 'Wed', uv: 20 }, { name: 'Thu', uv: 35 }, { name: 'Fri', uv: 30 }, { name: 'Sat', uv: 42 }, { name: 'Sun', uv: 18 }], topMeds: [{ name: 'Paracetamol', count: 60 }, { name: 'Amoxicillin', count: 40 }, { name: 'Salbutamol', count: 25 }, { name: 'Loratadine', count: 22 }, { name: 'Mefenamic Acid', count: 18 }] };

    isSeeded = true;
};

// --- API FUNCTIONS ---
// Note: All functions return Promises to maintain the async interface expected by the UI components.

// Auth
export const signIn = async (email: string, password: string): Promise<User> => {
    const user = dbState.users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid credentials');
    if (user.status === 'banned') throw new Error('This account has been banned.');
    return Promise.resolve(user);
};

export const signOut = async (): Promise<void> => Promise.resolve();

export const signUp = async (details: { name: string, email: string, password: string, contactNumber: string, address: StructuredAddress, validIdFile: File }): Promise<User> => {
    if (dbState.users.some(u => u.email === details.email)) {
        throw new Error('Email already in use.');
    }
    const newUser: User = {
        id: generateId(),
        name: details.name,
        email: details.email,
        password: details.password,
        contactNumber: details.contactNumber,
        address: details.address,
        validIdUrl: URL.createObjectURL(details.validIdFile),
        role: 'patient',
        status: 'active',
        isVerifiedByBhw: false,
        hasUsedFreeConsultation: false,
        isPremium: false,
        avatarUrl: MOCK_AVATARS[Math.floor(Math.random() * MOCK_AVATARS.length)],
    };
    dbState.users.push(newUser);
    
    // Create BHW notification
    const bhwNotification: BhwNotification = {
        id: generateId(),
        userId: newUser.id,
        userName: newUser.name,
        validIdUrl: newUser.validIdUrl!,
        timestamp: Date.now(),
        barangay: newUser.address.barangay,
    };
    dbState.bhwNotifications.push(bhwNotification);

    return Promise.resolve(newUser);
};


// Getters
export const getUsers = async (): Promise<User[]> => Promise.resolve(dbState.users);
export const getConsultations = async (user: User): Promise<Consultation[]> => {
    if (user.role === 'patient') {
        return Promise.resolve(dbState.consultations.filter(c => c.patientId === user.id));
    }
    return Promise.resolve(dbState.consultations);
};
export const getPrescriptions = async (user: User): Promise<Prescription[]> => {
     if (user.role === 'patient') {
        return Promise.resolve(dbState.prescriptions.filter(p => p.patientId === user.id));
    }
    return Promise.resolve(dbState.prescriptions);
};
export const getForumPosts = async (): Promise<ForumPost[]> => Promise.resolve(dbState.forumPosts);
export const getDoctorProfiles = async (): Promise<DoctorProfile[]> => Promise.resolve(dbState.doctorProfiles);
export const getMedicines = async (): Promise<Medicine[]> => Promise.resolve(dbState.medicines);
export const getResidentRecords = async (user: User): Promise<ResidentRecord[]> => {
    if (user.role === 'bhw' && user.assignedBarangay) {
        return Promise.resolve(dbState.residentRecords.filter(r => r.address.barangay === user.assignedBarangay));
    }
    return Promise.resolve(dbState.residentRecords);
};
export const getBhwNotifications = async (user: User): Promise<BhwNotification[]> => {
     if (user.role === 'bhw' && user.assignedBarangay) {
        return Promise.resolve(dbState.bhwNotifications.filter(n => n.barangay === user.assignedBarangay));
    }
    return Promise.resolve(dbState.bhwNotifications);
};
export const getPatientNotifications = async (userId: string): Promise<PatientNotification[]> => Promise.resolve(dbState.patientNotifications.filter(n => n.userId === userId));
export const getPrivateChats = async (userId: string): Promise<any> => Promise.resolve(dbState.privateChats);
export const getPatientDoctorChats = async (userId: string): Promise<any> => Promise.resolve(dbState.patientDoctorChats);
export const getRhuStats = async (): Promise<RhwStats | null> => Promise.resolve(dbState.rhuStats);
export const getBhwStats = async (user: User): Promise<BhwStats | null> => Promise.resolve(dbState.bhwStats);
export const getPharmacyStats = async (): Promise<PharmacyStats | null> => Promise.resolve(dbState.pharmacyStats);


// Setters / Updaters
export const addConsultation = async (consultation: Omit<Consultation, 'id' | 'patient' | 'doctor' | 'status'>): Promise<void> => {
    const patient = dbState.users.find(u => u.id === consultation.patientId);
    if (!patient) throw new Error("Patient not found");

    if (!patient.isPremium && patient.hasUsedFreeConsultation) {
        throw new Error("Free consultation already used.");
    }

    patient.hasUsedFreeConsultation = true;

    const newConsultation: Consultation = {
        id: generateId(),
        ...consultation,
        patient: patient,
        date: new Date().toISOString().split('T')[0],
        status: 'Pending Doctor',
    };
    dbState.consultations.push(newConsultation);

    const newPrescription: Prescription = {
        id: generateId(),
        consultationId: newConsultation.id,
        patientId: consultation.patientId,
        patient: patient,
        aiSummary: consultation.aiSummary,
        dateIssued: new Date().toISOString().split('T')[0],
        doctorName: 'Pending Review',
        status: 'Pending',
    };
    dbState.prescriptions.push(newPrescription);
    return Promise.resolve();
};

export const updateUserProfile = async (userId: string, updatedDetails: Partial<User>): Promise<void> => {
    dbState.users = dbState.users.map(u => u.id === userId ? { ...u, ...updatedDetails } : u);
    return Promise.resolve();
};

export const createProfessionalUser = async (newUser: Omit<User, 'id' | 'status'>): Promise<void> => {
    const user: User = {
        ...newUser,
        id: generateId(),
        status: 'active',
        avatarUrl: MOCK_AVATARS[Math.floor(Math.random() * MOCK_AVATARS.length)]
    };
    dbState.users.push(user);
    if (user.role === 'doctor') {
        const newProfile: DoctorProfile = {
            id: generateId(),
            userId: user.id,
            name: user.name,
            specialty: 'General Physician',
            avatarUrl: user.avatarUrl || '',
            availability: 'Available',
        };
        dbState.doctorProfiles.push(newProfile);
    }
    return Promise.resolve();
};

export const updateProfessionalProfile = async (userId: string, userUpdates: Partial<User>, profileUpdates: Partial<DoctorProfile>): Promise<void> => {
    dbState.users = dbState.users.map(u => u.id === userId ? { ...u, ...userUpdates } : u);
    dbState.doctorProfiles = dbState.doctorProfiles.map(p => p.userId === userId ? { ...p, ...profileUpdates } : p);
    return Promise.resolve();
};

export const addResidentRecord = async (details: Omit<ResidentRecord, 'id' | 'createdAt'>): Promise<void> => {
    const newRecord: ResidentRecord = {
        ...details,
        id: generateId(),
        createdAt: Date.now()
    };
    dbState.residentRecords.push(newRecord);
    return Promise.resolve();
};
export const deleteResidentRecord = async (recordId: string): Promise<void> => {
    dbState.residentRecords = dbState.residentRecords.filter(r => r.id !== recordId);
    return Promise.resolve();
};
export const updateResidentRecord = async (recordId: string, details: Partial<Omit<ResidentRecord, 'id' | 'createdAt'>>): Promise<void> => {
    dbState.residentRecords = dbState.residentRecords.map(r => r.id === recordId ? { ...r, ...details } : r);
    return Promise.resolve();
};

export const updateUserStatus = async (userId: string, status: 'active' | 'banned'): Promise<void> => {
    dbState.users = dbState.users.map(u => u.id === userId ? { ...u, status } : u);
    return Promise.resolve();
};
export const deleteUserAccount = async (userId: string): Promise<void> => {
    dbState.users = dbState.users.filter(u => u.id !== userId);
    return Promise.resolve();
};
export const addReportToUser = async (userId: string, report: any): Promise<void> => {
    dbState.users = dbState.users.map(u => {
        if (u.id === userId) {
            return { ...u, reports: [...(u.reports || []), report] };
        }
        return u;
    });
    return Promise.resolve();
};

export const updateConsultationStatus = async (consultationId: string, status: ConsultationStatus, doctorId: string): Promise<void> => {
    dbState.consultations = dbState.consultations.map(c => c.id === consultationId ? { ...c, status, doctorId } : c);
    return Promise.resolve();
};

export const addPrescription = async (prescription: Omit<Prescription, 'id' | 'patient' | 'doctorName'>): Promise<void> => {
    const patient = dbState.users.find(u => u.id === prescription.patientId);
    const doctor = dbState.users.find(u => u.id === prescription.doctorId);
    if (!patient || !doctor) return;
    const newRx: Prescription = {
        ...prescription,
        id: generateId(),
        patient: patient,
        doctorName: doctor.name
    };
    dbState.prescriptions.push(newRx);
    return Promise.resolve();
};

export const updatePrescription = async (prescriptionId: string, details: Partial<Omit<Prescription, 'id'>>): Promise<void> => {
    dbState.prescriptions = dbState.prescriptions.map(p => p.id === prescriptionId ? { ...p, ...details } : p);
    return Promise.resolve();
};

export const addForumPost = async (userId: string, content: string): Promise<void> => {
    const author = dbState.users.find(u => u.id === userId);
    if (!author) return;
    const newPost: ForumPost = {
        id: generateId(),
        authorId: userId,
        author: author,
        timestamp: new Date().toLocaleString(),
        content: content
    };
    dbState.forumPosts.unshift(newPost); // Add to the top
    return Promise.resolve();
};

export const sendPrivateMessage = async (senderId: string, recipientId: string, content: string): Promise<void> => {
    const conversationId = [senderId, recipientId].sort().join('-');
    if (!dbState.privateChats[conversationId]) {
        dbState.privateChats[conversationId] = [];
    }
    const newMessage: PrivateChatMessage = {
        id: generateId(),
        senderId,
        recipientId,
        content,
        timestamp: new Date().toLocaleString()
    };
    dbState.privateChats[conversationId].push(newMessage);
    return Promise.resolve();
};

export const sendPatientDoctorMessage = async (patientId: string, doctorId: string, content: string): Promise<void> => {
    const conversationId = [patientId, doctorId].sort().join('-');
    if (!dbState.patientDoctorChats[conversationId]) {
        dbState.patientDoctorChats[conversationId] = [];
    }
    const newMessage: PatientDoctorChatMessage = {
        id: generateId(),
        sender: 'patient',
        content,
        timestamp: new Date().toLocaleString(),
        readByDoctor: false,
        readByPatient: true
    };
    dbState.patientDoctorChats[conversationId].push(newMessage);
    return Promise.resolve();
};

export const sendDoctorPatientMessage = async (doctorId: string, patientId: string, content: string): Promise<void> => {
    const conversationId = [patientId, doctorId].sort().join('-');
    if (!dbState.patientDoctorChats[conversationId]) {
        dbState.patientDoctorChats[conversationId] = [];
    }
    const newMessage: PatientDoctorChatMessage = {
        id: generateId(),
        sender: 'doctor',
        content,
        timestamp: new Date().toLocaleString(),
        readByDoctor: true,
        readByPatient: false
    };
    dbState.patientDoctorChats[conversationId].push(newMessage);
    return Promise.resolve();
};

export const markDoctorChatAsRead = async (conversationId: string): Promise<void> => {
    if (dbState.patientDoctorChats[conversationId]) {
        dbState.patientDoctorChats[conversationId].forEach(msg => {
            if(msg.sender === 'patient') msg.readByDoctor = true;
        });
    }
    return Promise.resolve();
};

export const updateDoctorAvailability = async (doctorId: string, availability: 'Available' | 'On Leave'): Promise<void> => {
    dbState.doctorProfiles = dbState.doctorProfiles.map(p => p.id === doctorId ? { ...p, availability } : p);
    return Promise.resolve();
};

export const upgradeUserSubscription = async (userId: string, plan: 'individual' | 'family'): Promise<void> => {
    dbState.users = dbState.users.map(u => {
        if (u.id === userId) {
            return {
                ...u,
                isPremium: true,
                subscriptionType: plan,
                familyId: plan === 'family' ? `fam-${userId}` : u.familyId,
                monthlyDirectChatCredits: plan === 'individual' ? 2 : u.monthlyDirectChatCredits,
                chatAccessPasses: {},
            };
        }
        return u;
    });
    return Promise.resolve();
};

export const grantPremiumSubscription = async (userId: string): Promise<void> => {
    return upgradeUserSubscription(userId, 'individual');
};

export const approveIdVerification = async (notificationId: string): Promise<void> => {
    const notif = dbState.bhwNotifications.find(n => n.id === notificationId);
    if (!notif) return;

    dbState.users = dbState.users.map(u => u.id === notif.userId ? { ...u, isVerifiedByBhw: true, idRejectionReason: null } : u);
    dbState.bhwNotifications = dbState.bhwNotifications.filter(n => n.id !== notificationId);
    
    dbState.patientNotifications.push({
        id: generateId(),
        userId: notif.userId,
        message: 'notification_id_verified',
        isRead: false,
        timestamp: Date.now()
    });
    return Promise.resolve();
};

export const rejectIdVerification = async (notificationId: string, reason: string): Promise<void> => {
    const notif = dbState.bhwNotifications.find(n => n.id === notificationId);
    if (!notif) return;

    dbState.users = dbState.users.map(u => u.id === notif.userId ? { ...u, isVerifiedByBhw: false, idRejectionReason: reason } : u);
    dbState.bhwNotifications = dbState.bhwNotifications.filter(n => n.id !== notificationId);
    
     dbState.patientNotifications.push({
        id: generateId(),
        userId: notif.userId,
        message: `notification_id_rejected|${reason}`,
        isRead: false,
        timestamp: Date.now()
    });
    return Promise.resolve();
};

export const markPatientNotificationAsRead = async (notificationId: string): Promise<void> => {
    dbState.patientNotifications = dbState.patientNotifications.filter(n => n.id !== notificationId);
    return Promise.resolve();
};

export const updateValidId = async (userId: string, file: File): Promise<void> => {
    const user = dbState.users.find(u => u.id === userId);
    if (!user) return;
    
    user.validIdUrl = URL.createObjectURL(file);
    user.isVerifiedByBhw = false;
    user.idRejectionReason = null;
    
    dbState.bhwNotifications.push({
        id: generateId(),
        userId: user.id,
        userName: user.name,
        validIdUrl: user.validIdUrl,
        timestamp: Date.now(),
        barangay: user.address.barangay,
    });
    return Promise.resolve();
};

export const validateAndRemitPrescription = async (prescriptionId: string): Promise<{ success: boolean; message: string; }> => {
    const pres = dbState.prescriptions.find(p => p.id === prescriptionId);
    if (!pres) {
        return Promise.resolve({ success: false, message: "Prescription not found." });
    }
    if (pres.status === 'Remitted') {
        return Promise.resolve({ success: false, message: "This prescription has already been remitted." });
    }
    if (pres.status !== 'Approved') {
        return Promise.resolve({ success: false, message: `This prescription is not approved. Status: ${pres.status}` });
    }
    pres.status = 'Remitted';
    return Promise.resolve({ success: true, message: "Prescription validated and marked as remitted." });
};
