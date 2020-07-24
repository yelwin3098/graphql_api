import jwt from 'jsonwebtoken'

const getUser= token =>{
    if(!token) return null
    

    //Bearer 
    const parsedToken= token.split(' ')[1]

    try {
        const decodedToken=jwt.verify(parsedToken,"mysupersecretkey")

        return decodedToken.userId
    }catch(error){
        return null
    }
}
export default getUser