# 📂 Express File Manager

A sleek and feature-rich **File Manager** powered by Express.js, Prisma ORM, Koyeb PostgreSQL, and Cloudinary. Users can effortlessly **create, delete, and rename files and folders**, upload files to the cloud, and generate public URLs for easy sharing.

## 🚀 Features

- ✅ User authentication (Sign up, Login, Logout) using **Passport.js**
- 📁 Create, delete, and update folders
- 📄 Create, delete, and read files
- ☁️ Upload files to **Cloudinary**
- 🔗 Share public URLs for files
- 🗃️ Organized folder structure for better usability

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** Koyeb PostgreSQL
- **ORM:** Prisma
- **Authentication:** Passport.js
- **Storage:** Cloudinary for file uploads
- **View Engine:** EJS (for rendering views)
- **Styling:** CSS

## 📂 Project Structure

```
file-uploader
│ ├── .env
│ ├── .gitignore
│ ├── package-lock.json
│ ├── package.json
│ ├── prisma
│ │ ├── migrations
│ │ └── schema.prisma
│ ├── README.md
│ │ ├── src
│ │ ├── app.js
│ │ ├── config
│ │ │ ├── cloudinaryConfig.js
│ │ │ └── sessionConfig.js
│ │ ├── controllers
│ │ │ ├── authController.js
│ │ │ ├── fileController.js
│ │ │ └── folderController.js
│ │ ├── middlewares
│ │ │ └── multer.js
│ │ ├── prismaClient
│ │ │ └── index.js
│ │ ├── public
│ │ │ ├── icons
│ │ │ │ ├── clouds.png
│ │ │ │ ├── dots.png
│ │ │ │ ├── file.png
│ │ │ │ ├── folder 1.png
│ │ │ │ ├── folder-auth.png
│ │ │ │ ├── folder.png
│ │ │ │ ├── jpg.png
│ │ │ │ ├── plus.png
│ │ │ │ ├── small-folder.png
│ │ │ │ ├── txt.png
│ │ │ │ └── white-cloud.png
│ │ │ ├── js
│ │ │ │ └── dashboardDOM.js
│ │ │ └── styles
│ │ │ ├── dashboard.css
│ │ │ ├── landingPage.css
│ │ │ └── signInPage.css
│ │ ├── routes
│ │ │ ├── auth.js
│ │ │ ├── dashboard.js
│ │ │ ├── downloadZip.js
│ │ │ ├── fileManagementRouter.js
│ │ │ ├── folder.js
│ │ │ ├── folderManagementRouter.js
│ │ │ └── upload.js
│ │ ├── services
│ │ │ └── userServices.js
│ │ ├── uploads
│ │ └── views
│ │ ├── dashboard.ejs
│ │ ├── landing.ejs
│ │ ├── loginForm.ejs
│ │ └── signUpForm.ejs
│ ├── todo
│ └── tree_output.txt
```

## ⚡ Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Etativel/file-uploader.git
   cd file-uploader
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up **.env** file:
   ```sh
   DATABASE_URL="your_database_url"
   CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
   CLOUDINARY_API_KEY="your_cloudinary_api_key"
   CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
   SESSION_SECRET="your_secret_key"
   ```
4. Run Prisma migrations:
   ```sh
   npx prisma migrate dev --name init
   ```
5. Start the server:
   ```sh
   cd src
   node app.js
   ```
   The app runs on `http://localhost:3030`

## 🔑 Authentication

- **Sign up & Login** using bcrypt for password hashing.
- Sessions handled with **express-session**.
- Authenticated users can manage files and folders.

## ☁️ Cloud Storage

- Files are uploaded to **Cloudinary**.
- Each uploaded file gets a **public URL** for sharing.

## 📌 API Endpoints

| Method | Endpoint                             | Description               |
| ------ | ------------------------------------ | ------------------------- |
| POST   | `/sign-up`                           | Register a new user       |
| POST   | `/sign-in`                           | Login user                |
| GET    | `/log-out`                           | Logout user               |
| POST   | `/dashboard/create`                  | Create a new folder       |
| POST   | `/update-folder`                     | Rename a folder           |
| POST   | `/dashboard/delete-folder/:folderId` | Delete a folder           |
| POST   | `/dashboard/*/upload`                | Upload a file to a folder |
| POST   | `/dashboard/delete/:fileId`          | Delete a file             |
| POST   | `/dashboard/share-folder/:folderId`  | Share a folder            |

## 📜 Route Details

### Authentication Routes

- **POST** `/sign-up` - Registers a new user.
- **POST** `/sign-in` - Logs in the user and redirects to the dashboard.
- **GET** `/log-out` - Logs out the user and redirects to the login page.

### Folder Routes

- **POST** `/dashboard/create` - Creates a new folder inside the specified parent folder.
- **POST** `/update-folder` - Renames a folder.
- **POST** `/dashboard/delete-folder/:folderId` - Deletes a folder.
- **POST** `/dashboard/share-folder/:folderId` - Share a folder and its content.

### File Routes

- **POST** `/dashboard/*/upload` - Uploads a file to the specified folder.
- **POST** `/dashboard/delete/:fileId` - Deletes a file from the specified folder.

## 🛠️ Middleware and Helpers

- **Passport.js**: Handles user authentication and session management.
- **Multer**: Middleware for handling file uploads.
- **Flash Messages**: Provides feedback for successful or failed operations (e.g., login failure, successful file upload).

## 🧑‍💻 Authentication & Authorization

All endpoints (except for registration and login) require the user to be authenticated. The authentication middleware ensures the user is logged in before accessing protected routes.

## 🎨 UI & Design

- Fully responsive design using **CSS**.
- Smooth animations for file/folder interactions.
- **EJS templates** used for rendering views.

## 📜 License

MIT License © 2025 Farhan Maulana

---
