import React from 'react';
import { Clock, Calendar } from 'lucide-react';

interface ScheduleSectionProps {
  scheduleAt?: Date;
  onChange: (date: Date | undefined) => void;
}

const ScheduleSection: React.FC<ScheduleSectionProps> = ({ scheduleAt, onChange }) => {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val ? new Date(val) : undefined);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
        <Clock size={16} className="text-blue-600" />
        Schedule Post
      </h3>
      
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Publish Date & Time
        </label>
        <div className="relative">
          <input
            type="datetime-local"
            value={scheduleAt ? new Date(scheduleAt.getTime() - scheduleAt.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''}
            onChange={handleDateChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          />
        </div>
        <p className="mt-2 text-[10px] text-gray-400">
          Leave empty to publish immediately when clicking "Publish".
        </p>
      </div>
    </div>
  );
};

export default ScheduleSection;
