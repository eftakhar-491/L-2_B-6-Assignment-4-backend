import { Router } from "express";
// import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";
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
