import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";

const app = express();

// this use for cross origin sharing 
app.use(cors({ origin: process.env.CORS_ORIGIN }));
// this middleware use for parsing the json data
app.use(express.json());
// this is used for parsing url data extended is used for nessted object
app.use(express.urlencoded({ extended: true }));
// this is used to parse the cookie
app.use(cookieParser());

// routes import
import userRouter from './src/routes/user.routes.js';


//Routes declaration
app.use("/api/v1/user", userRouter);

// Custom error handeling
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  return res.status(statusCode).json({
    statusCode: statusCode,
    message: message
  });
})

export default app