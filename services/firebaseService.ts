/**
 * Firebase Service
 *
 * This file implements the interactions with Firebase services (Auth, Firestore, Storage).
 * It replaces the previous mock implementation with live Firebase calls.
 */
import { auth, db, storage } from '../firebaseConfig';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    updateProfile
} from "firebase/auth";
import {
    collection,
    doc,
    addDoc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    onSnapshot,
    query,
    where,
    orderBy,
    serverTimestamp,
    runTransaction,
    arrayUnion,
    writeBatch,
    Timestamp,
    increment
} from "firebase/firestore";
import {
    ref,
    uploadBytes,
    getDownloadURL
} from "firebase/storage";
import type { User, Role, Consultation, Prescription, ForumPost, DoctorProfile, ResidentRecord, PrivateChatMessage, PatientDoctorChatMessage, ConsultationStatus, Medicine, RhwStats, BhwStats, AISummary, StructuredAddress, BhwNotification, PatientNotification, PharmacyStats, DoctorSpecialty } from '../types';

// --- HELPER FUNCTIONS ---

/**
 * Converts a Firestore document snapshot into a data object including its ID.
 */
const docWithId = (doc: any) => ({ ...doc.data(), id: doc.id });

/**
 * A generic function to create a real-time listener on a Firestore collection.
 * @param collectionPath The path to the collection.
 * @param setter The React state setter function.
 * @param hydrationFunc A function to process and join related data for each document.
 * @param queryConstraints Optional query constraints (where, orderBy, etc.).
 */
const createListener = (collectionPath: string, setter: Function, hydrationFunc: (doc: any) => Promise<any> = async (d) => d, ...queryConstraints: any[]) => {
    const q = query(collection(db, collectionPath), ...queryConstraints);
    const unsubscribe = onSnapshot(q, async (snapshot) => {
        const data = await Promise.all(snapshot.docs.map(d => hydrationFunc(docWithId(d))));
        setter(data);
    });
    return unsubscribe;
};

// --- AUTHENTICATION ---

export const onAuthChange = (callback: (user: { uid: string } | null) => void) => {
    return onAuthStateChanged(auth, callback);
};

export const signIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const signUp = async (details: { name: string, email: string, password: string, contactNumber: string, address: StructuredAddress, validIdFile: File }) => {
    const userCredential = await createUserWithEmailAndPassword(auth, details.email, details.password);
    const user = userCredential.user;
    await updateProfile(user, { displayName: details.name });

    const validIdUrl = await uploadFile(details.validIdFile, `valid-ids/${user.uid}`);

    const newUserProfile: Omit<User, 'id'> = {
        name: details.name,
        email: details.email,
        role: 'patient',
        contactNumber: details.contactNumber,
        address: details.address,
        validIdUrl,
        status: 'active',
        isPremium: false,
        isVerifiedByBhw: false,
        hasUsedFreeConsultation: false,
    };
    
    // Create user document in Firestore
    await setDoc(doc(db, "users", user.uid), newUserProfile);
    
    // Create a notification for the BHW
    const notification = {
        userId: user.uid,
        userName: details.name,
        validIdUrl,
        timestamp: serverTimestamp(),
        barangay: details.address.barangay,
    };
    await addDoc(collection(db, 'bhwNotifications'), notification);
};

export const signOut = () => {
    return firebaseSignOut(auth);
};

// --- STORAGE ---

export const uploadFile = async (file: File, path: string): Promise<string> => {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
};

// --- READ OPERATIONS (USERS) ---

export const getUserProfile = async (uid: string): Promise<User | null> => {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() } as User;
    }
    return null;
};

export const getUsers = (setter: React.Dispatch<React.SetStateAction<User[]>>) => {
    return createListener('users', setter, async (user) => user);
};

// --- DATA HYDRATION HELPERS ---

