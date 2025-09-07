/**
 * Firebase Service Mock
 * 
 * This file mocks the interactions with Firebase services (Auth, Firestore, Storage).
 * It centralizes all application data, simulates a normalized database structure,
 * and provides mock real-time updates to the UI.
 */
import type { User, Role, Consultation, Prescription, ForumPost, DoctorProfile, ResidentRecord, PrivateChatMessage, PatientDoctorChatMessage, ConsultationStatus, Medicine, PharmacyStats, RhwStats, BhwStats, AISummary, StructuredAddress, BhwNotification, PatientNotification } from '../types';

// --- MOCK DATABASE (NORMALIZED) ---
let MOCK_DB = {
    users: [
        // --- PATIENT ACCOUNTS (RESET TO DEFAULT) ---
        { id: 'p1', name: 'Juan dela Cruz', email: 'patient@ebotika.ph', role: 'patient', contactNumber: '09123456789', address: { barangay: 'Poblacion', purok: 'Purok 3', streetAddress: '123 Rizal Ave' }, avatarUrl: 'https://picsum.photos/id/237/200/200', status: 'active', validIdUrl: 'https://placehold.co/600x400.png?text=Valid+ID', weeklyChatCredits: 1, lastCreditReset: Date.now(), chatAccessPasses: {}, isVerifiedByBhw: true },
        { id: 'p2', name: 'Anna Reyes', email: 'anna@ebotika.ph', role: 'patient', contactNumber: '09987654321', address: { barangay: 'Laguinbanua', purok: 'Purok 1', streetAddress: '456 Bonifacio St' }, avatarUrl: 'https://picsum.photos/id/338/200/200', status: 'active', validIdUrl: 'https://placehold.co/600x400.png?text=Valid+ID', weeklyChatCredits: 1, lastCreditReset: Date.now(), chatAccessPasses: {}, isVerifiedByBhw: true },
        { id: 'p3', name: 'Pedro Penduko', email: 'pedro@ebotika.ph', role: 'patient', contactNumber: '09178765432', address: { barangay: 'Poblacion', purok: 'Purok 5', streetAddress: '789 Mabini Blvd' }, avatarUrl: 'https://picsum.photos/id/433/200/200', status: 'active', validIdUrl: 'https://placehold.co/600x400.png?text=Valid+ID', weeklyChatCredits: 1, lastCreditReset: Date.now(), chatAccessPasses: {}, isVerifiedByBhw: true },
        
        // --- PROFESSIONAL & SYSTEM ACCOUNTS (SETUP DATA) ---
        { id: 'd1', name: 'Dr. Maria Dela Cruz', email: 'doctor@ebotika.ph', role: 'doctor', avatarUrl: 'https://picsum.photos/id/1027/200/200', isOnline: true, status: 'active', address: { barangay: 'Poblacion', purok: '', streetAddress: '' } },
        { id: 'd2', name: 'Dr. Jose Rizal', email: 'pedia@ebotika.ph', role: 'doctor', avatarUrl: 'https://picsum.photos/id/1025/200/200', isOnline: true, status: 'active', address: { barangay: 'Poblacion', purok: '', streetAddress: '' } },
        { id: 'd3', name: 'Dr. Gabriela Silang', email: 'cardio@ebotika.ph', role: 'doctor', avatarUrl: 'https://picsum.photos/id/1011/200/200', isOnline: false, status: 'active', address: { barangay: 'Poblacion', purok: '', streetAddress: '' } },
        { id: 'ph1', name: 'Botika Pharmacist', email: 'pharmacy@ebotika.ph', role: 'pharmacy', avatarUrl: 'https://picsum.photos/id/10/200/200', isOnline: false, status: 'active', address: { barangay: 'Poblacion', purok: '', streetAddress: '' } },
        { id: 'a1', name: 'RHU Admin', email: 'admin@ebotika.ph', role: 'admin', avatarUrl: 'https://picsum.photos/id/20/200/200', isOnline: true, status: 'active', address: { barangay: 'Poblacion', purok: '', streetAddress: '' } },
        { id: 'bhw1', name: 'BHW Maria Clara', email: 'bhw@ebotika.ph', role: 'bhw', avatarUrl: 'https://picsum.photos/id/30/200/200', isOnline: true, status: 'active', address: { barangay: 'Poblacion', purok: '', streetAddress: '' }, assignedBarangay: 'Poblacion' },
    ] as User[],
    consultations: [] as Omit<Consultation, 'patient' | 'doctor'>[],
    prescriptions: [] as Omit<Prescription, 'patient' | 'doctor' | 'doctorName'>[],
    medicines: [
        { id: 'med-1', name: 'Paracetamol' }, { id: 'med-2', name: 'Amoxicillin' }, { id: 'med-3', name: 'Salbutamol' }, { id: 'med-4', name: 'Loratadine' }, { id: 'med-5', name: 'Mefenamic Acid' }, { id: 'med-6', name: 'Cetirizine' },
    ] as Medicine[],
    doctorProfiles: [
        { id: 'doc-prof-1', userId: 'd1', name: 'Dr. Maria Dela Cruz', specialty: 'specialty_gp', avatarUrl: 'https://picsum.photos/id/1027/200/200', availability: 'Available' },
        { id: 'doc-prof-2', userId: 'd2', name: 'Dr. Jose Rizal', specialty: 'specialty_pedia', avatarUrl: 'https://picsum.photos/id/1025/200/200', availability: 'Available' },
        { id: 'doc-prof-3', userId: 'd3', name: 'Dr. Gabriela Silang', specialty: 'specialty_cardio', avatarUrl: 'https://picsum.photos/id/1011/200/200', availability: 'On Leave' },
    ] as DoctorProfile[],
    forumPosts: [] as Omit<ForumPost, 'author'>[],
    residentRecords: [
         { id: 'res-1', name: 'Juan dela Cruz', contactNumber: '09123456789', address: { barangay: 'Poblacion', purok: 'Purok 3', streetAddress: '123 Rizal Ave' }, createdAt: Date.now() - 86400000 * 5 },
         { id: 'res-2', name: 'Anna Reyes', contactNumber: '09987654321', address: { barangay: 'Laguinbanua', purok: 'Purok 1', streetAddress: '456 Bonifacio St' }, createdAt: Date.now() - 86400000 * 3 },
         { id: 'res-3', name: 'Pedro Penduko', contactNumber: '09178765432', address: { barangay: 'Poblacion', purok: 'Purok 5', streetAddress: '789 Mabini Blvd' }, createdAt: Date.now() - 86400000 * 2 },
    ] as ResidentRecord[],
    bhwNotifications: [] as BhwNotification[],
    patientNotifications: [] as PatientNotification[],
    privateChats: {} as Record<string, PrivateChatMessage[]>,
    patientDoctorChats: {} as Record<string, PatientDoctorChatMessage[]>,
};

