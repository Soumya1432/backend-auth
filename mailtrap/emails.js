import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE
} from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";


export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify Your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        `{verificationCode}`,
        verificationToken
      ),
      category: "Email Verification"
    });
    console.log("Email sent successfully", response);
  } catch (error) {
    console.log("Error sending verification email", error.meesage);
  }
};


export const sendWelcomeEmail = async (email, name) => {
  const receipent = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: receipent,
      template_uuid: "bad1feb6-82d3-413a-b53d-91b8e7182ff5",
      template_variables: {
        name: name,
        company_info_name: "ZeroWork",
        company_info_address: "Salt lake city,sector V",
        company_info_city: "Kolkata",
        company_info_zip_code: "70009",
        company_info_country: "India"
      }
    });
    console.log("Welcome email send succesfully", response);
  } catch (error) {
    console.log("Error", error);
    throw new Error(`Error sending welcome email:${error}`);
  }
};


export const sendPasswordResetEmail = async (email, resetURL) => {
  const receipent = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: receipent,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset"
    });
  } catch (error) {
    console.error("Error sending password reset mail", error);
    throw new Error(`Error sending password reset mail:${error}`);
  }
};


export const sendResetSuccessEmail = async email => {
  const receipent = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: receipent,
      subject: "Password reset successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset"
    });
    console.log("Password reset email send successfully", response);
  } catch (error) {
    console.log("Error", error);
  }
};
