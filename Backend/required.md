
# 📝 API Specification for TripSense App

---

## 🗄️ Notes for DB Creation

Trips are stored in a collection named `Trips`.  
Each user’s document should look like:

```json
{
    "email": "user@example.com",
    "Trips": [
        {
            "date": "2025-09-20",
            "destination": "Mumbai",
            "email": "user@example.com",
            "mode": "Car",
            "id": "unique_trip_id_12345",
            "errormsg": ""
        }
    ]
}
```

---

## ✅ 1️⃣ Trip Creation Response Structure

### Successful Trip Creation Response
```json
{
    "date": "2025-09-20",
    "destination": "Mumbai",
    "email": "user@example.com",
    "mode": "Car",
    "id": "unique_trip_id_12345",
    "errormsg": ""
}
```

### Failed Trip Creation Response
```json
{
    "date": null,
    "destination": null,
    "email": null,
    "mode": null,
    "id": null,
    "errormsg": "Reason for failure"
}
```

---

## ✅ 2️⃣ Trip Creation Request Body

```json
{
    "email": "user@example.com"
}
```

---

## ✅ 3️⃣ Get User Trips Response Structure

### Successful Response Example
```json
{
    "myTrips": [
        {
            "date": "2025-09-20",
            "destination": "Mumbai",
            "email": "user@example.com",
            "mode": "Car",
            "id": "unique_trip_id_12345",
            "errormsg": ""
        },
        {
            "date": "2025-09-22",
            "destination": "Nashik",
            "email": "user@example.com",
            "mode": "Bus",
            "id": "unique_trip_id_67890",
            "errormsg": ""
        }
    ],
    "errormsg": ""
}
```

### Failed Response Example
```json
{
    "myTrips": [],
    "errormsg": "Unable to fetch trips: <error reason>"
}
```