const hydrateConsultation = async (c: any): Promise<Consultation> => {
    const patientSnap = await getDoc(doc(db, 'users', c.patientId));
    let doctorProfile: DoctorProfile | undefined;
    if (c.doctorId) {
        const doctorProfileQuery = query(collection(db, 'doctorProfiles'), where('userId', '==', c.doctorId));
        const doctorProfileSnap = await getDocs(doctorProfileQuery);
        if (!doctorProfileSnap.empty) {
            doctorProfile = docWithId(doctorProfileSnap.docs[0]);
        }
    }
    return {
        ...c,
        date: c.date instanceof Timestamp ? c.date.toDate().toISOString().split('T')[0] : c.date,
        patient: { id: patientSnap.id, ...patientSnap.data() } as User,
        doctor: doctorProfile,
    };
};

const hydratePrescription = async (p: any): Promise<Prescription> => {
    const patientSnap = await getDoc(doc(db, 'users', p.patientId));
    let doctorProfile: DoctorProfile | undefined;
    let doctorName = "Pending Review";
    if (p.doctorId) {
        const doctorProfileQuery = query(collection(db, 'doctorProfiles'), where('userId', '==', p.doctorId));
        const doctorProfileSnap = await getDocs(doctorProfileQuery);
        if (!doctorProfileSnap.empty) {
            doctorProfile = docWithId(doctorProfileSnap.docs[0]);
            doctorName = doctorProfile?.name || "Dr. Unknown";
        }
    }
    return {
        ...p,
        dateIssued: p.dateIssued instanceof Timestamp ? p.dateIssued.toDate().toISOString().split('T')[0] : p.dateIssued,
        patient: { id: patientSnap.id, ...patientSnap.data() } as User,
        doctor: doctorProfile,
        doctorName: doctorName
    };
};

const hydrateForumPost = async (p: any): Promise<ForumPost> => {
    const authorSnap = await getDoc(doc(db, 'users', p.authorId));
    return {
        ...p,
        timestamp: p.timestamp instanceof Timestamp ? p.timestamp.toDate().toLocaleString() : p.timestamp,
        author: { id: authorSnap.id, ...authorSnap.data() } as User,
    };
};

// --- READ OPERATIONS (LISTENERS) ---
export const getMedicines = (setter: React.Dispatch<React.SetStateAction<Medicine[]>>) => createListener('medicines', setter);
export const getDoctorProfiles = (setter: React.Dispatch<React.SetStateAction<DoctorProfile[]>>) => createListener('doctorProfiles', setter);
export const getConsultations = (currentUser: User, setter: React.Dispatch<React.SetStateAction<Consultation[]>>) => {
    const constraints = currentUser.role === 'patient' ? [where('patientId', '==', currentUser.id), orderBy('date', 'desc')] : [orderBy('date', 'desc')];
    return createListener('consultations', setter, hydrateConsultation, ...constraints);
};
export const getPrescriptions = (currentUser: User, setter: React.Dispatch<React.SetStateAction<Prescription[]>>) => {
    const constraints = currentUser.role === 'patient' ? [where('patientId', '==', currentUser.id), orderBy('dateIssued', 'desc')] : [orderBy('dateIssued', 'desc')];
    return createListener('prescriptions', setter, hydratePrescription, ...constraints);
};
export const getForumPosts = (setter: React.Dispatch<React.SetStateAction<ForumPost[]>>) => createListener('forumPosts', setter, hydrateForumPost, orderBy('timestamp', 'desc'));
export const getResidentRecords = (currentUser: User, setter: React.Dispatch<React.SetStateAction<ResidentRecord[]>>) => {
    const constraints = currentUser.role === 'bhw' && currentUser.assignedBarangay ? [where('address.barangay', '==', currentUser.assignedBarangay), orderBy('name')] : [orderBy('name')];
    return createListener('residentRecords', setter, async r => r, ...constraints);
};
export const getBhwNotifications = (currentUser: User, setter: React.Dispatch<React.SetStateAction<BhwNotification[]>>) => {
     const constraints = currentUser.role === 'bhw' && currentUser.assignedBarangay ? [where('barangay', '==', currentUser.assignedBarangay), orderBy('timestamp', 'desc')] : [orderBy('timestamp', 'desc')];
    return createListener('bhwNotifications', setter, async n => n, ...constraints);
};
export const getPatientNotifications = (userId: string, setter: React.Dispatch<React.SetStateAction<PatientNotification[]>>) => createListener('patientNotifications', setter, async n => n, where('userId', '==', userId), orderBy('timestamp', 'desc'));

