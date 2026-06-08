from database import earthquakes_collection

earthquakes_collection.insert_one({
    "test": "working"
})

print("MongoDB Connected")