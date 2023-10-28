import { Router } from "express";
import { CategoryController } from "../controllers/category.js";
import { CategoryModel } from "../models/category.js";

const categoryRouter = Router();

const categoryController = new CategoryController( {categoryModel: CategoryModel} );

categoryRouter.get('/', categoryController.getAll);
categoryRouter.get('/:id', categoryController.get);
categoryRouter.post('/create', categoryController.create);
categoryRouter.post('/update', categoryController.update);
categoryRouter.delete('/:id', categoryController.delete);


export default categoryRouter;