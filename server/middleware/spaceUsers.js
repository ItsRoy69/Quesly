const users = [];

const addUser = ({ id, username, spacename }) => {

  const existingUser = users.find((user) => {
    return user.id === id;
  });

  const user = { id, username, spacename };

  if (existingUser) {
    return { user };
  }

  users.push(user);

  return { user };
};

const getUser = (id) => {
  console.log(`users`, users, id);
  return users.find((user) => user.id === id);
};

module.exports = { addUser, getUser };
