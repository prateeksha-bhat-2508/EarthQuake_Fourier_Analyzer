"use client";

import dynamic from "next/dynamic";

const Plot = dynamic(
  () => import("react-plotly.js"),
  { ssr: false }
);

export default function SeismicChart({
  time,
  signal,
}: {
  time: number[];
  signal: number[];
}) {
  return (
    <Plot
      data={[
        {
          x: time,
          y: signal,
          type: "scatter",
          mode: "lines",
        },
      ]}
      layout={{
        title: {
          text: "Seismic Waveform",
        },
        width: 900,
        height: 400,
      }}
    />
  );
}