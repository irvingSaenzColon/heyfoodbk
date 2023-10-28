import jwt from 'jsonwebtoken';

export const userExtractor = (request, response, next) => {
    const authorization = request.get('authorization');
    let token = null;

    if(authorization && authorization.toLowerCase().startsWith('bearer ')){
        token = authorization.slice(7, authorization.length);
    }

    const decodedToken = jwt.verify(token, process.env.SECRET);

    if(!token || !decodedToken.id){
        return response.status(401).json({error: 'Token missing or invalid'});
    }

    request.userId = decodedToken.id;

    next();
}