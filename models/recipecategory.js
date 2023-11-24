import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class RecipeCategoryModel{
    static async getAll (){
        const recipeCategories = await prisma.recipeCategory.findMany();

        return recipeCategories;
    }

    static async get( id ){
        if(id === undefined) return {};

        try{
            const recipeCategory = await prisma.recipeCategory.findUnique( {where: {id: id} } );
        
            return recipeCategory;
        } catch( e ){
            throw e;
        }
    }

    static async create({input}){
        const {
          name
        } = input;

        try{
            const category = await prisma.recipeCategory.create( { data: { name: name } } );
             
            return category;
        } catch(e){
            throw new Error(e);
        }
    }

    static async update({input}){
        const {
            id,
            name
         } = input;

         const category = await prisma.recipeCategory.update({
            data: { name: name },
            where: {id: id}
         })

       return category;
    }

    static async delete({input}){
        const {
            id,
            userId
        } = input;

        // First find if it exists 
        const category = await prisma.recipeCategory.findUnique( { where: {id: id} } );
        
        if(!category) return;

        await prisma.categoriesOnRecipe.deleteMany( { where: {categoryId: id} } );
        await prisma.recipeCategory.delete( { where: {id: id} } );
    }
}