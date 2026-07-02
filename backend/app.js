require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require('path');

const authRoutes = require("./routes/auth.routes");
const strategyRoutes = require("./routes/strategy.routes");
const indicatorRoutes = require("./routes/indicator.routes");

const app = express();

const targetRoutes =
  require('./routes/target.routes');

const fiscalYearRoutes =
  require('./routes/fiscalYear.routes');

const resultRoutes =
  require('./routes/result.routes');

const evidenceRoutes =
  require('./routes/evidence.routes');

const dashboardRoutes =
  require('./routes/dashboard.routes');

const userRoutes =
  require('./routes/user.routes');

const strategicPlanRoutes =
  require('./routes/strategicPlan.routes');

const categoryRoutes =
  require('./routes/category.routes');



app.use(cors());
app.use(express.json());

app.use(
  '/uploads',
  express.static(
    path.join(__dirname, 'uploads')
  )
);

app.use("/api", authRoutes);
app.use("/api/evidence", evidenceRoutes);
app.use("/api", resultRoutes);
app.use("/api", fiscalYearRoutes);
app.use("/api", targetRoutes);
app.use("/api", strategyRoutes);
app.use("/api", indicatorRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", userRoutes);
app.use('/api', categoryRoutes);
app.use("/api", strategicPlanRoutes);

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const db = require("./config/db");

const reportRoutes =
  require('./routes/report.routes');

db.query("SELECT 1")
  .then(() => {
    console.log("MySQL Connected");
  })
  .catch((err) => {
    console.error("MySQL Error");
    console.error(err);
  });

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: err.message
  });
});

app.use(
  '/api/settings',
  require('./routes/setting.routes')
);

app.use(
  '/api/report',
  reportRoutes
);