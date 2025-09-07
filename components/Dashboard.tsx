import React from 'react';

// A reusable card for displaying key statistics on dashboards.
export const StatCard: React.FC<{ title: string; value: string | number; subtitle?: string; icon?: React.ReactNode; }> = ({ title, value, subtitle, icon }) => (
    <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center">
            {icon && <div className="mr-4 text-teal-500 bg-teal-100 p-3 rounded-lg">{icon}</div>}
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
                {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
            </div>
        </div>
    </div>
);

// A reusable mock chart component for data visualization placeholders.
export const MockChart: React.FC<{data: any[], title: string}> = ({data, title}) => {
    const values = data.map(item => item.uv || item.count || 0);
    const maxValue = Math.max(...values, 1); // Avoid division by zero

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-gray-700 mb-2">{title}</h3>
            <div className="bg-gray-100 p-4 rounded-md h-48 flex items-center justify-center">
                <div className="flex items-end h-full w-full justify-around">
                    {data.map((item, index) => {
                        const value = item.uv || item.count || 0;
                        const heightPercent = (value / maxValue) * 100;
                        return (
                            <div key={index} className="flex flex-col items-center w-8">
                                <div 
                                    className="w-full bg-teal-400 rounded-t-sm hover:bg-teal-500 transition-colors" 
                                    style={{ height: `${heightPercent}%` }}
                                    title={`${item.name || item.day}: ${value}`}
                                ></div>
                                <span className="text-xs mt-1 text-gray-500">{item.name || item.day}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};