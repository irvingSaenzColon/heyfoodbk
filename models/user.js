import { firebaseConfig } from '../config/firebase.config.js'
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { storageImage } from '../util/index.js';

const {sign} = jwt;

const prisma = new PrismaClient();

const appFirebase = initializeApp(firebaseConfig);
const storage = getStorage(appFirebase);


export class UserModel{
    static async getAll (){
        

        return user;
    }

    static async get( id ){
        const user = await prisma.user.findUnique({where:{id : id}});
        return {body: user, error: 0, status: 200};
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
        } = input;
        let imageUrl = '';
        let errorResult ={body:{}, error: 0, status:  200};

        const userNick = await prisma.user.findUnique({ where: {nickname : nickname } });

        if(userNick !== null){
            errorResult.body = {...errorResult.body, "nickname": "Ya existe una cuenta con ese nickname"};
            errorResult.error++;
        }

        const userEmail = await prisma.user.findUnique({ where : { email: email } });

        if(userEmail !== null){
            errorResult.body = {...errorResult.body, "email": "Ya existe una cuenta con ese email"};
            errorResult.error++;
        }

        // Errors count, if it is greater than zero, it means that an email or nickname already exists on db
        if( errorResult.error ) return errorResult

        imageUrl = image !== null ? await storageImage(storage, 'User', image) : '';
        
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

            const payload = {id : userRecord.id, nickname: userRecord.nickname };

            const token = sign(payload, process.env.SECRET, {
                expiresIn: '7d'
            });

            return {body: {id: userRecord.id, token: token}, error: 0, status: 200}
        } catch(error){
            console.error(error)
            return {body: error, error: 1, status: 500}
        }
    }

    static async update({input}){
        const {
            id,
            name, 
            nickname,
            bio,
            cover
        } = input;

        let result = {};

        const userNickname = await prisma.user.findUnique({where: {nickname : nickname}});

        if(userNickname !== null && userNickname?.id !== id){
            return {body: {"nickname": "Ya existe una cuenta con ese nickname", status: 409, error: 1}};
        }

        const userCurrentData = await prisma.user.findUnique( {where: {id: id}} );

        if(cover === typeof String || cover === null){
            console.log('La imagen es un string, por lo que no es necesario subir nada');
            result = await prisma.user.update({
                where: { id: id },
                data: {
                    name: name,
                    nickname: nickname,
                    bio: bio
                }
            });

            return {body: result, error: 0, status: 201}
        }
        
        
        if(userCurrentData.cover !== ''){
            // Getting storage ref from previous
            // await deleteFromStorage(storage, userCurrentData.cover);
        }

        const newImageURL = await storageImage(storage,'User' ,cover);

            result = await prisma.user.update({
                where: { id: id },
                data: {
                    name: name,
                    nickname: nickname,
                    bio: bio,
                    cover: newImageURL
                }
            });

        return {body: result, error: 0, status: 201}
    }

    static async authenticate({input}){
        const {
            credential,
            password,
            type
        } = input;

        let userResult = {};
        
        if(type === 'n'){
            userResult = await prisma.user.findUnique({ where: {nickname : credential } });
        }
        else if ( type === 'e'){
            userResult = await prisma.user.findUnique({ where : { email: credential } });
        }
        else if( type === 't'){
            // userResult = await this.findByTelephone({input: {telephone: credential, option: 'ft'}});
        }

        

        if(!userResult) return null;
        
        if(userResult.password !== password ) return null;
        console.log(userResult);
        const payload = {id : userResult.id, nickname: userResult.nickname };

        const token = sign(payload, process.env.SECRET, {
            expiresIn: '7d'
        });

        return {id : userResult.id, token: token};
    }

    static async search({input}){
        const {
            username
        } = input;

        const users = await prisma.user.findMany( {
            where: { OR: [
                {nickname: { contains: username }},
                {name: { contains: username }}
            ] }
        } );

        return users;
    }
}