import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Form,
  Button,
  Alert,
  Col,
  Row,
  Card,
} from "react-bootstrap";

function App() {
  const [location, setLocation] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleTypes, setVehicleTypes] = useState([]); // State for vehicle types
  const [startDateTime, setStartDateTime] = useState("");
  const [durationMins, setDurationMins] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("info");
  const [vehicleId, setVehicleId] = useState(null);

  // Fetch vehicle types from the database
  useEffect(() => {
    const fetchVehicleTypes = async () => {
      try {
        const response = await axios.get("http://localhost:3000/vehicle-types");
        setVehicleTypes(response.data); // Assuming response.data is an array of vehicle types
      } catch (error) {
        console.error("Error fetching vehicle types:", error);
      }
    };

    fetchVehicleTypes();
  }, []);

  const checkAvailability = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/check-availability",
        {
          location,
          vehicleType,
          startDateTime,
          durationMins,
        }
      );
      if (response.data.available) {
        setVehicleId(response.data.vehicleId);
        setMessage("Vehicle is available!");
        setVariant("success");
      } else {
        setVehicleId(null);
        setMessage("Vehicle is not available.");
        setVariant("warning");
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred while checking availability.");
      setVariant("danger");
    }
  };

  const scheduleTestDrive = async () => {
    if (!vehicleId) {
      setMessage("Please check availability before scheduling a test drive.");
      setVariant("warning");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/schedule-test-drive",
        {
          vehicleId,
          startDateTime,
          durationMins,
          customerName,
          customerPhone,
          customerEmail,
        }
      );
      setMessage(response.data.message);
      setVariant("success");
    } catch (error) {
      console.error(error);
      setMessage("An error occurred while scheduling the test drive.");
      setVariant("danger");
    }
  };

  return (
    <Container
      fluid
      className="d-flex vh-100 align-items-center justify-content-center bg-info"
    >
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }}>
          <Card className="shadow-lg">
            <Card.Body>
              <Card.Title className="text-center text-warning mb-4">
                Find, Book, Drive: The Road to Your Next Car Starts Here!
              </Card.Title>
              <Form>
                <Form.Group controlId="vehicleType">
                  <Form.Label className="text-info">Vehicle Type</Form.Label>
                  <Form.Control
                    as="select"
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                  >
                    <option value="">Select Vehicle Type</option>
                    {vehicleTypes.map((type) => (
                      <option key={type.id} value={type.value}>
                        {type.name}
                      </option>
                    ))}
                    {/* <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="truck">Truck</option>
                    <option value="electric">Electric</option> */}
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="location" className="mt-3">
                  <Form.Label className="text-info">Your Location</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="startDateTime" className="mt-3">
                  <Form.Label className="text-info">Start DateTime</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={startDateTime}
                    onChange={(e) => setStartDateTime(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="durationMins" className="mt-3">
                  <Form.Label className="text-info">Duration (mins)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter duration in minutes"
                    value={durationMins}
                    onChange={(e) => setDurationMins(e.target.value)}
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  className="mt-4 w-100"
                  onClick={checkAvailability}
                >
                  Search Availability
                </Button>

                <Button
                  variant="outline-info"
                  className="mt-2 w-100"
                  onClick={() => alert("Location Suggestion")}
                >
                  Suggest a Location
                </Button>
              </Form>

              {message && (
                <Alert variant={variant} className="mt-4 text-center">
                  {message}
                </Alert>
              )}
              {message === "Vehicle is available!" && (
                <>
                  <Form.Group controlId="customerName" className="mt-4">
                    <Form.Label className="text-info">Customer Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group controlId="customerPhone" className="mt-3">
                    <Form.Label className="text-info">
                      Customer Phone
                    </Form.Label>
                    <Form.Control
                      type="tel"
                      placeholder="Enter your phone number"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group controlId="customerEmail" className="mt-3">
                    <Form.Label className="text-info">
                      Customer Email
                    </Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                    />
                  </Form.Group>

                  <Button
                    variant="success"
                    className="mt-4 w-100"
                    onClick={scheduleTestDrive}
                  >
                    Schedule Test Drive
                  </Button>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default App;

// import React, { useState } from "react";
// import axios from "axios";
// import {
//   Box,
//   Button,
//   Container,
//   FormControl,
//   FormLabel,
//   Input,
//   Heading,
//   Text,
//   VStack,
//   Flex,
//   Select,
// } from "@chakra-ui/react";

// function App() {
//   const [location, setLocation] = useState("");
//   const [vehicleType, setVehicleType] = useState("");
//   const [startDateTime, setStartDateTime] = useState("");
//   const [durationMins, setDurationMins] = useState("");
//   const [customerName, setCustomerName] = useState("");
//   const [customerPhone, setCustomerPhone] = useState("");
//   const [customerEmail, setCustomerEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [vehicleId, setVehicleId] = useState(null);

//   const checkAvailability = async () => {
//     try {
//       const response = await axios.post(
//         "http://localhost:3000/check-availability",
//         {
//           location,
//           vehicleType,
//           startDateTime,
//           durationMins,
//         }
//       );
//       if (response.data.available) {
//         setVehicleId(response.data.vehicleId);
//         setMessage("Vehicle is available!");
//       } else {
//         setVehicleId(null);
//         setMessage("Vehicle is not available.");
//       }
//     } catch (error) {
//       console.error(error);
//       setMessage("An error occurred while checking availability.");
//     }
//   };

//   const scheduleTestDrive = async () => {
//     if (!vehicleId) {
//       setMessage("Please check availability before scheduling a test drive.");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         "http://localhost:3000/schedule-test-drive",
//         {
//           vehicleId,
//           startDateTime,
//           durationMins,
//           customerName,
//           customerPhone,
//           customerEmail,
//         }
//       );
//       setMessage(response.data.message);
//     } catch (error) {
//       console.error(error);
//       setMessage("An error occurred while scheduling the test drive.");
//     }
//   };

//   return (
//     <Flex
//       direction="column"
//       height="100vh"
//       alignItems="center"
//       justifyContent="center"
//       bg="#40E0D0" // Set explicit turquoise color using HEX
//       p={4}
//     >
//       <Heading mb={8} color="gold" textAlign="center" fontSize="3xl">
//         Find, Book, Drive: The Road to Your Next Car Starts Here!
//       </Heading>

//       <Box
//         bg="white"
//         p={8}
//         borderRadius="md"
//         boxShadow="lg"
//         maxW="container.md"
//         w="full"
//       >
//         <VStack spacing={4} align="stretch">
//           <FormControl id="vehicleType">
//             <FormLabel color="#40E0D0" fontWeight="bold">
//               Vehicle Type
//             </FormLabel>
//             <Select
//               placeholder="Select Vehicle Type"
//               value={vehicleType}
//               onChange={(e) => setVehicleType(e.target.value)}
//               bg="white"
//             >
//               <option value="sedan">Sedan</option>
//               <option value="suv">SUV</option>
//               <option value="truck">Truck</option>
//               <option value="electric">Electric</option>
//             </Select>
//           </FormControl>

//           <FormControl id="location">
//             <FormLabel color="#40E0D0" fontWeight="bold">
//               Your Location
//             </FormLabel>
//             <Input
//               placeholder="Enter your location"
//               value={location}
//               onChange={(e) => setLocation(e.target.value)}
//               bg="white"
//             />
//           </FormControl>

//           <Button colorScheme="green" size="lg" onClick={checkAvailability}>
//             Search Availability
//           </Button>

//           <Button
//             colorScheme="teal"
//             variant="outline"
//             size="lg"
//             onClick={() => alert("Location Suggestion")}
//           >
//             Suggest a Location
//           </Button>

//           {message && (
//             <Text mt={4} fontSize="lg" color="#40E0D0" textAlign="center">
//               {message}
//             </Text>
//           )}
//         </VStack>
//       </Box>
//     </Flex>
//   );
// }

// export default App;

// import React, { useState } from "react";
// import axios from "axios";

// function App() {
//   const [location, setLocation] = useState("");
//   const [vehicleType, setVehicleType] = useState("");
//   const [startDateTime, setStartDateTime] = useState("");
//   const [durationMins, setDurationMins] = useState("");
//   const [customerName, setCustomerName] = useState("");
//   const [customerPhone, setCustomerPhone] = useState("");
//   const [customerEmail, setCustomerEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [vehicleId, setVehicleId] = useState(null); // New state to store vehicle ID after availability check

//   const checkAvailability = async () => {
//     try {
//       const response = await axios.post(
//         "http://localhost:3000/check-availability",
//         {
//           location,
//           vehicleType,
//           startDateTime,
//           durationMins,
//         }
//       );
//       if (response.data.available) {
//         setVehicleId(response.data.vehicleId); // Store the vehicleId for scheduling
//         setMessage("Vehicle is available!");
//       } else {
//         setVehicleId(null);
//         setMessage("Vehicle is not available.");
//       }
//     } catch (error) {
//       console.error(error);
//       setMessage("An error occurred while checking availability.");
//     }
//   };

//   const scheduleTestDrive = async () => {
//     if (!vehicleId) {
//       setMessage("Please check availability before scheduling a test drive.");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         "http://localhost:3000/schedule-test-drive",
//         {
//           vehicleId, // Use the vehicleId from the availability check
//           startDateTime,
//           durationMins,
//           customerName,
//           customerPhone,
//           customerEmail,
//         }
//       );
//       setMessage(response.data.message);
//     } catch (error) {
//       console.error(error);
//       setMessage("An error occurred while scheduling the test drive.");
//     }
//   };

//   return (
//     <div className="App">
//       <h1>EV Test Drive Scheduler</h1>
//       <div>
//         <label>Location:</label>
//         <input
//           type="text"
//           value={location}
//           onChange={(e) => setLocation(e.target.value)}
//         />
//       </div>
//       <div>
//         <label>Vehicle Type:</label>
//         <input
//           type="text"
//           value={vehicleType}
//           onChange={(e) => setVehicleType(e.target.value)}
//         />
//       </div>
//       <div>
//         <label>Start DateTime:</label>
//         <input
//           type="datetime-local"
//           value={startDateTime}
//           onChange={(e) => setStartDateTime(e.target.value)}
//         />
//       </div>
//       <div>
//         <label>Duration (mins):</label>
//         <input
//           type="number"
//           value={durationMins}
//           onChange={(e) => setDurationMins(e.target.value)}
//         />
//       </div>
//       <button onClick={checkAvailability}>Check Availability</button>
//       <h2>{message}</h2>
//       {message === "Vehicle is available!" && (
//         <>
//           <div>
//             <label>Customer Name:</label>
//             <input
//               type="text"
//               value={customerName}
//               onChange={(e) => setCustomerName(e.target.value)}
//             />
//           </div>
//           <div>
//             <label>Customer Phone:</label>
//             <input
//               type="tel"
//               value={customerPhone}
//               onChange={(e) => setCustomerPhone(e.target.value)}
//             />
//           </div>
//           <div>
//             <label>Customer Email:</label>
//             <input
//               type="email"
//               value={customerEmail}
//               onChange={(e) => setCustomerEmail(e.target.value)}
//             />
//           </div>
//           <button onClick={scheduleTestDrive}>Schedule Test Drive</button>
//         </>
//       )}
//     </div>
//   );
// }

// export default App;
