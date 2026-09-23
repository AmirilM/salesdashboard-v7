import { Boxes } from 'lucide-react';

export const Product = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Boxes className="h-6 w-6 text-blue-600" />
          Product Performance
        </h2>
        <p className="text-gray-500">
          This page will show sales performance by product/brand/SKU with drill-down capability.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Coming Soon</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Top products by revenue</li>
          <li>Brand performance comparison</li>
          <li>SKU-level detail analysis</li>
          <li>Product category breakdown</li>
        </ul>
      </div>
    </div>
  );
};
