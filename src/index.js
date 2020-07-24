import express from 'express';
import mongoose from 'mongoose'
import server from './server';
const createServer= async ()=> {
    try{
            await mongoose.connect('mongodb://localhost/graphql_ecommerce'); 
            const app=express();

            const PORT=4444;
            server.applyMiddleware({app});

            app.listen({port:PORT},()=>{
                console.log(`Server is ready  al http://localhost:${PORT}${server.graphqlPath}`)
            })
    }catch(err){
        console.log(err)
    }
}
createServer();
