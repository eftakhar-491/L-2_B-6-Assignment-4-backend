import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { SuperAdminControllers } from "./superAdmin.controller";

const router = Router();

router.get(
  "/overview",
  checkAuth(Role.super_admin),
  SuperAdminControllers.getOverview,
);
router.get("/users", checkAuth(Role.super_admin), SuperAdminControllers.getUsers);
router.get("/meals", checkAuth(Role.super_admin), SuperAdminControllers.getMeals);
router.patch(
  "/users/:id/role",
  checkAuth(Role.super_admin),
  SuperAdminControllers.updateUserRole,
);
router.patch(
  "/users/:id/status",
  checkAuth(Role.super_admin),
  SuperAdminControllers.updateUserStatus,
);
router.delete(
  "/users/:id",
  checkAuth(Role.super_admin),
  SuperAdminControllers.deleteUser,
);
router.delete(
  "/providers/:id",
  checkAuth(Role.super_admin),
  SuperAdminControllers.deleteProvider,
);
router.delete(
  "/meals/:id",
  checkAuth(Role.super_admin),
  SuperAdminControllers.deleteMeal,
);

export const SuperAdminRoutes = router;
