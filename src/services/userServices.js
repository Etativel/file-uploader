const prisma = require("../prismaClient");

async function createUser(username, email, hashedPassword) {
  return await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });
}

async function isEmailUsed(email) {
  const queryEmail = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  return queryEmail !== null;
}

async function isUsernameTaken(username) {
  const lowerUsername = username.toLowerCase();
  const usernames = await prisma.user.findUnique({
    where: {
      username: lowerUsername,
    },
  });
  if (!username) return "Username cannot be empty";
  console.log("this is usernames", usernames);
  return usernames !== null;
}

async function getUser(username, id) {
  return await prisma.user.findUnique({
    where: username ? { username } : { id },
  });
}

module.exports = {
  createUser,
  getUser,
  isEmailUsed,
  isUsernameTaken,
};
