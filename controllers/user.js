export class UserController{
    constructor({userModel}){
        this.userModel = userModel;
    }

    get = async (request, response) => {
        const id = request.params.id;

        const user = await this.userModel.get( parseInt( id ) );
        
        response.json(user);
    }

     getAll = async (request, response) => {
        const users = await this.userModel.getAll();
        response.json(users);
    }

    create = async (request, response) => {
        const image = (request?.files !== null && request?.files !== undefined) ? request.files.image : null;
        const data = request.body;

        const result =  await this.userModel.create({input: {...data, image}});

        response.json(result);
    }

    update = async (request, response, next) => {
        const cover = (request?.files !== null && request?.files !== undefined) ? request.files.cover : null;
        const data = request.body;
        const {userId} = request;

        const result = await this.userModel.update({input: {id: userId, ...data, cover} });
        
        return response.status(202).json(result);
    }

    authenticate = async (request, response, next) => {
        const input = request.body;
        
        try{
            const result = await this.userModel.authenticate( {input: input} );
            response.status(200).json({body: result, message: !result? 'usuario y/o contraseña incorrectos' : ''});
        } catch(e){

        }
    }

    search = async (request, response, next) => {
        const input = request.body;
        
        const result = await this.userModel.search( {input} );

        response.status(200).json( { body: result, message: '' } );
    }

}