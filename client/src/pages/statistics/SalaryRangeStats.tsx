import React from 'react';

interface SalaryRangeStatsProps {
  data: Array<{
    range: string;
    count: number;
  }>;
}

const SalaryRangeStats: React.FC<SalaryRangeStatsProps> = ({ data }) => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sr.No
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Salary Range
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Employee Count
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.range}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalaryRangeStats;
