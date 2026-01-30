import { Server } from "http";
let server: Server;

// import { envVars } from "./app/config/env";
import { app } from "./app";

const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    server = app.listen(PORT, () => {
      console.log(`✅✅✅✅ Server is listening to http://localhost:${PORT} `);
    });
  } catch (error) {
    console.log("❌❌❌❌❌", error);
  }
};

(async () => {
  await startServer();
})();

process.on("SIGTERM", () => {
  console.log("SIGTERM signal recieved... Server shutting down..");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("SIGINT", () => {
  console.log("SIGINT signal recieved... Server shutting down..");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejecttion detected... Server shutting down..", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception detected... Server shutting down..", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});
