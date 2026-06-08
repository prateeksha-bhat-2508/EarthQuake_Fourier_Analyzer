import sys
import os

sys.path.append(
    os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )
)
import requests

from database import earthquakes_collection

USGS_URL = (
    "https://earthquake.usgs.gov/fdsnws/event/1/query"
)

params = {
    "format": "geojson",
    "starttime": "2011-01-01",
    "endtime": "2012-12-31",

    "minmagnitude": 6,

    "latitude": 36,
    "longitude": 138,

    "maxradiuskm": 2000
}

response = requests.get(
    USGS_URL,
    params=params
)

data = response.json()

earthquakes_collection.delete_many({})

for quake in data["features"][:20]:

    props = quake["properties"]
    coords = quake["geometry"]["coordinates"]

    earthquakes_collection.insert_one({
        "usgsId": quake["id"],

        "place": props["place"],

        "magnitude": props["mag"],

        "timestamp": props["time"],

        "longitude": coords[0],
        "latitude": coords[1],
        "depth": coords[2],

        "tsunami": bool(
            props.get("tsunami", 0)
        ),

        "waveformFile": "",

        "affectedAreas": [],

        "evacuationAreas": []
    })

print("Imported 20 earthquakes")