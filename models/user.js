import { firebaseConfig } from '../config/firebase.config.js'
import { initializeApp } from 'firebase/app';
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);


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
        let imageUrl = '';

        const userNick = await prisma.user.findUnique({
            where: {
                nickname : nickname
            }
        });

        const userEmail = await prisma.user.findUnique({
            where : {
                email: email
            }
        });

        return {body: userNick, error: 0, status: 200};

        // Verificar si el nickname existe
        // Verificar si el email existe
        if(image !== null){
            const salt = new Date().getTime();
            const storageRef = ref(storage, `User/${image.name}-${salt}`);
            const metadata = {
                contentType : image.mimetype
            };
            const snapshot = await uploadBytesResumable( storageRef, image.data, metadata );

            imageUrl = await getDownloadURL( snapshot.ref );
        }
        else{
            imageUrl = '';
        }
        // Formatting date so it does not cause a conflict with birthdate field of the table
        let isoDate = (new Date(birthdate)).toISOString();
        // Creating a record
        try{
            const userRecord = await prisma.user.create({
                data: {
                    name: name,
                    nickname: nickname,
                    email: email,
                    telephone: telephone,
                    bio: bio,
                    password: password,
                    gender: gender,
                    height: height,
                    weight: weight,
                    birthdate: isoDate,
                    image: imageUrl
                }
            });

            return {body: userRecord, error: 0, status: 200}
        } catch(error){
            console.error(error)
            return {body: error, error: 1, status: 500}
        }
    }

    static async findByNickname({input}){
        const {
            nickname, 
            option
        } = input;

        // 

        return {};
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