// --- MOCK REAL-TIME LISTENERS (PUB/SUB) ---
const setters = {
    users: new Set<Function>(),
    consultations: new Set<Function>(),
    prescriptions: new Set<Function>(),
    medicines: new Set<Function>(),
    forumPosts: new Set<Function>(),
    doctorProfiles: new Set<Function>(),
    residentRecords: new Set<Function>(),
    privateChats: new Set<Function>(),
    patientDoctorChats: new Set<Function>(),
    pharmacyStats: new Set<Function>(),
    rhuStats: new Set<Function>(),
    bhwStats: new Set<Function>(),
    bhwNotifications: new Set<Function>(),
    patientNotifications: new Set<Function>(),
};

// --- DATA HYDRATION & NOTIFICATION ---
const findUser = (id: string) => MOCK_DB.users.find(u => u.id === id)!;
const findDoctorProfile = (userId: string) => MOCK_DB.doctorProfiles.find(d => d.userId === userId);

const hydrateConsultation = (c: Omit<Consultation, 'patient'|'doctor'>): Consultation => ({
    ...c,
    patient: findUser(c.patientId),
    doctor: c.doctorId ? findDoctorProfile(c.doctorId) : undefined,
});

const hydratePrescription = (p: Omit<Prescription, 'patient'|'doctor'|'doctorName'>): Prescription => {
    const doctorProfile = p.doctorId ? findDoctorProfile(p.doctorId) : undefined;
    return {
        ...p,
        patient: findUser(p.patientId),
        doctor: doctorProfile,
        doctorName: doctorProfile?.name || "Pending Review",
    }
};

const hydrateForumPost = (p: Omit<ForumPost, 'author'>): ForumPost => ({
    ...p,
    author: findUser(p.authorId),
});


const notify = (key: keyof typeof setters, data: any) => {
    setters[key].forEach(setter => setter(data));
};

