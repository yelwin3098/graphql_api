import fs from 'fs';
import path from 'path'

import {ApolloServer} from 'apollo-server-express';
// import typeDefs from './schema/typeDef';
import resolvers from './resolver/index';

import getUser from './utils/getUser'

const typeDefs=fs.readFileSync(path.join(__dirname,'./schema', 'schema.graphql'), "utf8")
                 .toString()

const server=new ApolloServer({
    typeDefs,
    resolvers,
    context:({ req }) =>{
        //Check token from headers
        const token=req.headers.authorization || ''

        //Extract userId from token
        const userId=getUser(token);
        return {userId};
    } 
});

export default server;