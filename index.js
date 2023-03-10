import { Server } from "socket.io";
import mqtt from "mqtt";

const io = new Server(process.env.PORT || 8000, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

const topic = "level";

io.on("connection", (socket) => {
  // Socket connection made
  console.log(`client ${socket.id} connected`);

  // Connect to MQTT server
  let options = {
    host: "1387b8aada2e4198970f3b56103589c6.s2.eu.hivemq.cloud",
    port: 8883,
    protocol: "mqtts",
    username: "skinuthia800",
    password: "Gearbox001",
  };

  let client = mqtt.connect(options);

  socket.on("start-pump", () => {
    // Send mqtt signal to device to start pump
    console.log("Sending signal to device to start pump...");
  });

  socket.on("open-tap", () => {
    // Send mqtt signal to device to open tap pump
    console.log("Sending signal to device to open tap...");
  });

  client.on("connect", function () {
    // Check MQTT server connection
    console.log("MQTT client connected: " + client.connected);

    if (client.connected == true) {
      //  Subscribe to topic 'level'
      client.subscribe(topic);
    }
  });

  client.on("message", function (topic, message) {
    // Receiving data from device

    console.log("Message : " + message);
    console.log("Topic : " + topic);

    // Calculate % level

    let level = 100 - (parseInt(message) / 80) * 100;

    // Send data to dashboard via websockets

    socket.emit(topic, {
      data: parseInt(level),
    });

    console.log("Data sent to frontend...");
  });

  // Cant connect to mqtt server
  client.on("error", function (error) {
    console.log(error);
    process.exit(1);
  });
});
