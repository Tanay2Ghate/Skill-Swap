const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User, UserSkill, Skill } = require('../models');
const generateTokens = require('../utils/generateTokens');
const sendEmail = require('../utils/sendEmail');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    
    // Validate
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email is already registered' });
    }

    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password_hash });

    const { accessToken, refreshToken } = generateTokens(user);
    
    // Store refresh token hash
    const refreshSalt = await bcrypt.genSalt(10);
    const refreshTokenHash = await bcrypt.hash(refreshToken, refreshSalt);
    user.refresh_token = refreshTokenHash;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, avatar_url: user.avatar_url, avg_rating: user.avg_rating },
      accessToken
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ 
      where: { email },
      include: [{ model: UserSkill, as: 'userSkills', include: [{ model: Skill, as: 'skill' }] }]
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(user);
    
    const refreshSalt = await bcrypt.genSalt(10);
    const refreshTokenHash = await bcrypt.hash(refreshToken, refreshSalt);
    user.refresh_token = refreshTokenHash;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      success: true,
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        avatar_url: user.avatar_url, 
        avg_rating: user.avg_rating,
        userSkills: user.userSkills
      },
      accessToken
    });
  } catch (error) {
    next(error);
  }
};

exports.refresh = async (req, res, next) => {
  try {
    const cookieHeader = req.headers.cookie;
    let refreshToken = null;
    if (cookieHeader) {
      const cookies = cookieHeader.split(';').map(c => c.trim());
      const refreshCookie = cookies.find(c => c.startsWith('refreshToken='));
      if (refreshCookie) {
        refreshToken = refreshCookie.split('=')[1];
      }
    }

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'Refresh token missing' });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err) return res.status(401).json({ success: false, message: 'Invalid refresh token' });

      const user = await User.findByPk(decoded.id);
      if (!user || !user.refresh_token) return res.status(401).json({ success: false, message: 'Invalid refresh token' });

      const isMatch = await bcrypt.compare(refreshToken, user.refresh_token);
      if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid refresh token' });

      const tokens = generateTokens(user);
      
      const refreshSalt = await bcrypt.genSalt(10);
      user.refresh_token = await bcrypt.hash(tokens.refreshToken, refreshSalt);
      await user.save();

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.status(200).json({ success: true, accessToken: tokens.accessToken });
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    // Attempt to clear refresh token from db if valid
    const cookieHeader = req.headers.cookie;
    if (cookieHeader) {
      const cookies = cookieHeader.split(';').map(c => c.trim());
      const refreshCookie = cookies.find(c => c.startsWith('refreshToken='));
      if (refreshCookie) {
        const token = refreshCookie.split('=')[1];
        try {
          const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
          const user = await User.findByPk(decoded.id);
          if (user) {
            user.refresh_token = null;
            await user.save();
          }
        } catch (e) {
          // Ignore invalid token on logout
        }
      }
    }

    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'lax' });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const user = await User.findOne({ where: { email } });
    if (user) {
      const otp = crypto.randomInt(100000, 999999).toString();
      user.otp = otp;
      user.otp_expires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
      await user.save();

      await sendEmail({
        to: email,
        subject: 'SkillSwap Password Reset OTP',
        html: `<p>Your password reset OTP is: <strong>${otp}</strong>. It expires in 10 minutes.</p>`
      });
    }

    res.status(200).json({ success: true, message: "If this email is registered, you'll receive an OTP" });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user || user.otp !== otp || new Date() > user.otp_expires) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    const salt = await bcrypt.genSalt(12);
    user.password_hash = await bcrypt.hash(newPassword, salt);
    user.otp = null;
    user.otp_expires = null;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    next(error);
  }
};
