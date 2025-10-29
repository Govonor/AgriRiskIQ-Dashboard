import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar, Legend
} from "recharts";

export default function AnalyticsPanel() {
  // Mock sample trends (past 6 months)
  const ndviData = [
    { month: "May", value: 0.42 },
    { month: "Jun", value: 0.47 },
    { month: "Jul", value: 0.51 },
    { month: "Aug", value: 0.56 },
    { month: "Sep", value: 0.63 },
    { month: "Oct", value: 0.61 },
  ];

  const rainfallData = [
    { month: "May", mm: 42 },
    { month: "Jun", mm: 55 },
    { month: "Jul", mm: 70 },
    { month: "Aug", mm: 63 },
    { month: "Sep", mm: 58 },
    { month: "Oct", mm: 74 },
  ];

  const riskData = [
    { category: "Low", value: 35 },
    { category: "Moderate", value: 45 },
    { category: "High", value: 20 },
  ];

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* NDVI Trend */}
      <div className="bg-white rounded-lg shadow p-4">
        <h4 className="font-semibold text-green-700 text-sm mb-2">
          🌿 Vegetation (NDVI) Trend
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={ndviData}>
            <defs>
              <linearGradient id="colorNdvi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34A853" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#34A853" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="month" stroke="#888" />
            <YAxis domain={[0, 1]} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#34A853"
              fillOpacity={1}
              fill="url(#colorNdvi)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Rainfall Trend */}
      <div className="bg-white rounded-lg shadow p-4">
        <h4 className="font-semibold text-blue-600 text-sm mb-2">
          ☔ Rainfall (mm)
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={rainfallData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke="#888" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="mm"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Risk Distribution */}
      <div className="bg-white rounded-lg shadow p-4">
        <h4 className="font-semibold text-red-600 text-sm mb-2">
          🔥 Risk Level Distribution
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={riskData}>
            <XAxis dataKey="category" stroke="#888" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#E53935" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
