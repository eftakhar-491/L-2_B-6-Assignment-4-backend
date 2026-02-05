import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { CartControllers } from "./cart.controller";

const router = Router();

router.get("/", checkAuth(Role.customer), CartControllers.getCart);
router.post("/items", checkAuth(Role.customer), CartControllers.addItem);
router.patch("/items/:id", checkAuth(Role.customer), CartControllers.updateItem);
router.delete(
  "/items/:id",
  checkAuth(Role.customer),
  CartControllers.removeItem,
);
router.delete("/clear", checkAuth(Role.customer), CartControllers.clearCart);

export const CartRoutes = router;
