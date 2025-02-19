const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs-extra");
const cloudinary = require("../config/cloudinaryConfig");

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

    //get all subfolders recursively
    const subfolders = await getAllSubfolders(folder.id);
    const allFolderIds = subfolders.map((f) => f.id);

    //get all files in the folder and subfolders
    const allFiles = await prisma.file.findMany({
      where: { folderId: { in: [folder.id, ...allFolderIds] } },
    });

    //delete files from the filesystem
    for (const file of allFiles) {
      console.log(file);
      await cloudinary.uploader.destroy(file.filename);
    }

    //delete files from database
    await prisma.file.deleteMany({
      where: { folderId: { in: [folder.id, ...allFolderIds] } },
    });

    //delete folders from database in reverse order (deepest first)
    await prisma.folder.deleteMany({
      where: { id: { in: allFolderIds } },
    });

    //delete the main folder
    await prisma.folder.delete({ where: { id: folder.id } });

    res.json({ message: "Folder and all subfolders deleted successfully" });
  } catch (error) {
    console.error("Error deleting folder:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// UPDATE
async function renameFolder(req, res) {
  if (!req.body) {
    return res.redirect("/dashboard");
  }

  const { folderName, folderId } = req.body;

  const folder = await prisma.folder.findUnique({
    where: { id: parseInt(folderId) },
  });

  if (!folder) {
    return res.status(404).send("Folder not found");
  }

  const oldPath = folder.path;
  const parentFolder = folder.parentId
    ? await prisma.folder.findUnique({ where: { id: folder.parentId } })
    : null;

  const newParentPath = parentFolder
    ? parentFolder.path
    : `uploads/dashboard-${req.user.id}`;
  const newPath = `${newParentPath}/${folderName}`.replace(/\/\//g, "/");

  await prisma.folder.update({
    where: { id: parseInt(folderId) },
    data: {
      name: folderName,
      path: newPath,
    },
  });

  await updateChildFolderPaths(folderId, oldPath, newPath);

  const basePath = `uploads/dashboard-${req.user.id}/`;
  const redirectPath = newParentPath.startsWith(basePath)
    ? newParentPath.slice(basePath.length)
    : newParentPath;

  console.log("redirect path", basePath);

  // Check if the update happen on the highest parent and redirect it to the /dashboard
  if (!redirectPath || redirectPath === `uploads/dashboard-${req.user.id}`) {
    return res.redirect("/dashboard");
  }

  res.redirect(`/dashboard/${redirectPath}`);

  // res.redirect("/dashboard/${redirectPath}") ;
}

// recursive function to update subfolder paths
async function updateChildFolderPaths(parentId, oldPath, newPath) {
  const subfolders = await prisma.folder.findMany({
    where: { parentId: parseInt(parentId) },
  });

  for (const subfolder of subfolders) {
    const updatedChildPath = subfolder.path.replace(oldPath, newPath);

    await prisma.folder.update({
      where: { id: subfolder.id },
      data: { path: updatedChildPath },
    });
    await updateChildFolderPaths(subfolder.id, oldPath, newPath);
  }
}

// Share zip folder
async function getAllFilesInFolder(folderId) {
  // Get the main folder
  const folder = await prisma.folder.findUnique({ where: { id: folderId } });
  if (!folder) return [];

  // Get all subfolders recursively
  const subfolders = await getAllSubfolders(folderId);
  const allFolderIds = [folderId, ...subfolders.map((f) => f.id)];

  // Fetch all files in the folder and subfolders
  return await prisma.file.findMany({
    where: { folderId: { in: allFolderIds } },
  });
}

async function shareZipFolder(req, res) {
  try {
    const { folderId } = req.params;
    const files = await getAllFilesInFolder(folderId);

    if (files.length === 0) {
      return res.status(404).json({ error: "No files found in this folder" });
    }

    // Create ZIP in memory
    const archive = archiver("zip", { zlib: { level: 9 } });
    const zipBuffer = [];

    archive.on("data", (chunk) => zipBuffer.push(chunk));
    archive.on("end", async () => {
      const finalBuffer = Buffer.concat(zipBuffer);

      // Upload ZIP to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload_stream(
        { resource_type: "raw", folder: "zipped_folders" },
        async (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return res.status(500).json({ error: "Failed to upload ZIP" });
          }
          res.json({ downloadLink: result.secure_url });
        }
      );
      uploadResponse.end(finalBuffer);
    });

    for (const file of files) {
      const response = await axios.get(file.url, { responseType: "stream" });
      archive.append(response.data, { name: file.path });
    }

    archive.finalize();
  } catch (error) {
    console.error("Error zipping folder:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  deleteFolder,
  renameFolder,
  shareZipFolder,
};
