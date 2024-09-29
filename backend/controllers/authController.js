const User = require("../models/userModel.js");
const asyncHandler = require("../middleware/asyncHandler.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Product = require("../models/productModel");

const createTokens = require('../utils/createTokens.js')

const register = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(401).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ firstName, lastName, email, password: hashedPassword });


    const { accessToken, refreshToken } = await createTokens(newUser, res);

    try {
        await sendVerificationEmailRegister(newUser, accessToken);
        return res.json({
            accessToken,
            refreshToken,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            isAdmin: newUser.isAdmin,
            isVerified: newUser.isVerified,
            id: newUser._id
        })

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

})

const sendVerificationEmailRegister = async (newUser, accessToken) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'abdok7496@gmail.com',
            pass: 'nmyk kfxb idjj ryqk' // Consider using environment variables for security
        }
    });

    const mailOptions = {
        from: 'abdok7496@gmail.com',
        to: newUser.email,
        subject: 'Verify your email',
        text: `Please verify your email by clicking the following link: ${process.env.FRONTEND_URL}/auth/verify/${newUser._id}/${accessToken}`
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve(info.response);
            }
        });
    });
};


const sendVerificationEmailLogin = asyncHandler(async (req, res) => {

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser || !existingUser.isAdmin) {
        return res.status(401).json({ message: "User does not exist" });
    }

    if (existingUser.isVerified) {
        return res.status(402).json({ message: "User already verified" });
    }


    const { accessToken, refreshToken } = await createTokens(existingUser, res);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'abdok7496@gmail.com',
            pass: 'nmyk kfxb idjj ryqk' // Consider using environment variables for security
        }
    });

    const mailOptions = {
        from: 'abdok7496@gmail.com',
        to: existingUser.email,
        subject: 'Verify your email',
        text: `Please verify your email by clicking the following link: ${process.env.FRONTEND_URL}/auth/verify/${existingUser._id}/${accessToken}`
    };

    try {
        await new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(info.response);
                }
            });
        });

        // Return user information and tokens in response like in register
        return res.json({
            accessToken,
            refreshToken,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            email: existingUser.email,
            isAdmin: existingUser.isAdmin,
            isVerified: existingUser.isVerified,
            id: existingUser._id
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
})

const verifyEmail = asyncHandler(async (req, res) => {
    const { id, accessToken } = req.body;

    const existingUser = await User.findById(id);

    if (!existingUser) {
        return res.status(400).json({ message: "User does not exist" });
    }

    try {
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized' })
            } else {
                existingUser.isVerified = true;
                await existingUser.save();
                return res.status(200).json({
                    message: 'Email verified successfully',
                    accessToken,
                    firstName: existingUser.firstName,
                    lastName: existingUser.lastName,
                    email: existingUser.email,
                    isAdmin: existingUser.isAdmin,
                    isVerified: existingUser.isVerified,
                    id: existingUser._id
                })
            }
        })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
})
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body; // cart is sent from frontend session

    console.log(email)
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser || !existingUser.isAdmin) {
        return res.status(400).json({ message: "User does not exist" });
    }

    if (!existingUser.isVerified) {
        return res.status(401).json({ message: "Please verify your email" });
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
        return res.status(402).json({ message: "Incorrect password" });
    }
    

    const { accessToken, refreshToken } = await createTokens(existingUser, res);
    try {
        const userInfo = {
            accessToken,
            refreshToken,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            email: existingUser.email,
            isAdmin: existingUser.isAdmin,
            isVerified: existingUser.isVerified,
            id: existingUser._id,
        };
        res.cookie('userInfo', JSON.stringify(userInfo), { httpOnly: true, sameSite: 'None', secure: process.env.NODE_ENV === 'production' });
        return res.json(userInfo);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});



const refresh = asyncHandler(async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const refreshToken = cookies.jwt;
    const userInfo = cookies.userInfo;
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
            // Refresh token is invalid or expired
            return res.status(403).json({ message: "Forbidden" });
        }


        const existingUser = await User.findById(decoded.userInfo.id);

        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const accessToken = jwt.sign({
            userInfo: {
                id: existingUser._id,
            }
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })

        return res.json({ accessToken, userInfo })
    })
})


const logout = asyncHandler(async (req, res) => {
    const cookies = req.cookies;

    const { id } = req.body;
    

    const existingUser = await User.findById(id);

    if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
    }


    
    if (!cookies?.jwt) {
        return res.sendStatus(204);
    }

    res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'None',
        secure: process.env.NODE_ENV === 'production',
    })

    return res.json({ 'message': 'Cookie cleared' })

})

module.exports = {
    register,
    sendVerificationEmailLogin,
    verifyEmail,
    login,
    refresh,
    logout
}
