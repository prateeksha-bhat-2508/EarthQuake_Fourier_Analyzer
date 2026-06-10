"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

export default function ImpactChart({
  affectedRadius,
  evacuationRadius
}: any) {

  const data = [
    {
      name: "Affected",
      radius: affectedRadius
    },
    {
      name: "Evacuation",
      radius: evacuationRadius
    }
  ];

  return (
    <div
      className="
      bg-zinc-900
      p-4
      rounded-lg
      h-[350px]
    "
    >

      <h3
        className="
        text-xl
        font-bold
        mb-4
      "
      >
        Radius Analysis
      </h3>

      <ResponsiveContainer
        width="100%"
        height="85%"
      >

        <BarChart data={data}>

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="radius"
            fill="#ef4444"
          />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}