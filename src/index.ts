import express from 'express';
import mongoose from 'mongoose'
import cors from "cors";
import {Mutation} from './resolvers/Mutation'
import {Query} from './resolvers/Query'
import {Subscription} from "./resolvers/Subscription";
import {typeDefs} from "./typeDefs";
import {getUserId} from "./utils";
import {PubSub, ApolloServer} from 'apollo-server';

const resolvers = {
    Mutation,
    Query,
    Subscription
}

const app = express();
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: "50mb", extended: true}))
app.use(cors());

const pubsub = new PubSub()


const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({req}) => {
        return {
            ...req,
            pubsub,
            userId:
                req && req.headers.authorization && req.headers.authorization !== "undefined" ? getUserId(req) : null
        };
    }
});

const CONNECTION_URL = "mongodb+srv://vadaszbence:EDpvmmkb439qYee@cluster0.x44no.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

mongoose.connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.set('useFindAndModify', false);

server.listen().then(({ url }: {url: string}) => console.log(`server started at ${url}`));