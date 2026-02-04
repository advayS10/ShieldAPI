const redis = require("../config/redis");

const checkLimit = async (key, limit, windowSec) => {
  const count = await redis.incr(key);
  if (count == 1) await redis.expire(key, windowSec);
  return count > limit;
};

exports.loginLimiter = async (req, res, next) => {
  try {
    const ip = req.ip;
    const email = req.body?.email.toLowerCase().trim();

    if (!email) return res.status(400).json({ message: "Email required" });

    const ipkey = `login:ip:${ip}`;
    const emailkey = `login:ip:${email}`;

    const ipBlocked = await checkLimit(ipkey, 10, 900); // 10 attempts per ip under 15 min
    const emailBlocked = await checkLimit(emailkey, 5, 900); // 5 attempts per email under 15 min

    if (ipBlocked || emailBlocked) {
      return res
        .status(429)
        .json({ message: "Too many login attempts. Try later." });
    }

    next();
  } catch (err) {
    console.error("Error in login limiter", err);
    next();
  }
};

exports.signupLimiter = async (req, res, next) => {
  try {
    const ip = req.ip;
    const email = req.body?.email.toLowerCase().trim();

    if (!email) return res.status(400).json({ message: "Email required" });

    const key = `signup:ip:${ip}`;

    const blocked = await checkLimit(key, 5, 3600); // 5 attempts per ip under 1 hr

    if (blocked) {
      return res
        .status(429)
        .json({ message: "Too many accounts created. Try later." });
    }

    next();
  } catch (err) {
    console.error("Error in signup limiter", err);
    next();
  }
};
