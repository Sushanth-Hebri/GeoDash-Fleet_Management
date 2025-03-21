const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Driver = require("../models/Driver");
const Owner = require("../models/Owner");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Register Driver
exports.registerDriver = async (req, res) => {
  const { name, email, password, phone, address, licenseNumber, vehicleType, experience } = req.body;

  try {
    let driver = await Driver.findOne({ email });
    if (driver) return res.status(400).json({ message: "Driver already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    driver = new Driver({ name, email, password: hashedPassword, phone, address, licenseNumber, vehicleType, experience });

    await driver.save();
    res.status(201).json({ message: "Driver registered successfully", token: generateToken(driver._id) });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Register Owner
exports.registerOwner = async (req, res) => {
  const { name, email, password, phone, address, companyName, fleetSize, businessRegistrationNumber, paymentDetails } = req.body;

  try {
    let owner = await Owner.findOne({ email });
    if (owner) return res.status(400).json({ message: "Owner already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    owner = new Owner({ name, email, password: hashedPassword, phone, address, companyName, fleetSize, businessRegistrationNumber, paymentDetails });

    await owner.save();
    res.status(201).json({ message: "Owner registered successfully", token: generateToken(owner._id) });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await Driver.findOne({ email }) || await Owner.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.json({ message: "Login successful", token: generateToken(user._id) });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
