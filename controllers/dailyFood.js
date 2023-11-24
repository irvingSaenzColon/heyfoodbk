export class DailyFoodController{
    constructor({dailyFoodModel}){
        this.dailyFoodModel = dailyFoodModel;
    }

    getAll = async (request, response, next) => {
        const data = request.body;
        const userId = request.userId;

        if( !data.date ||  !userId ) return response.status(422).json({body: null, message: 'Falta enviar campos'});

        const result = await this.dailyFoodModel.getAll( {input: {...data, userId}} );

        return response.status(200).json( {body: result, message: ''} );
    }

    get = async( request, response, next ) => {
        
    }

    create = async (request, response, next) => {
        const input = request.body;
        const userId = request.userId; 

        console.log(userId);
        
        if( !userId || !input.foods ) return response.status(422).json({body: null, message: 'Falta enviar campos'});

        const result = await this.dailyFoodModel.create( { input: {...input, userId} } );

        return response.status(201).json( {body: result, message: 'meal created'} );

    }

    update = async (request, response, next) => {
        const input = request.body;
        const userId = request.userId; 

        if( !userId || !input.id ) return response.status(422).json({body: null, message: 'Falta enviar campos'});

        const result = await this.dailyFoodModel.update( { input: {...input, userId} } );

        return response.status(201).json( {body: result, message: 'daily meal updated'} );
    }

    resume = async (request, response, next) => {
        const input = request.body;
        const userId = request.userId;

        if(!input.beginDate || !input.endDate || !userId) return response.status(422).json({body: null, message: "Falta enviar parametros"});

        const result = await this.dailyFoodModel.resume( { input: {...input, userId} } );

        return response.status(201).json( {body: result, message: ''} );
    }

    delete = async (request, response, next) => {
        const id = parseInt( request.params.id );
        const userId = request.userId; 

        if( !userId || !id ) return response.status(422).json({body: null, message: 'Falta enviar campos'});

        await this.dailyFoodModel.delete( { input: {id, userId} } );

        return response.status(204).json();
    }
}