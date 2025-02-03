const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// DELETE

async function deleteFile(fileId) {
  await prisma.delete({
    where: {
      id: parseInt(fileId),
    },
  });
}

module.exports = {
  deleteFile,
};
