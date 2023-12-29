const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;
const dotenv = require("dotenv");
dotenv.config();
const database = require("./config/database");
database.connect();

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json({ limit: '150mb' }));

// Importing Routes
const userRoutes  = require("./routes/User");
const courseRoutes = require("./routes/Course");

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/courses", courseRoutes);



app.get("/", (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Your server is up and running...',
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

app.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`);
});

