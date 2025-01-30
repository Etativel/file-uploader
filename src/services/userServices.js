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

async function getUser(username, id) {
  return await prisma.user.findUnique({
    where: username ? { username } : { id },
  });
}

module.exports = {
  createUser,
  getUser,
};
