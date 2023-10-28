import { PrismaClient } from "@prisma/client";
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { firebaseConfig } from "../config/firebase.config.js";
import { storageImage } from "../util/index.js";

const prisma = new PrismaClient();

const appFirebase = initializeApp(firebaseConfig);
const storage = getStorage(appFirebase);

export class FoodModel{
    static async getAll(){
        const foods = await prisma.food.findMany({
            include:{
                nutriment : true,
                foodCategory: true,
                images: true
            },
            
        });

        return foods;
    }

    static async get(id){
        const food = await prisma.food.findUnique({
            where: {id: id},
            include:{
                nutriment : true,
                foodCategory: true,
                images: true
            }
        });

        return food;
    }

    static async create({input}){
        const {
            name,
            category,
            portion,
            images,
            energy,
            calories,
            carbs,
            proteins,
            fibre,
            potassium,
            sugar,
            fat,
            saturatedFats,
            polyunsaturatedFat,
            cholesterol,
            sodium,
        } = input;
        
        // Find category id
        const categoryId = await prisma.category.findFirst( {where : { name : category }} );

        if(categoryId === null) return {body: 'No se encontró la categoría', status: 404, error: 1};

        // insert nutriments
        const nutriment = await prisma.nutriments.create({
            data: {
                portion: portion,
                energy: energy,
                calories: parseFloat( calories ),
                carbohydrates: parseFloat( carbs ),
                proteins: parseFloat( proteins ),
                fiber: parseFloat( fibre ),
                potassium: parseFloat( potassium ),
                sugar: parseFloat( sugar ),
                fat: parseFloat( fat ),
                saturatedFats: parseFloat( saturatedFats ),
                polyunsaturatedFat: parseFloat( polyunsaturatedFat ),
                cholesterol: parseFloat( cholesterol ),
                sodium: parseFloat( sodium )
            }
        });

        // insert food
        const food = await prisma.food.create( {
            data: {
                name: name,
                categoryId: categoryId.id,
                nutrimentId: nutriment.id
            }
        } );

        if(images === null) return food;
        
        // insert media in fire storage
        images.forEach( async(data, index) => {
            const imageUrl =  await storageImage(storage,'Food', data);
            await prisma.foodMedia.create({
                data: {
                    image: imageUrl,
                    fooId: food.id
                }
            });
        } );

        return food;
    }

    static async update({input}) {
        const {
            id,
            name,
            category
        } = input;

        // Find category id
        const categoryId = await prisma.category.findFirst( {where : { name : category }} );

        if(categoryId === null) return {body: 'No se encontró la categoría', status: 404, error: 1};

        const food = await prisma.food.update( {
            where: {id: id},
            data: {
                name : name,
                categoryId: categoryId
            }
        })

        return food;
    }

    static async delete(id){
        const deleted = await prisma.food.delete({ where: {id: id} });

        return deleted;
    }
}