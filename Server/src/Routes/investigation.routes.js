import express from "express";

import {
  startInvestigation,
} from "../Controllers/investigation.controller.js";

const router =
  express.Router();

router.post(
  "/investigate",
  startInvestigation
);

export default router;