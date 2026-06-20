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

const COLORS = ["#6D28D9", "#A855F7", "#F59E0B", "#0F172A", "#10B981", "#EF4444"];

export function MonthlySalesChart({ data = [] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="sales" stroke="#6D28D9" strokeWidth={2} />
        <Line type="monotone" dataKey="revenue" stroke="#F59E0B" strokeWidth={2} />
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
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={!isMobile}
          label={isMobile ? false : ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={isMobile ? 75 : 95}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" height={36} iconType="circle" />
      </PieChart>
    </ResponsiveContainer>
  );
}
