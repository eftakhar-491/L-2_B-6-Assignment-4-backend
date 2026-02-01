import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserControllers } from "./user.controller";
import { Role } from "./user.interface";


// /api/user/

const router = Router();
// admin route
router.get("/", checkAuth(Role.ADMIN), UserControllers.getAllUsers);

router.get(
  "/:id/profile",
  checkAuth(Role.ADMIN),
  UserControllers.getSingleUser,
);

router.put(
  "/:id/update-profile",
  checkAuth(Role.ADMIN),
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
