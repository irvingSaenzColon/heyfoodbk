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

        const dailyFood = await prisma.dailyMeal.findMany({ 
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

        const isoDate = new Date(date).toISOString();
        let dailyMealHeader = null;

        dailyMealHeader = await prisma.dailyMeal.findFirst( {where : {createdAt: isoDate, type: type}} );

        console.log(dailyMealHeader);

        // Create the header of daily meal only if it does not exists
        if(!dailyMealHeader){

            dailyMealHeader = await prisma.dailyMeal.create({ 
                data: {
                    userId: userId,
                    type: type,
                    createdAt: isoDate
                } 
            });
        }

        // Create detail of daily meal for each food
        for await (const food of foods) {
            const dailyMealDetail = await prisma.dailyMealDetail.create({
                data: {
                    portion: food.portion,
                    foodId: food.id,
                    dailyMealId: dailyMealHeader.id
                }
            });
            console.log( dailyMealDetail );
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

        console.log( result );

        return result;
    }
}