const contacts = [
  {
    _id: '6090f5891f90ac6e724816e3',
    favorite: false,
    features: [],
    name: 'Contact2',
    email: 'test2@mail.com',
    phone: '0902322323',
  },
  {
    _id: '6090f2f01f90ac6e724816e2',
    favorite: false,
    features: [],
    name: 'Contact1',
    email: 'test2@mail.com',
    phone: '0902322323',
  },
];

const newContact = {
  name: 'Contact3',
  email: 'test2@mail.com',
  phone: '0902322323',
  favorite: false,
};

const User = {
  _id: '609c1842faa6d4a8a86a6acc',
  name: 'Guest',
  subscription: 'starter',
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwOWMxODQyZmFhNmQ0YThhODZhNmFjYyIsImlhdCI6MTYyMDg0MjYxMCwiZXhwIjoxNjIwODQ5ODEwfQ.WZ5EH5unyPBBj3RD2gviXL7Ho7rq9gyCnDWcVc0BfUw',
  email: 'user-test@gmail.com',
  password: '$2a$06$3/d8T/Ms.Em7CamFQT9eR.LgCETQLLHPAhv4amwHqWCAWMhX7wfri',
  avatar:
    'https://s.gravatar.com/avatar/46ac0d807668ee5b8b01f108591a12af?s=250',
  createdAt: '2021-05-12T18:02:42.662+00:00',
  updatedAt: '2021-05-12T18:03:30.844+00:00',
};

const users = [];
users[0] = Userconst;
newUser = { email: 'test22@test.com', password: '123456' };

module.exports = { contacts, newContact, User, users, newUser };
