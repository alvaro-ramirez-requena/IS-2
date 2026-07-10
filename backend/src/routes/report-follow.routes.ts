import { Router } from "express";
import { ReportFollowController } from "../controllers/report-follow.controller";

const router =
  Router();

router.post(
  "/follow",
  ReportFollowController.follow
);

router.delete(
  "/unfollow",
  ReportFollowController.unfollow
);

router.get(
  "/is-following/:userId/:reportId",
  ReportFollowController.isFollowing
);

router.get(
  "/user/:userId",
  ReportFollowController.getFollowedReports
);

export default router;