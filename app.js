import express from "express";
import fileUpload from "express-fileupload";
import { corsMiddleware } from "./middlewares/cors.js";
import userRouter from "./routes/user.js";
import categoryRouter from "./routes/category.js";
import foodRouter from "./routes/food.js";
import dailyFoodRouter from "./routes/dailyfood.js";
import weightRouter from "./routes/weight.js";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use( fileUpload() );
app.use( express.json() );
app.use( express.urlencoded({extended: true}) );
app.use( corsMiddleware() );
app.disable('x-powered-by');

app.use('/user', userRouter );
app.use('/category', categoryRouter );
app.use('/food', foodRouter );
app.use('/daily', dailyFoodRouter );
app.use('/weight', weightRouter );

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
});
