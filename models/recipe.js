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
                images: true,
                categories: {
                    include: {
                        category: true
                    }
                }
            }
        } )

        return recipes;
    }

    static async get( id ){
        const recipe = await prisma.recipe.findFirst( {
            include: {
                nutriment: true,
                ingredients: {
                    include: {
                        recipeIngredientfood:{
                            include: {
                                nutriment: true,
                                foodCategory: true,
                                images: true,
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
           categories,
           userId
        } = input;
        const newNutriments = await this.updateNutriments( ingredients );

        const nutriments = await prisma.nutriments.create( {
            data: {
                portion: newNutriments.portion,
                energy: newNutriments.energy,
                calories: newNutriments.calories ,
                carbohydrates: newNutriments.carbohydrates ,
                proteins: newNutriments.proteins ,
                fiber: newNutriments.fiber ,
                potassium: newNutriments.potassium ,
                sugar: newNutriments.sugar ,
                fat: newNutriments.fat ,
                saturatedFats: newNutriments.saturatedFats ,
                polyunsaturatedFat: newNutriments.polyunsaturatedFat ,
                cholesterol: newNutriments.cholesterol ,
                sodium: newNutriments.sodium
            }
        } );

        const recipeHeader = await prisma.recipe.create( {
            data: {
                title: title,
                description: description,
                preparationTime: preparationTime,
                cookingTime: cookingTime,
                userId: userId,
                nutrimentId: nutriments.id
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

        categories.forEach( async(category) =>{
            await prisma.categoriesOnRecipe.create({
                data: {
                    recipeId: recipeHeader.id,
                    categoryId: category.id
                }
            });
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
            categories,
            deletedIngredients,
            deletedImages,
            deletedSteps,
            updatedSteps,
            updatedIngredients,
            deletedCategories,
            userId
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
        for await (const ingredient of updatedIngredients){
            await prisma.recipeIngredient.update( {
                data:{
                    portion: ingredient.portion
                },
                where: { id: ingredient.id }
            } );
        }

        // Removing ingredients
        deletedIngredients.forEach( async( id ) =>{
            const exists = await prisma.recipeIngredient.findFirst( {where:{ id: id } } );
            if(exists) await prisma.recipeIngredient.delete( { where:{id:id} } );
        } );

        // Removing Categories
        deletedCategories.forEach( async(id) => {
            await prisma.categoriesOnRecipe.delete({
                where:{ recipeId_categoryId: {
                    recipeId: recipeHeader.id,
                    categoryId: parseInt( id )
                } }
            })
        } );

        categories.forEach( async ( category ) => {
            await prisma.categoriesOnRecipe.create( {
                data: {
                    recipeId: recipeHeader.id,
                    categoryId: parseInt( category.id )
                }
            } )
        } );

        const newIngredients = await prisma.recipeIngredient.findMany({ where: { recipeId: recipeHeader.id }});

        const newNutriments = await this.updateNutriments( newIngredients );
        await prisma.nutriments.update( {
            data: {
                portion: newNutriments.portion,
                energy: newNutriments.energy,
                calories: newNutriments.calories ,
                carbohydrates: newNutriments.carbohydrates ,
                proteins: newNutriments.proteins ,
                fiber: newNutriments.fiber ,
                potassium: newNutriments.potassium ,
                sugar: newNutriments.sugar ,
                fat: newNutriments.fat ,
                saturatedFats: newNutriments.saturatedFats ,
                polyunsaturatedFat: newNutriments.polyunsaturatedFat ,
                cholesterol: newNutriments.cholesterol ,
                sodium: newNutriments.sodium
            },
            where: { id: recipeHeader.nutrimentId }
        } )

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

        const recipesGB = await prisma.recipe.groupBy( {
            by:['id'],
            where: { title: { contains: title} }
        } );

        const recipes = [];
        for await (const rt of recipesGB){
            const temp = await prisma.recipe.findUnique({
                include: {
                    images: true,
                    steps: true,
                    ingredients: true,
                    categories: {
                        include: {
                            category: true
                        }
                    }
                },
                where: { id : rt.id }
            });

            recipes.push( temp );
        }

        console.log( recipes );

        recipes.forEach( recipe =>{
            recipe.categories = recipe.categories.map( category => {
                return{ id: category.category.id ,recipeId: category.recipeId, name: category.category.name };
            } );
        } );

        return recipes;
    }

    static async updateNutriments(ingredients){
        let output = {
            portion: 0,
            energy: 0,
            calories: 0,
            carbohydrates: 0,
            proteins: 0,
            fiber: 0,
            potassium: 0,
            sugar: 0,
            fat: 0,
            saturatedFats: 0,
            polyunsaturatedFat: 0,
            cholesterol: 0,
            sodium: 0
        };

        for await(const ingredient of ingredients){
            const food = await prisma.food.findUnique({
                include: {
                    nutriment: true
                },
                where: { id: ingredient.foodId }
            });

            const { nutriment } = food;
            const portionFloat = parseFloat( ingredient.portion );
            const nutrimentFloat = parseFloat( nutriment.portion );

            output.portion += parseFloat(ingredient.portion)  ;
            output.energy += (parseFloat(nutriment.energy) * portionFloat) / nutrimentFloat;
            output.calories+= (parseFloat(nutriment.calories) * portionFloat) / nutrimentFloat;
            output.carbohydrates += (parseFloat(nutriment.carbohydrates) * portionFloat) / nutrimentFloat;
            output.proteins += (parseFloat(nutriment.proteins) * portionFloat) / nutrimentFloat;
            output.fiber += (parseFloat(nutriment.fiber) * portionFloat) / nutrimentFloat;
            output.potassium += (parseFloat(nutriment.potassium) * portionFloat) / nutrimentFloat;
            output.sugar += (parseFloat(nutriment.sugar) * portionFloat) / nutrimentFloat;
            output.fat += (parseFloat(nutriment.fat) * portionFloat) / nutrimentFloat;
            output.saturatedFats += (parseFloat(nutriment.saturatedFats) * portionFloat) / nutrimentFloat;
            output.polyunsaturatedFat += (parseFloat(nutriment.polyunsaturatedFat) * portionFloat) / nutrimentFloat;
            output.cholesterol += (parseFloat(nutriment.cholesterol) * portionFloat) / nutrimentFloat;
            output.sodium += (parseFloat(nutriment.sodium) * portionFloat) / nutrimentFloat;
        }

        return output;
    }
}