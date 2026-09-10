import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import dotenv from 'dotenv';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import { initDB } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

async function bootstrap() {
  await initDB();

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  app.use(cors({ origin: 'http://localhost:4200' }));
  app.use(express.json());
  app.use('/graphql', expressMiddleware(server));

  app.get('/health', (_, res) => res.json({ status: 'ok' }));

  app.listen(PORT, () => {
    console.log(`🚀 GraphQL Server ready at http://localhost:${PORT}/graphql`);
    console.log(`🔍 Apollo Sandbox:     http://localhost:${PORT}/graphql`);
  });
}

bootstrap().catch(err => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
