// import express from "express";
// import { ApolloServer } from "apollo-server-express";
// import { createServer } from "http";
// import compression from "compression";
// import cors from "cors";
// import helmet from "helmet";
// import { schema } from "./Schema";
//
// const PORT = process.env.PORT || 4000;
// const app = express();
// app.use(cors());
// app.use(helmet());
// app.use(compression());
// const server = new ApolloServer({
//     schema,
// });
// server.applyMiddleware({ app, path: "/graphql" });
// const httpServer = createServer(app);
// httpServer.listen({ port: PORT }, (): void =>
//     console.log(`🚀GraphQL-Server is running on http://localhost:4000/graphql`)
// );

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