const notifyAllData = (currentUser?: User) => {
    notify('users', MOCK_DB.users);
    const hydratedConsultations = MOCK_DB.consultations.map(hydrateConsultation);
    const filteredConsultations = currentUser?.role === 'patient' ? hydratedConsultations.filter(c => c.patientId === currentUser.id) : hydratedConsultations;
    notify('consultations', filteredConsultations);
    
    const hydratedPrescriptions = MOCK_DB.prescriptions.map(hydratePrescription);
    const filteredPrescriptions = currentUser?.role === 'patient' ? hydratedPrescriptions.filter(p => p.patientId === currentUser.id) : hydratedPrescriptions;
    notify('prescriptions', filteredPrescriptions);
    
    notify('medicines', MOCK_DB.medicines);
    notify('forumPosts', MOCK_DB.forumPosts.map(hydrateForumPost));
    notify('doctorProfiles', MOCK_DB.doctorProfiles);
    
    const filteredResidentRecords = currentUser?.role === 'bhw' && currentUser.assignedBarangay 
        ? MOCK_DB.residentRecords.filter(r => r.address.barangay === currentUser.assignedBarangay) 
        : MOCK_DB.residentRecords;
    notify('residentRecords', filteredResidentRecords);
    
    const filteredBhwNotifications = currentUser?.role === 'bhw' && currentUser.assignedBarangay
        ? MOCK_DB.bhwNotifications.filter(n => n.barangay === currentUser.assignedBarangay)
        : MOCK_DB.bhwNotifications;
    notify('bhwNotifications', filteredBhwNotifications);
    
    if (currentUser?.id) {
        const filteredPatientNotifications = MOCK_DB.patientNotifications.filter(n => n.userId === currentUser.id);
        notify('patientNotifications', filteredPatientNotifications);
    }


    // Analytics
    notify('pharmacyStats', calculatePharmacyStats());
    notify('rhuStats', calculateRhuStats());
    notify('bhwStats', calculateBhwStats(currentUser));
};

const createListener = <T>(key: keyof typeof setters, setter: React.Dispatch<React.SetStateAction<T>>, initialData: T) => {
    setters[key].add(setter);
    setter(initialData); // Initial load
    return () => { setters[key].delete(setter); };
};

// --- CHAT CREDIT LOGIC ---
const _checkAndResetWeeklyCredits = (user: User): User => {
    if (user.role !== 'patient' || user.isPremium) {
        return user;
    }
    const now = Date.now();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    if (!user.lastCreditReset || (now - user.lastCreditReset > oneWeek)) {
        return { ...user, weeklyChatCredits: 1, lastCreditReset: now };
    }
    return user;
};


// --- MOCK AUTHENTICATION ---
let MOCK_AUTH_USERS: { [email: string]: { uid: string, password: string } } = {
    'patient@ebotika.ph': { uid: 'p1', password: 'password' },
    'anna@ebotika.ph': { uid: 'p2', password: 'password' },
    'pedro@ebotika.ph': { uid: 'p3', password: 'password' },
    'doctor@ebotika.ph': { uid: 'd1', password: 'password' },
    'pedia@ebotika.ph': { uid: 'd2', password: 'password' },
    'cardio@ebotika.ph': { uid: 'd3', password: 'password' },
    'pharmacy@ebotika.ph': { uid: 'ph1', password: 'password' },
    'admin@ebotika.ph': { uid: 'a1', password: 'password' },
    'bhw@ebotika.ph': { uid: 'bhw1', password: 'password' },
};
let currentAuthListener: ((user: { uid: string } | null) => void) | null = null;
let currentFirebaseUser: { uid: string } | null = null;

const notifyAuthListener = () => {
    if (currentAuthListener) {
        currentAuthListener(currentFirebaseUser);
    }
};

export const onAuthChange = (callback: (user: { uid: string } | null) => void) => {
    currentAuthListener = callback;
    setTimeout(() => notifyAuthListener(), 0); // Simulate async
    return () => { currentAuthListener = null; };
};

export const signIn = async (email: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            const authUser = MOCK_AUTH_USERS[email];
            if (authUser && authUser.password === password) {
                const userProfile = await getUserProfile(authUser.uid);
                if (userProfile?.status === 'banned') {
                    reject(new Error('This account has been banned.'));
                    return;
                }
                currentFirebaseUser = { uid: authUser.uid };
                notifyAuthListener();
                resolve();
            } else {
                reject(new Error('Invalid credentials'));
            }
        }, 1000);
    });
};

