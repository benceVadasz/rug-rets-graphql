import {ApolloServer, gql} from "apollo-server-express";
import express from 'express';
import mongoose from 'mongoose'
import cors from "cors";
import {schema} from "./Schema";


const startServer = async () => {
    const app = express();
    app.use(express.json({limit: '50mb'}));
    app.use(express.urlencoded({limit: "50mb", extended: true}))
    app.use(cors());


    const server = new ApolloServer({
        schema
    });

    server.applyMiddleware({app});

    const CONNECTION_URL = "mongodb+srv://vadaszbence:EDpvmmkb439qYee@cluster0.x44no.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

    await mongoose.connect(CONNECTION_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    app.listen({port: 4000}, () =>
        console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
    );
};

startServer()
    .catch((e) => {
        console.log(e)
    })