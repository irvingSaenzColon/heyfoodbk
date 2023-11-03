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
                            include: {
                                nutriment: true
                            }
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

        let totalCalories = 0;
        const isoDate = new Date(date).toISOString();
        let dailyMealHeader = null;

        dailyMealHeader = await prisma.dailyMeal.findFirst( {where : {createdAt: isoDate}} );

        

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
            const dailyMealDetail = await prisma.dailyMealDetail.create({
                data: {
                    portion: food.portion,
                    type: type,
                    foodId: food.id,
                    dailyMealId: dailyMealHeader.id
                }
            });
        }

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
                }
            }
        });

        for (const f of foodsMeals) totalCalories +=((f.dailyMealDetailFood.nutriment.calories * f.portion) / 100);

        await prisma.dailyMeal.update( {
             where: { id: dailyMealHeader.id } ,
             data: {
                totalCalories: totalCalories
             }
            } );


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

        console.log( result );

        return result;
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
}