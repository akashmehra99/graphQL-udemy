import { createSchema, createYoga } from "graphql-yoga";
import { createServer } from "node:http";

// Demo data
const users = [{
  id: '1',
  name: 'Andrew',
  email: 'andrew@example.com',
  age: 27
}, {
  id: '2',
  name: 'Sarah',
  email: 'sarah@example.com'
}, {
  id: '3',
  name: 'Mike',
  email: 'mike@example.com'
}]

const posts = [{
  id: '10',
  title: 'GraphQL 101',
  body: 'This is how to use GraphQL...',
  published: true,
  author: '1'
}, {
  id: '11',
  title: 'GraphQL 201',
  body: 'This is an advanced GraphQL post...',
  published: false,
  author: '1'
}, {
  id: '12',
  title: 'Programming Music',
  body: '',
  published: false,
  author: '2'
}]

const comments = [{
  id: '102',
  text: 'This worked well for me. Thanks!',
  author: '3',
  post: '10'
}, {
  id: '103',
  text: 'Glad you enjoyed it.',
  author: '1',
  post: '10'
}, {
  id: '104',
  text: 'This did no work.',
  author: '2',
  post: '11'
}, {
  id: '105',
  text: 'Nevermind. I got it to work.',
  author: '1',
  post: '11'
}]
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        me: User!
        posts(query: String): [Post]!
        post: Post!
        comments: [Comment!]!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!      
    }

    type Post {
      id: ID!
      title: String!
      body: String!
      published: Boolean!
      author: User!
      comments: [Comment!]!
    }

    type Comment {
      id: ID!
      text: String!
      author: User!
      post: Post!
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
    },
    comments: (parent, args, ctx, info) => comments,
  },
  Post: {
    author: (parent, args, ctx, info) => {
      const authorId = parent.author;
      return users.find((user) => user.id === authorId);
    }
  },
  User: {
    posts: (parent, args, ctx, info) => {
      const userId = parent.id;
      return posts.filter((post) => post.author === userId);
    }
  },
  Comment: {
    author: (parent, args, ctx, info) => {
      return users.find((user) => {
        return user.id === parent.author
      })
    },
    post: (parent, args, ctx, info) => {
      return posts.find((post) => {
        return post.id === parent.post
      })
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
