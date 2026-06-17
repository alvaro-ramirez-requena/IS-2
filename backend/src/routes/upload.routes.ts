import { Router }
from "express";

import {
  upload,
} from "../middlewares/upload.middleware";

import {
  UploadController,
} from "../controllers/upload.controller";

const router =
  Router();

const controller =
  new UploadController();

router.post(
  "/",

  upload.single("image"),

  controller.uploadImage
);

export default router;