import { Router } from "express";
import { matchCandidatesController } from "../controllers/matchController.js";

const router = Router();

router.post("/", matchCandidatesController);

export default router;
