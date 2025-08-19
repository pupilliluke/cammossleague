package cammossleague.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${app.email.from}")
    private String fromEmail;
    
    @Value("${app.name}")
    private String appName;
    
    @Value("${app.base-url}")
    private String baseUrl;
    
    public void sendPasswordResetEmail(String toEmail, String userName, String resetToken) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Password Reset Request - " + appName);
            
            String resetUrl = baseUrl + "/reset-password?token=" + resetToken;
            String htmlContent = createPasswordResetEmailTemplate(userName, resetUrl);
            
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            logger.info("Password reset email sent successfully to: {}", toEmail);
            
        } catch (MailException | MessagingException e) {
            logger.error("Failed to send password reset email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }
    
    private String createPasswordResetEmailTemplate(String userName, String resetUrl) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Password Reset - %s</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        line-height: 1.6; 
                        color: #333; 
                        background-color: #f4f4f4; 
                        margin: 0; 
                        padding: 20px; 
                    }
                    .container { 
                        max-width: 600px; 
                        margin: 0 auto; 
                        background: white; 
                        padding: 30px; 
                        border-radius: 10px; 
                        box-shadow: 0 0 10px rgba(0,0,0,0.1); 
                    }
                    .header { 
                        text-align: center; 
                        margin-bottom: 30px; 
                        padding-bottom: 20px; 
                        border-bottom: 2px solid #e7e7e7; 
                    }
                    .logo { 
                        font-size: 24px; 
                        font-weight: bold; 
                        color: #2563eb; 
                        margin-bottom: 10px; 
                    }
                    .button { 
                        display: inline-block; 
                        background-color: #2563eb; 
                        color: white; 
                        padding: 12px 30px; 
                        text-decoration: none; 
                        border-radius: 5px; 
                        margin: 20px 0; 
                        font-weight: bold; 
                    }
                    .button:hover { 
                        background-color: #1d4ed8; 
                    }
                    .warning { 
                        background-color: #fef3c7; 
                        border: 1px solid #f59e0b; 
                        padding: 15px; 
                        border-radius: 5px; 
                        margin: 20px 0; 
                    }
                    .footer { 
                        margin-top: 30px; 
                        padding-top: 20px; 
                        border-top: 1px solid #e7e7e7; 
                        text-align: center; 
                        color: #666; 
                        font-size: 14px; 
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">%s</div>
                        <h1>Password Reset Request</h1>
                    </div>
                    
                    <div class="content">
                        <p>Hello %s,</p>
                        
                        <p>We received a request to reset your password for your %s account. If you made this request, click the button below to reset your password:</p>
                        
                        <div style="text-align: center;">
                            <a href="%s" class="button">Reset Password</a>
                        </div>
                        
                        <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
                        <p style="word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 4px; font-family: monospace;">%s</p>
                        
                        <div class="warning">
                            <strong>⚠️ Important:</strong>
                            <ul>
                                <li>This link will expire in 1 hour</li>
                                <li>If you didn't request this password reset, please ignore this email</li>
                                <li>For security, this link can only be used once</li>
                            </ul>
                        </div>
                        
                        <p>If you continue to have problems, please contact your league administrator.</p>
                    </div>
                    
                    <div class="footer">
                        <p>This is an automated message from %s.<br>
                        Please do not reply to this email.</p>
                    </div>
                </div>
            </body>
            </html>
            """, appName, appName, userName, appName, resetUrl, resetUrl, appName);
    }
}