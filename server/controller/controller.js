const mongoose = require('mongoose');
const UserInfo = require('../modals/userinfo');
const RegisterUser = require('../modals/userRegistration');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path'); // To manage file paths
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config({ path: "./config/config.env" });
const secretKey = process.env.JWT_SECRET

const transporter = nodemailer.createTransport({
  service: "gmail", // Change this to your email service provider
  auth: {
    user: process.env.myEmail,
    pass: process.env.myPass,
  }
});


exports.get = async (req, res) => {
  try {
    console.log("here");
    
    // Find all users in the 'User' collection
    const users = await UserInfo.find();
    console.log(users);
    
    // Check if there are no users found
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }

    // Return the list of users
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (e) {
    // Handle errors
    res.status(400).json({
      success: false,
      message: e.message,
    });
  }
};

exports.post = async (req, res) => {
  try {
    // Get data from the request body
    const { firstName, lastName, email, levelReached } = req.body;

    // Create a new instance of the User model
    const newUser = new UserInfo({
      firstName,
      lastName,
      email,
      levelReached
    });

    // Save the new user to the database
    await newUser.save();

    // Respond with success message
    res.status(201).json({
      success: true,
      message: "User data saved successfully",
      data: newUser
    });

  } catch (e) {
    // Handle errors and respond with error message
    res.status(400).json({
      success: false,
      message: e.message,
    });
  }
};

exports.exportToExcel = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await UserInfo.find();

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found in the database.",
      });
    }

    // Prepare data for the Excel file
    const userData = users.map((user) => ({
      'First Name': user.firstName,
      'Last Name': user.lastName,
      'Email': user.email,
      'level Reached': user.levelReached,
      'Created At': user.createdAt,
      'Updated At': user.updatedAt,
    }));

    // console.log(userData);
    
    // Create a new workbook
    const worksheet = XLSX.utils.json_to_sheet(userData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

    // Write workbook to buffer
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

    // Set response headers for download
    res.setHeader("Content-Disposition", "attachment; filename=Report.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    // Send the buffer as a response (this will trigger the download)
    res.send(buffer);

  } catch (e) {
    // Handle errors
    console.error("Error occurred while exporting to Excel:", e);
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};


exports.registerEmail = async (req, res) => {
  try {
    const { email } = req.body;
    // console.log("Received Email:", email);

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    // Ensure Email Uniqueness
    const existingUser = await RegisterUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists." });
    }

    // Generate a unique accessToken
    let token;
    let isUnique = false;
    while (!isUnique) {
      token = Math.floor(100000 + Math.random() * 900000).toString(); // Generate token
      const existingToken = await RegisterUser.findOne({ accessToken: token });
      if (!existingToken) isUnique = true; // Ensure token is unique
    }
    
    // console.log("Generated Token:", token);

    // Prevent null accessToken before saving
    if (!token) {
      return res.status(500).json({ success: false, message: "Error generating access token." });
    }

    // Create User
    const newUser = new RegisterUser({ email, accessToken: token });
    // console.log("New User:", newUser);

    await newUser.save();
    // console.log("User saved successfully:", newUser);

    // Send Email
    const mailOptions = {
      from: process.env.myEmail,
      to: email,
      subject: "Your Access Token",
    //   html: `
    //     <p>Hello,</p>
    //     <p>Here is your access token: <strong>${token}</strong></p>
    //     <p>Please keep it secure.</p>
    //     <p>Here's the link to the test: <a href="https://game-memory-cniu.vercel.app/">Click Here</a></p>
    //     <p>Best regards,<br>Rmoney India</p>
    // `
    html: `
        <p>Hello,</p>
        <p>Here is your access token: <strong>${token}</strong></p>
        <p>Please keep it secure.</p>
        <p>Here's the link to the test: <a href="http://192.168.10.116:5000">Click Here </a> for Time Test</p>
        <p>Best regards,<br>Rmoney India</p>
    `
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      accessToken: token,
      message: "User registered successfully. Token sent to email."
    });

  } catch (error) {
    console.error("Error in registering user:", error);

    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Duplicate Email or Access Token" });
    }

    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


exports.authenticateEmail = async (req, res) => {
  const { email, accessToken } = req.body;

  if (!email || !accessToken) {
    return res.status(400).json({ success: false, message: "Email and Access Token are required." });
  }

  try {
    // Find the user in the database
    const user = await RegisterUser.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // // Verify the JWT token
    // jwt.verify(accessToken, "secretKey", async (err, decoded) => {
    //   if (err) {
    //     return res.status(401).json({ success: false, message: "Invalid or expired token." });
    //   }

    //   // If the token is valid, delete the user entry
    //   await RegisterUser.deleteOne({ email });

    //   res.status(200).json({ success: true, message: "Authentication successful! Access granted." });
    // });

    // Check if the provided token matches the stored one
    
    if (user.accessToken !== accessToken) {
      // console.log("here");
      
      return res.status(401).json({ success: false, message: "Invalid token." });
    }

    // Delete the user entry after successful authentication
    await RegisterUser.deleteOne({ email });
    // console.log("deleted");
    
    res.status(200).json({ success: true, message: "Authentication successful! Access granted." });

  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(500).json({ success: false, message: "Internal Server Error." });
  }
};