// --- CHAT LISTENERS ---
export const getPrivateChats = (userId: string, setter: React.Dispatch<React.SetStateAction<any>>) => {
    const q = query(collection(db, 'privateChats'), where('members', 'array-contains', userId));
    const allMessagesUnsubs: Function[] = [];
    const chats: Record<string, PrivateChatMessage[]> = {};

    const unsub = onSnapshot(q, (snapshot) => {
        // Unsubscribe from old message listeners
        allMessagesUnsubs.forEach(u => u());
        allMessagesUnsubs.length = 0;

        snapshot.docs.forEach(doc => {
            const convoId = doc.id;
            const messagesQuery = query(collection(db, `privateChats/${convoId}/messages`), orderBy('timestamp'));
            const messagesUnsub = onSnapshot(messagesQuery, (msgSnapshot) => {
                chats[convoId] = msgSnapshot.docs.map(msgDoc => {
                    const data = msgDoc.data();
                    return { ...docWithId(msgDoc), timestamp: data.timestamp.toDate().toLocaleString() };
                });
                setter({ ...chats });
            });
            allMessagesUnsubs.push(messagesUnsub);
        });
    });
    return () => {
        unsub();
        allMessagesUnsubs.forEach(u => u());
    };
};
export const getPatientDoctorChats = (userId: string, setter: React.Dispatch<React.SetStateAction<any>>) => {
     const q = query(collection(db, 'patientDoctorChats'), where('members', 'array-contains', userId));
    const allMessagesUnsubs: Function[] = [];
    const chats: Record<string, PatientDoctorChatMessage[]> = {};

    const unsub = onSnapshot(q, (snapshot) => {
        allMessagesUnsubs.forEach(u => u());
        allMessagesUnsubs.length = 0;

        snapshot.docs.forEach(doc => {
            const convoId = doc.id;
            const messagesQuery = query(collection(db, `patientDoctorChats/${convoId}/messages`), orderBy('timestamp'));
            const messagesUnsub = onSnapshot(messagesQuery, (msgSnapshot) => {
                chats[convoId] = msgSnapshot.docs.map(msgDoc => {
                     const data = msgDoc.data();
                    return { ...docWithId(msgDoc), timestamp: data.timestamp.toDate().toLocaleString() };
                });
                setter({ ...chats });
            });
            allMessagesUnsubs.push(messagesUnsub);
        });
    });
    return () => {
        unsub();
        allMessagesUnsubs.forEach(u => u());
    };
};

// --- WRITE OPERATIONS ---
export const updateUserProfile = (userId: string, updatedDetails: Partial<User>) => updateDoc(doc(db, "users", userId), updatedDetails);
export const updateUserStatus = (userId: string, status: 'active' | 'banned') => updateDoc(doc(db, "users", userId), { status });
export const deleteUserAccount = (userId: string) => deleteDoc(doc(db, "users", userId)); // Note: This doesn't delete from Auth. Use Firebase Functions for that.
export const addReportToUser = (userId: string, report: any) => updateDoc(doc(db, "users", userId), { reports: arrayUnion(report) });
export const addResidentRecord = (details: Omit<ResidentRecord, 'id' | 'createdAt'>) => addDoc(collection(db, "residentRecords"), {...details, createdAt: serverTimestamp()});
export const deleteResidentRecord = (recordId: string) => deleteDoc(doc(db, "residentRecords", recordId));
export const updateResidentRecord = (recordId: string, details: any) => updateDoc(doc(db, "residentRecords", recordId), details);

export const createProfessionalUser = async (newUser: Omit<User, 'id' | 'status'>) => {
    // This is a simplified version. In production, this should be a Firebase Function.
    const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password!);
    const user = userCredential.user;
    const userProfile: Omit<User, 'id'> = {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        address: newUser.address,
        status: 'active'
    };
    await setDoc(doc(db, 'users', user.uid), userProfile);
};

