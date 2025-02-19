document.addEventListener("DOMContentLoaded", () => {
  const dashboard = document.querySelector(".dashboard");
  const home = document.querySelector(".home");

  // Ensure both elements exist before proceeding
  if (!dashboard || !home) {
    console.error("Sidebar elements not found.");
    return;
  }

  const path = window.location.pathname;
  const firstSegment = path.split("/")[1];

  // console.log("First URL Segment:", firstSegment);

  if (firstSegment === "dashboard") {
    dashboard.classList.add("active");
    home.classList.remove("active");
  } else if (firstSegment === "home") {
    dashboard.classList.remove("active");
    home.classList.add("active");
  } else {
    console.log("Page not found, setting default active tab...");
    if (!firstSegment) {
      home.classList.add("active");
    }
  }
});

function test() {
  const url = window.location.href;
  const match = url.match(/http:\/\/localhost:3030(\/[^?]*)/);

  if (match && match[1]) {
    const firstSegment = match[1].split("/")[1];

    if (firstSegment === "dashboard") {
      console.log("dashboard");
    } else {
      console.log("not found");
    }
  } else {
    console.log("not found");
  }
}
const showFolderBtn = document.querySelector(".show-folder-btn");
const showFileBtn = document.querySelector(".show-file-btn");
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".toggle-btn").forEach((button) => {
    const arrowUp = button.querySelector(".arrow-up");
    const arrowDown = button.querySelector(".arrow-down");

    arrowUp.style.display = "none";
    arrowDown.style.display = "inline";

    button.addEventListener("click", () => {
      const isDownVisible = arrowDown.style.display === "inline";
      arrowDown.style.display = isDownVisible ? "none" : "inline";
      arrowUp.style.display = isDownVisible ? "inline" : "none";
    });
  });
});
showFolderBtn.addEventListener("click", () => toggleVisibility("folder"));
showFileBtn.addEventListener("click", () => toggleVisibility("file"));
function toggleVisibility(section) {
  if (section === "folder") {
    const folderContainer = document.querySelector(".folder-container");
    folderContainer.classList.toggle("hide-component");
  } else {
    const fileContainer = document.querySelector(".file-container");
    fileContainer.classList.toggle("hide-component");
  }
}

function redirectPageToFolder(folderName) {
  if (folderName) {
    const currentPath = window.location.origin + window.location.pathname;
    window.location.href = `${currentPath}/${folderName}`;
  } else {
    console.error("Invalid folder path:", folderName);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const welcomeText = document.querySelector(".welcome-text");

  let path = window.location.pathname
    .replace("/dashboard", "")
    .split("/")
    .filter(Boolean);

  if (path.length === 0) {
    welcomeText.innerHTML = `<a class = 'folder-link' href="/dashboard">My Drive</a>`;
  } else {
    let breadcrumbHTML = `<a class = 'folder-link' href="/dashboard">My Drive</a>`;
    let fullPath = "/dashboard";

    path.forEach((segment, index) => {
      fullPath += `/${segment}`;
      breadcrumbHTML += ` > <a class = 'folder-link' href="${fullPath}">${segment}</a>`;
    });

    welcomeText.innerHTML = breadcrumbHTML;
  }
});

// Popup config
const popupButtons = document.querySelectorAll(".folder-options");
const popups = document.querySelectorAll(".popup");

popupButtons.forEach((button, index) => {
  const popup = popups[index];

  button.addEventListener("click", (event) => {
    event.stopPropagation();
    if (popup.style.display === "block") {
      popup.style.display = "none";
    } else {
      popups.forEach((p) => (p.style.display = "none"));

      const buttonRect = button.getBoundingClientRect();
      const popupWidth = 200;
      const screenWidth = window.innerWidth;

      let leftPos = buttonRect.left + window.scrollX;

      if (leftPos + popupWidth > screenWidth) {
        leftPos = screenWidth - popupWidth - 10;
      }

      popup.style.left = `${leftPos + 5}px`;
      popup.style.top = `${buttonRect.bottom + window.scrollY + 5}px`;

      popup.style.display = "block";
    }

    event.stopPropagation();
  });
});

document.addEventListener("click", (event) => {
  popups.forEach((popup) => {
    if (
      !popup.contains(event.target) &&
      !event.target.classList.contains("popup")
    ) {
      popup.style.display = "none";
    }
  });
});

