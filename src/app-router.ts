import { Router } from "express";

export class AppRouter {
  // private static createV1Endpoint(endpoint: string): string {
  //   return `/api/v1${endpoint}`;
  // }

  static get routes(): Router {
    const router = Router();
    const currentDate = new Date();

    router.get("/health", (_, res) => {
      res.json({
        status: "healthy",
        service: "Notes API",
        version: "1.0.0",
        timestamp: currentDate.toISOString()
      });
    });

    return router;
  }
}
