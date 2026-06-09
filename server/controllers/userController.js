import User from "../models/User.js";
import bcrypt from 'bcryptjs' ;
import jwt from 'jsonwebtoken';
import sendEmail from "../utils/sendEmail.js";
import { welcomeEmailTemplate, otpEmailTemplate } from "../utils/emailTemplates.js";

// Register User /api/user/register
export const register = async(req, res)=>{
    try {
        const {name, email, password} = req.body;
        if(!name || !email || !password){
            return res.json({success: false, message:'Missing details'})
        }
        const existingUser = await User.findOne({ email });

        if (existingUser && existingUser.isVerified) {
            return res.json({ success: false, message: 'User already exists' });
        }
      
        if (existingUser && !existingUser.isVerified) {
            await User.deleteOne({ email }); 
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const user = await User.create({
          name,
          email,
          password: hashedPassword,
          otp,
          otpExpire: Date.now() + 5 * 60 * 1000,
          authProvider: "email"
        });

await sendEmail({
  to: email,
  subject: "Verify your Orgofresh account",
  html: otpEmailTemplate(otp, "verify"),
});

await sendEmail({
  to: email,
  subject: "Reset your Orgofresh password",
  html: otpEmailTemplate(otp, "reset"),
});

        return res.json({success: true, message: "OTP sent"});

    } catch (error) {
        res.json({success: false, message: error.message});
    }
};
// verify OTP: /api/user/verify-otp
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.json({ success: false, message: "Missing details" });
        }
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

if (user.otp !== otp) {
    return res.json({ success: false, message: "Invalid OTP" });
}

if (user.otpExpire < Date.now()) {
    return res.json({ success: false, message: "OTP expired" });
}
        user.isVerified = true;
        user.otp = null;
        user.otpExpire = null;

        await user.save();
  
        try {
          await sendEmail({
            to: user.email,
            subject: "Welcome to Orgofresh 🥦",
            html: welcomeEmailTemplate(user.name),
          });
        } catch (err) {
          console.log("Welcome email failed:", err.message);
        }
        
        return res.json({ success: true, message: "Account verified successfully" });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Login user: /api/user/login
export const login = async(req, res)=>{
    try {
        const {email, password} =req.body;
        if(!email || !password)
            return res.json({success: false, message: 'Email and password are required'})
        const user = await User.findOne({email});
        if(!user){
            return res.json({success: false, message: 'Invalid email or password'})  
        }

        if(!user.isVerified){
            return res.json({success: false, message: "Please verify your account"});
        }
        if (user.password === "google-auth") {
            return res.json({
              success: false,
              message: "Please login using Google",
            });
          }

       if (!user.isVerified) {
       return res.json({
      success: false,
      message: "Please verify your account",
      });
      }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch)
             return res.json({success: false, message: 'Invalid email or password'})  
    
        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn: '7d'})
        res.cookie('token', token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        })
        return res.json({success: true, user: {email: user.email, name: user.name}})

    }catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
    }
// googlelogin: /api/user/google-login
export const googleLogin = async (req, res) => {
    try {
      console.log("🔥 Google login API HIT");
  
      const { name, email } = req.body;
  
      let user = await User.findOne({ email });
  
      let isNewUser = false;
  
     
      if (!user) {
        user = await User.create({
          name,
          email,
          password: "google-auth",
          authProvider: "google",
          isVerified: true,
        });
  
        isNewUser = true; 
      }
  
      if (isNewUser) {
        try {
          console.log("Sending Google welcome email...");
  
          await sendEmail({
            to: email,
            subject: "Welcome to Orgofresh",
            html: welcomeEmailTemplate(name),
          });
  
          console.log("Google welcome email sent");
        } catch (err) {
          console.log("Google email error:", err.message);
        }
      }
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
  
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
  
      res.json({
        success: true,
        user: { name: user.name, email: user.email },
        isNewUser,
      });
  
    } catch (error) {
      res.json({ success: false, message: error.message });
    }
  };

// forget password: /api/user/forgot-password
    export const forgotPassword = async (req, res) => {
        try {
            const { email } = req.body;
    
            if (!email) {
                return res.json({ success: false, message: "Email is required" });
            }
    
            const user = await User.findOne({ email });
    
            if (!user) {
                return res.json({ success: false, message: "User not found" });
            }
    
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
            user.otp = otp;
            user.otpExpire = Date.now() + 5 * 60 * 1000;
    
            await user.save();
    
            await sendEmail({
                to: email,
                subject: "Orgofresh OTP Verification",
                html: `
                  <div style="font-family:sans-serif;text-align:center">
                    <h2>Orgofresh Verification</h2>
                    <p>Your OTP is:</p>
                    <h1 style="letter-spacing:5px">${otp}</h1>
                    <p>This OTP is valid for 5 minutes</p>
                  </div>
                `
            });
    
            res.json({ success: true, message: "OTP sent" });
    
        } catch (error) {
            res.json({ success: false, message: error.message });
        }
    };
// reset password: /api/user/reset-password
    export const resetPassword = async (req, res) => {
        try {
            const { email, otp, password } = req.body;
    
            const user = await User.findOne({ email });
    
            if (!user) {
                return res.json({ success: false, message: "User not found" });
            }
            
            if (user.otp !== otp) {
                return res.json({ success: false, message: "Invalid OTP" });
            }
            
            if (user.otpExpire < Date.now()) {
                return res.json({ success: false, message: "OTP expired" });
            }
    
            user.password = await bcrypt.hash(password, 10);
            user.otp = null;
            user.otpExpire = null;
    
            await user.save();
    
            res.json({ success: true, message: "Password updated" });
    
        } catch (error) {
            res.json({ success: false, message: error.message });
        }
    };

// Check auth: /api/user/is-auth
export const isAuth = async(req, res)=>{
try {
    const user = await User.findById(req.userId).select("-password")
    return res.json({success: true, user}) 
} catch (error) {
    console.log(error.message);
    res.json({success: false, message: error.message}); 
}
}

// Logout User: /api/user/logout
export const logout = async(req, res)=>{
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
})
return res.json({success: true, message: 'Logged out'})
} catch (error) {
    console.log(error.message);
    res.json({success: false, message: error.message});         
}
}
    
    
    

