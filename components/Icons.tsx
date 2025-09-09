import React from 'react';

const iconProps = {
  className: "w-6 h-6",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const HomeIcon = () => <svg {...iconProps}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
export const ConsultsIcon = () => <svg {...iconProps}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
export const PrescriptionsIcon = () => <svg {...iconProps}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><path d="m9.5 14.5 2 2 4-4" /></svg>;
export const QRIcon = () => <svg {...iconProps}><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect></svg>;
export const ProfileIcon = () => <svg {...iconProps}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
export const LogoIcon = () => <svg className="w-16 h-16 text-teal-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.5 14H15v-2h1.5v2zm0-4H15v-2h1.5v2zm-5 4h-2v-4h2v4zm-2-6V8h2v2h-2zm-2 6H8v-4h1.5v4zM8 8h1.5v2H8V8zm4-2.5c.83 0 1.5.67 1.5 1.5S12.83 8.5 12 8.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5z"/></svg>;
export const SendIcon = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" clipRule="evenodd"></path></svg>;
export const ArrowLeftIcon = () => <svg {...iconProps} strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>;
export const LogoutIcon = () => <svg {...iconProps}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>;
export const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...iconProps} {...props}><polyline points="6 9 12 15 18 9"></polyline></svg>;
export const CheckCircleIcon = () => <svg {...iconProps} className="w-16 h-16 text-green-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>;
export const XCircleIcon = () => <svg {...iconProps} className="w-16 h-16 text-red-500"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>;
export const ChatBubbleIcon = () => <svg {...iconProps}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>;

export const StethoscopeIcon = () => <svg {...iconProps}><path d="M4.8 2.3A.3.3 0 1 0 5.4 2l-1.3 4.1c-.1.4.3.8.7.7l4.1-1.3a.3.3 0 1 0-.6-.4l-4-1.2Z"/><path d="M11.2 6.8c-.5-.5-1.2-.6-1.8-.1l-1.6 1.6c-.3.3-.3.8 0 1.1l2.5 2.5c.3.3.8.3 1.1 0l1.6-1.6c.5-.5.4-1.3-.1-1.8l-1.7-1.7Z"/><path d="m14 14 3 3"/><path d="M22 12c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8"/></svg>;
export const AlertTriangleIcon = () => <svg {...iconProps}><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>;
export const ClipboardListIcon = () => <svg {...iconProps}><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>;

export const EditIcon = () => <svg {...iconProps} className="w-5 h-5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
export const PhoneIcon = () => <svg {...iconProps}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>;
export const MapPinIcon = () => <svg {...iconProps}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;
export const TrashIcon = () => <svg {...iconProps} className="w-5 h-5"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>;

export const UserIcon = () => <svg {...iconProps}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
export const UsersIcon = () => <svg {...iconProps}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
export const CheckIcon = () => <svg {...iconProps} className="w-5 h-5 text-teal-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>;

export const UserPlusIcon = () => <svg {...iconProps}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>;
export const UserCheckIcon = () => <svg {...iconProps}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>;
export const ChartBarIcon = () => <svg {...iconProps}><path d="M3 3v18h18"/><path d="M9 17V9"/><path d="M15 17V5"/><path d="M12 17v-4"/></svg>;
export const UsersGroupIcon = () => <svg {...iconProps}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
export const PillIcon = () => <svg {...iconProps}><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>;
export const CheckBadgeIcon = () => <svg {...iconProps}><path d="M3.85 8.62a4 4 0 0 1 4.78-4.78l1.41 1.41a2 2 0 0 0 2.82 0l1.41-1.41a4 4 0 1 1 4.78 4.78l-1.41 1.41a2 2 0 0 0 0 2.82l1.41 1.41a4 4 0 1 1-4.78 4.78l-1.41-1.41a2 2 0 0 0-2.82 0l-1.41 1.41a4 4 0 1 1-4.78-4.78l1.41-1.41a2 2 0 0 0 0-2.82z"/><path d="m9 12 2 2 4-4"/></svg>;
export const IdIcon = () => <svg {...iconProps}><rect x="2" y="4" width="20" height="16" rx="2"/><circle cx="8" cy="10" r="2"/><path d="M12 14h6"/><path d="M12 10h6"/></svg>;
export const SparklesIcon = () => <svg {...iconProps} className="w-5 h-5" strokeWidth="1.5"><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z"/></svg>;
export const StarIcon = () => <svg {...iconProps} className="w-5 h-5" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>;