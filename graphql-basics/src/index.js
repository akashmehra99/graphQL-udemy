import { createSchema, createYoga, createPubSub } from 'graphql-yoga';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';
import { db } from './db';
import { Query } from './resolvers/Query';
import { Mutation } from './resolvers/Mutation';
import { User } from './resolvers/User';
import { Post } from './resolvers/Post';
import { Comment } from './resolvers/Comment';
import { Subscription } from './resolvers/Subscription';

const yoga = createYoga({
    schema: createSchema({
        typeDefs: readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'),
        resolvers: {
            Query,
            Mutation,
            User,
            Comment,
            Post,
            Subscription
        }
    }),
    context: {
        db,
        pubSub: createPubSub()
    }
});

const server = createServer(yoga);

server.listen(4000, () => {
    console.info('Server is running on http://localhost:4000/graphql');
});
