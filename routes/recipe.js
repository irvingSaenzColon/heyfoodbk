import { Router } from "express";
import { RecipeController } from "../controllers/recipe.js";
import { RecipeModel } from "../models/recipe.js";
import { userExtractor } from "../middlewares/userExtractor.js";

const recipeRouter = Router();

const recipeController = new RecipeController( {recipeModel : RecipeModel} );

recipeRouter.get('/', userExtractor, recipeController.getAll);
recipeRouter.get('/:id', userExtractor,recipeController.get);
recipeRouter.post('/create', userExtractor,recipeController.create);
recipeRouter.put('/update', userExtractor, recipeController.update);
recipeRouter.delete('/delete/:id', userExtractor, recipeController.delete);

export default recipeRouter;