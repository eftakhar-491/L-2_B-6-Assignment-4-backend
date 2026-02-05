import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { AdminControllers } from "./admin.controller";

const router = Router();

router.get("/users", checkAuth(Role.admin), AdminControllers.getAllUsers);
router.patch(
  "/users/:id",
  checkAuth(Role.admin),
  AdminControllers.updateUserStatus,
);

export const AdminRoutes = router;
