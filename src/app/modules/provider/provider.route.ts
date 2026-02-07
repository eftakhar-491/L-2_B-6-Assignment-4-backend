import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { ProviderControllers } from "./provider.controller";

const router = Router();

router.post(
  "/profile",
  checkAuth(Role.provider),
  ProviderControllers.createProviderProfile,
);
router.patch(
  "/profile",
  checkAuth(Role.provider),
  ProviderControllers.updateProviderProfile,
);
router.get(
  "/orders",
  checkAuth(Role.provider),
  ProviderControllers.getMyOrders,
);
router.get(
  "/categories",
  checkAuth(Role.provider),
  ProviderControllers.getMyCategories,
);
router.post(
  "/categories",
  checkAuth(Role.provider),
  ProviderControllers.createCategoryRequest,
);
router.post("/meals", checkAuth(Role.provider), ProviderControllers.addMeal);
router.put(
  "/meals/:id",
  checkAuth(Role.provider),
  ProviderControllers.updateMeal,
);
router.delete(
  "/meals/:id",
  checkAuth(Role.provider),
  ProviderControllers.removeMeal,
);
router.patch(
  "/orders/:id",
  checkAuth(Role.provider),
  ProviderControllers.updateOrderStatus,
);

export const ProviderRoutes = router;
