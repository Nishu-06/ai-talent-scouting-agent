import { Router } from "express";
import { getResultsController } from "../controllers/resultsController.js";

const router = Router();

router.get("/", getResultsController);

export default router;
