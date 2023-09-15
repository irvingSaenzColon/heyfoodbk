import mysql from 'mysql2/promise';

const config = {
    host: 'localhost',
    user: 'root',
    port: '3306',
    password: '1234',
    database: 'heyfooddb'
};

const connection = await mysql.createConnection(config);

export class UserModel{
    static async getAll (){
        const [user] = await connection.query('SELECT * FROM user;');

        return user;
    }

    static async get({ id }){
        return 'Irving';
    }

    static async create({input}){
        const {
            name, 
            nickname, 
            email, 
            telephone,
            bio, 
            password, 
            gender, 
            height,
            weight, 
            birthdate,
            image, 
            option
        } = input;

        let result = {
            body:{},
            error:0,
            status:0
        };

        const isNicknameAviable = await this.findByNickname({input: {nickname, option: 'fn'}});
        
        const isEmailAviable = await this.findByEmail({input: {email, option:'fe'}});

        if(Object.keys(isEmailAviable).length >= 1){
            result.body.email = 'Ya existe una cuenta con ese corre electrónico';
            result.error = 3;
        }

        if(Object.keys(isNicknameAviable).length >= 1){
            result.body.nickname = 'Ya existe una cuenta con ese nombre de usuario';
            result.error = result.error !== 0 ? result.error : 2;
        }

        if(result.error)
            return result;

        const [newkey] = await connection.query('select f_generate_key() as newkey');
        const generatedKey = newkey[0]['newkey'];

        const format = image !== null ? image.mimetype.split('/')[1] : '';
        const imageContent = image !== null ? image.data : null;

        await connection.execute('CALL sp_user_actions(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);', 
        [generatedKey, name, nickname, email, telephone, bio, password, gender, height, weight, birthdate, imageContent, format, option]);

        const [results] = await connection.execute('CALL sp_user_actions(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [generatedKey, null, null, null, null, null, null, null, null, null, null, null, null, 'r']);

        return {body: results[0][0], error: 0, status: 200}
    }

    static async findByNickname({input}){
        const {
            nickname, 
            option
        } = input;

        const [user] = await connection.execute('CALL sp_user_actions(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);', 
        [null, null, nickname, null, null, null, null, null, null, null, null, null, null, option]);

        return {...user[0]};
    }

    static async findByEmail({input}){
        const {
            email, 
            option
        } = input;

        const [user] = await connection.execute('CALL sp_user_actions(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);', 
        [null, null, null, email, null, null, null, null, null, null, null, null, null, option]);

        return {...user[0]};
    }

    static async findByTelephone({input}){
        const {
            telephone, 
            option
        } = input;

        const [user] = await connection.execute('CALL sp_user_actions(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);', 
        [null, null, null, null, telephone, null, null, null, null, null, null, null, null, option]);

        return {...user[0]};
    }

    static async authenticate({input}){
        console.log(input);
        const {
            credential,
            password,
            type
        } = input;

        let userResult = {};
        
        if(type === 'n'){
            userResult = await this.findByNickname({input: {nickname: credential, option: 'fn'}});
        }
        else if ( type === 'e'){
            userResult = await this.findByEmail({input: {email: credential, option: 'fe'}});
        }
        else if( type === 't'){
            userResult = await this.findByTelephone({input: {telephone: credential, option: 'ft'}});
        }

        const size = Object.entries(userResult).length;

        if(!size){
            return {body: 'Usuario no encontrado', error:1003, status: 404};
        }
        const userData = userResult[0];

        console.log(userData);
        if(userData.password === password)
            return {body: 'Usuario y/o contraseña incorrectos', error:1004, status: 404};

        return {body: 'Se puede inicar sesión', error:0, status: 202};
    }
}