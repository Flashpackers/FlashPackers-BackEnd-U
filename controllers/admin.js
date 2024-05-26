const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

const addAdmin = async (req, res) => {
  try {
    const { name, email, passwd } = req.body;
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ error: "Admin with this email already exists" });
    }
    const newAdmin = new Admin({ name, email, passwd });
    const result = await newAdmin.save();

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getAdmin = async (req, res) => {
  try {
    const { email } = req.params;
    const adminDetail = await Admin.findOne({ email });
    console.log("email: " + email);
    console.log("adminDetails: " + adminDetail);
    if (!adminDetail) {
      return res
        .status(400)
        .json({ error: "Admin with this email does not exists" });
    } else {
      return res.json(adminDetail);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, passwd } = req.body;

    const admin = await Admin.findOne({ email, passwd });
    if (!admin) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { email: admin.email, adminId: admin._id },
      "secretKey",
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const verifyToken = async (req, res) => {
  const token = req.body.token;

  if (!token) {
    return res.status(403).json({ message: "No token provided." });
  }

  jwt.verify(token, "secretKey", async (err, decoded) => {
    if (err) {
      return res.json({ valid: false });
    }
    const { email, adminId } = decoded;
    const currentAdmin = await Admin.findOne({ email });
    res.json({
      valid: true,
      name: currentAdmin.name,
      email: currentAdmin.email,
    });
  });
};

module.exports = { addAdmin, getAdmin, login, verifyToken };
