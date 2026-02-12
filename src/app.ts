import express from "express";
export const app = express();

import cookieParser from "cookie-parser";
import cors from "cors";
import { router } from "./app/routes";
// import { envVars } from "./app/config/env";
// import expressSession from "express-session";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import { getFrontendOrigins } from "./app/config/origins";

// import { router } from "./app/routes";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
// import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
// import notFound from "./app/middlewares/notFound";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(
//   expressSession({
//     secret: envVars.EXPRESS_SESSION_SECRET as string,
//     resave: false,
//     saveUninitialized: false,
//   }),
// );

app.use(cookieParser());

const frontendOrigins = getFrontendOrigins();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.replace(/\/+$/, "");
      if (frontendOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin not allowed by CORS: ${origin}`));
    },
    credentials: true,
  }),
);
// app.use(
//   "/api/uploads",
//   express.static("uploads", {
//     maxAge: "7d",
//     index: false,
//     setHeaders: (res) => {
//       res.set("X-Content-Type-Options", "nosniff");
//     },
//   }),
// );

app.use(
  "/api/auth",
  // (req, res, next) => {
  //   const { role } = req?.body;
  //   if (role && role === "admin") {
  //     req.body.status = "pending";
  //   }
  //   next();
  // },
  toNodeHandler(auth),
);
app.use("/api", router);

app.get("/", (_, res) => {
  res.send({
    message: "Welcome to the APP, this is a E-Commerce API",
    success: true,
  });
});

app.use(globalErrorHandler);
app.use(notFound);