function deleteFile(fileId) {
  if (!confirm("Are you sure you want to delete this file?")) return;

  fetch(`/dashboard/delete/${fileId}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      // Refresh the page to update the file list
      location.reload();
    })
    .catch((error) => console.error("Error deleting file:", error));
}
function deleteFolder(folderId) {
  fetch(`/dashboard/delete-folder/${folderId}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      // alert(data.message);
      location.reload();
    })
    .catch((error) => console.error("Error deleting folder:", error));
}

function logOut() {
  window.location.href = "/log-out";
}

// Folder dialog

const createFolderDialog = document.querySelector(".create-folder-dialog");
const showCreateFolderDialog = document.querySelector(".create-folder");

const uploadDialog = document.querySelector(".upload-dialog");
const showUploadDialog = document.querySelector(".upload-file");

const cancelUpload = document.querySelector(".u-cancel");
const cancelCF = document.querySelector(".c-f-cancel");

showUploadDialog.addEventListener("click", () => {
  uploadDialog.showModal();
});

cancelUpload.addEventListener("click", () => {
  uploadDialog.close();
});

showCreateFolderDialog.addEventListener("click", () => {
  createFolderDialog.showModal();
});

cancelCF.addEventListener("click", () => {
  const inputValue = document.querySelector(".folder-name-input");
  if (inputValue.value) {
    inputValue.value = "";
  }
  createFolderDialog.close();
});

createFolderDialog.addEventListener("click", (event) => {
  if (event.target === createFolderDialog) {
    createFolderDialog.close();
  }
});

uploadDialog.addEventListener("click", (event) => {
  if (event.target === uploadDialog) {
    uploadDialog.close();
  }
});

// Dark mode toggle

function toggleTheme() {
  const moonIcon = document.querySelector(".moon-icon");
  const sunIcon = document.querySelector(".sun-icon");

  // Toggle dark mode
  if (document.documentElement.classList.contains("dark-mode")) {
    document.documentElement.classList.remove("dark-mode");
    localStorage.setItem("theme", "light");
    moonIcon.classList.remove("hidden");
    sunIcon.classList.add("hidden");
  } else {
    document.documentElement.classList.add("dark-mode");
    localStorage.setItem("theme", "dark");
    moonIcon.classList.add("hidden");
    sunIcon.classList.remove("hidden");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const storedTheme = localStorage.getItem("theme") || "light";

  if (storedTheme === "dark") {
    document.documentElement.classList.add("dark-mode");
  } else {
    document.documentElement.classList.remove("dark-mode");
    localStorage.setItem("theme", "light");
  }

  const moonIcon = document.querySelector(".moon-icon");
  const sunIcon = document.querySelector(".sun-icon");

  if (document.documentElement.classList.contains("dark-mode")) {
    moonIcon.classList.add("hidden");
    sunIcon.classList.remove("hidden");
  } else {
    moonIcon.classList.remove("hidden");
    sunIcon.classList.add("hidden");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  //add hidden if on mobile
  if (window.innerWidth <= 650) {
    sidebar.classList.add("hidden");
  }
});

const sidebarToggle = document.querySelector(".sidebar-toggle");
const mainSidebarToggle = document.querySelector(".sidebar-toggle.main");
const sidebar = document.querySelector(".sidebar");
sidebarToggle.addEventListener("click", () => {
  mainSidebarToggle.classList.remove("hidden");
  sidebarToggle.classList.add("hidden");
  if (sidebar.classList.contains("hidden")) {
    sidebar.classList.remove("hidden");
    sidebar.classList.add("show");
  } else {
    sidebar.classList.add("hidden");
    sidebar.classList.remove("show");
  }
});

mainSidebarToggle.addEventListener("click", () => {
  mainSidebarToggle.classList.add("hidden");
  sidebarToggle.classList.remove("hidden");
  if (sidebar.classList.contains("hidden")) {
    sidebar.classList.remove("hidden");
    sidebar.classList.add("show");
  } else {
    sidebar.classList.add("hidden");
    sidebar.classList.remove("show");
  }
});

// Delete folder dialog

const deleteFolderBtns = document.querySelectorAll(".delete-folder-btn");
const deleteFolderDialog = document.querySelectorAll(".delete-folder-dialog");

deleteFolderBtns.forEach((btn) => {
  // get closest popup
  const popup = btn.closest(".popup");
  const dialog = popup.querySelector(".delete-folder-dialog");
  btn.addEventListener("click", () => {
    if (dialog) {
      dialog.showModal();
    }
  });
});

deleteFolderDialog.forEach((dialog) => {
  const cancelBtn = dialog.querySelector(".cancel-del-fold-btn");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      dialog.close();
    });
  }
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
});

