export class CategoryController{
    constructor({categoryModel}){
        this.categoryModel = categoryModel;
    }

    getAll = async(request, response, next) => {
        const categories = await this.categoryModel.getAll();

        return response.status(200).json(categories);
    }

    get = async(request, response, next) => {
        const id =request.params.id;

        if(id ===undefined ||  id === null) return response.status(422).json('Necesita mandar el id');
        
        const category = await this.categoryModel.get( parseInt( id ) );

        return response.status(200).json({body: category});
    }

    create = async (request, response, next) => {
        const data = request.body;

        const result = await this.categoryModel.create({input: {...data}});

        if(result === undefined) return response.status(422).json('Falta un parametro');
        else if (result === null) return response.status(409).json('La categoría ya existe');
        else return response.status(201).json({body: result, message: 'Se ha creado la categoría'});
    }

    update = async (request, response, next) => {
        const data = request.body;

        const result = await this.categoryModel.update({input: {...data}});


        if(result === undefined) return response.status(422).json('Falta un parametro');
        else if (result === null) return response.status(409).json('La categoría ya existe');
        else return response.status(201).json({body: result, message: 'Se ha creado la categoría'});
    }

    delete = async (request, response, next) => {
        const id = request.params.id;

        if( id === undefined ) return response.status(422).json({body: {}, message: 'Debe ingresar el id del elemento'})

        await this.categoryModel.delete( id );

        return response.status(204);
    }
}