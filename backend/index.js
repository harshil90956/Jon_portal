import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Allow all domains using '*'
app.use(cors({
  origin: "https://your-frontend-domain.com", // ✅ specific domain only
  credentials: true,                           // ✅ allow cookies/token headers
}));

const PORT = process.env.PORT || 3000;

// API routes
// api's
app.use("/active",(req,res)=>{
    res.send("Active server")
})
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// Start server
app.listen(PORT, () => {
  connectDB();
  console.log(`Server running at port ${PORT}`);
});
