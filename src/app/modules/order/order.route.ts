import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { OrderControllers } from "./order.controller";

const router = Router();

router.get(
  "/",
  checkAuth(Role.customer, Role.provider),
  OrderControllers.getMyOrders,
);
router.post(
  "/",
  checkAuth(Role.customer, Role.provider),
  OrderControllers.createOrder,
);
router.get(
  "/:id",
  checkAuth(Role.customer, Role.provider),
  OrderControllers.getOrderById,
);
router.patch(
  "/cancel/:id",
  checkAuth(Role.customer, Role.provider),
  OrderControllers.cancelOrder,
);

export const OrderRoutes = router;
