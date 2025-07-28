import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Account from '../models/Account';

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { displayName, emailAddress, secretKey } = req.body;

    const existingAccount = await Account.findOne({ 
      $or: [{ emailAddress }, { displayName }] 
    });
    if (existingAccount) {
      return res.status(400).json({ message: 'Account already exists' });
    }

    const saltRounds = 10;
    const hashedSecretKey = await bcrypt.hash(secretKey, saltRounds);

    const account = new Account({
      displayName,
      emailAddress,
      secretKey: hashedSecretKey
    });

    await account.save();

    const accessToken = jwt.sign(
      { 
        userId: account._id, 
        displayName: account.displayName,
        emailAddress: account.emailAddress 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Account created successfully',
      accessToken,
      userAccount: {
        id: account._id,
        displayName: account.displayName,
        emailAddress: account.emailAddress
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/signin', async (req, res) => {
  try {
    const { emailAddress, secretKey } = req.body;

    const account = await Account.findOne({ emailAddress });
    if (!account) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(secretKey, account.secretKey);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const accessToken = jwt.sign(
      { 
        userId: account._id, 
        displayName: account.displayName,
        emailAddress: account.emailAddress 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Sign in successful',
      accessToken,
      userAccount: {
        id: account._id,
        displayName: account.displayName,
        emailAddress: account.emailAddress
      }
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 