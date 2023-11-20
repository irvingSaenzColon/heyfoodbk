import { Router } from "express";
import { FoodController } from "../controllers/food.js";
import { FoodModel } from "../models/food.js";

const foodRouter = Router();

const foodController = new FoodController( {foodModel: FoodModel } );

foodRouter.get('/', foodController.getAll);
foodRouter.get('/:id', foodController.get);
foodRouter.post('/create', foodController.create);
foodRouter.post('/update', foodController.update);
foodRouter.post('/search', foodController.search);
foodRouter.delete('/:id', foodController.delete);

export default foodRouter;