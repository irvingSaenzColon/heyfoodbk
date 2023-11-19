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
    
    static async getAll( id ){
        const weightHeader = await prisma.weightHeader.findUnique( { where: { userId: id } } );

        if(!weightHeader) return [];

        const weightItems = await prisma.weightItem.findMany( { 
            where: { weightHeaderId: weightHeader.id }, 
            include:{
                weightMedia: true
            },
            orderBy: { createAt: 'desc' },
            take: 6
        } );

        weightItems.forEach( wi => {
            const d = new Date(wi.createAt)
            const year = d.getFullYear();
            let month = d.getMonth()+1;
            let dt = d.getDate();

            if (dt < 10) {
            dt = '0' + dt;
            }
            if (month < 10) {
            month = '0' + month;
            }
            wi.createAt = `${year}-${month}-${dt}`;
        } )

        return weightItems;
    }

    static async create( { input } ){
        const {
            value,
            description,
            images,
            userId
        } = input;
        let weightHeader = await prisma.weightHeader.findUnique( { where: { userId: userId } } );
        let weightImages = [];
        
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
         await images.forEach(async (img) => {
            const imageUrl =   await storageImage(storage,'Weight', img);
            let weightMedia = await prisma.weightMedia.create({ 
                data: {
                    url: imageUrl,
                    weightItemId: weightItem.id
                }
            });

            weightImages.push( weightMedia );
         });

         weightItem.weightMedia = weightImages;

         return weightItem ;
    }

    static async update( {input} ){
        const {
            id,
            value,
            description,
            images,
            deleted,
            userId
        } = input;
        console.log(`Esto es el id del elemento ${id}`);
        let weightImages = [];

        let weightItem = await prisma.weightItem.update({ 
            where: { id : parseInt( id ) },
            data: {
            value: value,
            description: description
            } 
        });

        // TODOD: new images
        await images.forEach(async (img) => {
            const imageUrl =   await storageImage(storage,'Weight', img);
            const imgResult = await prisma.weightMedia.create({ 
                data: {
                    url: imageUrl,
                    weightItemId: parseInt( id )
                }
            });
            console.log( imgResult );
            weightImages.push( imgResult );
        });

        // TODO: delete images
        
        deleted.forEach( async (img) => {
            await prisma.weightMedia.delete( { where: {id : img} } );
        } );

        weightItem.weightMedia = weightImages;

        return weightItem;
    }

    static async delete( id ){
        if(!id) return {};
        
        console.log('Eliminando '+id);

        const weightMedia = await prisma.weightMedia.findMany( { where: { weightItemId: id } } );

        if(weightMedia.length){
            await prisma.weightMedia.deleteMany( { where: { weightItemId: id } } );
        }

        await prisma.weightItem.delete( { where: { id: id } } )
        console.log('Hecho');
    }
}