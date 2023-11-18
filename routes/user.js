import { Router } from "express";
import { UserController } from "../controllers/user.js";
import { UserModel } from "../models/user.js";
import { userExtractor } from "../middlewares/userExtractor.js";

const userRouter = Router();

const userController = new UserController( {userModel :UserModel} );

userRouter.get('/', userController.getAll);
userRouter.get('/:id', userController.get);
userRouter.post('/', userController.create);
userRouter.post('/authenticate', userController.authenticate);
userRouter.post('/update', userExtractor ,userController.update);

export default userRouter;