export const updateProfessionalProfile = async (userId: string, userUpdates: Partial<User>, profileUpdates: Partial<DoctorProfile>) => {
    const batch = writeBatch(db);
    const userRef = doc(db, "users", userId);
    batch.update(userRef, userUpdates);

    if (Object.keys(profileUpdates).length > 0) {
        const profileQuery = query(collection(db, 'doctorProfiles'), where('userId', '==', userId));
        const profileSnapshot = await getDocs(profileQuery);
        if (!profileSnapshot.empty) {
            const profileRef = profileSnapshot.docs[0].ref;
            batch.update(profileRef, profileUpdates);
        }
    }
    await batch.commit();
};


export const approveIdVerification = async (notificationId: string) => {
    const notifDoc = await getDoc(doc(db, 'bhwNotifications', notificationId));
    if (!notifDoc.exists()) return;
    const { userId } = notifDoc.data();
    
    const batch = writeBatch(db);
    batch.update(doc(db, 'users', userId), { isVerifiedByBhw: true, idRejectionReason: null });
    batch.delete(doc(db, 'bhwNotifications', notificationId));
    
    const patientNotification = {
        userId: userId,
        message: 'notification_id_verified',
        isRead: false,
        timestamp: serverTimestamp()
    };
    batch.set(doc(collection(db, 'patientNotifications')), patientNotification);

    await batch.commit();
};
export const rejectIdVerification = async (notificationId: string, reason: string) => {
     const notifDoc = await getDoc(doc(db, 'bhwNotifications', notificationId));
    if (!notifDoc.exists()) return;
    const { userId } = notifDoc.data();
    
    const batch = writeBatch(db);
    batch.update(doc(db, 'users', userId), { isVerifiedByBhw: false, idRejectionReason: reason });
    batch.delete(doc(db, 'bhwNotifications', notificationId));
    
    const patientNotification = {
        userId: userId,
        message: `notification_id_rejected|${reason}`,
        isRead: false,
        timestamp: serverTimestamp()
    };
    batch.set(doc(collection(db, 'patientNotifications')), patientNotification);

    await batch.commit();
};

export const markPatientNotificationAsRead = (notificationId: string) => updateDoc(doc(db, 'patientNotifications', notificationId), { isRead: true });

export const updateValidId = async (userId: string, file: File) => {
    const userDocRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userDocRef);
    if (!userSnap.exists()) return;
    const user = userSnap.data();

    const validIdUrl = await uploadFile(file, `valid-ids/${userId}-${Date.now()}`);

    await updateDoc(userDocRef, { validIdUrl, isVerifiedByBhw: false, idRejectionReason: null });

    const newBhwNotification = {
        userId: userId,
        userName: user.name,
        validIdUrl,
        timestamp: serverTimestamp(),
        barangay: user.address.barangay,
    };
    await addDoc(collection(db, 'bhwNotifications'), newBhwNotification);
};

const getSpecialtyForConsultation = (summary: AISummary): DoctorSpecialty => {
    const suggestion = summary.diagnosis_suggestion.toLowerCase();
    if (suggestion.includes('skin') || suggestion.includes('rash') || suggestion.includes('acne')) return 'Dermatologist';
    if (suggestion.includes('heart') || suggestion.includes('chest pain')) return 'Cardiologist';
    if (suggestion.includes('child') || suggestion.includes('infant')) return 'Pediatrician';
    if (suggestion.includes('pregnant') || suggestion.includes('women')) return 'OB-GYN';
    return 'General Physician';
};

