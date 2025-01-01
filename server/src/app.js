import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";

const app = express();

// this use for cross origin sharing 
app.use(cors({ origin: [process.env.CORS_ORIGIN, "http://localhost:5173", "https://rentalert.iotsense.in"], credentials: true }));
// this middleware use for parsing the json data
app.use(express.json());
// this is used for parsing url data extended is used for nessted object
app.use(express.urlencoded({ extended: true }));
// this is used to parse the cookie
app.use(cookieParser());

// routes import
import tenantRouter from './routes/tenant.route.js';
import phonepeRouter from './routes/phonepe.route.js';

//Routes declaration
app.use("/api/v1/tenant", tenantRouter);
app.use("/api/v1/phonepe", phonepeRouter);

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