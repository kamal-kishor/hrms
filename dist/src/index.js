import { ApolloServer } from "apollo-server";
import mongoose from "mongoose";
// import { startStandaloneServer } from "@apollo/server/standalone";
import typeDefs from "../graphQL/typeDefs";
import resolvers from "../graphQL/resolvers";
import dotenv from "dotenv";
dotenv.config();
const startServer = async () => {
    try {
        const server = new ApolloServer({
            typeDefs,
            resolvers,
        });
        await mongoose.connect(process.env.MONGODB);
        console.log(`🚀 MongoDB Connected`);
        const { url } = await server.listen({ port: 3030 });
        console.log(`🚀 Server Running at ${url}`);
        // const { url(server, {
        //   listen: { port: 4000 },
        // }); } = await startStandaloneServer
        // console.log(`🚀  Server ready at: ${url}`);
    }
    catch (error) {
        console.error("Error: ", error.message);
    }
};
startServer();
