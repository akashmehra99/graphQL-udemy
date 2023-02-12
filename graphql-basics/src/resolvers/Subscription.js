export const Subscription = {
    comment: {
        subscribe: (parent, args, { pubSub, db }, info) => {
            const { postId } = args;
            const post = db.posts.find(
                (post) => post.id === postId && post.published
            );
            if (!post) {
                throw new Error('Post not found');
            }

            return pubSub.subscribe(`comment ${postId}`);
        }
    }
};
