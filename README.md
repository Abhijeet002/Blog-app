# ✨ Echoes and Edits – Full Stack Blog App

A feature-rich, full-stack blog platform where users can create, explore, and manage blog posts with beautiful UI and secure backend services.

> 🚀 **Live Demo**: (https://blog-app-three-topaz.vercel.app/)  

> 📂 **Frontend**: React + Vite + Tailwind CSS  
> 🔧 **Backend**: Node.js + Express.js + PostgreSQL   
> 🔧 **Deployed using**: Render(for backend) + Railway(for database) + Vercel(for frontend)   
> 👤 **Author**: Abhijeet

---

## 📸 Screenshots

![Home Page](https://drive.google.com/file/d/12CB150cSqTSEqYACEu9Vj5y__tVD5I5L/view?usp=drive_link)
![Write Post](https://drive.google.com/file/d/17kOGfK8nJppajwQCUyxlJ3i_OrXtSTuW/view?usp=drive_link)
![User Profile](https://drive.google.com/file/d/1Mzqn1Lo9uJhthaXDpEHObnHMnaq5Vu06/view?usp=drive_link)
![Post Page](https://drive.google.com/file/d/17ApZ9EheeQQ51-3MUFKI0CBszGv4XrtF/view?usp=drive_link)
![Video link](https://www.loom.com/share/636b3f1a88b545c1851b24450c910529?sid=e8db5a17-b11b-48a4-a384-3890b0d81ed4)

---

## 🧩 Features

- 🔐 JWT-based authentication (Login/Register)
- 👤 Role-based access (Admin/User)
- 📝 Create, edit, and delete blog posts
- 🔍 Category-based filtering (e.g., `/category/tech`)
- 🖼️ Profile image upload via Cloudinary
- ⚡ Responsive and animated UI
- 🌐 RESTful API architecture
- 📁 File structure organized for scalability

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- shadcn/ui
- Cloudinary (image upload)

### Backend

- Node.js
- Express.js
- PostgreSQL
- bcrypt & JWT
- CORS

---

## 📂 Project Structure

```
echoes-and-edits/
├── client/              # React Frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       └── main.jsx
├── api/              # Express Backend
│   ├── controllers/
│   ├── routes/
│   ├── index.js/
│   └── utils/
│   └── db.js
```

---

## 🧪 Getting Started

###  Prerequisites

- Node.js (v18+)
- PostgreSQL Database
- Cloudinary Account (for image uploads)

---

### 🔧 Backend Setup

```bash
git clone https://github.com/Abhijeet002/Blog-app.git
cd blog-app/api
npm install
```

Create a `.env` file in `api/`:

```env
PORT=5000
DB_URL=your_postgres_connection_string
DB_HOST= localhost
DB_USER= your-db-username
DB_PASSWORD=your-db-pass
DB_NAME= your-db-name
DB_PORT= your-db-port
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the server:

```bash
nodemon start
```

---

### 🎨 Frontend Setup

Create a `.env` file in `client/`:
```env
VITE_API_URL= your-frontend-url
```

```bash
cd ../client
npm install
```

Start the client:

```bash
npm start
```



---

## 🚀 Clone and Run Locally

```bash
git clone https://github.com/Abhijeet002/Blog-app.git
cd blog-app
```

- Follow Backend & Frontend setup as above.
- Access it via `http://localhost:5173`

---

## 🤝 Contributing

Contributions are welcome! 🚀  
To contribute:

1. Fork the repo
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add your message"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---




## 📬 Contact

For feedback, issues, or collaborations:

**Abhijeet**  
📧 (mailto:abhijeetsachanwork@example.com)  
🔗 [LinkedIn](https://www.linkedin.com/in/abhijeet-sachan/)  
---

> _"Echoes and Edits is more than just a blog — it’s your voice on the web."_ ✍️
