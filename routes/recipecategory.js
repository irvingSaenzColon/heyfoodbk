import { Router } from "express";
import { userExtractor } from "../middlewares/userExtractor.js";
import { RecipeCategoryController } from "../controllers/recipecategory.js";
import { RecipeCategoryModel } from "../models/recipecategory.js";

const recipeCategoryRouter = Router();

const recipeController = new RecipeCategoryController( {recipeCategoryModel : RecipeCategoryModel} );

recipeCategoryRouter.get('/', userExtractor, recipeController.getAll);
recipeCategoryRouter.get('/:id', userExtractor, recipeController.get);
recipeCategoryRouter.post('/create', userExtractor, recipeController.create);
recipeCategoryRouter.put('/update', userExtractor, recipeController.update);
recipeCategoryRouter.delete('/delete/:id', userExtractor, recipeController.delete);

export default recipeCategoryRouter;