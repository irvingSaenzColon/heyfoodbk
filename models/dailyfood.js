import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class DailyFoodModel{
    static async getAll({input}){
        const {
            date,
            userId
        } = input;

        if(!date) return null;
        

        const dateIso = new Date(date).toISOString();

        const dailyFood = await prisma.dailyMeal.findFirst({ 
            where: { createdAt:  dateIso, userId: userId},
            include : {
                dailyMealDetails: {
                    include: {
                        dailyMealDetailFood: {
                            include: { nutriment: true }
                        },
                        dailyMealDetailRecipe: {
                            include: { nutriment: true }
                        }
                    }
                }
            }
        });

        return dailyFood;
    }

    static async get(  ){
        
    }

    static async create( { input } ){
        const {
            userId,
            type,
            foods,
            date
        } = input;

        if( !foods ) return null;

        const isoDate = new Date(date).toISOString();
        let dailyMealHeader = null;

        dailyMealHeader = await prisma.dailyMeal.findFirst( {
            where : {
                createdAt: isoDate,
                userId: userId
            }
        } );
        console.log(dailyMealHeader);

        // Create the header of daily meal only if it does not exists
        if(!dailyMealHeader){

            dailyMealHeader = await prisma.dailyMeal.create({ 
                data: {
                    userId: userId,
                    totalCalories: 0,
                    createdAt: isoDate
                } 
            });
        }

        // Create detail of daily meal for each food
        for await (const food of foods) {
            const {foodId, recipeId} = food;
            if(foodId !== undefined){
                await prisma.dailyMealDetail.create({
                    data: {
                        portion: food.portion,
                        type: type,
                        foodId: foodId,
                        dailyMealId: dailyMealHeader.id
                    }
                });
            } else{
                await prisma.dailyMealDetail.create({
                    data: {
                        portion: food.portion,
                        type: type,
                        recipeId: recipeId,
                        dailyMealId: dailyMealHeader.id
                    }
                });
            }
        }

        const result = await prisma.dailyMeal.findUnique( {
            where: {id: dailyMealHeader.id},
            include: { 
                dailyMealDetails:{
                    include: {
                        dailyMealDetailFood: {
                            include: {
                                nutriment : true
                            }
                        }
                    }
                }
            }
        } );

        await this.updateTotalCalories( dailyMealHeader.id );

        return result;
    }

    static async update({input}){
        const {
            id,
            portion,
            type,
            date,
            userId
        } = input;
      
        const isoDate = new Date( date ).toISOString();

        const dailyHeader = await prisma.dailyMeal.findFirst( {
             where: {
                 createdAt: isoDate, 
                 userId: userId
                } 
            } );

        const dailyMeal = await prisma.dailyMealDetail.update( {
            data: {
                portion: portion,
                type: type
            },
            where: { id : id }
        } );

        await this.updateTotalCalories( dailyHeader.id );

        return dailyMeal;
    }

    static async resume ( { input } ){
        const {
            userId,
            beginDate,
            endDate
        } = input;

        const result = await prisma.dailyMeal.findMany({
            where: {
                userId: userId,
                createdAt: {
                    gte: new Date(beginDate).toISOString(),
                    lte: new Date(endDate).toISOString()
                }
            }
        })

        return result;
    }

    static async delete( { input } ){
        const {
            id,
            userId
        } = input;
        console.log( id, userId );
        const dailyMealDetail = await prisma.dailyMealDetail.findUnique( { where: {id: id} } );
        if(dailyMealDetail !== null){
            await prisma.dailyMealDetail.delete( { where: { id: id} } );

            const dailyMealId =dailyMealDetail.dailyMealId;
            await this.updateTotalCalories( dailyMealId );
        }

        return;
    }

    static async updateTotalCalories( dailyMealId ){
        let totalCalories = 0;
        const dailyMealHeader = await prisma.dailyMeal.findUnique( { where: {id: dailyMealId} } );

        const foodsMeals = await prisma.dailyMealDetail.findMany({
            where: { dailyMealId: dailyMealHeader.id },
            select: {
                portion: true,
                dailyMealDetailFood: {
                    select: {
                        nutriment:{
                            select: {
                                calories: true
                            }
                        }
                    }
                },
                dailyMealDetailRecipe: {
                    select: {
                        nutriment: {
                            select: {
                                calories: true
                            }
                        }
                    }
                }
            }
        });

        for (const f of foodsMeals){
            if(f.dailyMealDetailFood !== undefined && f.dailyMealDetailFood !== null)
                totalCalories +=((f.dailyMealDetailFood.nutriment.calories * f.portion) / 100);
            else
                totalCalories +=((f.dailyMealDetailRecipe.nutriment.calories * f.portion) / 100);
        }

        await prisma.dailyMeal.update( {
             where: { id: dailyMealHeader.id } ,
             data: {
                totalCalories: totalCalories
             }
        } );

        return;
    }
}