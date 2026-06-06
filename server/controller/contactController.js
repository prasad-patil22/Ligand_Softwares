import ContactMessage from "../model/ContactMessage.js";
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

// @desc    Submit a new contact message
// @route   POST /api/contact
// @access  Public
export const submitMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Please enter all required fields" });
    }

    const newMessage = await ContactMessage.create({
      name,
      email,
      phone: phone || "",
      subject: subject || "Enquiry / Feedback",
      message
    });

    res.status(201).json({
      message: "Message submitted successfully",
      data: newMessage
    });
  } catch (error) {
    console.error("Submit Message Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private (Admin only)
export const getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json({ messages });
  } catch (error) {
    console.error("Get Messages Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// @desc    Reply to a contact message
// @route   POST /api/contact/:id/reply
// @access  Private (Admin only)
export const replyMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { replyMessage } = req.body;

    if (!replyMessage || !replyMessage.trim()) {
      return res.status(400).json({ error: "Please enter a reply message" });
    }

    const messageObj = await ContactMessage.findById(id);
    if (!messageObj) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Update message details
    messageObj.replyMessage = replyMessage;
    messageObj.isReplied = true;
    messageObj.repliedAt = Date.now();
    await messageObj.save();

    // Send email to user
    console.log(`Sending response email to: ${messageObj.email}...`);

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
        .message-quote {
          background-color: rgba(255, 255, 255, 0.02);
          border-left: 4px solid #7c3aed;
          border-radius: 4px 12px 12px 4px;
          padding: 16px;
          margin: 20px 0;
          font-style: italic;
          color: #94a3b8;
          font-size: 13.5px;
        }
        .reply-box {
          background-color: rgba(6, 182, 212, 0.03);
          border: 1px solid rgba(6, 182, 212, 0.15);
          border-radius: 12px;
          padding: 20px;
          margin: 24px 0;
          color: #ffffff;
          font-size: 14.5px;
          line-height: 1.7;
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
          <h2>Response to Your Enquiry</h2>
          <p>Hi <span class="highlight">${messageObj.name}</span>,</p>
          <p>Thank you for reaching out to Ligand Software Solutions. An administrator has reviewed your query regarding <span class="highlight">"${messageObj.subject}"</span> and provided a response.</p>
          
          <div class="message-quote">
            <strong>Your original message:</strong><br/>
            "${messageObj.message}"
          </div>

          <p><strong>Our Response:</strong></p>
          <div class="reply-box">
            ${replyMessage.replace(/\n/g, '<br/>')}
          </div>

          <p>If you have any further questions or require additional details, feel free to reply directly to this email or visit our portal.</p>
          
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
      from: `"Ligand Softwares Support" <${process.env.EMAIL}>`,
      to: messageObj.email,
      subject: `RE: ${messageObj.subject} - Ligand Softwares`,
      html: emailHtml
    };

    await transporter.sendMail(mailOptions);
    console.log("Response email sent successfully!");

    res.status(200).json({
      message: "Reply sent successfully and user notified via email.",
      data: messageObj
    });
  } catch (error) {
    console.error("Reply Message Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// @desc    Delete a contact message
// @route   DELETE /api/contact/:id
// @access  Private (Admin only)
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const messageObj = await ContactMessage.findByIdAndDelete(id);
    if (!messageObj) {
      return res.status(404).json({ error: "Message not found" });
    }
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Delete Message Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};
