const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db"); // Import the db.js file
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "EV Test Drive API",
      version: "1.0.0",
      description: "API documentation for the EV Test Drive application",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./server.js"], // Path to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * components:
 *   schemas:
 *     VehicleType:
 *       type: object
 *       properties:
 *         value:
 *           type: string
 *           description: The vehicle type value.
 *         name:
 *           type: string
 *           description: The human-readable name of the vehicle type.
 *       example:
 *         value: suv
 *         name: SUV
 */

/**
 * @swagger
 * /vehicle-types:
 *   get:
 *     summary: Fetch a list of distinct vehicle types
 *     responses:
 *       200:
 *         description: A list of vehicle types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VehicleType'
 *       500:
 *         description: Internal server error
 */
app.get("/vehicle-types", async (req, res) => {
  try {
    // Fetch distinct vehicle types from the 'vehicles' table
    const vehicleTypes = await db("vehicles")
      .distinct("type")
      .orderBy("type", "asc"); // Optional: Order the types alphabetically

    // Map the results to an array of objects with value and name fields
    const response = vehicleTypes.map((type) => ({
      value: type.type,
      name: type.type,
    }));

    res.status(200).json(response);
  } catch (err) {
    console.error("Error fetching vehicle types:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     AvailabilityRequest:
 *       type: object
 *       required:
 *         - location
 *         - vehicleType
 *         - startDateTime
 *         - durationMins
 *       properties:
 *         location:
 *           type: string
 *           description: The location where the vehicle is requested.
 *         vehicleType:
 *           type: string
 *           description: The type of vehicle being requested.
 *         startDateTime:
 *           type: string
 *           format: date-time
 *           description: The start date and time for the test drive.
 *         durationMins:
 *           type: integer
 *           description: The duration of the test drive in minutes.
 *       example:
 *         location: "New York"
 *         vehicleType: "SUV"
 *         startDateTime: "2024-01-01T10:00:00Z"
 *         durationMins: 120
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AvailabilityResponse:
 *       type: object
 *       properties:
 *         available:
 *           type: boolean
 *           description: Whether the vehicle is available.
 *         vehicleId:
 *           type: integer
 *           description: The ID of the available vehicle.
 *       example:
 *         available: true
 *         vehicleId: 5
 */

/**
 * @swagger
 * /check-availability:
 *   post:
 *     summary: Check vehicle availability based on location, type, and time
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AvailabilityRequest'
 *     responses:
 *       200:
 *         description: Availability status of the vehicle
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AvailabilityResponse'
 *       500:
 *         description: Internal server error
 */
app.post("/check-availability", async (req, res) => {
  console.log("request received" + JSON.stringify(req.body));
  const { location, vehicleType, startDateTime, durationMins } = req.body;

  try {
    const vehicle = await db("vehicles")
      .where({ type: vehicleType, location })
      .andWhere(function () {
        this.whereNotExists(
          db("reservations")
            .whereRaw('"vehicles"."id" = "reservations"."vehicle_id"')
            .andWhere("start_date_time", "<=", startDateTime)
            .andWhere("end_date_time", ">=", startDateTime)
        );
      })
      .first();

    if (vehicle) {
      res.status(200).json({ available: true, vehicleId: vehicle.id });
    } else {
      res.status(200).json({ available: false });
    }
  } catch (err) {
    console.error("Error checking availability:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     ScheduleTestDriveRequest:
 *       type: object
 *       required:
 *         - vehicleId
 *         - startDateTime
 *         - durationMins
 *         - customerName
 *         - customerPhone
 *         - customerEmail
 *       properties:
 *         vehicleId:
 *           type: integer
 *           description: The ID of the vehicle to reserve.
 *         startDateTime:
 *           type: string
 *           format: date-time
 *           description: The start date and time of the test drive.
 *         durationMins:
 *           type: integer
 *           description: The duration of the test drive in minutes.
 *         customerName:
 *           type: string
 *           description: The name of the customer.
 *         customerPhone:
 *           type: string
 *           description: The phone number of the customer.
 *         customerEmail:
 *           type: string
 *           format: email
 *           description: The email address of the customer.
 *       example:
 *         vehicleId: 5
 *         startDateTime: "2024-01-01T10:00:00Z"
 *         durationMins: 120
 *         customerName: "John Doe"
 *         customerPhone: "+123456789"
 *         customerEmail: "john.doe@example.com"
 */

/**
 * @swagger
 * /schedule-test-drive:
 *   post:
 *     summary: Schedule a test drive for a vehicle
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ScheduleTestDriveRequest'
 *     responses:
 *       200:
 *         description: Test drive successfully scheduled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Test drive scheduled successfully"
 *       500:
 *         description: Internal server error
 */
app.post("/schedule-test-drive", async (req, res) => {
  console.log(JSON.stringify(req.body));
  const {
    vehicleId,
    startDateTime,
    durationMins,
    customerName,
    customerPhone,
    customerEmail,
  } = req.body;

  try {
    await db("reservations").insert({
      vehicle_id: vehicleId,
      start_date_time: new Date(startDateTime),
      end_date_time: new Date(
        new Date(startDateTime).getTime() + durationMins * 60000
      ),
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail,
    });

    res.status(200).json({ message: "Test drive scheduled successfully" });
  } catch (err) {
    console.error("Error scheduling test drive:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
