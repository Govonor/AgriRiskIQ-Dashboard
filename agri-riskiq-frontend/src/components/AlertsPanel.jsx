// src/components/AlertsPanel.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState(() => {
    const saved = localStorage.getItem("agri_alerts_v1");
    return saved ? JSON.parse(saved) : [];
  });

  // Save alerts persistently
  useEffect(() => {
    localStorage.setItem("agri_alerts_v1", JSON.stringify(alerts));
  }, [alerts]);

  // Simulate AI alerts (frontend-only)
  useEffect(() => {
    const interval = setInterval(() => {
      const types = [
        { label: "Drought", color: "red", level: "critical" },
        { label: "Flood", color: "orange", level: "warning" },
        { label: "Pest Outbreak", color: "yellow", level: "warning" },
        { label: "Credit Default Risk", color: "green", level: "info" },
      ];
      const selected = types[Math.floor(Math.random() * types.length)];
      const score = Math.round(50 + Math.random() * 50);

      const newAlert = {
        id: Date.now(),
        title: `${selected.label} Risk (${score}%)`,
        message: `Predicted ${selected.label.toLowerCase()} risk detected with confidence score ${score}%.`,
        color: selected.color,
        level: selected.level,
        createdAt: new Date().toISOString(),
      };
      setAlerts((prev) => [newAlert, ...prev]);
    }, 15000); // every 15 seconds
    return () => clearInterval(interval);
  }, []);

  // Acknowledge alert
  const acknowledge = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-green-700">AI Predictive Alerts</h3>
        <span className="text-xs text-gray-500">{alerts.length}</span>
      </div>

      <div className="overflow-y-auto space-y-2 flex-1">
        {alerts.length === 0 ? (
          <p className="text-gray-500 text-sm">Monitoring... No alerts yet.</p>
        ) : (
          alerts.map((a, index) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`border-l-4 p-2 rounded ${
                a.level === "critical"
                  ? "border-red-500 bg-red-50"
                  : a.level === "warning"
                  ? "border-orange-400 bg-orange-50"
                  : "border-green-500 bg-green-50"
              }`}
            >
              <div className="flex justify-between">
                <div>
                  <h4 className="text-sm font-semibold">{a.title}</h4>
                  <p className="text-xs text-gray-600">{a.message}</p>
                  <p className="text-[10px] text-gray-400">
                    {new Date(a.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <button
                  onClick={() => acknowledge(a.id)}
                  className="text-[10px] text-blue-600 hover:underline"
                >
                  Acknowledge
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
