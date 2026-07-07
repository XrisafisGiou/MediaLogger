import express from "express";
import { register, login, identification, changePassword } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/register', register); 
router.post('/login', login);
router.get("/me", authMiddleware, identification);
router.patch("/password",authMiddleware,changePassword);
    
export default router;