export const addConsultation = async (consultation: Omit<Consultation, 'id' | 'patient' | 'doctor' | 'doctorId' | 'status'> & { patientId: string }) => {
    let assignedDoctorId: string | null = null;
    let requiredSpecialty: DoctorSpecialty | undefined;

    if (consultation.aiSummary) {
        requiredSpecialty = getSpecialtyForConsultation(consultation.aiSummary);
        
        const doctorsQuery = query(
            collection(db, 'doctorProfiles'),
            where('specialty', '==', requiredSpecialty),
            where('availability', '==', 'Available')
        );
        const doctorSnaps = await getDocs(doctorsQuery);
        const availableDoctors = doctorSnaps.docs.map(d => docWithId(d) as DoctorProfile);

        if (availableDoctors.length > 0) {
            const countersRef = doc(db, 'systemCounters', 'specialtyAssignments');
            await runTransaction(db, async (transaction) => {
                const countersDoc = await transaction.get(countersRef);
                const currentCount = countersDoc.exists() ? countersDoc.data()[requiredSpecialty!] || 0 : 0;
                
                const doctorIndex = currentCount % availableDoctors.length;
                assignedDoctorId = availableDoctors[doctorIndex].userId;

                // Update counter
                if (countersDoc.exists()) {
                    transaction.update(countersRef, { [requiredSpecialty!]: increment(1) });
                } else {
                    transaction.set(countersRef, { [requiredSpecialty!]: 1 });
                }
            });
        }
    }

    return runTransaction(db, async (transaction) => {
        const patientRef = doc(db, 'users', consultation.patientId);
        const patientSnap = await transaction.get(patientRef);
        if (!patientSnap.exists()) throw new Error("Patient not found.");
        
        const patientData = patientSnap.data() as User;
        if (!patientData.isPremium && patientData.hasUsedFreeConsultation) {
            throw new Error("You have used your free consultation. Please subscribe to a premium plan to send more.");
        }

        if (!patientData.isPremium) {
            transaction.update(patientRef, { hasUsedFreeConsultation: true });
        }
        
        const newConsultation = {
            ...consultation,
            date: Timestamp.now(),
            status: 'Pending Doctor',
            doctorId: assignedDoctorId,
            requiredSpecialty,
        };
        const consultationRef = doc(collection(db, 'consultations'));
        transaction.set(consultationRef, newConsultation);

        const newPrescription = {
            consultationId: consultationRef.id,
            patientId: consultation.patientId,
            doctorId: assignedDoctorId,
            aiSummary: consultation.aiSummary,
            dateIssued: Timestamp.now(),
            status: 'Pending',
        };
        transaction.set(doc(collection(db, 'prescriptions')), newPrescription);
    });
};

export const updateConsultationStatus = (consultationId: string, status: ConsultationStatus, doctorId: string) => updateDoc(doc(db, 'consultations', consultationId), { status, doctorId });
export const addPrescription = (prescription: any) => addDoc(collection(db, 'prescriptions'), {...prescription, dateIssued: serverTimestamp()});
export const updatePrescription = (prescriptionId: string, details: any) => updateDoc(doc(db, 'prescriptions', prescriptionId), details);
export const addForumPost = (post: any) => addDoc(collection(db, 'forumPosts'), {...post, timestamp: serverTimestamp()});

export const sendPrivateMessage = async (senderId: string, recipientId: string, content: string) => {
    const convoId = [senderId, recipientId].sort().join('-');
    const convoRef = doc(db, 'privateChats', convoId);
    await setDoc(convoRef, { members: [senderId, recipientId] }, { merge: true });
    await addDoc(collection(convoRef, 'messages'), { senderId, recipientId, content, timestamp: serverTimestamp() });
};
export const sendPatientDoctorMessage = async (patientId: string, doctorId: string, content: string) => {
    const convoId = [patientId, doctorId].sort().join('-');
    const convoRef = doc(db, 'patientDoctorChats', convoId);
    await setDoc(convoRef, { members: [patientId, doctorId] }, { merge: true });
    await addDoc(collection(convoRef, 'messages'), { sender: 'patient', content, timestamp: serverTimestamp(), readByDoctor: false, readByPatient: true });
};
export const sendDoctorPatientMessage = async (doctorId: string, patientId: string, content: string) => {
    const convoId = [patientId, doctorId].sort().join('-');
    const convoRef = doc(db, 'patientDoctorChats', convoId);
    await setDoc(convoRef, { members: [patientId, doctorId] }, { merge: true });
    await addDoc(collection(convoRef, 'messages'), { sender: 'doctor', content, timestamp: serverTimestamp(), readByDoctor: true, readByPatient: false });
};

