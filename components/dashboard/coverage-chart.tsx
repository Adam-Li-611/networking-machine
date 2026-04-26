"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function CoverageChart({ data }: { data: { name: string; contacts: number; campaigns: number }[] }) {
  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
          <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} height={48} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="contacts" fill="#334155" radius={[3, 3, 0, 0]} />
          <Bar dataKey="campaigns" fill="#0f766e" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