// View file
function viewFile(link) {
  window.open(link, "_blank");
}

// Download file
function downloadFile(fileUrl, fileName = "download") {
  const downloadUrl = fileUrl.includes("?")
    ? `${fileUrl}&fl_attachment=true`
    : `${fileUrl}?fl_attachment=true`;
  fetch(downloadUrl, { mode: "cors" })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.blob();
    })
    .then((blob) => {
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    })
    .catch((error) => {
      console.error("Download error:", error);
    });
}

// Check max size
const fileInput = document.querySelector(".choose-file");
const maxFileSize = 10 * 1024 * 1024;

fileInput.addEventListener("change", function () {
  const files = fileInput.files;
  for (let i = 0; i < files.length; i++) {
    if (files[i].size > maxFileSize) {
      alert(`Some file exceeds the maximum size of 10MB.`);
      fileInput.value = "";
      break;
    }
  }
});

// Share clipboard
async function shareClipboard(link) {
  const clipboardAlert = document.querySelector(".clip-board");

  try {
    await navigator.clipboard.writeText(link);

    clipboardAlert.classList.add("show");

    if (clipboardAlert.timeoutId) {
      clearTimeout(clipboardAlert.timeoutId);
    }

    clipboardAlert.timeoutId = setTimeout(() => {
      clipboardAlert.classList.remove("show");
      clipboardAlert.timeoutId = null;
    }, 3000);
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
}

// Rename folder

const showUpdateFolderDialog = document.querySelectorAll(".rename-folder-btn");
const updateFolderDialog = document.querySelector(".update-folder-dialog");
const cancelRenameFolder = document.querySelector(".u-f-cancel");

cancelRenameFolder.addEventListener("click", () => {
  updateFolderDialog.close();
});

if (showUpdateFolderDialog) {
  showUpdateFolderDialog.forEach((show) => {
    const currentFolderContainer = show.closest(".parent-folder");
    const folderName = currentFolderContainer.querySelector(".folder-name");
    const folderNameInput =
      updateFolderDialog.querySelector(".folder-name-input");
    const folderIdInput = updateFolderDialog.querySelector(".folder-id");
    const folderId = currentFolderContainer.querySelector(".folder-id");
    show.addEventListener("click", () => {
      folderNameInput.value = folderName.textContent;
      folderIdInput.value = folderId.textContent;
      updateFolderDialog.showModal();
    });
  });
}

updateFolderDialog.addEventListener("click", (event) => {
  if (event.target === updateFolderDialog) {
    updateFolderDialog.close();
  }
});

cancelRenameFolder.addEventListener("click", () => {
  uploadDialog.close();
});

// Share zip folder

// const shareFolderBtn = document.querySelector(".share-folder-btn")

// if (shareFolderBtn){
//   shareFolderBtn.forEach((folder)=>{
//     const parentFolder = folder.closest('.parent-folder')
//     const folderId = parentFolder.querySelector("")

//   })
// }

const shareFolderDialog = document.querySelector(".share-folder-dialog");

const linkContainer = document.querySelector(".dialog-ctr.share-folder");

function shareZipFolder(folderId) {
  console.log("folder id", folderId);
  shareFolderDialog.showModal();
  linkContainer.innerHTML = `
  <div class="loading-link">Zipping folder</div>
  `;
  fetch(`/share-folder/${folderId}`, {
    method: "POST",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.empty) {
        alert("This folder is empty");
        return;
      }
      if (data.downloadLink) {
        // window.location.href = data.downloadLink;
        const expirationTime = new Date(data.expiresAt).toLocaleString();
        linkContainer.innerHTML = `
                      <input
                        type="text"
                        value="${data.downloadLink}"
                        class="share-folder-link"
                        readonly
                        onclick="this.select()"
                      />
                      <p>${expirationTime}</p>
                      <div class="share-folder-btn-ctr">
                        <button class="copy-folder-link-btn">Copy link</button>
                      </div>
        `;
        const copyLinkBtn = document.querySelector(".copy-folder-link-btn");
        copyLinkBtn.addEventListener("click", async () => {
          await navigator.clipboard.writeText(data.downloadLink);
          shareFolderDialog.close();
          setTimeout(() => {
            alert("Link copied");
          }, 0);
        });
      } else {
        alert("Failed to generate ZIP.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred while generating the ZIP file.");
    });
}
