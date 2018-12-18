import uuidv4 from 'uuid/v4';

const Mutation = {
  createUser(parent, args, { db }, info) {
    const emailTaken = db.users.some(user => user.email === args.data.email);

    if (emailTaken) {
      throw new Error('Email taken.');
    }

    const user = {
      ...args.data,
      posts: [],
      comments: [],
      id: uuidv4()
    };

    db.users.push(user);
    return user;
  },
  deleteUser(parent, args, { db }, info) {
    const { id } = args;
    const userIndex = db.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new Error('User not found!');
    }

    const [user] = [...db.users.splice(userIndex, 1)];
    db.users = db.users.filter(user => user.id !== id);
    return user;
  },
  updateUser(parent, { id, data }, { db }, info) {
    const user = db.users.find(user => user.id === id);
    if (!user) {
      throw new Error('User not found!');
    }

    if (typeof data.email === 'string') {
      const emailTaken = db.users.some(user => user.email === data.email);

      if (emailTaken) {
        throw new Error('Email taken');
      }

      user.email = data.email;
    }

    if (typeof data.name === 'string') {
      user.name = data.name;
    }

    if (typeof data.age === 'number') {
      user.age = data.age;
    }

    return user;
  },
  createPost(parent, args, { db, pubsub }, info) {
    const userExist = db.users.some(user => user.id === args.data.author);

    if (!userExist) {
      throw new Error('User no exist');
    }

    const post = {
      ...args.data,
      id: uuidv4(),
      comments: []
    };

    db.posts.push(post);

    if (args.data.published) {
      pubsub.publish('post', { 
        post: {
          mutation: 'CREATED',
          data: post  
        }
       });
    }
    
    return post;
  },
  deletePost(parent, args, { db, pubsub }, info) {
    const { id } = args;
    const postIndex = db.posts.findIndex(post => post.id === id);

    if (postIndex === -1) {
      throw new Error('Post not found!');
    }

    const [post] = [...db.posts.splice(postIndex, 1)];
    db.posts = db.posts.filter(post => post.id !== id);
    if  (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: post
        }
      });
    }
    return post;
  },
  updatePost(parent, { id, data }, { db, pubsub }, info) {
    const post = db.posts.find(post => post.id === id);
    const originalPost = {...post};

    if (!post) {
      throw new Error('Post not found!');
    }

    if (data.title) {
      post.title = data.title;
    }

    if (data.body) {
      post.body = data.body;
    }

    if (typeof data.published === 'boolean') {
      post.published = data.published;

      if (originalPost.published && !post.published) {
        // deleted
        pubsub.publish('post', {
          post: {
            mutation: 'DELETED',
            data: originalPost
          }
        });
      } else if (!originalPost.published && post.published) {
        // created
        pubsub.publish('post', {
          post: {
            mutation: 'CREATED',
            data: post
          }
        });
      }
    } else if (post.published) {
      // updated
      pubsub.publish('post', {
        post: {
          mutation: 'UPDATED',
          data: post
        }
      });
    }

    return post;
  },
  createComment(parent, args, { db, pubsub }, info) {
    const userExist = db.users.some(user => user.id === args.data.author);
    const postExist = db.posts.some(post => post.id === args.data.post);

    if (!userExist) {
      throw new Error('User no exist');
    }

    if (!postExist) {
      throw new Error('Post no exist');
    }

    const comment = {
      ...args.data,
      id: uuidv4()
    };

    db.comments.push(comment);
    pubsub.publish(`comment ${args.data.post}`, {
      comment: {
        mutation: 'CREATED',
        data: comment
      }
    });
    return comment;
  },
  deleteComment(parent, args, { db, pubsub }, info) {
    const commentIndex = db.comments.findIndex(comment => comment.id === args.id);

    if (commentIndex === -1) {
      throw new Error('Comment not found!');
    }

    const [comment] = [...db.comments.splice(commentIndex, 1)];
    db.comments = db.comments.filter(comment => comment.post !== args.id);

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'DELETED',
        data: comment
      }
    });
    return comment;
  },
  updateComment(parent, { id, data }, { db, pubsub }, info) {
    const comment = db.comments.find(comment => comment.id === id);

    if (!comment) {
      throw new Error('Comment not found!');
    }

    if (!data.text) {
      throw new Error('You must add new text for comment');
    }

    comment.text = data.text;

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'UPDATED',
        data: comment
      }
    });
    return comment;
  }
};

export { Mutation as default };