import express from "express";
export const app = express();

import cookieParser from "cookie-parser";
import cors from "cors";
import { router } from "./app/routes";
// import { envVars } from "./app/config/env";
// import expressSession from "express-session";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";

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

app.use(
  cors({
    origin: [process.env.FRONTEND_URL as string],
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
