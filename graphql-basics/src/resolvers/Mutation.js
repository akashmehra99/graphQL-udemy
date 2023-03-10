import { v4 as uuidv4 } from 'uuid';

export const Mutation = {
    createUser: (parent, args, { db }, info) => {
        const emailTaken = db.users.some(
            (user) => user.email === args.data.email
        );
        if (emailTaken) {
            throw new Error('Email already taken.');
        }
        const user = {
            id: uuidv4(),
            ...args.data
        };
        db.users.push(user);
        return user;
    },
    deleteUser: (parent, args, { db }, info) => {
        const userIndex = db.users.findIndex((user) => user.id === args.id);
        if (userIndex === -1) {
            throw new Error('User does not exists');
        }
        const deletedUsers = db.users.splice(userIndex, 1);

        db.posts = db.posts.filter((post) => {
            const match = post.author === args.id;
            if (match) {
                db.comments = db.comments.filter(
                    (comment) => comment.author !== post.id
                );
            }
            return !match;
        });

        db.comments = db.comments.filter(
            (comment) => comment.author !== args.id
        );

        return deletedUsers[0];
    },
    updateUser: (parent, args, { db }, info) => {
        const { id, data } = args;
        const user = db.users.find((user) => user.id === id);
        if (!user) {
            throw new Error('USer not found');
        }
        const { email, name, age } = data;
        if (typeof email === 'string') {
            const emailTaken = db.users.some((user) => user.email === email);
            if (emailTaken) {
                throw new Error('Email in use');
            }
            user.email = email;
        }
        if (typeof name === 'string') {
            user.name = name;
        }

        if (typeof age !== 'undefined') {
            user.age = age;
        }
        return user;
    },
    createPost: (parent, args, { db, pubSub }, info) => {
        const userExists = db.users.some(
            (user) => user.id === args.data.author
        );
        if (!userExists) {
            throw new Error('User not Found');
        }
        const post = {
            id: uuidv4(),
            ...args.data
        };
        db.posts.push(post);
        post.published &&
            pubSub.publish('post', {
                post: {
                    mutation: 'CREATED',
                    data: post
                }
            });
        return post;
    },
    deletePost: (parent, args, { db, pubSub }, info) => {
        const postIndex = db.posts.findIndex((post) => post.id === args.id);
        if (postIndex === -1) {
            throw new Error('Post not found');
        }
        const deletedPosts = db.posts.splice(postIndex, 1);
        db.comments = db.comments.filter((comment) => comment.post !== args.id);
        deletedPosts[0].published &&
            pubSub.publish('post', {
                post: {
                    mutation: 'DELETED',
                    data: deletedPosts[0]
                }
            });
        return deletedPosts[0];
    },

    updatePost: (parent, args, { db, pubSub }, info) => {
        const { id, data } = args;
        const post = db.posts.find((post) => post.id === id);
        const originalPost = structuredClone(post);
        if (!post) {
            throw new Error('Post not found');
        }
        const { title, body, published } = data;
        if (typeof title === 'string') {
            post.title = title;
        }
        if (typeof body === 'string') {
            post.body = body;
        }
        if (typeof published === 'boolean') {
            post.published = published;
            originalPost.published &&
                !published &&
                pubSub.publish('post', {
                    post: {
                        mutation: 'DELETED',
                        data: post
                    }
                });
            !originalPost.published &&
                published &&
                pubSub.publish('post', {
                    post: {
                        mutation: 'CREATED',
                        data: post
                    }
                });
        } else if (post.published) {
            console.log('Post published', post.published);
            pubSub.publish('post', {
                post: {
                    mutation: 'UPDATED',
                    data: post
                }
            });
        }
        return post;
    },
    createComment: (parent, args, { db, pubSub }, info) => {
        const userExists = db.users.some(
            (user) => user.id === args.data.author
        );
        const postExists = db.posts.some(
            (post) => post.published && post.id === args.data.post
        );
        if (!userExists || !postExists) {
            throw new Error('Unable to find user or post');
        }
        const comment = {
            id: uuidv4(),
            ...args.data
        };
        db.comments.push(comment);
        pubSub.publish(`comment ${args.data.post}`, {
            comment: {
                mutation: 'CREATED',
                data: comment
            }
        });
        return comment;
    },
    deleteComment: (parent, args, { db, pubSub }, info) => {
        const commentIndex = db.comments.findIndex(
            (comment) => comment.id === args.id
        );
        if (commentIndex === -1) {
            throw new Error('Comment not forund');
        }
        const deletedComments = db.comments.splice(commentIndex, 1);
        pubSub.publish(`comment ${deletedComments[0].post}`, {
            comment: {
                mutation: 'DELETED',
                data: deletedComments[0]
            }
        });

        return deletedComments[0];
    },
    updateComment: (parent, args, { db, pubSub }, info) => {
        const { id, data } = args;
        const comment = db.comments.find((comment) => comment.id === id);
        if (!comment) {
            throw new Error('Comment not found');
        }
        const { text } = data;
        if (typeof text === 'string') {
            comment.text = text;
        }
        pubSub.publish(`comment ${comment.post}`, {
            comment: {
                mutation: 'UPDATED',
                data: comment
            }
        });
        return comment;
    }
};
