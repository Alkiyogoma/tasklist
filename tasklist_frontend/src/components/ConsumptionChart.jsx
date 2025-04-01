import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ConsumptionChart = ({ data }) => {
  console.log("ConsumptionChart received data:", data);

  // Enhanced validation with detailed logging
  if (!data) {
    console.log("Chart data is undefined or null");
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No consumption data available</p>
      </div>
    );
  }

  if (!Array.isArray(data)) {
    console.log("Chart data is not an array, type:", typeof data);
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Invalid data format</p>
      </div>
    );
  }

  if (data.length === 0) {
    console.warn("Chart data array is empty");
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No consumption data available</p>
      </div>
    );
  }

  // Define colors for different utility types
  const colors = {
    electricity: '#F59E0B', // Yellow
    water: '#3B82F6',       // Blue
    gas: '#10B981',         // Green
  };

  // Log the first data item to help with debugging
  console.log("First data item:", data[0]);
  
  // Find available utility types in the data
  const availableTypes = Object.keys(data[0])
    .filter(key => {
      // Exclude non-utility properties
      const nonUtilityKeys = ['date', 'month', 'period', 'id'];
      return !nonUtilityKeys.includes(key) && data[0][key] !== undefined;
    });
  
  console.log("Available utility types:", availableTypes);

  // Format large numbers for display
  const formatValue = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value.toFixed(2);
  };
  
  // Custom tooltip to display formatted values
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded shadow-lg border border-gray-200">
          <p className="text-gray-600 font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value !== null && entry.value !== undefined ? formatValue(entry.value) : '0'}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => {
            if (!value) return '';
            try {
              const date = new Date(value);
              if (isNaN(date.getTime())) return value;
              return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            } catch (e) {
              console.log("Date parsing error:", e);
              return value;
            }
          }}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => formatValue(value)}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {availableTypes.map((type) => (
          <Line
            key={type}
            type="monotone"
            dataKey={type}
            name={type.charAt(0).toUpperCase() + type.slice(1)}
            stroke={colors[type] || '#999'}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ConsumptionChart;