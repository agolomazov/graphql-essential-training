import uuidv4 from 'uuid/v4';

const users = [{
  id: uuidv4(),
  name: 'Anton',
  email: 'cesear@bk.ru',
  age: 30
}, {
  id: uuidv4(),
  name: 'Dima',
  email: 'dima@bk.ru',
  age: 20
}, {
  id: uuidv4(),
  name: 'Antonina',
  email: 'antonina@bk.ru',
  age: 24
}];

const posts = [{
  id: uuidv4(),
  title: 'GraphQL 101',
  body: 'This is how to use GraphQL...',
  published: true,
  author: users[0].id
}, {
  id: uuidv4(),
  title: 'GraphQL 201',
  body: 'This is an advanced GraphQL post...',
  published: false,
  author: users[0].id
}, {
  id: uuidv4(),
  title: 'GraphQL 301',
  body: '',
  published: false,
  author: users[1].id
}];

const comments = [{
  id: uuidv4(),
  text: 'This worked well for me. Thanks!',
  author: users[0].id,
  post: posts[0].id
}, {
  id: uuidv4(),
  text: 'Glad you enjoyed it.',
  author: users[0].id,
  post: posts[0].id
}, {
  id: uuidv4(),
  text: 'This did no work',
  author: users[1].id,
  post: posts[1].id
}, {
  id: uuidv4(),
  text: 'Nevermind. I got it to work',
  author: users[2].id,
  post: posts[2].id
}];

const db = {
  users,
  posts,
  comments
};

export { db as default };