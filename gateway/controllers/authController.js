const Auth = require("../models/Auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwtSecret, jwtExpiresIn } = require("../config/env");

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Fields are missing" });
    }

    const user = await Auth.findOne({ email });

    if (user) {
      return res.status(409).json({ message: "User already signed up" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);

    const newUser = await Auth.create({
      email,
      password: hashpassword,
    });

    const userObj = newUser.toObject();
    delete userObj.password;

    return res.status(201).json({ message: "New user created", user: userObj });
  } catch (err) {
    console.log("Error in Signup", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Fields are missing" });
    }

    const user = await Auth.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not signed up" });
    }

    const userPassword = user.password;

    const validUser = await bcrypt.compare(userPassword, password);

    if (!validUser) {
      return res.status(401).json({ message: "Password doesn't match" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, {
      expiresIn: jwtExpiresIn,
    });

    return res.status(200).json({ message: "User verified", token });
  } catch (err) {
    console.log("Error in login", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
