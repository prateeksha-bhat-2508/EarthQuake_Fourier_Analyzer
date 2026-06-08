from obspy.clients.fdsn import Client
from obspy import UTCDateTime

from database import earthquakes_collection

client = Client("IRIS")

for quake in earthquakes_collection.find():

    quake_time = UTCDateTime(
        quake["timestamp"] / 1000
    )

    try:

        st = client.get_waveforms(
            network="IU",
            station="ANMO",
            location="00",
            channel="BHZ",
            starttime=quake_time,
            endtime=quake_time + 600
        )

        filename = (
            f"waveforms/"
            f"{quake['_id']}.mseed"
        )

        st.write(
            filename,
            format="MSEED"
        )

        earthquakes_collection.update_one(
            {
                "_id":
                quake["_id"]
            },
            {
                "$set": {
                    "waveformFile":
                    filename
                }
            }
        )

        print(
            "Saved",
            filename
        )

    except Exception as e:

        print(
            "Failed",
            quake["_id"],
            e
        )