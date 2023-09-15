import { Router } from "express";
import { UserController } from "../controllers/user.js";
import { UserModel } from "../models/user.js";

const userRouter = Router();

const userController = new UserController( {userModel :UserModel} );

userRouter.get('/', userController.getAll);
userRouter.post('/', userController.create);
userRouter.post('/authenticate', userController.authenticate);

export default userRouter;