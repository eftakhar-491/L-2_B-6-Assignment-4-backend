import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserControllers } from "./user.controller";
import { Role } from "./user.interface";
import { checkRole } from "../../middlewares/checkRole";

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
  checkRole(...Object.values(Role)),
  UserControllers.getMe,
);

router.patch(
  "/profile",
  checkAuth(...Object.values(Role)),
  checkRole(...Object.values(Role)),
  UserControllers.updateMe,
);

router.post(
  "/addresses",
  checkAuth(...Object.values(Role)),
  checkRole(...Object.values(Role)),
  UserControllers.createAddress,
);

router.get(
  "/addresses",
  checkAuth(...Object.values(Role)),
  checkRole(...Object.values(Role)),
  UserControllers.getMyAddresses,
);

router.patch(
  "/addresses/:id",
  checkAuth(...Object.values(Role)),
  checkRole(...Object.values(Role)),
  UserControllers.updateAddress,
);

router.delete(
  "/addresses/:id",
  checkAuth(...Object.values(Role)),
  checkRole(...Object.values(Role)),
  UserControllers.deleteAddress,
);

export const UserRoutes = router;
