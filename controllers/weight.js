export class WeightController{
    constructor({weightModel}){
        this.weightModel = weightModel;
    }

    get = async (request, response, next) => {
        const id = request.params.id;
        
        response.json({});
    }

     getAll = async (request, response, next) => {
        // const users = await this.userModel.getAll();
        //TODO: retreive all weights from user
        response.status(200).json([]);
    }

    create = async (request, response, next) => {
        const images = (request?.files !== null && request?.files !== undefined) ? request.files.images : null;
        const data = request.body;
        const {userId} = request;


        try{
            const result =  await this.weightModel.create({input: {...data, userId, images}});
            response.status(200).json( result )
        } catch(e){
            response.status(500).json("Hubo un error " + e);
        }
    }

    update = async (request, response, next) => {
        const cover = (request?.files !== null && request?.files !== undefined) ? request.files.cover : null;
        const data = request.body;
        const {userId} = request;

        console.log( cover );
        const result = await this.weightModel.update({input: {id: userId, ...data, cover} });
        
        return response.status(202).json(result);
    }

    delete = async (request, response, next) => {

        this.weightModel.delete( id );
        
        response.status(result.status).json(result);
    }
}