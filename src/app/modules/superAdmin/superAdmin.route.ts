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

export const SuperAdminRoutes = router;
