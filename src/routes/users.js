import express from "express";
import { register, login, identification } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/register', register); 
router.post('/login', login);
router.get("/me", authMiddleware, identification);
    
export default router;