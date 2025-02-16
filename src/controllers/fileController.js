const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cloudinary = require("../config/cloudinaryConfig");
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
    // const publicId = `uploads/${file.filename}`;
    await cloudinary.uploader.destroy(file.filename);
    // console.log("filename file", file.filename);
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
