"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Skydda Palette
const COLORS = ["#f59e0b", "#38bdf8", "#a78bfa", "#34d399", "#f87171", "#71717a"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="border border-zinc-700 bg-zinc-950 p-3 shadow-xl text-xs font-mono">
        <p className="text-zinc-400 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {entry.name}: <span className="font-bold text-white">${entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function MonthlySalesChart({ data = [] }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
        <XAxis dataKey="month" stroke="#71717a" fontSize={11} tickLine={false} />
        <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="top"
          height={36}
          formatter={(value) => <span className="text-xs text-zinc-400 font-mono">{value}</span>}
        />
        <Line
          type="monotone"
          dataKey="sales"
          name="Units Sold"
          stroke="#f59e0b"
          strokeWidth={2}
          dot={{ r: 3, fill: "#f59e0b" }}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          name="Gross Revenue ($)"
          stroke="#38bdf8"
          strokeWidth={2}
          dot={{ r: 3, fill: "#38bdf8" }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function GenreDistributionChart({ data = [] }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 500);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={isMobile ? 75 : 95}
          innerRadius={45}
          dataKey="value"
          stroke="#09090b"
          strokeWidth={3}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#09090b",
            borderColor: "#3f3f46",
            borderRadius: "0px",
            fontSize: "11px",
            fontFamily: "monospace",
          }}
          itemStyle={{ color: "#ffffff" }}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          iconType="square"
          formatter={(value) => <span className="text-xs text-zinc-400 font-mono">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
