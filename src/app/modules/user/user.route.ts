import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserControllers } from "./user.controller";
import { Role } from "./user.interface";

// /api/user/

const router = Router();
// admin route
router.get("/", checkAuth(Role.admin), UserControllers.getAllUsers);

router.get(
  "/profile/:id",
  checkAuth(Role.admin),
  UserControllers.getSingleUser,
);

router.put(
  "/update-profile/:id",
  checkAuth(Role.admin),
  UserControllers.updateUser,
);

// user route
router.get(
  "/profile",
  checkAuth(...Object.values(Role)),
  UserControllers.getMe,
);

router.patch(
  "/profile",
  checkAuth(...Object.values(Role)),
  UserControllers.updateMe,
);

export const UserRoutes = router;
