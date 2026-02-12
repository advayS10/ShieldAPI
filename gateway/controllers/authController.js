const Auth = require("../models/Auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwtSecret, jwtExpiresIn } = require("../config/env");
const { ApiError } = require("../utils/errorHandler");

exports.signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "Fields are missing");
    }

    const emailNormalized = email.toLowerCase().trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailNormalized)) {
      throw new ApiError(400, "Invalid email format")
    }

    const user = await Auth.findOne({ email: emailNormalized });

    if (user) {
      throw new ApiError(409, "Email already exist")
    }

    if (password.length < 6) {
      throw new ApiError(400, "Password must be at least 6 characters")
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
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "Fields are missing");
    }

    const emailNormalized = email.toLowerCase().trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailNormalized)) {
      throw new ApiError(400, "Invalid email format")
    }

    const user = await Auth.findOne({ email: emailNormalized });
    const isValidPassword = user
      ? await bcrypt.compare(password, user.password)
      : false;

    if (!user || !isValidPassword) {
      throw new ApiError(400, "Invalid email or password")
    }

    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: jwtExpiresIn },
    );

    return res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    next(err);
  }
};
