const API_URL = "http://127.0.0.1:8000";

export async function getEarthquakes() {
  const res = await fetch(
    `${API_URL}/earthquakes`
  );

  return res.json();
}

export async function analyzeEarthquake(
  id: string
) {
  const res = await fetch(
    `${API_URL}/analyze-earthquake/${id}`
  );

  return res.json();
}