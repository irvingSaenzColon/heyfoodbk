import { firebaseConfig } from '../config/firebase.config.js'
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { PrismaClient } from '@prisma/client';
import { storageImage } from '../util/index.js';

const prisma = new PrismaClient();

const appFirebase = initializeApp(firebaseConfig);
const storage = getStorage(appFirebase);

export class WeightModel{
    static async get( id ){

    }
    
    static async getAll(){

    }

    static async create( { input } ){
        const {
            value,
            description,
            images,
            userId
        } = input;
        let weightHeader = await prisma.weightHeader.findUnique( { where: { userId: userId } } );
        console.log(weightHeader);
        if( !weightHeader ){
            weightHeader = await prisma.weightHeader.create( { 
                data :{
                userId : userId
            } } )
        }

        const weightItem = await prisma.weightItem.create( { 
            data: {
                value: value,
                description : description,
                weightHeaderId: weightHeader.id
            }
         } );

         //TODO : insert images if array is not empty or null

         return weightItem ;
    }

    static async update( input ){

    }

    static async delete( id ){

    }
}