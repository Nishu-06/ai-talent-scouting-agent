import { Router } from "express";
import { parseJdController } from "../controllers/jdController.js";

const router = Router();

router.post("/parse", parseJdController);

export default router;
