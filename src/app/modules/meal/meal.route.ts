import { Router } from "express";
import { MealControllers } from "./meal.controller";

const router = Router();

router.get("/", MealControllers.getAllMeals);
router.get("/:id", MealControllers.getMealById);

export const MealRoutes = router;

