import { Router } from "express";
import { ProviderControllers } from "./provider.controller";

const router = Router();

router.get("/", ProviderControllers.getAllProviders);
router.get("/:id", ProviderControllers.getProviderWithMenu);

export const ProviderPublicRoutes = router;
