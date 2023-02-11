export const User = {
    posts: (parent, args, { db }, info) => {
        const userId = parent.id;
        return db.posts.filter((post) => post.author === userId);
    }
};
