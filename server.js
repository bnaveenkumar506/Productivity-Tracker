const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  userId: String,
  blockedSites: [String],
  dailyLimit: Number,
  timeLogs: [{ domain: String, timeSpent: Number }],
});

const User = mongoose.model("User", userSchema);

app.post("/api/sync", async (req, res) => {
  const { userId, blockedSites, dailyLimit, timeLogs } = req.body;
  let user = await User.findOne({ userId });
  if (!user) {
    user = new User({ userId, blockedSites, dailyLimit, timeLogs });
  } else {
    user.blockedSites = blockedSites;
    user.dailyLimit = dailyLimit;
    user.timeLogs = timeLogs;
  }
  await user.save();
  res.json({ message: "Data synced successfully" });
});

app.get("/api/report/:userId", async (req, res) => {
  const user = await User.findOne({ userId: req.params.userId });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user.timeLogs);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));