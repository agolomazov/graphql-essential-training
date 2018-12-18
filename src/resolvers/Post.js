const Post = {
  author(parent, args, { db }, info) {
    const { author } = parent;
    return db.users.find(user => user.id === author);
  },
  comments(parent, args, { db }, info) {
    return db.comments.filter(comment => {
      return comment.post === parent.id;
    });
  }
};

export { Post as default };