import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { Screens, IBAJAY_ADDRESS_DATA } from '../../constants';
import { useTranslation } from '../../hooks/useTranslation';
import type { ResidentRecord, StructuredAddress, BhwNotification } from '../../types';
import { TrashIcon, EditIcon, UserPlusIcon, UserCheckIcon, UsersIcon } from '../../components/Icons';
import { MockChart, StatCard } from '../../components/Dashboard';

const barangayOptions = Object.keys(IBAJAY_ADDRESS_DATA);

const ResidentRecordModal: React.FC<{ onClose: () => void, recordToEdit?: ResidentRecord | null }> = ({ onClose, recordToEdit }) => {
    const { user, addResidentRecord, updateResidentRecord, t } = useAppContext();
    const isEditMode = !!recordToEdit;

    const [name, setName] = useState(recordToEdit?.name || '');
    const [contactNumber, setContactNumber] = useState(recordToEdit?.contactNumber || '');
    const [selectedBarangay, setSelectedBarangay] = useState(recordToEdit?.address.barangay || user?.assignedBarangay || barangayOptions[0]);
    const [selectedPurok, setSelectedPurok] = useState(recordToEdit?.address.purok || IBAJAY_ADDRESS_DATA[recordToEdit?.address.barangay || user?.assignedBarangay || barangayOptions[0]][0]);
    const [streetAddress, setStreetAddress] = useState(recordToEdit?.address.streetAddress || '');

    const purokOptions = useMemo(() => {
        return IBAJAY_ADDRESS_DATA[selectedBarangay] || [];
    }, [selectedBarangay]);

    const handleBarangayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newBarangay = e.target.value;
        setSelectedBarangay(newBarangay);
        setSelectedPurok(IBAJAY_ADDRESS_DATA[newBarangay][0]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !contactNumber.trim() || !streetAddress.trim()) {
            alert("Please fill in all fields.");
            return;
        }

        const address: StructuredAddress = {
            barangay: selectedBarangay,
            purok: selectedPurok,
            streetAddress
        };

        const recordDetails = {
            name,
            contactNumber,
            address,
        };

        if (isEditMode) {
            updateResidentRecord(recordToEdit.id, recordDetails);
            alert(t('bhw_record_updated_alert', { name }));
        } else {
            addResidentRecord(recordDetails);
            alert(t('bhw_record_created_alert', { name }));
        }
        onClose();
    };

    return (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
                <h2 className="text-xl font-bold mb-4 text-gray-800">{t(isEditMode ? 'bhw_modal_edit_title' : 'bhw_modal_add_title')}</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder={t('register_fullname_label')} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" required />
                    <input type="tel" value={contactNumber} onChange={e => setContactNumber(e.target.value)} placeholder={t('register_phone_label')} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" required />
                    
                    <div>
                        <label htmlFor="barangay" className="block text-xs font-medium text-gray-700">{t('register_barangay_label')}</label>
                        <select 
                            id="barangay" 
                            value={selectedBarangay} 
                            onChange={handleBarangayChange} 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-100"
                            disabled
                        >
                            <option value={selectedBarangay}>{selectedBarangay}</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="purok" className="block text-xs font-medium text-gray-700">{t('register_purok_label')}</label>
                        <select id="purok" value={selectedPurok} onChange={e => setSelectedPurok(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                            {purokOptions.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>

                    <input type="text" value={streetAddress} onChange={e => setStreetAddress(e.target.value)} placeholder={t('register_street_address_label')} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" required />

                    <div className="flex justify-end space-x-2 pt-2">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">{t('guest_modal_cancel')}</button>
                        <button type="submit" className="bg-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-600">{t(isEditMode ? 'bhw_modal_save_button' : 'bhw_modal_add_button')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

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

const RejectReasonModal: React.FC<{ onClose: () => void; onSubmit: (reason: string) => void; }> = ({ onClose, onSubmit }) => {
    const [reason, setReason] = useState('');
    const { t } = useTranslation();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason.trim()) {
            alert("Please provide a reason for resubmission.");
            return;
        }
        onSubmit(reason);
    };

    return (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
                <h2 className="text-xl font-bold mb-2 text-gray-800">{t('bhw_reject_modal_title')}</h2>
                <p className="text-sm text-gray-600 mb-4">{t('bhw_reject_modal_prompt')}</p>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <textarea
                        rows={3}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        placeholder={t('bhw_reject_modal_placeholder')}
                        required
                    />
                    <div className="flex justify-end space-x-2 pt-2">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">{t('guest_modal_cancel')}</button>
                        <button type="submit" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">{t('bhw_reject_modal_submit_button')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const ResidentRecordCard: React.FC<{ record: ResidentRecord; onDelete: () => void; onEdit: () => void; }> = ({ record, onDelete, onEdit }) => {
    return (
        <div className="w-full text-left p-2 flex justify-between items-center text-sm border-b border-gray-100 last:border-b-0">
            <div className="flex items-center space-x-3">
                <img src={`https://ui-avatars.com/api/?name=${record.name.replace(' ', '+')}&background=random&color=fff`} alt={record.name} className="w-8 h-8 rounded-full" />
                <div>
                    <p className="font-semibold text-gray-800">{record.name}</p>
                    <p className="text-gray-500 text-xs">{`${record.address.purok}`}</p>
                </div>
            </div>
            <div className="flex items-center space-x-1">
                <button
                    onClick={(e) => { e.stopPropagation(); onEdit(); }}
                    className="p-2 text-blue-500 hover:bg-blue-100 rounded-full transition-colors"
                    aria-label={`Edit record for ${record.name}`}
                >
                    <EditIcon />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                    aria-label={`Delete record for ${record.name}`}
                >
                    <TrashIcon />
                </button>
            </div>
        </div>
    );
};


const BHWDashboard: React.FC = () => {
    const { user, logout, navigateTo, t, residentRecords, deleteResidentRecord, bhwStats, bhwNotifications, approveIdVerification, rejectIdVerification } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [recordToEdit, setRecordToEdit] = useState<ResidentRecord | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState<ResidentRecord | null>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [rejectModalNotif, setRejectModalNotif] = useState<BhwNotification | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleConfirmDelete = () => {
        if (recordToDelete) {
            deleteResidentRecord(recordToDelete.id);
            setRecordToDelete(null);
        }
    };
    
    const handleOpenAddModal = () => {
        setRecordToEdit(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (record: ResidentRecord) => {
        setRecordToEdit(record);
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setRecordToEdit(null);
    };

    const handleRejectSubmit = (reason: string) => {
        if (rejectModalNotif) {
            rejectIdVerification(rejectModalNotif.id, reason);
            setRejectModalNotif(null);
        }
    };

    const handleExport = () => {
        setIsExporting(true);

        const escapeCsvCell = (cellData: string | undefined | null): string => {
            if (cellData === null || cellData === undefined) return '';
            const str = String(cellData);
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        };

        const headers = ['Record ID', 'Full Name', 'Contact Number', 'Barangay', 'Purok', 'Street Address'];

        const rows = residentRecords.map(r => [
            escapeCsvCell(r.id),
            escapeCsvCell(r.name),
            escapeCsvCell(r.contactNumber),
            escapeCsvCell(r.address.barangay),
            escapeCsvCell(r.address.purok),
            escapeCsvCell(r.address.streetAddress),
        ].join(','));

        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'ebotika_bhw_resident_masterlist.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setTimeout(() => setIsExporting(false), 1000);
    };


    return (
        <div className="relative flex flex-col h-full">
            {isModalOpen && <ResidentRecordModal onClose={handleCloseModal} recordToEdit={recordToEdit} />}
            {recordToDelete && (
                <ConfirmationModal 
                    title={t('bhw_delete_confirm_title')}
                    text={t('bhw_delete_confirm_text', { name: recordToDelete.name })}
                    onConfirm={handleConfirmDelete}
                    onClose={() => setRecordToDelete(null)}
                />
            )}
            {rejectModalNotif && (
                <RejectReasonModal 
                    onClose={() => setRejectModalNotif(null)}
                    onSubmit={handleRejectSubmit}
                />
            )}
            <header className="bg-white p-4 shadow-md z-10">
                 <div className="flex justify-between items-center">
                    <div className="relative" ref={dropdownRef}>
                        <button onClick={() => setIsDropdownOpen(prev => !prev)} className="flex-shrink-0 block">
                            {user?.avatarUrl ? (
                                <img src={user.avatarUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                                <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-xl font-bold">
                                    {user?.name?.charAt(0) || 'B'}
                                </div>
                            )}
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-100">
                                <button
                                    onClick={() => {
                                        navigateTo(Screens.PROFESSIONAL_PROFILE_EDIT);
                                        setIsDropdownOpen(false);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    {t('profile_edit_button')}
                                </button>
                                <button
                                    onClick={logout}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                    {t('profile_logout_button')}
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="text-right">
                        <h1 className="text-2xl font-bold text-gray-800">{t('bhw_dashboard_title')}</h1>
                        <p className="text-sm text-gray-500">Welcome, {user?.name || 'BHW'}</p>
                    </div>
                </div>
                {user?.assignedBarangay && (
                    <div className="mt-2 text-center bg-blue-50 text-blue-700 font-semibold py-1 rounded-md text-sm">
                        {t('bhw_managing_barangay_header', { barangay: user.assignedBarangay })}
                    </div>
                )}
                 <div className="mt-3 grid grid-cols-2 gap-2">
                    <button 
                        onClick={() => navigateTo(Screens.FORUM)}
                        className="w-full bg-teal-500 text-white text-sm font-bold py-2 px-4 rounded-lg shadow hover:bg-teal-600 transition"
                    >
                        Professionals Forum
                    </button>
                     <button 
                        onClick={() => navigateTo(Screens.PROFESSIONALS_DIRECTORY)}
                        className="w-full bg-blue-500 text-white text-sm font-bold py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition"
                    >
                        Private Chat
                    </button>
                 </div>
            </header>
            <main className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4 custom-scrollbar">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <StatCard title={t('bhw_stat_total_residents')} value={residentRecords.length} icon={<UsersIcon />} />
                    <StatCard title={t('bhw_stat_pending_verifications')} value={bhwNotifications.length} icon={<UserCheckIcon />} />
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                     <h2 className="font-bold text-lg text-gray-800 mb-3">{t('bhw_quick_actions_title')}</h2>
                     <div className="grid grid-cols-1 gap-3">
                         <button 
                            onClick={handleOpenAddModal}
                            className="w-full flex flex-col items-center justify-center bg-green-50 text-green-700 font-bold py-3 px-2 rounded-lg hover:bg-green-100 transition"
                        >
                            <UserPlusIcon />
                            <span className="mt-1 text-sm">{t('bhw_add_resident_record_button')}</span>
                        </button>
                     </div>
                </div>


                 <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="font-bold text-lg text-gray-800 mb-2">{t('bhw_verifications_title')}</h2>
                    <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                        {bhwNotifications.length > 0 ? (
                            bhwNotifications.map(notif => (
                                <div key={notif.id} className="bg-yellow-50 p-2 rounded-md flex justify-between items-center">
                                    <div className="flex items-center space-x-3">
                                        <img src={`https://ui-avatars.com/api/?name=${notif.userName.replace(' ', '+')}&background=EAB308&color=fff`} alt={notif.userName} className="w-8 h-8 rounded-full" />
                                        <div>
                                            <p className="font-semibold text-sm text-yellow-800">{notif.userName}</p>
                                            <a href={notif.validIdUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">View Submitted ID</a>
                                        </div>
                                    </div>
                                    <div className="flex space-x-1">
                                         <button
                                            onClick={() => setRejectModalNotif(notif)}
                                            className="bg-orange-100 text-orange-600 text-xs font-bold py-1 px-2 rounded-full hover:bg-orange-200 transition"
                                        >
                                            {t('bhw_reject_button')}
                                        </button>
                                        <button
                                            onClick={() => approveIdVerification(notif.id)}
                                            className="bg-green-100 text-green-600 text-xs font-bold py-1 px-2 rounded-full hover:bg-green-200 transition"
                                        >
                                            {t('bhw_approve_button')}
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-sm text-gray-500 py-4">No pending verifications.</p>
                        )}
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="font-bold text-lg text-gray-800">{t('bhw_resident_record_list_title')}</h2>
                         <button 
                            onClick={handleExport}
                            disabled={isExporting}
                            className="bg-gray-100 text-gray-600 text-xs font-bold py-1 px-3 rounded-full hover:bg-gray-200 transition disabled:opacity-50"
                        >
                            {isExporting ? t('bhw_exporting_button') : t('bhw_export_button_short')}
                        </button>
                    </div>
                    <div className="space-y-1 max-h-72 overflow-y-auto custom-scrollbar">
                        {residentRecords.length > 0 ? (
                            residentRecords.map(record => (
                                <ResidentRecordCard 
                                    key={record.id} 
                                    record={record} 
                                    onDelete={() => setRecordToDelete(record)}
                                    onEdit={() => handleOpenEditModal(record)}
                                />
                            ))
                        ) : (
                            <p className="text-center text-sm text-gray-500 py-4">No resident records added yet.</p>
                        )}
                    </div>
                </div>
                
                {bhwStats && (
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h2 className="text-xl font-bold text-gray-800 mb-3">{t('bhw_analytics_title')}</h2>
                        <div className="space-y-4">
                            <MockChart data={bhwStats.weeklyRecordsAdded} title={t('bhw_weekly_chart_title')} />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default BHWDashboard;