export const markDoctorChatAsRead = async (convoId: string) => {
    const messagesRef = collection(db, `patientDoctorChats/${convoId}/messages`);
    const q = query(messagesRef, where('readByDoctor', '==', false));
    const unreadSnapshot = await getDocs(q);
    const batch = writeBatch(db);
    unreadSnapshot.docs.forEach(d => batch.update(d.ref, { readByDoctor: true }));
    await batch.commit();
};

export const updateDoctorAvailability = (docProfileId: string, availability: any) => updateDoc(doc(db, 'doctorProfiles', docProfileId), { availability });
export const upgradeUserSubscription = (userId: string, plan: 'individual' | 'family') => {
     const updateData: any = {
        isPremium: true,
        subscriptionType: plan,
        hasUsedFreeConsultation: undefined,
     };
     if (plan === 'family') {
        updateData.familyId = `fam-${userId}`;
     }
    return updateDoc(doc(db, 'users', userId), updateData);
};
export const grantPremiumSubscription = (userId: string) => updateDoc(doc(db, "users", userId), { isPremium: true, subscriptionType: 'individual' });

export const validateAndRemitPrescription = (prescriptionId: string): Promise<{ success: boolean; message: string; }> => {
    const presRef = doc(db, 'prescriptions', prescriptionId);
    return runTransaction(db, async (transaction) => {
        const presDoc = await transaction.get(presRef);
        if (!presDoc.exists()) {
            throw new Error("Prescription not found.");
        }
        const prescription = presDoc.data();
        if (prescription.status === 'Remitted') {
            throw new Error("This prescription has already been remitted.");
        }
        if (prescription.status !== 'Approved') {
            throw new Error(`This prescription is not approved for remittance. Its status is: ${prescription.status}.`);
        }
        transaction.update(presRef, { status: 'Remitted' });
        return { success: true, message: "Prescription validated and marked as remitted." };
    }).catch(error => {
        return { success: false, message: error.message };
    });
};

// --- ANALYTICS (MOCK DATA) ---
// In a real app, these would be calculated using Firebase Functions or another backend service.
export const getRhuStats = (setter: React.Dispatch<React.SetStateAction<any>>) => {
    const mockStats: RhwStats = {
        weeklyConsultations: [{ name: 'Mon', uv: 12 }, { name: 'Tue', uv: 19 }, { name: 'Wed', uv: 10 }, { name: 'Thu', uv: 25 }, { name: 'Fri', uv: 20 }, { name: 'Sat', uv: 11 }, { name: 'Sun', uv: 6 }],
        urgencyBreakdown: [{ name: 'Low', count: 55 }, { name: 'Medium', count: 32 }, { name: 'High', count: 12 }, { name: 'Critical', count: 4 }],
        topPrescribed: [{ name: 'Paracetamol', count: 45 }, { name: 'Amoxicillin', count: 28 }, { name: 'Salbutamol', count: 19 }, { name: 'Loratadine', count: 15 }, { name: 'Mefenamic Acid', count: 11 }]
    };
    setter(mockStats);
    return () => {}; // Return a dummy unsubscribe function
};
export const getBhwStats = (currentUser: User, setter: React.Dispatch<React.SetStateAction<any>>) => {
     const mockStats: BhwStats = {
        weeklyRecordsAdded: [{ name: 'Mon', uv: 5 }, { name: 'Tue', uv: 8 }, { name: 'Wed', uv: 12 }, { name: 'Thu', uv: 7 }, { name: 'Fri', uv: 15 }, { name: 'Sat', uv: 4 }, { name: 'Sun', uv: 2 }],
        residentDistribution: [{ name: 'Poblacion', count: 150 }, { name: 'Laguinbanua', count: 80 }, { name: 'Naisud', count: 120 }]
    };
    setter(mockStats);
    return () => {};
};
export const getPharmacyStats = (setter: React.Dispatch<React.SetStateAction<any>>) => {
    const mockStats: PharmacyStats = {
        weeklyValidations: [{ name: 'Mon', uv: 22 }, { name: 'Tue', uv: 28 }, { name: 'Wed', uv: 20 }, { name: 'Thu', uv: 35 }, { name: 'Fri', uv: 30 }, { name: 'Sat', uv: 42 }, { name: 'Sun', uv: 18 }],
        topMeds: [{ name: 'Paracetamol', count: 60 }, { name: 'Amoxicillin', count: 40 }, { name: 'Salbutamol', count: 25 }, { name: 'Loratadine', count: 22 }, { name: 'Mefenamic Acid', count: 18 }]
    };
    setter(mockStats);
    return () => {};
};

