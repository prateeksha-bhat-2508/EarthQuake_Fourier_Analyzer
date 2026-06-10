"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import ImpactChart from "../components/ImpactChart";

const ImpactMap = dynamic(
  () => import("../components/ImpactMap"),
  { ssr: false }
);
import {
  getEarthquakes,
  analyzeEarthquake,
} from "../lib/api";

import SeismicChart from "../components/SeismicChart";
import FFTChart from "../components/FFTChart";

const EarthquakeMap = dynamic(
  () => import("../components/EarthquakeMap"),
  { ssr: false }
);

export default function Home() {
  const [earthquakes, setEarthquakes] =
    useState<any[]>([]);

  const [selectedEarthquake,
    setSelectedEarthquake] =
    useState<any>(null);

  const [seismic,
    setSeismic] =
    useState<any>(null);

  useEffect(() => {
    getEarthquakes().then(
      setEarthquakes
    );
  }, []);

  async function selectEarthquake(
    quake: any
  ) {
    setSelectedEarthquake(quake);

    const analysis =
      await analyzeEarthquake(
        quake.id
      );

    setSeismic(analysis);
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">

      <h1 className="text-5xl font-bold">
        QuakeWatch
      </h1>

      <p className="text-gray-400 mt-2">
        Seismic Intelligence Platform
      </p>

      <div className="grid grid-cols-3 gap-6 mt-8">

        {/* MAP */}

        <div className="col-span-2">

          <EarthquakeMap
            earthquakes={earthquakes}
            selectedEarthquake={
              selectedEarthquake
            }
            onSelectEarthquake={
              selectEarthquake
            }
          />

        </div>

        {/* RIGHT PANEL */}

        <div className="space-y-4">

          <div className="bg-zinc-900 p-4 rounded-lg">

            <h2 className="text-xl font-bold">
              Earthquake Events
            </h2>

            <div className="mt-4 max-h-[350px] overflow-y-auto space-y-2">

              {earthquakes.map(
                (quake) => (

                <button
                  key={quake.id}
                  onClick={() =>
                    selectEarthquake(quake)
                  }
                  className="w-full text-left bg-zinc-800 p-3 rounded hover:bg-zinc-700"
                >

                  <div>
                    {quake.place}
                  </div>

                  <div className="text-gray-400">
                    Magnitude{" "}
                    {quake.magnitude}
                  </div>

                </button>

              ))}

            </div>

          </div>

          {selectedEarthquake && (

            <div className="bg-zinc-900 p-4 rounded-lg">

              <h2 className="text-xl font-bold mb-3">
                Selected Event
              </h2>

              <p>
                <strong>
                  Location:
                </strong>{" "}
                {selectedEarthquake.place}
              </p>

              <p>
                <strong>
                  Magnitude:
                </strong>{" "}
                {selectedEarthquake.magnitude}
              </p>

              <p>
                <strong>
                  Depth:
                </strong>{" "}
                {selectedEarthquake.depth} km
              </p>

              <p>
                <strong>
                  Latitude:
                </strong>{" "}
                {selectedEarthquake.latitude}
              </p>

              <p>
                <strong>
                  Longitude:
                </strong>{" "}
                {selectedEarthquake.longitude}
              </p>

              <p>
                <strong>
                  Timestamp:
                </strong>{" "}
                {new Date(
                  selectedEarthquake.timestamp
                ).toLocaleString()}
              </p>

              <p>
                <strong>
                  Tsunami:
                </strong>{" "}
                {selectedEarthquake.tsunami
                  ? "Yes"
                  : "No"}
              </p>

            </div>

          )}

        </div>

      </div>

      {/* FOURIER ANALYSIS */}

      {seismic && (

        <div className="mt-8 space-y-6">

          <h2 className="text-3xl font-bold">
            Fourier Analysis
          </h2>

          <div className="grid grid-cols-4 gap-4">

            <div className="bg-zinc-900 p-4 rounded-lg">

              <h3 className="font-bold">
                Signal Energy
              </h3>

              <p className="text-2xl">
                {seismic.signal_energy}
              </p>

            </div>

            <div className="bg-zinc-900 p-4 rounded-lg">

              <h3 className="font-bold">
                Peak Amplitude
              </h3>

              <p className="text-2xl">
                {seismic.peak_amplitude}
              </p>

            </div>

            <div className="bg-zinc-900 p-4 rounded-lg">

              <h3 className="font-bold">
                Hazard Score
              </h3>

              <p className="text-2xl">
                {seismic.hazard_score}
              </p>

            </div>

            <div className="bg-zinc-900 p-4 rounded-lg">

              <h3 className="font-bold">
                Dominant Frequency
              </h3>

              <p className="text-2xl">

                {
                  seismic
                    .dominant_frequencies?.[0]
                    ?.frequency
                } Hz

              </p>

            </div>

          </div>

          <SeismicChart
            time={
              seismic.waveform.time
            }
            signal={
              seismic.waveform.signal
            }
          />
          

          <FFTChart
            frequency={
              seismic.fft.frequency
            }
            amplitude={
              seismic.fft.amplitude
            }
          />
          <div className="mt-10">

  <h2 className="text-3xl font-bold mb-6">
    Impact Analysis
  </h2>

  <div className="grid grid-cols-2 gap-6">

    <ImpactMap
      latitude={
        selectedEarthquake.latitude
      }
      longitude={
        selectedEarthquake.longitude
      }
      affectedRadius={
        seismic.impact_analysis
          .affected_radius_km
      }
      evacuationRadius={
        seismic.impact_analysis
          .evacuation_radius_km
      }

      
    />

    

    <div className="bg-zinc-900 p-6 rounded-lg h-[350px]">

  <h3 className="text-2xl font-bold mb-6">
    Risk Assessment
  </h3>

  <div className="space-y-4">

    <div className="flex justify-between">
      <span className="text-gray-400">
        Risk Level
      </span>

      <span
        className={`font-bold px-3 py-1 rounded
        ${
          seismic.impact_analysis.risk_level === "SEVERE"
            ? "bg-red-600"
            : seismic.impact_analysis.risk_level === "HIGH"
            ? "bg-orange-600"
            : seismic.impact_analysis.risk_level === "MODERATE"
            ? "bg-yellow-600"
            : "bg-green-600"
        }`}
      >
        {seismic.impact_analysis.risk_level}
      </span>
    </div>

    <div className="flex justify-between">
      <span className="text-gray-400">
        Affected Radius
      </span>

      <span>
        {
          seismic.impact_analysis
            .affected_radius_km
        } km
      </span>
    </div>

    <div className="flex justify-between">
      <span className="text-gray-400">
        Evacuation Radius
      </span>

      <span>
        {
          seismic.impact_analysis
            .evacuation_radius_km
        } km
      </span>
    </div>

    <div className="flex justify-between">
      <span className="text-gray-400">
        Estimated Impact Area
      </span>

      <span>
        {
          seismic.impact_analysis
            .affected_area_sqkm
        }
        {" "}km²
      </span>
    </div>
    </div>

    <hr className="border-zinc-700 my-4" />

    <div>

      <p className="text-gray-400">
        Epicenter Coordinates
      </p>

      <p>
        {selectedEarthquake.latitude}
        ° N,
        {" "}
        {selectedEarthquake.longitude}
        ° E
      </p>

    </div>

    <div>

      <p className="text-gray-400">
        Location
      </p>

      <p>
        {selectedEarthquake.place}
      </p>

    </div>

    <div>
      

      <p className="text-gray-400">
        Magnitude
      </p>

      <p>
        M
        {" "}
        {selectedEarthquake.magnitude}
      </p>

    </div>

    <div>

      <p className="text-gray-400">
        Depth
      </p>

      <p>
        {selectedEarthquake.depth}
        {" "}
        km
      </p>

    </div>

    <div>

      <p className="text-gray-400">
        Tsunami Risk
      </p>

      <p
        className={
          selectedEarthquake.tsunami
            ? "text-red-400"
            : "text-green-400"
        }
      >
        {
          selectedEarthquake.tsunami
            ? "Potential Tsunami"
            : "No Tsunami Detected"
        }
      </p>

    </div>

  </div>

  

</div>

          <div className="bg-zinc-900 p-6 rounded-lg">

            <h2 className="text-xl font-bold mb-4">
              Frequency Distribution
            </h2>

            <p>
              Low Frequency
              (0-1 Hz):{" "}
              {
                seismic
                  .frequency_bands
                  .low
              }%
            </p>

            <p>
              Mid Frequency
              (1-5 Hz):{" "}
              {
                seismic
                  .frequency_bands
                  .mid
              }%
            </p>

            <p>
              High Frequency
              (5+ Hz):{" "}
              {
                seismic
                  .frequency_bands
                  .high
              }%
            </p>

          </div>

        </div>

        </div>

      

      )}

    </main>
  );
}