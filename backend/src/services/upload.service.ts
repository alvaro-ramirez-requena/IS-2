import cloudinary from "../config/cloudinary";

export class UploadService {
  async uploadImage(filePath: string) {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "reportaya",
    });

    return {
      imageUrl: result.secure_url,
    };
  }
}
