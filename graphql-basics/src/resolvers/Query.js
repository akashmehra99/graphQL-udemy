export const Query = {
    users: (parent, args, { db }, info) => {
        if (!args.query) {
            return db.users;
        }
        const query = args.query.toLowerCase();
        return db.users.filter((user) =>
            user.name.toLowerCase().includes(query)
        );
    },
    me: () => {
        return {
            id: 123098,
            name: 'Akash Mehra',
            email: 'akash.mehra99@gmail.com',
            age: 30
        };
    },
    posts: (parent, args, { db }, info) => {
        if (!args.query) {
            return db.posts;
        }
        const query = args.query.toLowerCase();
        return db.posts.filter(
            (pos) =>
                pos.title.toLowerCase().includes(query) ||
                pos.body.toLowerCase().includes(query)
        );
    },
    post: () => {
        return {
            id: '092',
            title: 'GrapgQl 101',
            body: '',
            published: true
        };
    },
    comments: (parent, args, { db }, info) => db.comments
};
