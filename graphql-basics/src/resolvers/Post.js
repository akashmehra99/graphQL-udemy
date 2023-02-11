export const Post = {
    author: (parent, args, { db }, info) => {
        const authorId = parent.author;
        return db.users.find((user) => user.id === authorId);
    }
};
