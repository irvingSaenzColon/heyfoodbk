export class WeightController{
    constructor({weightModel}){
        this.weightModel = weightModel;
    }

    get = async (request, response, next) => {
        const id = request.params.id;
        
        response.json({});
    }

    getAll = async (request, response, next) => {
        const {userId} = request;

        if(!userId){
            return response.status(422).json({body: {}, message: 'acceso denegado'});
        }

        const result = await this.weightModel.getAll( userId );

        response.status(200).json( result );
    }

    create = async (request, response, next) => {
        let images = (request?.files !== null && request?.files !== undefined) ? request.files.images : [];
        const data = request.body;
        const {userId} = request;
        if( !Array.isArray(images) ){
            images = [ images ];
        }

        if(!userId){
            return response.status(422).json({body: {}, message: 'acceso denegado'});
        }

        try{
            const result =  await this.weightModel.create({input: {...data, userId, images}});
            response.status(200).json( result )
        } catch(e){
            response.status(500).json("Hubo un error " + e);
        }
    }

    update = async (request, response, next) => {
        let images = (request?.files !== null && request?.files !== undefined) ? request.files.images : [];
        const data = request.body;
        let deleted =   data.deleted !== null & data.deleted !== undefined ?  JSON.parse( data.deleted ) : [];
        const {userId} = request;

        if( !Array.isArray(images) ){
            images = [ images ];
        }

        console.log(Array.isArray( deleted ))
        if(!Array.isArray( deleted )){
            console.log( Array.from( [deleted] ) );
            data.deleted = Array.from( [deleted] );
        } else{
            data.deleted = deleted;
        }
        
        console.log('Esto es el arreglo de nuevos elementos');
        console.log( images );

        
        const result = await this.weightModel.update({input: {id: userId, ...data, images} });
        
        return response.status(202).json(result);
    }

    delete = async (request, response, next) => {
        const id = parseInt( request.params.id ) ;

        await this.weightModel.delete( id );
        
        response.status(204);
    }

    getFrom = async (request, response, next) => {
        const id = request.params.id;

        const result = await this.weightModel.getFrom( parseInt( id ) );

        return response.status(200).json( result );
    }

    search = async(request, response, next) => {
        const input = request.body;
        const {userid} = request;

        const result = await this.weightModel.search( {input} );

        response.status(200).json({body: result, message: ''});
    }
}