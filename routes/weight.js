import { Router } from "express";
import { WeightController } from "../controllers/weight.js";
import { WeightModel } from "../models/weight.js";
import { userExtractor } from "../middlewares/userExtractor.js";

const weightRouter = Router();

const weightController = new WeightController( {weightModel : WeightModel} );

weightRouter.get('/', userExtractor, weightController.getAll);
weightRouter.get('/:id', weightController.get);
weightRouter.get('/from/:id', weightController.getFrom);
weightRouter.post('/create', userExtractor,weightController.create);
weightRouter.post('/update', userExtractor, weightController.update);
weightRouter.delete('/delete/:id', userExtractor, weightController.delete);

export default weightRouter;