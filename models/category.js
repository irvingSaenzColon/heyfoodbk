import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export class CategoryModel{
    static async getAll(){
        const categories = await prisma.category.findMany();
        return categories;
    }

    static async get(id){
        const category = await prisma.category.findUnique({where: {id: id}});

        return category;
    }

    static async create ({input}){
        const {
            name,
            description
        } = input;


        if(name === undefined || description === undefined) return undefined;

        const categoryName = await prisma.category.findFirst({where: {name : name}});

        if(categoryName !== null) return null;

        const category = await prisma.category.create({
            data: {
                name: name,
                description: description
            }
        });

        return category;
    }

    static async update({input}){
        const {
            id, 
            name,
            description
        } = input;

        if(id===undefined || name === undefined || description === undefined) return undefined;

        const categoryId = await prisma.category.findFirst( {where: {name: name} } );

        if( id !== categoryId.id ) return null;

        const category = await prisma.category.update({
            where: {id: id},
            data: {
                name: name,
                description: description
            }
        });

        return category;
    }

    static async delete(id){
        const category = await prisma.category.delete({ where: {id: id} });

        return category;
    }
}