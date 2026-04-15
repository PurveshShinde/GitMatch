import nodemailer from "nodemailer";

const createTransporter = () => {
	return nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});
};

export const sendVerificationEmail = async (to, token) => {
	const transporter = createTransporter();
	const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

	console.log("[EMAIL] Verification URL:", verifyUrl);
	console.log("[EMAIL] Sending to:", to);

	const mailOptions = {
		from: `"GitMatch" <${process.env.EMAIL_USER}>`,
		to,
		subject: "Verify Your Email — GitMatch",
		html: `
			<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden;">
				<div style="background: linear-gradient(135deg, #7c3aed, #06b6d4); padding: 40px 30px; text-align: center;">
					<h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: -0.5px;">GitMatch</h1>
					<p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">Developer Matchmaking Platform</p>
				</div>
				<div style="padding: 40px 30px; color: #cbd5e1;">
					<h2 style="color: #ffffff; margin: 0 0 16px; font-size: 22px;">Verify Your Email</h2>
					<p style="margin: 0 0 24px; line-height: 1.6; font-size: 15px;">
						Welcome to GitMatch! Click the button below to verify your email address and activate your account.
					</p>
					<div style="text-align: center; margin: 32px 0;">
						<a href="${verifyUrl}" style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #06b6d4); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-weight: 700; font-size: 15px; letter-spacing: 0.5px;">
							VERIFY EMAIL
						</a>
					</div>
					<p style="margin: 24px 0 0; font-size: 13px; color: #64748b; line-height: 1.5;">
						This link expires in <strong style="color: #94a3b8;">24 hours</strong>. If you didn't create an account on GitMatch, you can safely ignore this email.
					</p>
					<hr style="border: none; border-top: 1px solid #1e293b; margin: 30px 0;" />
					<p style="margin: 0; font-size: 12px; color: #475569; text-align: center;">
						Can't click the button? Copy and paste this URL:<br/>
						<a href="${verifyUrl}" style="color: #06b6d4; word-break: break-all;">${verifyUrl}</a>
					</p>
				</div>
			</div>
		`,
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		console.log("[EMAIL] ✓ Verification email sent successfully:", info.messageId);
		return info;
	} catch (error) {
		console.error("[EMAIL] ✗ Failed to send verification email:");
		console.error("  Error:", error.message);
		console.error("  Code:", error.code);
		console.error("  Config EMAIL_USER:", process.env.EMAIL_USER);
		console.error("  Config has EMAIL_PASS?:", !!process.env.EMAIL_PASS);
		throw error;
	}
};

export const sendPasswordResetEmail = async (to, token) => {
	const transporter = createTransporter();
	const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

	console.log("[EMAIL] Reset URL:", resetUrl);
	console.log("[EMAIL] Sending to:", to);

	const mailOptions = {
		from: `"GitMatch" <${process.env.EMAIL_USER}>`,
		to,
		subject: "Reset Your Password — GitMatch",
		html: `
			<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden;">
				<div style="background: linear-gradient(135deg, #7c3aed, #06b6d4); padding: 40px 30px; text-align: center;">
					<h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: -0.5px;">GitMatch</h1>
					<p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">Developer Matchmaking Platform</p>
				</div>
				<div style="padding: 40px 30px; color: #cbd5e1;">
					<h2 style="color: #ffffff; margin: 0 0 16px; font-size: 22px;">Password Reset Request</h2>
					<p style="margin: 0 0 24px; line-height: 1.6; font-size: 15px;">
						We received a request to reset the password for your GitMatch account. Click the button below to set a new password.
					</p>
					<div style="text-align: center; margin: 32px 0;">
						<a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #06b6d4); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-weight: 700; font-size: 15px; letter-spacing: 0.5px;">
							RESET PASSWORD
						</a>
					</div>
					<p style="margin: 24px 0 0; font-size: 13px; color: #64748b; line-height: 1.5;">
						This link expires in <strong style="color: #94a3b8;">1 hour</strong>. If you didn't request a password reset, you can safely ignore this email.
					</p>
					<hr style="border: none; border-top: 1px solid #1e293b; margin: 30px 0;" />
					<p style="margin: 0; font-size: 12px; color: #475569; text-align: center;">
						Can't click the button? Copy and paste this URL:<br/>
						<a href="${resetUrl}" style="color: #06b6d4; word-break: break-all;">${resetUrl}</a>
					</p>
				</div>
			</div>
		`,
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		console.log("[EMAIL] ✓ Password reset email sent successfully:", info.messageId);
		return info;
	} catch (error) {
		console.error("[EMAIL] ✗ Failed to send password reset email:");
		console.error("  Error:", error.message);
		console.error("  Code:", error.code);
		console.error("  Config EMAIL_USER:", process.env.EMAIL_USER);
		console.error("  Config has EMAIL_PASS?:", !!process.env.EMAIL_PASS);
		throw error;
	}
};
