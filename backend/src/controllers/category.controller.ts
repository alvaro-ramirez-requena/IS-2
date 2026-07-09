import { Request, Response } from "express";
import { CategoryService } from "../services/category.service";

const categoryService =
  new CategoryService();

export class CategoryController {

  static async getAll(
    req: Request,
    res: Response
  ) {
    try {

      const categories =
        await categoryService.getAll();

      res.json(categories);

    } catch (error: any) {

      res.status(400).json({
        message: error.message,
      });

    }
  }

  static async getById(
    req: Request,
    res: Response
  ) {
    try {

      const category =
        await categoryService.getById(
          req.params.id as string
        );

      res.json(category);

    } catch (error: any) {

      res.status(400).json({
        message: error.message,
      });

    }
  }

  static async create(
    req: Request,
    res: Response
  ) {
    try {

      const category =
        await categoryService.create(
          req.body
        );

      res.status(201).json(category);

    } catch (error: any) {

      res.status(400).json({
        message: error.message,
      });

    }
  }

  static async update(
    req: Request,
    res: Response
  ) {
    try {

      const category =
        await categoryService.update(
          req.params.id as string,
          req.body
        );

      res.json(category);

    } catch (error: any) {

      res.status(400).json({
        message: error.message,
      });

    }
  }

  static async delete(
    req: Request,
    res: Response
  ) {
    try {

      await categoryService.delete(
        req.params.id as string
      );

      res.json({
        message:
          "Categoría eliminada correctamente",
      });

    } catch (error: any) {

      res.status(400).json({
        message: error.message,
      });

    }
  }

}