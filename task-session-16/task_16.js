/**
 * Task 16: Authentication & Authorization Module
 * 
 * Features:
 * - User Schema & Mongoose Model (Name, Email, Password, Role, Phone)
 * - Password Hashing with bcryptjs
 * - Authentication (Register, Login) with JWT Token Generation
 * - Protection Middleware (JWT Token Verification via Bearer Header)
 * - Role-Based Authorization Middleware (restrictTo('admin', 'instructor'))
 * - Interactive Web UI at http://localhost:5000/ to test auth live
 */

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "antigravity_super_secret_jwt_key_2026";
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/auth_db";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------------------------------------------------
// 1. MONGOOSE USER SCHEMA & MODEL
// -------------------------------------------------------------
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"]
    },
    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student"
    },
    phone: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

// In-Memory Fallback for standalone execution without a running Mongo daemon
let isMongoConnected = false;
const inMemoryUsers = [];

mongoose.connect(MONGO_URI)
  .then(() => {
    isMongoConnected = true;
    console.log("✅ Successfully connected to MongoDB Database");
  })
  .catch(() => {
    isMongoConnected = false;
    console.log("⚠️ Local MongoDB unreachable. Using in-memory authentication handler.");
  });

// -------------------------------------------------------------
// 2. HELPER & MIDDLEWARE FUNCTIONS
// -------------------------------------------------------------

// Sign JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id || user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// Protect Routes (Authentication Middleware)
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: "You are not logged in! Please log in to get access."
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid or expired token. Please log in again."
    });
  }
};

// Authorize Roles (Authorization Middleware)
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "fail",
        message: `Forbidden! Role '${req.user.role}' is not allowed to access this resource.`
      });
    }
    next();
  };
};

// -------------------------------------------------------------
// 3. AUTHENTICATION & AUTHORIZATION ROUTES
// -------------------------------------------------------------

// POST /api/v1/auth/register
app.post("/api/v1/auth/register", async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide name, email, and password."
      });
    }

    if (isMongoConnected) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ status: "fail", message: "Email already registered." });
      }

      const user = await User.create({ name, email, password, role, phone });
      const token = generateToken(user);

      return res.status(201).json({
        status: "success",
        message: "Registration successful!",
        token,
        data: {
          user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone }
        }
      });
    } else {
      const existing = inMemoryUsers.find(u => u.email === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ status: "fail", message: "Email already registered." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        id: "usr_" + Date.now(),
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: role || "student",
        phone: phone || ""
      };
      inMemoryUsers.push(newUser);

      const token = generateToken(newUser);
      return res.status(201).json({
        status: "success",
        message: "Registration successful!",
        token,
        data: {
          user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, phone: newUser.phone }
        }
      });
    }
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// POST /api/v1/auth/login
app.post("/api/v1/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: "fail", message: "Please provide email and password." });
    }

    if (isMongoConnected) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ status: "fail", message: "Incorrect email or password." });
      }

      const token = generateToken(user);
      return res.status(200).json({
        status: "success",
        message: "Login successful!",
        token,
        data: {
          user: { id: user._id, name: user.name, email: user.email, role: user.role }
        }
      });
    } else {
      const user = inMemoryUsers.find(u => u.email === email.toLowerCase());
      if (!user) {
        return res.status(401).json({ status: "fail", message: "Incorrect email or password." });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ status: "fail", message: "Incorrect email or password." });
      }

      const token = generateToken(user);
      return res.status(200).json({
        status: "success",
        message: "Login successful!",
        token,
        data: {
          user: { id: user.id, name: user.name, email: user.email, role: user.role }
        }
      });
    }
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// GET /api/v1/auth/me (Protected Route for All Logged-in Users)
app.get("/api/v1/auth/me", protect, (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to your protected profile!",
    user: req.user
  });
});

// GET /api/v1/auth/instructor-portal (Protected & Restricted to Instructor / Admin)
app.get("/api/v1/auth/instructor-portal", protect, restrictTo("instructor", "admin"), (req, res) => {
  res.status(200).json({
    status: "success",
    message: `Welcome Instructor/Admin (${req.user.email}) to the Content Creation Portal!`
  });
});

// GET /api/v1/auth/admin-dashboard (Protected & Restricted to Admin Only)
app.get("/api/v1/auth/admin-dashboard", protect, restrictTo("admin"), (req, res) => {
  res.status(200).json({
    status: "success",
    message: `Welcome Administrator (${req.user.email}) to the System Control Center!`
  });
});

