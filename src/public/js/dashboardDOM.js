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

  console.log("First URL Segment:", firstSegment);

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

function redirectPageToFolder(folderPath) {
  if (folderPath) {
    window.location.href = `/dashboard/${folderPath}`;
  } else {
    console.error("Invalid folder path:", folderPath);
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
  if (!confirm("Are you sure to delete the folder and its content?")) return;

  fetch(`/dashboard/delete-folder/${folderId}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      location.reload();
    })
    .catch((error) => console.error("Error deleting folder:", error));
}

function logOut() {
  window.location.href = "/log-out";
}

// Dialog
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
