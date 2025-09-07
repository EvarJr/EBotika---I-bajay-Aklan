import React from 'react';
import type { AISummary } from '../types';
import { StethoscopeIcon, AlertTriangleIcon, ClipboardListIcon } from './Icons';
import { useTranslation } from '../hooks/useTranslation';

const urgencyStyles = {
    Low: { border: 'border-l-green-500', text: 'text-green-800' },
    Medium: { border: 'border-l-yellow-500', text: 'text-yellow-800' },
    High: { border: 'border-l-orange-500', text: 'text-orange-800' },
    Critical: { border: 'border-l-red-500', text: 'text-red-800' },
};

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; children: React.ReactNode; }> = ({ icon, label, children }) => (
    <div>
        <div className="flex items-center text-sm font-semibold text-gray-600">
            {icon}
            <span className="ml-2">{label}</span>
        </div>
        <div className="pl-8 mt-1 text-gray-800">
            {children}
        </div>
    </div>
);

export const AISummaryCard: React.FC<{ summary: AISummary }> = ({ summary }) => {
    const { t } = useTranslation();
    const styles = urgencyStyles[summary.urgency_level];
    
    return (
        <div className={`bg-white p-4 rounded-lg shadow-md border-l-4 ${styles.border} mt-4 animate-fade-in`}>
            <h3 className="font-bold text-lg text-gray-800 mb-4">{t('ai_summary_title')}</h3>
            <div className="space-y-4">
                <InfoRow icon={<StethoscopeIcon />} label={t('ai_summary_suggestion')}>
                    <p>{summary.diagnosis_suggestion}</p>
                </InfoRow>
                <InfoRow icon={<AlertTriangleIcon />} label={t('ai_summary_urgency')}>
                    <p className={`font-bold ${styles.text}`}>{summary.urgency_level}</p>
                </InfoRow>
                <InfoRow icon={<ClipboardListIcon />} label={t('ai_summary_recommendation')}>
                    <p className="text-sm whitespace-pre-wrap">{summary.recommendation}</p>
                </InfoRow>
            </div>
        </div>
    );
};