// -------------------------------------------------------------
// 4. INTERACTIVE DEMO UI (Served at `/`)
// -------------------------------------------------------------
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Task 16: Authentication & Authorization Demo</title>
      <style>
        body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; padding: 24px; margin: 0; }
        .container { max-width: 900px; margin: 0 auto; }
        header { background: #1e293b; padding: 20px; border-radius: 12px; border: 1px solid #334155; margin-bottom: 24px; }
        h1 { margin: 0 0 6px 0; color: #38bdf8; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .card { background: #1e293b; padding: 20px; border-radius: 12px; border: 1px solid #334155; }
        .form-group { margin-bottom: 12px; }
        label { display: block; font-size: 13px; color: #94a3b8; margin-bottom: 4px; }
        input, select { width: 100%; box-sizing: border-box; padding: 10px; background: #0f172a; border: 1px solid #334155; border-radius: 6px; color: white; }
        button { background: #0284c7; color: white; border: none; padding: 10px 14px; border-radius: 6px; font-weight: 600; cursor: pointer; width: 100%; margin-top: 8px; }
        button:hover { background: #0369a1; }
        .btn-green { background: #16a34a; }
        .btn-green:hover { background: #15803d; }
        .btn-purple { background: #9333ea; }
        .btn-purple:hover { background: #7e22ce; }
        .token-box { background: #0f172a; border: 1px solid #334155; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 11px; word-break: break-all; margin-top: 10px; color: #38bdf8; }
        .output { margin-top: 16px; background: #0284c715; border: 1px solid #0284c7; padding: 12px; border-radius: 8px; font-size: 13px; white-space: pre-wrap; }
      </style>
    </head>
    <body>
      <div class="container">
        <header>
          <h1>🔐 Task 16: Auth & Role Authorization System</h1>
          <p style="margin:0; font-size:14px; color:#94a3b8;">Demonstrating Mongoose User Model, Bcrypt Hashing, JWT Bearer Protection & RBAC Middleware</p>
        </header>

        <div class="grid">
          <!-- Register & Login Form -->
          <div class="card">
            <h3>📝 Account Access</h3>
            <div class="form-group"><label>Full Name</label><input type="text" id="regName" value="Alice Smith" /></div>
            <div class="form-group"><label>Email Address</label><input type="email" id="email" value="alice@example.com" /></div>
            <div class="form-group"><label>Password</label><input type="password" id="password" value="secret123" /></div>
            <div class="form-group"><label>Select Role</label>
              <select id="role">
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button onclick="register()">Register New User</button>
            <button class="btn-green" onclick="login()">Login & Obtain JWT</button>

            <div style="margin-top:16px;">
              <label>Stored JWT Bearer Token:</label>
              <div id="tokenDisplay" class="token-box">No token active. Please Register or Login.</div>
            </div>
          </div>

          <!-- Protected Route Tester -->
          <div class="card">
            <h3>⚡ Test Protected Routes</h3>
            <button onclick="testRoute('/api/v1/auth/me')">GET /auth/me (All Users)</button>
            <button class="btn-purple" onclick="testRoute('/api/v1/auth/instructor-portal')">GET /auth/instructor-portal (Instructor/Admin)</button>
            <button style="background:#e11d48" onclick="testRoute('/api/v1/auth/admin-dashboard')">GET /auth/admin-dashboard (Admin Only)</button>

            <div class="output" id="responseOutput">Console Response Output Will Appear Here...</div>
          </div>
        </div>
      </div>

      <script>
        let currentToken = '';

        async function register() {
          const body = {
            name: document.getElementById('regName').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            role: document.getElementById('role').value
          };

          const res = await fetch('/api/v1/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          });
          const data = await res.json();
          if (data.token) {
            currentToken = data.token;
            document.getElementById('tokenDisplay').innerText = currentToken;
          }
          document.getElementById('responseOutput').innerText = JSON.stringify(data, null, 2);
        }

        async function login() {
          const body = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
          };

          const res = await fetch('/api/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          });
          const data = await res.json();
          if (data.token) {
            currentToken = data.token;
            document.getElementById('tokenDisplay').innerText = currentToken;
          }
          document.getElementById('responseOutput').innerText = JSON.stringify(data, null, 2);
        }

        async function testRoute(endpoint) {
          const res = await fetch(endpoint, {
            headers: { 'Authorization': 'Bearer ' + currentToken }
          });
          const data = await res.json();
          document.getElementById('responseOutput').innerText = \`[HTTP \${res.status}]\n\` + JSON.stringify(data, null, 2);
        }
      </script>
    </body>
    </html>
  `);
});

// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Task 16 Auth Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
