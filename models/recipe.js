import { firebaseConfig } from '../config/firebase.config.js'
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { PrismaClient } from '@prisma/client';
import { deleteFromStorage, storageImage } from '../util/index.js';

const prisma = new PrismaClient();

const appFirebase = initializeApp(firebaseConfig);
const storage = getStorage(appFirebase);


export class RecipeModel{
    static async getAll (){
        
        const recipes = await prisma.recipe.findMany( {
            include:{
                steps: true,
                ingredients: true,
                images: true
            }
        } )

        return recipes;
    }

    static async get( id ){
        const recipe = await prisma.recipe.findFirst( {
            include: {
                ingredients: {
                    include: {
                        recipeIngredientfood:{
                            include: {
                                nutriment: true,
                                foodCategory: true,
                                images: true
                            }
                        }
                    }
                },
                steps: true,
                images: true
            },
            where: { id : id}
        } );

       return recipe ;
    }

    static async create({input}){
        const {
           title,
           description,
           preparationTime,
           cookingTime,
           images,
           steps,
           ingredients,
           userId
        } = input;
        const recipeHeader = await prisma.recipe.create( {
            data: {
                title: title,
                description: description,
                preparationTime: preparationTime,
                cookingTime: cookingTime,
                userId: userId
            }
        } );

        steps.forEach(async (step) => {
            await prisma.recipeStep.create( {
                data: {
                    description: step,
                    recipeId: recipeHeader.id
                }
            } );
        });

        ingredients.forEach( async(ingredient) =>{
            await prisma.recipeIngredient.create( {
                data: {
                    foodId: ingredient.foodId,
                    portion: ingredient.portion,
                    recipeId: recipeHeader.id
                }
            } )
        } );

        if(images === null) return recipeHeader;

        images.forEach( async(data, index) => {
            const imageUrl =  await storageImage(storage,'Recipe', data);
            await prisma.recipeMedia.create({
                data: {
                    image: imageUrl,
                    recipeId: recipeHeader.id
                }
            });
        } );
         
        return recipeHeader;
    }

    static async update({input}){
        const {
            id,
            title,
            description,
            preparationTime,
            cookingTime,
            images,
            steps,
            ingredients,
            userId,
            deletedIngredients,
            deletedImages,
            deletedSteps,
            updatedSteps,
            updatedIngredients
         } = input;

         const recipeHeader = await prisma.recipe.update( {
            data: {
                title: title,
                description: description,
                preparationTime: preparationTime,
                cookingTime: cookingTime
            },
            where: { id: id }
         } );

        //  Adding new images
        images.forEach( async(data, index) => {
            const imageUrl =  await storageImage(storage,'Recipe', data);
            await prisma.recipeMedia.create({
                data: {
                    image: imageUrl,
                    recipeId: id
                }
            });
        } );

        // Removing Images
        deletedImages.forEach( async( id ) => {
            const exists = await prisma.recipeMedia.findFirst( { where: { id: id } } )

            if(exists) await prisma.recipeMedia.delete( { where: { id: id } } )
        } )

        // Adding new steps
        steps.forEach(async (step) => {
            await prisma.recipeStep.create( {
                data: {
                    description: step,
                    recipeId: id
                }
            } );
        });

        // Updateing Steps
        updatedSteps.forEach( async(step) => {
            await prisma.recipeStep.update( {
                data:{
                    description: step.description
                },
                where: { id: step.id }
            } )
        } )

        // Removing steps
        deletedSteps.forEach(async (id) => {
            const exists = await prisma.recipeStep.findFirst( { where: {id: id} } )
            if( exists ) await prisma.recipeStep.delete( { where: { id: id } } )
        });

        // Adding new Ingredients
        ingredients.forEach( async(ingredient) =>{
            await prisma.recipeIngredient.create( {
                data: {
                    foodId: ingredient.foodId,
                    portion: ingredient.portion,
                    recipeId: recipeHeader.id
                }
            } )
        } );

        // Updateing ingredients
        updatedIngredients.forEach( async(ingredient) => {
            await prisma.recipeIngredient.update( {
                data:{
                    portion: ingredient.portion
                },
                where: { id: ingredient.id }
            } );
        } )

        // Removing ingredients
        deletedIngredients.forEach( async( id ) =>{
            const exists = await prisma.recipeIngredient.findFirst( {where:{ id: id } } );
            if(exists) await prisma.recipeIngredient.delete( { where:{id:id} } );
        } );

       return recipeHeader;
    }

    static async delete({input}){
        const {
            id,
            userId
        } = input;

        // Find the recipe first
        const recipeHeader = await prisma.recipe.findUnique( { where: {id : id} } );

        if(!recipeHeader) return;

        await prisma.recipeIngredient.deleteMany( { where: { recipeId: recipeHeader.id } } );
        await prisma.recipeStep.deleteMany( { where: { recipeId: recipeHeader.id } } );
        await prisma.recipeMedia.deleteMany( {where: {recipeId: recipeHeader.id}} );
        await prisma.recipe.delete( { where: { id: id } } );
    }

    static async search({input}){
        const {
            title,
            category
        } = input;

        if(category === undefined || title === undefined) return [];

        const recipes = await prisma.recipe.findMany( {
            include:{
                steps: true,
                images: true,
                ingredients: true
            },
            where: { title: { contains: title} }
        } )

        return recipes;
    }
}