export class RecipeCategoryController{
    constructor({recipeCategoryModel}){
        this.recipeCategoryModel = recipeCategoryModel;
    }

    getAll = async(request, response, next) => {
        const {userId} = request;

        if(!userId) return response.status(401).json({body: {}, message: 'Acción inválida'});

        const result = await this.recipeCategoryModel.getAll();

        return response.status(200).json({body: result, message: '' });
    }

    get = async (request, response, next) => {
        const id = request.params.id;
        const {userId} = request;

        if( userId === undefined ) return response.status(401).json({body:{}, message:'Acción inválida'});
        if( id === undefined ) return response.status(422).json({body:{}, message: 'Debe enviar el id de la categoria'});

        try{
            const result = await this.recipeCategoryModel.get( parseInt( id ) );

            return response.status(200).json({body:result, message: ''});
        } catch( e ){
            return response.status(500).json(e);
        }
    }
    create = async (request, response, next) =>{
        const input = request.body;
        const {userId} = request;
        console.log(input);
        if( userId === undefined ) return response.status(401).json({body:{}, message:'Acción inválida'});
        if( input.name === undefined ) return response.status(409).json({body:{}, message: 'Faltan campos por enviar'});

        try{
            const result = await this.recipeCategoryModel.create( {input:{...input}} );

            return response.status(200).json({body:result, message: ''});
        } catch( e ){
            console.error( e );
            return response.status(500).json(e);
        }
    }

    update = async (request, response, next) => {
        const input = request.body;
        const { userId } = request;

        if(!userId) return response.status(401).json({body:'', message:'Acción inválida'});
        if(input.name ===undefined || !input.id) return response.status(422).json({body:'', message:'Faltan mandar campos'});

        try{
            const result = await this.categoryModel.update( input );
            return response.status(200).json(result);
        } catch(e){
            return response.status(500).json(e);
        }
    }

    delete = async (request, reponse, next) => {
        const id = request.params.id;
        const { userId } = request;

        if(!userId) return response.status(401).json({body: {}, message: 'Acción inválida'});
        if(!id) return response.status(422).json({body: {}, message: 'Faltan parametros'});

        await this.categoryModel.delete( parent(id) );

        return response.status(204).json();
    }
}