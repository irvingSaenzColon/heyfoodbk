import { uploadBytesResumable, ref, getDownloadURL, deleteObject } from 'firebase/storage';


export const storageImage = async (storage, url, image) => {
    const salt = new Date().getTime();
    const newName = `${image.name}-${salt}`;
    const storageRef = ref(storage, `${url}/${newName}`);
    const metadata = {
        contentType : image.mimetype
    };
    let imageUrl = '';

    const snapshot = await uploadBytesResumable( storageRef, image.data, metadata );

    imageUrl = await getDownloadURL( snapshot.ref );

    return imageUrl;
}

export const deleteFromStorage = async (storage, imageURL) => {
    try{
        const storageRef = ref(storage, `User/${imageURL}`);
        const delResult = await deleteObject( storageRef )
        console.info('Archivo eliminado correctamente');
    } catch(e){
        console.error(e);
    }
}

export const retrieveArraySringify = ( arrayStringify ) =>{
    let result = arrayStringify;
    if( result != undefined ){
        result = JSON.parse( result );
        result = result.map( i => JSON.parse( i ) );
    } else{
        result = [];
    }

    return result;
}