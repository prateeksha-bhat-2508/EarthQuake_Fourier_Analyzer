import numpy as np
from scipy.fft import fft, fftfreq
from obspy import read

from obspy import read
import numpy as np


def generate_seismic_signal():
    """
    Synthetic earthquake waveform.
    P-wave arrives around 2s.
    S-wave arrives around 5s.
    """

    fs = 100

    t = np.linspace(0, 10, fs * 10)

    signal = np.zeros_like(t)

    # P-wave
    signal[t > 2] += (
        np.sin(2 * np.pi * 1 * t[t > 2])
        * 0.5
    )

    # S-wave
    signal[t > 5] += (
        np.sin(2 * np.pi * 3 * t[t > 5])
        * 1.5
    )

    signal += 0.1 * np.random.randn(len(t))

    return t, signal


def generate_magnitude_based_signal(magnitude):
    """
    Waveform strength scales with earthquake magnitude.
    """

    fs = 100

    t = np.linspace(0, 10, fs * 10)

    if magnitude is None:
        magnitude = 3.0

    p_amp = max(0.2, magnitude * 0.15)
    s_amp = max(0.5, magnitude * 0.4)

    signal = np.zeros_like(t)

    # P-wave
    signal[t > 2] += (
        np.sin(2 * np.pi * 1 * t[t > 2])
        * p_amp
    )

    # S-wave
    signal[t > 5] += (
        np.sin(2 * np.pi * 3 * t[t > 5])
        * s_amp
    )

    signal += 0.05 * np.random.randn(len(t))

    return t, signal


def compute_fft(signal, fs=100):
    """
    Fourier Transform.
    """

    n = len(signal)

    yf = fft(signal)

    xf = fftfreq(n, 1 / fs)

    return xf[: n // 2], np.abs(yf[: n // 2])


def detect_waves(t, signal):

    abs_signal = np.abs(signal)

    noise_window = abs_signal[:500]

    noise_level = np.mean(noise_window)

    threshold_p = noise_level * 5

    threshold_s = noise_level * 12

    p_wave = None
    s_wave = None

    for i in range(500, len(signal)):

        if (
            p_wave is None
            and abs_signal[i] > threshold_p
        ):
            p_wave = float(t[i])

        if (
            p_wave is not None
            and abs_signal[i] > threshold_s
        ):
            s_wave = float(t[i])
            break

    return p_wave, s_wave

def estimate_distance(p_wave, s_wave):
    """
    Estimate epicentral distance from
    P-S arrival time difference.
    """

    if p_wave is None or s_wave is None:
        return 0

    vp = 6.0   # km/s
    vs = 3.5   # km/s

    distance = (
        (s_wave - p_wave)
        /
        ((1 / vs) - (1 / vp))
    )

    return round(float(distance), 2)


def estimate_magnitude(signal):
    """
    Simplified Richter-style estimate.
    """

    peak_amplitude = np.max(
        np.abs(signal)
    )

    magnitude = (
        np.log10(
            peak_amplitude * 1000
        )
        + 1
    )

    return round(float(magnitude), 2)

def load_real_waveform():

    st = read("japan_earthquake.mseed")

    trace = st[0]

    signal = trace.data.astype(float)

    sampling_rate = trace.stats.sampling_rate

    t = np.arange(len(signal)) / sampling_rate

    return t, signal

from obspy import read
import numpy as np
import os

def load_waveform_file(filepath):

    base_dir = os.path.dirname(
        os.path.abspath(__file__)
    )

    full_path = os.path.join(
        base_dir,
        filepath
    )

    st = read(full_path)

    tr = st[0]

    signal = tr.data.astype(
        np.float64
    )

    fs = tr.stats.sampling_rate

    t = np.arange(
        len(signal)
    ) / fs

    return t, signal