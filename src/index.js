import { ApolloServer, gql } from "apollo-server";
import mongoose from "mongoose";
// import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "../graphQL/typeDefs.js";
import { resolvers } from "../graphQL/resolvers/index.js";
import dotenv from "dotenv";
dotenv.config();

const startServer = async () => {
  try {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => ({ req }),
    });

    await mongoose.connect(process.env.MONGODB);
    console.log(`🚀 MongoDB Connected`);

    const { url } = await server.listen({ port: 8080 });
    console.log(`🚀 Server Running at ${url}`);
  } catch (error) {
    console.error("Error: ", error.message);
  }
};

startServer();
