const nodemailer = require('nodemailer');
const NotificationLog = require('../models/NotificationLog');

class NotificationService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async logNotification(recipient, type, event, subject, message, status, errorMessage = null) {
    try {
      await NotificationLog.create({
        recipient,
        type,
        event,
        subject,
        message,
        status,
        errorMessage
      });
    } catch (error) {
      console.error('Failed to log notification:', error.message);
    }
  }

  async sendPetitionCreated(userEmail, petitionTitle) {
    const subject = 'Petition Created Successfully';
    const message = `Your petition "${petitionTitle}" has been created and is now live.`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject,
      html: `
        <h2>Your petition has been created!</h2>
        <p><strong>Title:</strong> ${petitionTitle}</p>
        <p>Your petition is now live and people can start signing it.</p>
      `
    };
    
    try {
      await this.transporter.sendMail(mailOptions);
      await this.logNotification(userEmail, 'email', 'petition_created', subject, message, 'sent');
      console.log('Petition creation email sent');
    } catch (error) {
      await this.logNotification(userEmail, 'email', 'petition_created', subject, message, 'failed', error.message);
      console.error('Email send failed:', error.message);
    }
  }

  async sendComplaintStatusUpdate(userEmail, complaintTitle, newStatus) {
    const subject = 'Complaint Status Updated';
    const message = `Your complaint "${complaintTitle}" status has been updated to ${newStatus}.`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject,
      html: `
        <h2>Your complaint status has been updated</h2>
        <p><strong>Complaint:</strong> ${complaintTitle}</p>
        <p><strong>New Status:</strong> ${newStatus}</p>
      `
    };
    
    try {
      await this.transporter.sendMail(mailOptions);
      await this.logNotification(userEmail, 'email', 'complaint_status_updated', subject, message, 'sent');
      console.log('Complaint status email sent');
    } catch (error) {
      await this.logNotification(userEmail, 'email', 'complaint_status_updated', subject, message, 'failed', error.message);
      console.error('Email send failed:', error.message);
    }
  }

  async sendComplaintAssigned(volunteerEmail, complaintTitle) {
    const subject = 'New Complaint Assigned';
    const message = `A complaint "${complaintTitle}" has been assigned to you for review.`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: volunteerEmail,
      subject,
      html: `
        <h2>A complaint has been assigned to you</h2>
        <p><strong>Complaint:</strong> ${complaintTitle}</p>
        <p>Please log in to review and update the status.</p>
      `
    };
    
    try {
      await this.transporter.sendMail(mailOptions);
      await this.logNotification(volunteerEmail, 'email', 'complaint_assigned', subject, message, 'sent');
      console.log('Complaint assignment email sent');
    } catch (error) {
      await this.logNotification(volunteerEmail, 'email', 'complaint_assigned', subject, message, 'failed', error.message);
      console.error('Email send failed:', error.message);
    }
  }

  async sendComplaintSubmitted(userEmail, complaintTitle) {
    const subject = 'Complaint Submitted Successfully';
    const message = `Your complaint "${complaintTitle}" has been submitted and will be reviewed by our team.`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject,
      html: `
        <h2>Your complaint has been submitted!</h2>
        <p><strong>Title:</strong> ${complaintTitle}</p>
        <p>We have received your complaint and it will be reviewed by our team shortly.</p>
        <p>You will receive updates as the status changes.</p>
      `
    };
    
    try {
      await this.transporter.sendMail(mailOptions);
      await this.logNotification(userEmail, 'email', 'complaint_submitted', subject, message, 'sent');
      console.log('Complaint submission email sent');
    } catch (error) {
      await this.logNotification(userEmail, 'email', 'complaint_submitted', subject, message, 'failed', error.message);
      console.error('Email send failed:', error.message);
    }
  }
}

module.exports = new NotificationService();