export const signUp = async (details: { name: string, email: string, password: string, contactNumber: string, address: StructuredAddress, validIdFile: File }): Promise<void> => {
     return new Promise((resolve, reject) => {
        setTimeout(async () => {
            if (MOCK_AUTH_USERS[details.email]) {
                reject(new Error('Email already in use.'));
                return;
            }

            const isVerifiedResident = MOCK_DB.residentRecords.some(record =>
                record.name.trim().toLowerCase() === details.name.trim().toLowerCase() &&
                record.address.barangay.toLowerCase() === details.address.barangay.toLowerCase() &&
                record.address.purok.toLowerCase() === details.address.purok.toLowerCase()
            );

            if (!isVerifiedResident) {
                reject(new Error('Registration failed. Your name and address do not match the resident master list. Please contact your Barangay Health Worker.'));
                return;
            }
            
            const validIdUrl = await uploadFile(details.validIdFile, 'valid-ids');
            const newUid = `user-${Date.now()}`;
            MOCK_AUTH_USERS[details.email] = { uid: newUid, password: details.password };
            
            const newUserProfile: User = {
                id: newUid,
                name: details.name,
                email: details.email,
                role: 'patient',
                contactNumber: details.contactNumber,
                address: details.address,
                validIdUrl,
                status: 'active',
                isPremium: false,
                weeklyChatCredits: 1,
                lastCreditReset: Date.now(),
                chatAccessPasses: {},
                isVerifiedByBhw: false, // BHW must verify ID
            };
            MOCK_DB.users = [...MOCK_DB.users, newUserProfile];
            
            // Create a notification for the BHW
            const notification: BhwNotification = {
                id: `notif-${Date.now()}`,
                userId: newUid,
                userName: details.name,
                validIdUrl,
                timestamp: Date.now(),
                barangay: details.address.barangay,
            };
            MOCK_DB.bhwNotifications = [notification, ...MOCK_DB.bhwNotifications];

            notifyAllData();

            currentFirebaseUser = { uid: newUid };
            notifyAuthListener();
            resolve();
        }, 1500);
     });
};

export const signOut = async (): Promise<void> => {
    currentFirebaseUser = null;
    notifyAuthListener();
};

// --- MOCK STORAGE ---
export const uploadFile = (file: File, path: string): Promise<string> => {
    return new Promise(resolve => setTimeout(() => resolve(URL.createObjectURL(file)), 500));
};

