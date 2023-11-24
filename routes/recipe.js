import { Router } from "express";
import { userExtractor } from "../middlewares/userExtractor.js";
import { RecipeController } from "../controllers/recipe.js";
import { RecipeCategoryModel } from "../models/recipecategory.js";
import { RecipeModel } from "../models/recipe.js";


const recipeRouter = Router();

const recipeController = new RecipeController( {recipeModel : RecipeModel, categoryModel: RecipeCategoryModel} );

recipeRouter.get('/', userExtractor, recipeController.getAll);
recipeRouter.get('/:id', userExtractor,recipeController.get);
recipeRouter.post('/create', userExtractor,recipeController.create);
recipeRouter.post('/search', userExtractor, recipeController.search);
recipeRouter.put('/update', userExtractor, recipeController.update);
recipeRouter.delete('/delete/:id', userExtractor, recipeController.delete);

export default recipeRouter;