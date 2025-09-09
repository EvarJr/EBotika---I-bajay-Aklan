export const Screens = {
  WELCOME: 'WELCOME',
  LOGIN: 'LOGIN',
  REGISTER: 'REGISTER',
  PATIENT_HOME: 'PATIENT_HOME',
  SYMPTOM_CHECK: 'SYMPTOM_CHECK',
  CONSULTATIONS: 'CONSULTATIONS',
  PRESCRIPTIONS: 'PRESCRIPTIONS',
  PROFILE: 'PROFILE',
  QR_DISPLAY: 'QR_DISPLAY',
  DOCTOR_DASHBOARD: 'DOCTOR_DASHBOARD',
  DOCTOR_INBOX: 'DOCTOR_INBOX',
  CONSULTATION_DETAIL: 'CONSULTATION_DETAIL',
  PRESCRIPTION_FORM: 'PRESCRIPTION_FORM',
  PHARMACY_DASHBOARD: 'PHARMACY_DASHBOARD',
  PHARMACY_SCAN: 'PHARMACY_SCAN',
  RHU_DASHBOARD: 'RHU_DASHBOARD',
  BHW_DASHBOARD: 'BHW_DASHBOARD',
  PATIENT_DETAIL_MANAGEMENT: 'PATIENT_DETAIL_MANAGEMENT',
  FORUM: 'FORUM',
  PROFESSIONALS_DIRECTORY: 'PROFESSIONALS_DIRECTORY',
  PRIVATE_CHAT: 'PRIVATE_CHAT',
  DOCTOR_CHAT: 'DOCTOR_CHAT',
  PATIENT_CONSULTATION_DETAIL: 'PATIENT_CONSULTATION_DETAIL',
  PROFESSIONAL_PROFILE_EDIT: 'PROFESSIONAL_PROFILE_EDIT',
} as const;

export const CHAT_HISTORY_KEY = 'ebotikaChatHistory';
export const SESSION_KEY = 'ebotikaSession';

export const DOCTOR_SPECIALIZATIONS = [
    'General Physician',
    'Pediatrician',
    'Cardiologist',
    'Dermatologist',
    'OB-GYN',
] as const;


export const MOCK_SYMPTOMS: { key: string, emoji: string }[] = [
    { key: 'symptom_headache', emoji: '🤯' },
    { key: 'symptom_fever', emoji: '🤒' },
    { key: 'symptom_cough', emoji: '🤧' },
    { key: 'symptom_sore_throat', emoji: '😷' },
    { key: 'symptom_body_aches', emoji: '🤕' },
    { key: 'symptom_stomachache', emoji: '🤢' }
];

export const MOCK_AVATARS: string[] = [
    'https://picsum.photos/id/237/200/200',
    'https://picsum.photos/id/338/200/200',
    'https://picsum.photos/id/433/200/200',
    'https://picsum.photos/id/553/200/200',
    'https://picsum.photos/id/577/200/200',
    'https://picsum.photos/id/651/200/200',
    'https://picsum.photos/id/888/200/200',
    'https://picsum.photos/id/918/200/200',
];

export const IBAJAY_ADDRESS_DATA: { [barangay: string]: string[] } = {
  "Agdugayan": ["Purok 1", "Purok 2", "Purok 3", "Purok 4", "Purok 5"],
  "Aglibacao": ["Purok 1", "Purok 2", "Purok 3"],
  "Aparicio": ["Purok 1", "Purok 2", "Purok 3", "Purok 4"],
  "Aquino": ["Purok 1", "Purok 2", "Purok 3", "Purok 4", "Purok 5", "Purok 6"],
  "As-is": ["Purok 1", "Purok 2", "Purok 3"],
  "Bagacay": ["Purok 1", "Purok 2", "Purok 3", "Purok 4"],
  "Batuan": ["Purok 1", "Purok 2", "Purok 3"],
  "Buenavista": ["Purok 1", "Purok 2", "Purok 3", "Purok 4"],
  "Bugtongbato": ["Purok 1", "Purok 2", "Purok 3", "Purok 4", "Purok 5"],
  "Cabugao": ["Purok 1", "Purok 2", "Purok 3"],
  "Capilijan": ["Purok 1", "Purok 2", "Purok 3", "Purok 4"],
  "Claudio Marcelo": ["Purok 1", "Purok 2", "Purok 3"],
  "Colongcolong": ["Purok 1", "Purok 2", "Purok 3", "Purok 4"],
  "Laguinbanua": ["Purok 1", "Purok 2", "Purok 3", "Purok 4", "Purok 5", "Purok 6"],
  "Maloco": ["Purok 1", "Purok 2", "Purok 3", "Purok 4", "Purok 5"],
  "Mabusao": ["Purok 1", "Purok 2", "Purok 3"],
  "Monlaque": ["Purok 1", "Purok 2", "Purok 3", "Purok 4"],
  "Naile": ["Purok 1", "Purok 2", "Purok 3", "Purok 4", "Purok 5"],
  "Naisud": ["Purok 1", "Purok 2", "Purok 3", "Purok 4", "Purok 5", "Purok 6", "Purok 7"],
  "Ondoy": ["Purok 1", "Purok 2", "Purok 3", "Purok 4"],
  "Poblacion": ["Purok 1", "Purok 2", "Purok 3", "Purok 4", "Purok 5", "Purok 6", "Purok 7"],
  "Polo": ["Purok 1", "Purok 2", "Purok 3", "Purok 4"],
  "Regador": ["Purok 1", "Purok 2", "Purok 3"],
  "Rivera": ["Purok 1", "Purok 2", "Purok 3", "Purok 4"],
  "Rizal": ["Purok 1", "Purok 2", "Purok 3"],
  "San Isidro": ["Purok 1", "Purok 2", "Purok 3", "Purok 4"],
  "San Jose": ["Purok 1", "Purok 2", "Purok 3"],
  "Santa Cruz": ["Purok 1", "Purok 2", "Purok 3", "Purok 4"],
  "Tagbaya": ["Purok 1", "Purok 2", "Purok 3"],
  "Tul-atog": ["Purok 1", "Purok 2", "Purok 3"],
  "Unat": ["Purok 1", "Purok 2", "Purok 3"],
  "Yawan": ["Purok 1", "Purok 2", "Purok 3", "Purok 4"],
  "Cabano": ["Purok 1", "Purok 2", "Purok 3"],
  "Jawili": ["Purok 1", "Purok 2", "Purok 3"],
  "Pangihan": ["Purok 1", "Purok 2", "Purok 3", "Purok 4"],
};