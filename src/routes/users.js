const express = require('express')
const router = express.Router()
const bcrypt = require("bcrypt");
const prisma = require("../lib/prisma");
const jwt = require("jsonwebtoken");

router.post('/register', async (req,res) =>{
    try {
        const { username, password } = req.body;
        
        if (!username || !password){
            res.status(400).json({ error:"Username or password cannot be empty!"});
        }
        
        const existingUser = await prisma.user.findUnique({
            where: { username },
        });

        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                username,
                passwordHash: hashedPassword,
            },
        });
        res.json({message: "User created successfully",
            user: {
                id: user.id,
                username: user.username,
            },
        });
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Server error!" });
    }
})

router.post('/login', async (req,res) =>{
    try {
        const { username, password } = req.body;
        
        if (!username || !password){
            res.status(400).json({ error:"Username or password cannot be empty!"});
        }

        const user = await prisma.user.findUnique({ where: { username },})
        if (!user){
            res.status(400).json({ error:"Invalid user!"});
        }
        const correctPassword = await bcrypt.compare(password,user.passwordHash)
        if (correctPassword){
            const token = jwt.sign({ userId: user.id, username: user.username },"secret_key", { expiresIn: "1d" });
            res.json({
                message: "Login successful!",
                token,
            });
        }
        else{
            res.status(400).json({ error:"Invalid password!"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error!" });
    }
})
module.exports = router