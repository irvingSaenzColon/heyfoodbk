import { response } from "express";
import { retrieveArraySringify } from "../util/index.js";

export class RecipeController{
    constructor({ recipeModel }){
        this.recipeModel = recipeModel;
    }

    getAll = async (request, response, next) => {
        const { userId } = request;

        if(!userId) return response.status(401).json({body: {}, message: 'Necesita mandar el id como parametro'})

        const result = await this.recipeModel.getAll();

        return response.status(200).json({body: result, message: ''})
    }

    get = async (request, response, next) => {
        const id = request.params.id;

        if(id === undefined) return response.status(422).json({body: {}, message: 'Necesita mandar el id como parametro'});

        const result = await this.recipeModel.get( parseInt( id ) );

        return response.status(200).json({body: result, message: ''});
    }
    

    create = async (request, response, next) => {
        let images = request.files !== null && request.files !== undefined ? request.files.images : [];
        let input = request.body;
        const { userId } = request;
        console.log( input );
        console.log( images );
        const  ingredients  =  retrieveArraySringify( input.ingredients ) ;
        const steps = JSON.parse( input.steps );
        const categories  = JSON.parse(input.categories);
        if(!Array.isArray( images )){
            images = [ images ];
        }

        input = {...input, ingredients, steps, categories, images, userId};
        
        console.log( input );
        
        const result = await this.recipeModel.create({input});

        return response.status(200).json( {body: result, message: 'Se ha creado la receta'} );
    }

    update = async (request, response, next) => {
        let images = request.files !== null && request.files !== undefined ? request.files.images : [];
        let input = request.body;
        const ingredients = retrieveArraySringify( input.ingredients ) ;
        const steps = retrieveArraySringify( input.steps ) ;
        const updatedSteps = retrieveArraySringify( input.updatedSteps ) ;
        const categories = JSON.parse( input.categories ) ;
        const deletedIngredients = JSON.parse( input.deletedIngredients );
        const deletedImages = JSON.parse( input.deletedImages );
        const deletedSteps = JSON.parse( input.deletedSteps );
        const updatedIngredients = retrieveArraySringify( input.updatedIngredients );
        const deletedCategories = JSON.parse( input.deletedCategories );
        
        const id = parseInt( input.id );
        if(!Array.isArray( images )){
            images = [ images ];
        }

        input = {
            ...input, 
            id,
            images, 
            ingredients, 
            steps, 
            categories, 
            deletedImages, 
            deletedIngredients, 
            deletedSteps,
            deletedCategories,
            updatedSteps,
            updatedIngredients
        };
        
        
        const result = await this.recipeModel.update( {input: input} );
        
        return response.status(201).json( {body: result, message: 'Se ha actualizado la receta'} );
    }

    

    delete = async (request, response, next) => {
        const id = request.params.id; 
        const {userId} = request;

        if(!id) return response.status(422).json({body: {}, message: 'Falta enviar un parametro para poder realizar la acción'});

        await this.recipeModel.delete(  {input: { id :parseInt(id), userId }} );

        return response.status(204).json();
    }

    search = async(request, response, next) => {
        const input = request.body;

        if(input.title === undefined || input.category === undefined)
            return response.status(422).json({body: [], message: 'Falta enviar un parametro para poder realizar la acción'});

        const result = await this.recipeModel.search( {input} );

        return response.status(200).json( {body: result, message: ''} );
    }

}