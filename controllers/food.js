export class FoodController{
    constructor({foodModel}){
        this.foodModel = foodModel;
    }

    getAll = async (request, response, next) => {
        const result = await this.foodModel.getAll();

        return response.status(200).json({body: result, message: ''})
    }

    get = async (request, response, next) => {
        const id = request.params.id;

        if(id === undefined) return response.status(422).json({body: {}, message: 'Necesita mandar el id como parametro'});

        const result = await this.foodModel.get( parseInt( id ) );

        return response.status(200).json({body: result, message: ''});
    }

    create = async (request, response, next) => {
        const images = request.files !== null && request.files !== undefined ? request.files.images : null;
        const data = request.body;

        const result = await this.foodModel.create({input: {...data , images: images}});

        return response.status(200).json( {body: result, message: 'Se ha creado la comida'} );
    }

    update = async (request, response, next) => {
        const images = request.files !== null && request.files !== undefined ? request.files.images : null;

        const data = request.body;

        const result = await this.foodModel.update({input: {...data , images}});

        return response.status(201).json( {body: result, message: 'Se ha creado la comida'} );
    }

    delete = async (request, response, next) => {
        const id = request.params.id; 

        if(!id) return response.status(422).json({body: {}, message: 'Falta enviar un parametro para poder realizar la acción'});

        await this.foodModel.delete( id );

        return response.status(204);
    }
}