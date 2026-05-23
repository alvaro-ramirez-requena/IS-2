import type {
  Request,
  Response,
} from "express";

import { UploadService }
from "../services/upload.service";

const uploadService =
  new UploadService();

export class UploadController {

  async uploadImage(
    req: Request,
    res: Response
  ) {

    try {

      const file =
        req.file;

      if (!file) {

        return res.status(400)
          .json({
            message:
              "Imagen requerida",
          });
      }

      const result =
        await uploadService
          .uploadImage(file.path);

      return res.status(200)
        .json(result);

    } catch (error) {

      return res.status(500)
        .json({
          message:
            "Error subiendo imagen",
        });
    }
  }
}