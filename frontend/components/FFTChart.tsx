"use client";

import dynamic from "next/dynamic";

const Plot = dynamic(
  () => import("react-plotly.js"),
  { ssr: false }
);

export default function FFTChart({
  frequency,
  amplitude,
}: {
  frequency: number[];
  amplitude: number[];
}) {

  const limitedFrequency =
    frequency.slice(1, 2000);

  const limitedAmplitude =
    amplitude.slice(1, 2000);

  return (
    <div
  className="
  bg-zinc-900/70
  backdrop-blur-md
  border
  border-zinc-500
  shadow-[0_0_20px_rgba(255,255,255,0.15)]
  rounded-2xl
  p-4
  transition-all
  duration-300
  hover:scale-[1.02]
  hover:shadow-[0_0_30px_rgba(255,255,255,0.25)]
"
>

      <p>
        Frequency Points:
        {limitedFrequency.length}
      </p>

      <Plot
        data={[
          {
            x: limitedFrequency,
            y: limitedAmplitude,
            type: "scatter",
            mode: "lines",
          },
        ]}
        layout={{
  title: {
    text: "Frequency Spectrum (FFT)",
  },
  autosize: true,
  height: 400,
}}
        style={{
          width: "100%",
        }}
      />

    </div>
  );
}