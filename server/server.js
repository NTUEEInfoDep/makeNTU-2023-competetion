// 先不要理這個檔案
// import { ApolloServer } from '@apollo/server';
const { ApolloServer } = require("@apollo/server");
// import { startStandaloneServer } from '@apollo/server/standalone';
const { startStandaloneServer } = require("@apollo/server/standalone");
// import * as fs from "fs";
const fs = require("fs");

const server = new ApolloServer({
  typeDefs: fs.readFileSync("./server/schema.graphql", "utf-8"),
  resolvers: {},
});

const port = process.env.PORT || 3000;
startStandaloneServer(server, { port }).then(({ url }) => {
  console.log(`Server started on port ${port}`);
});
