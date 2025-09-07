import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { MockChart, StatCard } from '../../components/Dashboard';
import { Screens } from '../../constants';
import { useTranslation } from '../../hooks/useTranslation';
import type { User } from '../../types';
import { ChevronDownIcon, TrashIcon, UsersGroupIcon, UserCheckIcon } from '../../components/Icons';

type AddUserModalProps = {
    onClose: () => void;
    titleKey: string;
    allowedRoles: Array<{ value: 'doctor' | 'pharmacy' | 'bhw'; labelKey: string }>;
};

const AddUserModal: React.FC<AddUserModalProps> = ({ onClose, titleKey, allowedRoles }) => {
    const { addProfessionalUser, t } = useAppContext();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(allowedRoles[0].value);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !email.trim() || !password.trim()) {
            alert("Please fill in all fields.");
            return;
        }
        const newUser: Omit<User, 'id' | 'status'> = {
            name,
            email,
            password,
            role,
            address: { barangay: '', purok: '', streetAddress: ''},
        };
        addProfessionalUser(newUser);
        alert(t('rhu_user_created_alert', { name }));
        onClose();
    };

    return (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
                <h2 className="text-xl font-bold mb-4 text-gray-800">{t(titleKey)}</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder={t('register_fullname_label')} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" required />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t('login_email_label')} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" required />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={t('login_password_label')} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" required />
                    
                    <label htmlFor="role" className="block text-xs font-medium text-gray-700 pt-1">{t('rhu_modal_role_label')}</label>
                    <select id="role" value={role} onChange={e => setRole(e.target.value as 'doctor' | 'pharmacy' | 'bhw')} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm -mt-1">
                        {allowedRoles.map(r => (
                            <option key={r.value} value={r.value}>{t(r.labelKey)}</option>
                        ))}
                    </select>

                    <div className="flex justify-end space-x-2 pt-2">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">{t('guest_modal_cancel')}</button>
                        <button type="submit" className="bg-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-600">{t('rhu_modal_create_button')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const PatientCard: React.FC<{ patient: User }> = ({ patient }) => {
    const { navigateTo, setActivePatientForManagement, t } = useAppContext();

    const handleReview = () => {
        setActivePatientForManagement(patient);
        navigateTo(Screens.PATIENT_DETAIL_MANAGEMENT);
    };

    const isBanned = patient.status === 'banned';

    return (
        <button 
            onClick={handleReview}
            className={`w-full text-left bg-white p-2 rounded-md flex justify-between items-center text-sm hover:bg-gray-200 transition ${isBanned ? 'opacity-60' : ''}`}
        >
            <div className="flex items-center space-x-2">
                <img src={patient.avatarUrl || `https://ui-avatars.com/api/?name=${patient.name.replace(' ', '+')}&background=random`} alt={patient.name} className="w-8 h-8 rounded-full object-cover" />
                <div>
                    <p className="font-semibold text-gray-800">{patient.name}</p>
                    <p className="text-gray-500">{patient.email}</p>
                </div>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${isBanned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                {isBanned ? t('patient_status_banned') : t('patient_status_active')}
            </span>
        </button>
    );
};

const BarangayAccordion: React.FC<{ barangay: string; patients: User[]; }> = ({ barangay, patients }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-t border-gray-200 last:border-b">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 transition"
            >
                <span className="font-semibold text-gray-700">{barangay} ({patients.length})</span>
                <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="p-2 space-y-2 bg-gray-50/50">
                    {patients.map(patient => (
                        <PatientCard key={patient.id} patient={patient} />
                    ))}
                </div>
            )}
        </div>
    );
};


const ProfessionalUserCard: React.FC<{ user: User; onDelete?: () => void }> = ({ user, onDelete }) => (
    <div className="bg-gray-50 p-2 rounded-md flex justify-between items-center text-sm">
        <div>
            <p className="font-semibold text-gray-800">{user.name}</p>
            <p className="text-gray-500">{user.email}</p>
        </div>
        {onDelete && (
            <button
                onClick={onDelete}
                className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                aria-label={`Delete user ${user.name}`}
            >
                <TrashIcon />
            </button>
        )}
    </div>
);

