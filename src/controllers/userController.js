import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export async function register(req, res) {
    try {
        const { username, password } = req.body;
        
        if (!username || !password){
            return res.status(400).json({ error:"Username or password cannot be empty!"});
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
        return res.status(500).json({ error: "Server error!" });
    }
}

export async function login(req, res) {
     try {
        const { username, password } = req.body;
        
        if (!username || !password){
            return res.status(400).json({ error:"Username or password cannot be empty!"});
        }

        const user = await prisma.user.findUnique({ where: { username },})
        if (!user){
             return res.status(400).json({ error:"Invalid user!"});
        }
        const correctPassword = await bcrypt.compare(password,user.passwordHash)
        if (correctPassword){
            const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1d" });
            res.json({
                message: "Login successful!",
                token,
            });
        }
        else{
            return res.status(400).json({ error:"Invalid password!"});
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error!" });
    }
}

export async function identification(req,res) {
    try {
        const userId = req.user.userId;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }

        res.json(user);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error!" });
    }
}