// --- DYNAMIC ANALYTICS ---
const calculatePharmacyStats = (): PharmacyStats => {
    const remitted = MOCK_DB.prescriptions.filter(p => p.status === 'Remitted');
    const topMeds = remitted.reduce((acc, p) => {
        if(p.medicine) acc[p.medicine] = (acc[p.medicine] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    return {
        weeklyValidations: [{ name: 'Mon', uv: 22 }, { name: 'Tue', uv: 30 }, { name: 'Wed', uv: 25 }, { name: 'Thu', uv: 40 }, { name: 'Fri', uv: 35 }, { name: 'Sat', uv: 15 }, { name: 'Sun', uv: 10 }], // Mocked for now
        topMeds: Object.entries(topMeds).sort((a,b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => ({ name, count }))
    };
};
const calculateRhuStats = (): RhwStats => {
    const urgencyCounts = MOCK_DB.consultations.reduce((acc, c) => {
        const urgency = c.aiSummary?.urgency_level || 'Low';
        acc[urgency] = (acc[urgency] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const topPrescribed = MOCK_DB.prescriptions.reduce((acc, p) => {
        if(p.medicine) acc[p.medicine] = (acc[p.medicine] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return {
        weeklyConsultations: [{name: 'Mon', uv: 10}, {name: 'Tue', uv: 15}, {name: 'Wed', uv: 8}, {name: 'Thu', uv: 22}, {name: 'Fri', uv: 18}, {name: 'Sat', uv: 9}, {name: 'Sun', uv: 4}],
        urgencyBreakdown: Object.entries(urgencyCounts).map(([name, count]) => ({ name, count })),
        topPrescribed: Object.entries(topPrescribed).sort((a,b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => ({ name, count }))
    };
};
const calculateBhwStats = (currentUser: User | null): BhwStats => {
    const recordsToAnalyze = currentUser?.role === 'bhw' && currentUser.assignedBarangay 
        ? MOCK_DB.residentRecords.filter(r => r.address.barangay === currentUser.assignedBarangay)
        : MOCK_DB.residentRecords;
        
    const distribution = recordsToAnalyze.reduce((acc, r) => {
        const brgy = r.address.barangay || 'Unknown';
        acc[brgy] = (acc[brgy] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    return {
        weeklyRecordsAdded: [{ name: 'Mon', uv: 5 }, { name: 'Tue', uv: 8 }, { name: 'Wed', uv: 12 }, { name: 'Thu', uv: 7 }, { name: 'Fri', uv: 15 }, { name: 'Sat', uv: 4 }, { name: 'Sun', uv: 2 }],
        residentDistribution: Object.entries(distribution).map(([name, count]) => ({ name, count })),
    };
};

// --- READ OPERATIONS (LISTENERS) ---
export const getUserProfile = async (uid: string): Promise<User | null> => {
    const user = MOCK_DB.users.find(u => u.id === uid);
    if (user) {
        const updatedUser = _checkAndResetWeeklyCredits(user);
        if (JSON.stringify(user) !== JSON.stringify(updatedUser)) {
            // Persist the change
            MOCK_DB.users = MOCK_DB.users.map(u => u.id === uid ? updatedUser : u);
        }
        return updatedUser;
    }
    return null;
};
export const getUsers = async (setter: React.Dispatch<React.SetStateAction<User[]>>) => createListener('users', setter, MOCK_DB.users);
export const getMedicines = async (setter: React.Dispatch<React.SetStateAction<Medicine[]>>) => createListener('medicines', setter, MOCK_DB.medicines);
export const getDoctorProfiles = async (setter: React.Dispatch<React.SetStateAction<DoctorProfile[]>>) => createListener('doctorProfiles', setter, MOCK_DB.doctorProfiles);
export const getPrivateChats = async (userId: string, setter: React.Dispatch<React.SetStateAction<any>>) => createListener('privateChats', setter, MOCK_DB.privateChats);
export const getPatientDoctorChats = async (userId: string, setter: React.Dispatch<React.SetStateAction<any>>) => createListener('patientDoctorChats', setter, MOCK_DB.patientDoctorChats);
export const getPharmacyStats = async (setter: React.Dispatch<React.SetStateAction<any>>) => createListener('pharmacyStats', setter, calculatePharmacyStats());
export const getRhuStats = async (setter: React.Dispatch<React.SetStateAction<any>>) => createListener('rhuStats', setter, calculateRhuStats());

export const getResidentRecords = async (currentUser: User, setter: React.Dispatch<React.SetStateAction<ResidentRecord[]>>) => {
    const filtered = currentUser.role === 'bhw' && currentUser.assignedBarangay 
        ? MOCK_DB.residentRecords.filter(r => r.address.barangay === currentUser.assignedBarangay) 
        : MOCK_DB.residentRecords;
    return createListener('residentRecords', setter, filtered);
};
export const getBhwNotifications = async (currentUser: User, setter: React.Dispatch<React.SetStateAction<BhwNotification[]>>) => {
    const filtered = currentUser.role === 'bhw' && currentUser.assignedBarangay
        ? MOCK_DB.bhwNotifications.filter(n => n.barangay === currentUser.assignedBarangay)
        : MOCK_DB.bhwNotifications;
    return createListener('bhwNotifications', setter, filtered);
};
export const getPatientNotifications = async (userId: string, setter: React.Dispatch<React.SetStateAction<PatientNotification[]>>) => {
    const filtered = MOCK_DB.patientNotifications.filter(n => n.userId === userId);
    return createListener('patientNotifications', setter, filtered);
};

export const getBhwStats = async (currentUser: User, setter: React.Dispatch<React.SetStateAction<any>>) => createListener('bhwStats', setter, calculateBhwStats(currentUser));

export const getConsultations = async (currentUser: User, setter: React.Dispatch<React.SetStateAction<Consultation[]>>) => {
    const hydrated = MOCK_DB.consultations.map(hydrateConsultation);
    const filtered = currentUser.role === 'patient' ? hydrated.filter(c => c.patientId === currentUser.id) : hydrated;
    return createListener('consultations', setter, filtered);
};

export const getPrescriptions = async (currentUser: User, setter: React.Dispatch<React.SetStateAction<Prescription[]>>) => {
    const hydrated = MOCK_DB.prescriptions.map(hydratePrescription);
    const filtered = currentUser.role === 'patient' ? hydrated.filter(p => p.patientId === currentUser.id) : hydrated;
    return createListener('prescriptions', setter, filtered);
};

export const getForumPosts = async (setter: React.Dispatch<React.SetStateAction<ForumPost[]>>) => {
    const hydrated = MOCK_DB.forumPosts.map(hydrateForumPost);
    return createListener('forumPosts', setter, hydrated);
};

// --- WRITE OPERATIONS ---

/**
 * Selects an available doctor for a new consultation based on specialty.
 * Priority: 1. Available Specialist, 2. Available GP, 3. Any Available Doctor.
 */
const selectDoctorForConsultation = (aiSummary: AISummary): string | null => {
    const availableDoctors = MOCK_DB.doctorProfiles.filter(d => d.availability === 'Available');
    if (availableDoctors.length === 0) return null;

    const diagnosisText = aiSummary.diagnosis_suggestion.toLowerCase();
    
    // 1. Prioritize specialists
    let specialist: DoctorProfile | undefined;
    if (diagnosisText.includes('pedia') || diagnosisText.includes('child')) {
        specialist = availableDoctors.find(d => d.specialty === 'specialty_pedia');
    } else if (diagnosisText.includes('cardio') || diagnosisText.includes('heart')) {
        specialist = availableDoctors.find(d => d.specialty === 'specialty_cardio');
    }
    if (specialist) return specialist.userId;

    // 2. Fallback to General Physician
    const generalPhysician = availableDoctors.find(d => d.specialty === 'specialty_gp');
    if (generalPhysician) return generalPhysician.userId;

    // 3. Fallback to any available doctor
    return availableDoctors[0].userId;
};

export const updateUserProfile = async (userId: string, updatedDetails: Partial<User>) => {
    MOCK_DB.users = MOCK_DB.users.map(u => u.id === userId ? { ...u, ...updatedDetails } : u);
    notifyAllData();
};
export const updateUserStatus = (userId: string, status: 'active' | 'banned') => {
    MOCK_DB.users = MOCK_DB.users.map(u => u.id === userId ? { ...u, status } : u);
    notifyAllData();
};
export const deleteUserAccount = (userId: string) => {
    const user = findUser(userId);
    if (user) {
        delete MOCK_AUTH_USERS[user.email];
        MOCK_DB.users = MOCK_DB.users.filter(u => u.id !== userId);
        notifyAllData();
    }
};
export const addUserReport = (userId: string, report: any) => {
    MOCK_DB.users = MOCK_DB.users.map(u => u.id === userId ? { ...u, reports: [...(u.reports || []), report] } : u);
    notifyAllData();
};
export const createProfessionalUser = (newUser: Omit<User, 'id' | 'status'>) => {
    const userWithId: User = { ...newUser, id: `${newUser.role}-${Date.now()}`, status: 'active', address: { barangay: 'Poblacion', purok: '', streetAddress: '' } };
    MOCK_DB.users.push(userWithId);
    MOCK_AUTH_USERS[newUser.email] = { uid: userWithId.id, password: newUser.password! };
    notifyAllData();
};
export const addResident = (details: Omit<ResidentRecord, 'id' | 'createdAt'>) => {
    const newRecord: ResidentRecord = { id: `res-${Date.now()}`, createdAt: Date.now(), ...details };
    MOCK_DB.residentRecords = [newRecord, ...MOCK_DB.residentRecords];
    notifyAllData();
};
export const deleteResident = (recordId: string) => {
    MOCK_DB.residentRecords = MOCK_DB.residentRecords.filter(r => r.id !== recordId);
    notifyAllData();
};

export const updateResidentRecord = (recordId: string, details: Partial<Omit<ResidentRecord, 'id' | 'createdAt'>>) => {
    MOCK_DB.residentRecords = MOCK_DB.residentRecords.map(r => 
        r.id === recordId ? { ...r, ...details } as ResidentRecord : r
    );
    notifyAllData();
};

export const approveIdVerification = (notificationId: string) => {
    const notification = MOCK_DB.bhwNotifications.find(n => n.id === notificationId);
    if (notification) {
        MOCK_DB.users = MOCK_DB.users.map(u => u.id === notification.userId ? { ...u, isVerifiedByBhw: true, idRejectionReason: null } : u);
        const newPatientNotification: PatientNotification = {
            id: `pnotif-${Date.now()}`,
            userId: notification.userId,
            message: 'notification_id_verified',
            isRead: false,
            timestamp: Date.now(),
        };
        MOCK_DB.patientNotifications.push(newPatientNotification);
        MOCK_DB.bhwNotifications = MOCK_DB.bhwNotifications.filter(n => n.id !== notificationId);
        notifyAllData(findUser(notification.userId));
    }
};

export const rejectIdVerification = (notificationId: string, reason: string) => {
    const notification = MOCK_DB.bhwNotifications.find(n => n.id === notificationId);
    if (notification) {
        MOCK_DB.users = MOCK_DB.users.map(u => u.id === notification.userId ? { ...u, isVerifiedByBhw: false, idRejectionReason: reason } : u);
        const newPatientNotification: PatientNotification = {
            id: `pnotif-${Date.now()}`,
            userId: notification.userId,
            message: `notification_id_rejected|${reason}`,
            isRead: false,
            timestamp: Date.now(),
        };
        MOCK_DB.patientNotifications.push(newPatientNotification);
        MOCK_DB.bhwNotifications = MOCK_DB.bhwNotifications.filter(n => n.id !== notificationId);
        notifyAllData(findUser(notification.userId));
    }
};

export const markPatientNotificationAsRead = (notificationId: string) => {
    MOCK_DB.patientNotifications = MOCK_DB.patientNotifications.map(n => n.id === notificationId ? { ...n, isRead: true } : n);
    notify('patientNotifications', MOCK_DB.patientNotifications.filter(n => n.userId === currentFirebaseUser?.uid));
};

export const updateValidId = async (userId: string, file: File) => {
    const user = findUser(userId);
    if (!user) return;
    
    const validIdUrl = await uploadFile(file, 'valid-ids');
    
    MOCK_DB.users = MOCK_DB.users.map(u => 
        u.id === userId 
        ? { ...u, validIdUrl, isVerifiedByBhw: false, idRejectionReason: null } 
        : u
    );

    const newBhwNotification: BhwNotification = {
        id: `notif-${Date.now()}`,
        userId: userId,
        userName: user.name,
        validIdUrl,
        timestamp: Date.now(),
        barangay: user.address.barangay,
    };
    MOCK_DB.bhwNotifications.push(newBhwNotification);
    notifyAllData(user);
};

export const addConsultation = (consultation: Omit<Consultation, 'id' | 'patient' | 'doctor'>) => {
    if (!consultation.aiSummary) return;

    const doctorId = selectDoctorForConsultation(consultation.aiSummary);
    
    const timestamp = Date.now();
    const newConsultationId = `consult-${timestamp}`;

    const newConsultation: Omit<Consultation, 'patient' | 'doctor'> = {
        id: newConsultationId,
        ...consultation,
        doctorId: doctorId,
        status: 'Pending Doctor',
    };

    MOCK_DB.consultations = [newConsultation, ...MOCK_DB.consultations];
    
    // Create corresponding pending prescription transactionally
    const newPrescription: Omit<Prescription, 'patient' | 'doctor' | 'doctorName'> = {
        id: `rx-${timestamp}`,
        consultationId: newConsultationId,
        patientId: consultation.patientId,
        doctorId: doctorId,
        aiSummary: consultation.aiSummary,
        dateIssued: new Date().toISOString().split('T')[0],
        status: 'Pending',
    };
    MOCK_DB.prescriptions = [newPrescription, ...MOCK_DB.prescriptions];

    notifyAllData();
};

export const updateConsultationStatus = (consultationId: string, status: ConsultationStatus, doctorId: string) => {
    MOCK_DB.consultations = MOCK_DB.consultations.map(c => c.id === consultationId ? { ...c, status, doctorId } : c);
    notifyAllData();
};
export const addPrescription = (prescription: Omit<Prescription, 'id' | 'patient' | 'doctorName'>) => {
    const newPrescription = { id: `rx-${Date.now()}`, ...prescription };
    MOCK_DB.prescriptions = [newPrescription, ...MOCK_DB.prescriptions];
    notifyAllData();
};
export const updatePrescription = (prescriptionId: string, details: Partial<Omit<Prescription, 'id'>>) => {
    MOCK_DB.prescriptions = MOCK_DB.prescriptions.map(p => p.id === prescriptionId ? { ...p, ...details } as Omit<Prescription, 'patient'|'doctor'|'doctorName'> : p);
    notifyAllData();
};
export const addForumPost = (post: Omit<ForumPost, 'id' | 'author'>) => {
    const newPost = { id: `fp-${Date.now()}`, ...post };
    MOCK_DB.forumPosts = [newPost, ...MOCK_DB.forumPosts];
    notifyAllData();
};

export const sendPrivateMessage = (senderId: string, recipientId: string, content: string) => {
    const convoId = [senderId, recipientId].sort().join('-');
    const message: PrivateChatMessage = { id: `pm-${Date.now()}`, senderId, recipientId, content, timestamp: new Date().toLocaleString() };
    const currentMessages = MOCK_DB.privateChats[convoId] || [];
    MOCK_DB.privateChats = { ...MOCK_DB.privateChats, [convoId]: [...currentMessages, message] };
    notify('privateChats', MOCK_DB.privateChats);
};

export const sendPatientDoctorMessage = (patientId: string, doctorId: string, content: string) => {
    let patient = findUser(patientId);
    if (!patient) return;

    // Check for weekly credit reset
    const updatedPatient = _checkAndResetWeeklyCredits(patient);
    if (patient !== updatedPatient) {
        patient = updatedPatient;
        MOCK_DB.users = MOCK_DB.users.map(u => u.id === patientId ? patient : u);
    }
    
    const now = Date.now();
    const activePass = patient.chatAccessPasses?.[doctorId] && patient.chatAccessPasses[doctorId] > now;

    let canSendMessage = false;
    let userWasUpdated = false;

    if (patient.isPremium || activePass) {
        canSendMessage = true;
    } else if ((patient.weeklyChatCredits || 0) > 0) {
        canSendMessage = true;
        // Consume credit and create pass
        const oneDay = 24 * 60 * 60 * 1000;
        const newPasses = { ...(patient.chatAccessPasses || {}), [doctorId]: now + oneDay };
        const userWithConsumedCredit = { ...patient, weeklyChatCredits: 0, chatAccessPasses: newPasses };
        MOCK_DB.users = MOCK_DB.users.map(u => u.id === patientId ? userWithConsumedCredit : u);
        userWasUpdated = true;
    }

    if (canSendMessage) {
        const convoId = [patientId, doctorId].sort().join('-');
        const message: PatientDoctorChatMessage = { id: `pdcm-${Date.now()}`, sender: 'patient', content, timestamp: new Date().toLocaleString(), readByDoctor: false, readByPatient: true };
        const currentMessages = MOCK_DB.patientDoctorChats[convoId] || [];
        MOCK_DB.patientDoctorChats = { ...MOCK_DB.patientDoctorChats, [convoId]: [...currentMessages, message] };
        notify('patientDoctorChats', MOCK_DB.patientDoctorChats);
        
        if (userWasUpdated) {
            notifyAllData(); // Notify all data if user object changed
        }
    }
};


export const sendDoctorPatientMessage = (doctorId: string, patientId: string, content: string) => {
    const convoId = [patientId, doctorId].sort().join('-');
    const message: PatientDoctorChatMessage = { id: `pdcm-${Date.now()}`, sender: 'doctor', content, timestamp: new Date().toLocaleString(), readByDoctor: true, readByPatient: false };
    const currentMessages = MOCK_DB.patientDoctorChats[convoId] || [];
    MOCK_DB.patientDoctorChats = { ...MOCK_DB.patientDoctorChats, [convoId]: [...currentMessages, message] };
    notify('patientDoctorChats', MOCK_DB.patientDoctorChats);
};

export const markDoctorChatAsRead = (convoId: string) => {
    if (MOCK_DB.patientDoctorChats[convoId]) {
        MOCK_DB.patientDoctorChats[convoId] = MOCK_DB.patientDoctorChats[convoId].map(msg => ({ ...msg, readByDoctor: true }));
        notify('patientDoctorChats', { ...MOCK_DB.patientDoctorChats });
    }
};

export const updateDoctorAvailability = (docProfileId: string, availability: any) => {
    MOCK_DB.doctorProfiles = MOCK_DB.doctorProfiles.map(d => d.id === docProfileId ? { ...d, availability } : d);
    notifyAllData();
};
export const upgradeUserSubscription = (userId: string, plan: 'individual' | 'family') => {
    MOCK_DB.users = MOCK_DB.users.map(u => u.id === userId ? { ...u, isPremium: true, subscriptionType: plan, familyId: plan === 'family' ? `fam-${userId}`: null, weeklyChatCredits: undefined, lastCreditReset: undefined, chatAccessPasses: undefined } : u);
    notifyAllData();
};