import { CalendarDays } from 'lucide-react';

export const Daily = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CalendarDays className="h-6 w-6 text-blue-600" />
          Daily Report
        </h2>
        <p className="text-gray-500">
          This page will show daily sales performance with date-range filtering.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Coming Soon</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Daily transaction summary</li>
          <li>Date picker for period selection</li>
          <li>Hourly sales breakdown</li>
          <li>Staff performance by date</li>
        </ul>
      </div>
    </div>
  );
};
