import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, Legend
} from "recharts";
import { motion } from "framer-motion";

export default function AnalyticsPanel({ overlay, zones }) {
  const [ndviData, setNdviData] = useState([]);
  const [rainfallData, setRainfallData] = useState([]);
  const [riskData, setRiskData] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [pulse, setPulse] = useState(false);

  // Simulate AI-driven updates
  useEffect(() => {
    const baseMonths = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];
    const randomFluctuation = () => Math.random() * 0.1 - 0.05; // ±0.05

    if (overlay
