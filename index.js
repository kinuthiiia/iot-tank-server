import { Server } from "socket.io";
import mqtt from "mqtt";

const io = new Server(8000, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

const topic = "level";

io.on("connection", (socket) => {
  // Socket connection made
  console.log(`client ${socket.id} connected`);

  // Connect to MQTT server
  let client = mqtt.connect(process.env.MQTT_BROKER);

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

    // Send data to dashboard via websockets

    socket.emit(topic, {
      data: parseInt(message),
    });

    console.log("Data sent to frontend...");
  });

  // Cant connect to mqtt server
  client.on("error", function (error) {
    console.log(error);
    process.exit(1);
  });
});
