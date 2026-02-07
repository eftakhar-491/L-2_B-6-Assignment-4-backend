import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { CartControllers } from "./cart.controller";

const router = Router();

router.get(
  "/",
  checkAuth(Role.customer, Role.provider),
  CartControllers.getCart,
);
router.post(
  "/items",
  checkAuth(Role.customer, Role.provider),
  CartControllers.addItem,
);
router.patch(
  "/items/:id",
  checkAuth(Role.customer, Role.provider),
  CartControllers.updateItem,
);
router.delete(
  "/items/:id",
  checkAuth(Role.customer, Role.provider),
  CartControllers.removeItem,
);
router.delete(
  "/clear",
  checkAuth(Role.customer, Role.provider),
  CartControllers.clearCart,
);

export const CartRoutes = router;
