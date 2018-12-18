const Comment = {
  author(parent, args, { db }, info) {
    const { author } = parent;
    return db.users.find(user => user.id === author);
  },
  post(parent, args, { db }, info) {
    return db.posts.find(post => post.id === parent.post);
  }
};

export { Comment as default };