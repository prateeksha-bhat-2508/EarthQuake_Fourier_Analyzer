from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from bson import ObjectId

from scipy.signal import find_peaks

import numpy as np

from database import earthquakes_collection

from seismic import (
    compute_fft,
    load_waveform_file
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "QuakeWatch Backend Running"
    }


@app.get("/earthquakes")
def get_earthquakes():

    earthquakes = []

    for quake in earthquakes_collection.find():

        earthquakes.append({

            "id":
                str(quake["_id"]),

            "usgsId":
                quake["usgsId"],

            "place":
                quake["place"],

            "magnitude":
                quake["magnitude"],

            "depth":
                quake["depth"],

            "latitude":
                quake["latitude"],

            "longitude":
                quake["longitude"],

            "timestamp":
                quake["timestamp"],

            "tsunami":
                quake["tsunami"]
        })

    earthquakes.sort(
        key=lambda x: x["magnitude"],
        reverse=True
    )

    return earthquakes


@app.get("/earthquake/{quake_id}")
def get_earthquake(quake_id: str):

    quake = earthquakes_collection.find_one({
        "_id": ObjectId(quake_id)
    })

    if not quake:
        return {
            "error": "Earthquake not found"
        }

    return {

        "id":
            str(quake["_id"]),

        "usgsId":
            quake["usgsId"],

        "place":
            quake["place"],

        "magnitude":
            quake["magnitude"],

        "depth":
            quake["depth"],

        "latitude":
            quake["latitude"],

        "longitude":
            quake["longitude"],

        "timestamp":
            quake["timestamp"],

        "tsunami":
            quake["tsunami"]
    }


@app.get("/analyze-earthquake/{quake_id}")
def analyze_earthquake(quake_id: str):

    quake = earthquakes_collection.find_one({
        "_id": ObjectId(quake_id)
    })

    if not quake:
        return {
            "error": "Earthquake not found"
        }

    # Load waveform
    # Load waveform for this earthquake
    t, signal = load_waveform_file(
    quake["waveformFile"]
)

    # FFT
    freq, amp = compute_fft(signal)

    # Dominant frequencies
    peaks, _ = find_peaks(
        amp,
        height=np.max(amp) * 0.2
    )

    dominant_frequencies = []

    for peak in peaks[:5]:

        dominant_frequencies.append({

            "frequency":
                round(
                    float(freq[peak]),
                    2
                ),

            "amplitude":
                round(
                    float(amp[peak]),
                    2
                )
        })

    # Metrics

    signal_energy = float(
        np.sum(
            np.square(signal)
        )
    )

    peak_amplitude = float(
        np.max(
            np.abs(signal)
        )
    )

    # Frequency bands

    low_mask = (
        (freq >= 0)
        &
        (freq < 1)
    )

    mid_mask = (
        (freq >= 1)
        &
        (freq < 5)
    )

    high_mask = (
        freq >= 5
    )

    low_energy = float(
        np.sum(
            amp[low_mask]
        )
    )

    mid_energy = float(
        np.sum(
            amp[mid_mask]
        )
    )

    high_energy = float(
        np.sum(
            amp[high_mask]
        )
    )

    total_energy = (
        low_energy
        + mid_energy
        + high_energy
    )

    if total_energy > 0:

        low_percent = round(
            low_energy /
            total_energy *
            100,
            2
        )

        mid_percent = round(
            mid_energy /
            total_energy *
            100,
            2
        )

        high_percent = round(
            high_energy /
            total_energy *
            100,
            2
        )

    else:

        low_percent = 0

        mid_percent = 0

        high_percent = 0

    # Hazard score

    hazard_score = round(
        min(
            100,
            (
                float(quake["magnitude"]) * 8
                +
                peak_amplitude * 15
                +
                np.log10(
                    signal_energy + 1
                ) * 10
            )
        ),
        2
    )

    return {

        "earthquake": {

            "id":
                str(quake["_id"]),

            "place":
                quake["place"],

            "magnitude":
                quake["magnitude"],

            "depth":
                quake["depth"],

            "latitude":
                quake["latitude"],

            "longitude":
                quake["longitude"],

            "timestamp":
                quake["timestamp"],

            "tsunami":
                quake["tsunami"]
        },

        "signal_energy":
            round(
                signal_energy,
                2
            ),

        "peak_amplitude":
            round(
                peak_amplitude,
                2
            ),

        "hazard_score":
            hazard_score,

        "dominant_frequencies":
            dominant_frequencies,

        "frequency_bands": {

            "low":
                low_percent,

            "mid":
                mid_percent,

            "high":
                high_percent
        },

        "waveform": {

            "time":
                t.tolist(),

            "signal":
                signal.tolist()
        },

        "fft": {

            "frequency":
                freq.tolist(),

            "amplitude":
                amp.tolist()
        }
    }