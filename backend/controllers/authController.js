import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const getJwtSecret = () => process.env.JWT_SECRET || 'ai_prep_secret_jwt_key_default';

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: 'Please provide all required fields: name, email, and password.' });
    return;
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({ message: 'An account with this email already exists.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server registration error', error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Please enter both your email and password.' });
    return;
  }

  try {
    let user = await User.findOne({ email });
    const lowerEmail = email.toLowerCase().trim();

    // Auto-seed sandbox credentials if missing
    if (!user) {
      if (lowerEmail === 'admin@interviewace.com' && password === 'admin') {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin', salt);
        user = await User.create({
          name: 'admin',
          email: 'admin@interviewace.com',
          password: hashedPassword
        });
      } else if (lowerEmail === 'student@interviewace.com' && password === 'student') {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('student', salt);
        user = await User.create({
          name: 'kishan kumar',
          email: 'student@interviewace.com',
          password: hashedPassword
        });
      }
    }

    if (!user) {
      res.status(401).json({ message: 'Invalid credentials. User not found.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials. Password matches fail.' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server login error', error: err.message });
  }
};
