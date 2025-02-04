const { PrismaClient } = require("@prisma/client");
const fs = require("fs-extra");
const prisma = new PrismaClient();

// DELETE

async function deleteFile(req, res) {
  const { fileId } = req.params;

  try {
    const file = await prisma.file.findUnique({
      where: { id: parseInt(fileId) },
    });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }
    await fs.remove(file.filepath);
    await prisma.file.delete({
      where: { id: parseInt(fileId) },
    });

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ error: "Failed to delete file" });
  }
}

module.exports = {
  deleteFile,
};
