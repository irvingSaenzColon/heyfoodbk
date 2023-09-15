export class UserController{
    constructor({userModel}){
        this.userModel = userModel;
    }

     getAll = async (request, response) => {
        const users = await this.userModel.getAll();
        response.json(users);
    }

    create = async (request, response) => {
        const image = request.files !== null ? request.files.image : null;
        const data = request.body;

        const result =  await this.userModel.create({input: {...data, image}});

        response.json(result);
    }

    authenticate = async (request, response) => {
        const input = request.body;
        
        const result = await this.userModel.authenticate( {input: input} );
        
        response.json(result);
    }

}