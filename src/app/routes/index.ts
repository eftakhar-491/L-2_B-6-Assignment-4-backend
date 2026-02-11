import { Router } from "express";
// import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";
import { ProviderRoutes } from "../modules/provider/provider.route";
import { ProviderPublicRoutes } from "../modules/provider/provider.public.route";
import { MealRoutes } from "../modules/meal/meal.route";
import { OrderRoutes } from "../modules/order/order.route";
import { CartRoutes } from "../modules/cart/cart.route";
import { AdminRoutes } from "../modules/admin/admin.route";
import { SuperAdminRoutes } from "../modules/superAdmin/superAdmin.route";
// import { ProductRoutes } from "../modules/product/product.route";
// import { CategoryRoutes } from "../modules/category/category.route";
// import { ImageRoutes } from "../modules/image/image.route";

export const router = Router();

const AuthRoutes = "";

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/meals",
    route: MealRoutes,
  },
  {
    path: "/providers",
    route: ProviderPublicRoutes,
  },
  {
    path: "/orders",
    route: OrderRoutes,
  },
  {
    path: "/cart",
    route: CartRoutes,
  },
  {
    path: "/admin",
    route: AdminRoutes,
  },
  {
    path: "/super-admin",
    route: SuperAdminRoutes,
  },
  {
    path: "/provider",
    route: ProviderRoutes,
  },
  // {
  //   path: "/user",
  //   route: UserRoutes,
  // },
  // {
  //   path: "/product",
  //   route: ProductRoutes,
  // },
  // {
  //   path: "/category",
  //   route: CategoryRoutes,
  // },
  // {
  //   path: "/image",
  //   route: ImageRoutes,
  // },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
