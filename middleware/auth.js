import jwt from 'jsonwebtoken'
import decode from 'jwt-decode'
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.JWT_SECRET
 
const auth= async(req,res,next)=>{
    try {
        const token = req?.headers?.authorization.split(' ')[1]

       
        const isCustomAuth = token?.length<500;
        // NB our custom token is less than 500 while google auth is above 500

        let decodedData;


        if (!token) {
            return res.status(401).json({error:'Not authenticated'})
        }
        
        const decodedToken = decode(token);
        if (decodedToken.exp*1000<new Date().getTime()) {
            return res.status(401).json({error:'Token has expired'})
        }

        if (token && isCustomAuth) { 
            decodedData= jwt.verify(token, secret)

            req.userId= decodedData?.id
        } else {
            //this is for google login in case we are signing in via google
            decodedData=jwt.decode(token)

            req.userId= decodedData?.sub
        }

        next();

    } catch (error) {
        console.log(error);
    }
}

export default auth;