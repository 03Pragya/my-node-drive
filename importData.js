const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

// PostgreSQL client setup
const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "ev_test_drive",
  password: "admin",
  port: 5432, // Default PostgreSQL port
});

client.connect();

// Load JSON data
const vehiclesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "vehicles.json"), "utf8")
).vehicles;
const reservationsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "reservations.json"), "utf8")
).reservations;
// Insert vehicles data
vehiclesData.forEach((vehicle) => {
  client.query(
    "INSERT INTO vehicles (id, type, location, available_from_time, available_to_time, available_days, minimum_minutes_between_bookings) VALUES ($1, $2, $3, $4, $5, $6, $7)",
    [
      vehicle.id,
      vehicle.type,
      vehicle.location,
      vehicle.availableFromTime,
      vehicle.availableToTime,
      vehicle.availableDays,
      vehicle.minimumMinutesBetweenBookings,
    ],
    (err, res) => {
      if (err) {
        console.error("Error inserting vehicle data:", err);
      } else {
        console.log("Inserted vehicle:", vehicle.id);
      }
    }
  );
});

// Insert reservations data
reservationsData.forEach((reservation) => {
  client.query(
    "INSERT INTO reservations (id, vehicle_id, start_date_time, end_date_time, customer_name, customer_email, customer_phone) VALUES ($1, $2, $3, $4, $5, $6, $7)",
    [
      reservation.id,
      reservation.vehicleId,
      reservation.startDateTime,
      reservation.endDateTime,
      reservation.customerName,
      reservation.customerEmail,
      reservation.customerPhone,
    ],
    (err, res) => {
      if (err) {
        console.error("Error inserting reservation data:", err);
      } else {
        console.log("Inserted reservation:", reservation.id);
      }
    }
  );
});

//Close the client connection
client.end();