// --- DATA SEEDING ---
export const seedInitialUsers = async () => {
    console.log("Checking if initial users need to be seeded...");

    const seedPassword = "password";

    const usersToSeed = [
        // Patient
        {
            email: "patient@ebotika.ph",
            name: "Juan dela Cruz",
            role: "patient" as Role,
            contactNumber: "09123456789",
            address: { barangay: 'Poblacion', purok: 'Purok 1', streetAddress: '123 Main St' },
            isVerifiedByBhw: true,
            hasUsedFreeConsultation: false,
            isPremium: false,
            validIdUrl: 'https://firebasestorage.googleapis.com/v0/b/ebotika-plus-a1.appspot.com/o/valid-ids%2Fmock-id.png?alt=media&token=12345678-1234-1234-1234-1234567890ab',
        },
        // Doctor
        {
            email: "doctor@ebotika.ph",
            name: "Dr. Maria Santos",
            role: "doctor" as Role,
            specialty: "General Physician" as DoctorSpecialty,
            avatarUrl: "https://picsum.photos/id/433/200/200",
            availability: "Available" as "Available" | "On Leave",
        },
        // Pharmacy
        {
            email: "pharmacy@ebotika.ph",
            name: "Rose Pharmacy",
            role: "pharmacy" as Role,
            avatarUrl: "https://picsum.photos/id/338/200/200",
        },
        // Admin
        {
            email: "admin@ebotika.ph",
            name: "RHU Administrator",
            role: "admin" as Role,
            avatarUrl: "https://picsum.photos/id/237/200/200",
        },
        // BHW
        {
            email: "bhw@ebotika.ph",
            name: "BHW Poblacion",
            role: "bhw" as Role,
            assignedBarangay: "Poblacion",
            avatarUrl: "https://picsum.photos/id/553/200/200",
        },
    ];

    for (const userData of usersToSeed) {
        try {
            // 1. Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, userData.email, seedPassword);
            const user = userCredential.user;
            console.log(`Created auth user: ${userData.email}`);

            // 2. Create user document in Firestore
            const userProfile: any = {
                name: userData.name,
                email: userData.email,
                role: userData.role,
                status: 'active',
                avatarUrl: userData.avatarUrl || `https://ui-avatars.com/api/?name=${userData.name.replace(' ', '+')}&background=random`,
            };

            if (userData.role === 'patient') {
                userProfile.contactNumber = userData.contactNumber;
                userProfile.address = userData.address;
                userProfile.isVerifiedByBhw = userData.isVerifiedByBhw;
                userProfile.hasUsedFreeConsultation = userData.hasUsedFreeConsultation;
                userProfile.isPremium = userData.isPremium;
                userProfile.validIdUrl = userData.validIdUrl;
            }

            if (userData.role === 'bhw') {
                userProfile.assignedBarangay = userData.assignedBarangay;
            }

            await setDoc(doc(db, "users", user.uid), userProfile);
            console.log(`Created firestore profile for: ${userData.email}`);

            // 3. Create doctorProfile if applicable
            if (userData.role === 'doctor' && userData.specialty && userData.availability) {
                const doctorProfileData: Omit<DoctorProfile, 'id'> = {
                    userId: user.uid,
                    name: userData.name,
                    specialty: userData.specialty,
                    avatarUrl: userData.avatarUrl!,
                    availability: userData.availability,
                };
                await addDoc(collection(db, "doctorProfiles"), doctorProfileData);
                console.log(`Created doctorProfile for: ${userData.email}`);
            }
        } catch (error: any) {
            if (error.code === 'auth/email-already-in-use') {
                console.log(`User ${userData.email} already exists. Skipping.`);
            } else {
                console.error(`Failed to seed user ${userData.email}:`, error);
            }
        }
    }

    console.log("Initial user seeding process finished.");
};
