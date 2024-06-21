import { Router } from "express";
import { createUser, getAllUsers } from "../controllers/userController.js";

const router = Router();

router.post("/", createUser);
router.get("/", getAllUsers);

export default router;
