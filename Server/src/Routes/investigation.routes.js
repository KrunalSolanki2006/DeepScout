import express from "express";
import {
  startInvestigation,
  getInvestigations,
  getInvestigationById,
  deleteInvestigation,
} from "../Controllers/investigation.controller.js";
import { requireAuth } from "../Middleware/auth.middleware.js";

const router = express.Router();

// Required investigation endpoints (Section 15, 17, 18, 19, 29)
router.post("/investigations", requireAuth, startInvestigation);
router.get("/investigations", requireAuth, getInvestigations);
router.get("/investigations/:id", requireAuth, getInvestigationById);
router.delete("/investigations/:id", requireAuth, deleteInvestigation);

// Alias endpoint for backwards compatibility
router.post("/investigate", requireAuth, startInvestigation);

export default router;