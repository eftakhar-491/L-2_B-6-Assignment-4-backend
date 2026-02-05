import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { OrderControllers } from "./order.controller";

const router = Router();

router.post("/", checkAuth(Role.customer), OrderControllers.createOrder);
router.get("/", checkAuth(Role.customer), OrderControllers.getMyOrders);
router.get("/:id", checkAuth(Role.customer), OrderControllers.getOrderById);
router.patch(
  "/:id/cancel",
  checkAuth(Role.customer),
  OrderControllers.cancelOrder,
);

export const OrderRoutes = router;
