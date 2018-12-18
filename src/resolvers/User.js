const User = {
  posts(parent, args, { db }, info) {
    return db.posts.filter(post => {
      const authorCond = post.author === parent.id;
      if (args.q) {
        return authorCond && post.title.toLowerCase().includes(args.q.toLowerCase());
      }
      return authorCond;
    });
  },
  comments(parent, args, { db }, info) {
    return db.comments.filter(comment => comment.author === parent.id);
  }
};

export { User as default };