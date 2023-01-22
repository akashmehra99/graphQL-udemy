import { createSchema, createYoga } from "graphql-yoga";
import { createServer } from "node:http";

// Demo data
const users = [{
  id: 1,
  name: 'Akash',
  email: 'akash.mehra99@gmail.com',
  age: 30
}, {
  id: 2,
  name: 'Divyanshi',
  email: 'divyanshi@gmail.com',
  age: 30
}, {
  id: 3,
  name: 'Harsh',
  email: 'harsh@gmail.com'
}]

const posts = [{
  id: '1',
  title: 'GrapgQl 101',
  body: '101',
  published: true,
  author: users[0]
},{
  id: '2',
  title: 'GrapgQl 102',
  body: '102',
  published: true,
  author: users[1]

},{
  id: '3',
  title: 'GrapgQl 103',
  body: '301',
  published: true,
  author: users[2]

},{
  id: '4',
  title: 'GrapgQl 104',
  body: '401',
  published: true,
  author: users[0]

}];

const typeDefs = `
    type Query {
        users(query: String): [User!]!
        me: User!
        posts(query: String): [Post]!
        post(query: String): Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        
    }

    type Post {
      id: ID!
      title: String!
      body: String!
      published: Boolean!
      author: User!
    }
`;

const resolvers = {
  Query: {
    users: (parent, args, ctx, info) => {
      if (!args.query) {
        return users;
      }
      const query = args.query.toLowerCase();
      return users.filter((user) => user.name.toLowerCase().includes(query));
    },
    me: () => {
      return {
        id: 123098,
        name: 'Akash Mehra',
        email: 'akash.mehra99@gmail.com',
        age: 30
      };
    },
    posts: (parent, args, ctx, info) => {
      if (!args.query) {
        return posts;
      }
      const query = args.query.toLowerCase();
      return posts.filter((pos) => pos.title.toLowerCase().includes(query) || pos.body.toLowerCase().includes(query));
    },
    post: () => {
      return {
        id: '092',
        title: 'GrapgQl 101',
        body: '',
        published: true
      }
    }
  },
};

const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers: resolvers,
  }),
});

const server = createServer(yoga);

server.listen(4000, () => {
  console.info("Server is running on http://localhost:4000/graphql");
});
