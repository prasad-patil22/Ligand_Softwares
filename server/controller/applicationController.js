import Application from "../model/Application.js";
import cloudinary from "../cloudinary.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Config transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

// @desc    Submit job/internship application
// @route   POST /api/applications
// @access  Public
export const submitApplication = async (req, res) => {
  try {
    const { name, email, phone, jobTitle, coverLetter, resumeFile } = req.body;

    if (!name || !email || !phone || !jobTitle || !resumeFile) {
      return res.status(400).json({ error: "Please enter all required fields" });
    }

    console.log(`Processing application for ${name} - ${jobTitle}...`);

    // 1. Upload base64 resume file to Cloudinary
    console.log("Uploading resume to Cloudinary...");
    const uploadRes = await cloudinary.v2.uploader.upload(resumeFile, {
      folder: "resumes",
      resource_type: "auto" // crucial for PDFs/Docs
    });

    const resumeUrl = uploadRes.secure_url;
    console.log("Resume uploaded successfully:", resumeUrl);

    // 2. Save Application details in Database
    const application = await Application.create({
      name,
      email,
      phone,
      jobTitle,
      resume: resumeUrl,
      coverLetter: coverLetter || ""
    });

    // 3. Send styled confirmation email to candidate
    console.log("Sending confirmation email to:", email);
    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          background-color: #0b0f19;
          color: #cbd5e1;
          font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #151c2c;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }
        .header {
          background: linear-gradient(135deg, #7c3aed, #06b6d4);
          padding: 35px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          color: #ffffff;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .content {
          padding: 40px 30px;
          line-height: 1.6;
        }
        .content h2 {
          color: #ffffff;
          font-size: 19px;
          margin-top: 0;
          font-weight: 700;
        }
        .highlight {
          color: #06b6d4;
          font-weight: 600;
        }
        .info-box {
          background-color: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 20px;
          margin: 24px 0;
        }
        .info-box table {
          width: 100%;
          border-collapse: collapse;
        }
        .info-box td {
          padding: 6px 0;
          font-size: 14px;
        }
        .info-box td.label {
          color: #94a3b8;
          width: 120px;
          font-weight: 500;
        }
        .info-box td.value {
          color: #ffffff;
          font-weight: 500;
        }
        .button-container {
          text-align: center;
          margin-top: 30px;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #7c3aed, #06b6d4);
          color: #0f172a !important;
          text-decoration: none;
          padding: 12px 30px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .footer {
          background-color: #0b0f19;
          padding: 20px 30px;
          text-align: center;
          font-size: 12px;
          color: #64748b;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        .footer a {
          color: #06b6d4;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>LIGAND SOFTWARES</h1>
        </div>
        <div class="content">
          <h2>Application Received Successfully!</h2>
          <p>Hi <span class="highlight">${name}</span>,</p>
          <p>Thank you for submitting your application for the <span class="highlight">${jobTitle}</span> position at Ligand Softwares. We have successfully received your information and resume.</p>
          
          <div class="info-box">
            <table>
              <tr>
                <td class="label">Position:</td>
                <td class="value">${jobTitle}</td>
              </tr>
              <tr>
                <td class="label">Name:</td>
                <td class="value">${name}</td>
              </tr>
              <tr>
                <td class="label">Email:</td>
                <td class="value">${email}</td>
              </tr>
              <tr>
                <td class="label">Phone:</td>
                <td class="value">${phone}</td>
              </tr>
            </table>
          </div>

          <p><strong>What happens next?</strong></p>
          <p>Our technical recruitment team will review your application materials and review your profile. If your skills align with our current requirements, we will contact you within <span class="highlight">2 to 3 business days</span> to schedule an initial technical screening conversation.</p>
          
          <p>In the meantime, feel free to explore our training programs or view our portfolios on our website.</p>
          
          <div class="button-container">
            <a href="http://localhost:3000" class="button">Visit Our Portal</a>
          </div>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Ligand Softwares. All rights reserved.</p>
          <p>Sankeshwar, Karnataka, India | <a href="mailto:info@ligandsoftwares.com">info@ligandsoftwares.com</a></p>
        </div>
      </div>
    </body>
    </html>
    `;

    const mailOptions = {
      from: `"Ligand Softwares Careers" <${process.env.EMAIL}>`,
      to: email,
      subject: `Application Received: ${jobTitle} - Ligand Softwares`,
      html: emailHtml
    };

    await transporter.sendMail(mailOptions);
    console.log("Confirmation email sent successfully to applicant!");

    res.status(201).json({
      message: "Application submitted successfully and confirmation email sent.",
      application
    });
  } catch (error) {
    console.error("Submit Application Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// @desc    Get all applications
// @route   GET /api/applications
// @access  Private (Admin only)
export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.status(200).json({ applications });
  } catch (error) {
    console.error("Get Applications Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// @desc    Delete an application
// @route   DELETE /api/applications/:id
// @access  Private (Admin only)
export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await Application.findByIdAndDelete(id);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("Delete Application Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};
