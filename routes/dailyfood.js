import { Router } from "express";
import { userExtractor } from "../middlewares/userExtractor.js";
import { DailyFoodController } from "../controllers/dailyFood.js";
import { DailyFoodModel } from "../models/dailyfood.js";

const dailyFoodRouter = Router();

const dailyFoodController = new DailyFoodController( {dailyFoodModel : DailyFoodModel} );

dailyFoodRouter.post('/', userExtractor, dailyFoodController.getAll);
dailyFoodRouter.post('/create', userExtractor, dailyFoodController.create);
dailyFoodRouter.put('/update', userExtractor, dailyFoodController.update);
dailyFoodRouter.post('/resume', userExtractor, dailyFoodController.resume);
dailyFoodRouter.delete('/delete/:id', userExtractor, dailyFoodController.delete);

export default dailyFoodRouter;