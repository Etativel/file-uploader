const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs-extra");

// DELETE
async function getAllSubfolders(folderId) {
  let subfolders = await prisma.folder.findMany({
    where: { parentId: parseInt(folderId) },
  });
  let allFolders = [];

  for (const folder of subfolders) {
    const children = await getAllSubfolders(folder.id);
    allFolders.push(folder, ...children);
  }

  return allFolders;
}

async function deleteFolder(req, res) {
  try {
    const { folderId } = req.params;
    const folder = await prisma.folder.findUnique({
      where: { id: parseInt(folderId) },
    });

    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    // Get all subfolders recursively
    const subfolders = await getAllSubfolders(folder.id);
    const allFolderIds = subfolders.map((f) => f.id);

    // Get all files in the folder and subfolders
    const allFiles = await prisma.file.findMany({
      where: { folderId: { in: [folder.id, ...allFolderIds] } },
    });

    // Delete files from the filesystem
    for (const file of allFiles) {
      console.log(file);
      await fs
        .unlink(file.path)
        .catch((err) => console.error("File deletion error:", err));
    }

    // Delete files from database
    await prisma.file.deleteMany({
      where: { folderId: { in: [folder.id, ...allFolderIds] } },
    });

    // Delete folders from database in reverse order (deepest first)
    await prisma.folder.deleteMany({
      where: { id: { in: allFolderIds } },
    });

    // Finally, delete the main folder
    await prisma.folder.delete({ where: { id: folder.id } });

    // Remove the actual directories
    for (const f of subfolders.reverse()) {
      await fs
        .rm(f.path, { recursive: true })
        .catch((err) => console.error("Folder deletion error:", err));
    }
    await fs.rm(folder.path, { recursive: true });

    res.json({ message: "Folder and all subfolders deleted successfully" });
  } catch (error) {
    console.error("Error deleting folder:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  deleteFolder,
};