const ConfirmationModal: React.FC<{
    title: string;
    text: string;
    onConfirm: () => void;
    onClose: () => void;
}> = ({ title, text, onConfirm, onClose }) => {
    const { t } = useTranslation();
    return (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
                <h2 className="text-xl font-bold mb-2 text-gray-800">{title}</h2>
                <p className="text-sm text-gray-600 mb-6">{text}</p>
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

const RHUDashboard: React.FC = () => {
    const { user, logout, navigateTo, t, users, consultations, prescriptions, deleteUser, rhuStats } = useAppContext();
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'management'>('overview');
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    const doctors = users.filter(u => u.role === 'doctor');
    const bhws = users.filter(u => u.role === 'bhw');
    const pharmacists = users.filter(u => u.role === 'pharmacy');
    const patientUsers = users.filter(u => u.role === 'patient');

    const professionalCount = doctors.length + bhws.length + pharmacists.length;

    const groupedPatients = useMemo(() => {
        return patientUsers.reduce<Record<string, User[]>>((acc, patient) => {
            const barangay = patient.address?.barangay || t('doctor_inbox_unknown_barangay');
            if (!acc[barangay]) acc[barangay] = [];
            acc[barangay].push(patient);
            return acc;
        }, {});
    }, [patientUsers, t]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsDropdownOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleConfirmDelete = () => {
        if (userToDelete) {
            deleteUser(userToDelete.id);
            setUserToDelete(null);
        }
    };

    const handleExport = () => {
        setIsExporting(true);
        const escapeCsvCell = (cellData: any): string => {
            if (cellData === null || cellData === undefined) return '';
            const str = String(cellData);
            if (str.includes(',') || str.includes('"') || str.includes('\n')) return `"${str.replace(/"/g, '""')}"`;
            return str;
        };
        const headers = ['Consultation ID', 'Patient Name', 'Date', 'Symptoms', 'AI Diagnosis Suggestion', 'AI Urgency Level', 'AI Recommendation', 'Status', 'Prescribed Medicine', 'Dosage'];
        const rows = consultations.map(c => {
            const prescription = prescriptions.find(p => p.consultationId === c.id);
            let medicine = 'N/A', dosage = 'N/A';
            if (prescription) {
                if (prescription.status === 'Approved' || prescription.status === 'Remitted') {
                    medicine = prescription.medicine || 'N/A';
                    dosage = prescription.dosage || 'N/A';
                } else if (prescription.status === 'Pending') {
                    medicine = 'Pending Doctor Review';
                } else if (prescription.status === 'Denied') {
                    medicine = 'Prescription Denied';
                }
            }
            return [escapeCsvCell(c.id), escapeCsvCell(c.patient.name), escapeCsvCell(c.date), escapeCsvCell(c.symptoms.join('; ')), escapeCsvCell(c.aiSummary?.diagnosis_suggestion), escapeCsvCell(c.aiSummary?.urgency_level), escapeCsvCell(c.aiSummary?.recommendation), escapeCsvCell(c.status), escapeCsvCell(medicine), escapeCsvCell(dosage)].join(',');
        });
        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'ebotika_consultations_export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => setIsExporting(false), 1000);
    };

    return (
        <div className="relative flex flex-col h-full">
            {isAddUserModalOpen && (
                <AddUserModal 
                    onClose={() => setIsAddUserModalOpen(false)}
                    titleKey="rhu_modal_professional_title"
                    allowedRoles={[
                        { value: 'doctor', labelKey: 'rhu_modal_role_doctor' },
                        { value: 'pharmacy', labelKey: 'rhu_modal_role_pharmacy' },
                        { value: 'bhw', labelKey: 'rhu_modal_role_bhw' },
                    ]}
                />
            )}
            {userToDelete && <ConfirmationModal title={t('rhu_delete_user_confirm_title')} text={t('rhu_delete_user_confirm_text', { name: userToDelete.name })} onConfirm={handleConfirmDelete} onClose={() => setUserToDelete(null)} />}
            
            <header className="bg-white p-4 shadow-md z-10">
                 <div className="flex justify-between items-center">
                    <div className="relative" ref={dropdownRef}>
                        <button onClick={() => setIsDropdownOpen(prev => !prev)} className="flex-shrink-0 block">
                            {user?.avatarUrl ? <img src={user.avatarUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-xl font-bold">{user?.name?.charAt(0) || 'A'}</div>}
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-100">
                                <button onClick={() => { navigateTo(Screens.PROFESSIONAL_PROFILE_EDIT); setIsDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t('profile_edit_button')}</button>
                                <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">{t('profile_logout_button')}</button>
                            </div>
                        )}
                    </div>
                    <div className="text-right">
                        <h1 className="text-2xl font-bold text-gray-800">RHU Dashboard</h1>
                        <p className="text-sm text-gray-500">Welcome, {user?.name || 'Admin'}</p>
                    </div>
                </div>
                 <div className="mt-3 grid grid-cols-2 gap-2">
                    <button onClick={() => navigateTo(Screens.FORUM)} className="w-full bg-teal-500 text-white text-sm font-bold py-2 px-4 rounded-lg shadow hover:bg-teal-600 transition">Professionals Forum</button>
                    <button onClick={() => navigateTo(Screens.PROFESSIONALS_DIRECTORY)} className="w-full bg-blue-500 text-white text-sm font-bold py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition">Private Chat</button>
                 </div>
            </header>
            <main className="flex-1 flex flex-col overflow-y-auto bg-gray-50 custom-scrollbar">
                <div className="border-b border-gray-200 px-4 bg-white">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        <button onClick={() => setActiveTab('overview')} className={`${activeTab === 'overview' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}>{t('rhu_tab_overview')}</button>
                        <button onClick={() => setActiveTab('management')} className={`${activeTab === 'management' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}>{t('rhu_tab_management')}</button>
                    </nav>
                </div>
                
                <div className="p-4 space-y-4">
                    {activeTab === 'overview' && (
                        <div className="space-y-4 animate-fade-in">
                            {rhuStats ? (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <StatCard title={t('rhu_stat_patients')} value={patientUsers.length} icon={<UsersGroupIcon />} />
                                        <StatCard title={t('rhu_stat_professionals')} value={professionalCount} icon={<UserCheckIcon />} />
                                    </div>
                                    <MockChart data={rhuStats.weeklyConsultations} title="Weekly Consultations" />
                                    <MockChart data={rhuStats.urgencyBreakdown} title="Urgency Breakdown" />
                                    <div className="bg-white p-4 rounded-lg shadow">
                                        <h3 className="font-bold text-gray-700 mb-2">Top 5 Prescribed Medicines</h3>
                                        <ol className="list-decimal list-inside text-gray-600 text-sm space-y-1">
                                            {rhuStats.topPrescribed.map(med => <li key={med.name}>{med.name} ({med.count})</li>)}
                                        </ol>
                                    </div>
                                </>
                            ) : <div className="text-center text-gray-500">Loading stats...</div>}

                            <div className="bg-white p-4 rounded-lg shadow">
                                <h2 className="font-bold text-lg text-gray-800 mb-3">{t('pharmacy_reporting_title')}</h2>
                                <button onClick={handleExport} disabled={isExporting} className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-green-700 transition disabled:bg-green-400">
                                    {isExporting ? t('rhu_exporting_button') : t('rhu_export_button')}
                                </button>
                            </div>
                        </div>
                    )}
                    {activeTab === 'management' && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="bg-white p-4 rounded-lg shadow">
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="font-bold text-lg text-gray-800">{t('rhu_professional_users_title')}</h2>
                                    <button onClick={() => setIsAddUserModalOpen(true)} className="bg-teal-500 text-white text-sm font-bold py-2 px-4 rounded-lg shadow hover:bg-teal-600 transition">{t('rhu_add_professional_button')}</button>
                                </div>
                                <div className="space-y-4 mt-4">
                                    <div className="border-t pt-3">
                                        <h3 className="font-bold text-base text-blue-600 mb-2">{t('rhu_doctor_management_title')} ({doctors.length})</h3>
                                        <div className="space-y-1 max-h-24 overflow-y-auto custom-scrollbar pr-1">{doctors.map(doc => <ProfessionalUserCard key={doc.id} user={doc} onDelete={() => setUserToDelete(doc)} />)}</div>
                                    </div>
                                    <div className="border-t pt-3">
                                        <h3 className="font-bold text-base text-green-600 mb-2">{t('rhu_pharmacy_management_section_title')} ({pharmacists.length})</h3>
                                        <div className="space-y-1 max-h-24 overflow-y-auto custom-scrollbar pr-1">{pharmacists.map(ph => <ProfessionalUserCard key={ph.id} user={ph} onDelete={() => setUserToDelete(ph)} />)}</div>
                                    </div>
                                    <div className="border-t pt-3">
                                        <h3 className="font-bold text-base text-orange-600 mb-2">{t('rhu_bhw_management_section_title')} ({bhws.length})</h3>
                                        <div className="space-y-1 max-h-24 overflow-y-auto custom-scrollbar pr-1">{bhws.map(bhw => <ProfessionalUserCard key={bhw.id} user={bhw} onDelete={() => setUserToDelete(bhw)} />)}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg shadow">
                                <h2 className="font-bold text-lg text-gray-800 mb-2">{t('rhu_patient_management_title')} ({patientUsers.length})</h2>
                                <div className="max-h-60 overflow-y-auto custom-scrollbar border rounded-md">
                                    {Object.entries(groupedPatients).map(([barangay, patients]) => (
                                        <BarangayAccordion key={barangay} barangay={barangay} patients={patients} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default RHUDashboard;