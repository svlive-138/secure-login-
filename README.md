# 🔐 Secure Login App

A secure and responsive MERN-based web application that allows users to sign up, log in, and safely store private data. This project emphasizes authentication, encryption, session management, and clean UI integration using HTML, CSS, and JavaScript.

---

## 🚀 Features

- ✅ Secure **User Authentication** (Sign Up / Login)
- 🔑 **Password Hashing** using Bcrypt
- 🔐 **Encryption** of sensitive user data with `mongoose-encryption`
- 🍪 **Session Management** using Cookies, JWT, and MongoStore
- 🛡️ Role-based access support (`user` / `admin`)
- 📝 Secret storage per user with dynamic rendering
- 💻 Responsive UI with clean routing and EJS templating

---

## 🧰 Tech Stack

| Layer       | Tools Used                                 |
|------------|---------------------------------------------|
| Frontend    | HTML, CSS, JavaScript                      |
| Backend     | Node.js, Express.js                        |
| Templates   | EJS                                        |
| Auth/Security | bcrypt, JWT, cookie-parser, mongoose-encryption |
| Database    | MongoDB (via Mongoose)                    |
| Sessions    | express-session, connect-mongo            |
| Deployment  | Render (optional)                         |

---

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/svlive-138/secure-login.git
   cd secure-login```

2 INSTALLIN DEPENDENCIES
```bash
npm install
```
3. Configure environment variables

Create a .env file in the root directory with the following keys:
```
MONGO_URI=your_mongo_connection_string
SESSION_SECRET=your_secure_session_key
JWT_SECRET=your_jwt_secret_key
```
4.Run the server
```
node app.js
```
5.🌐 Folder Structure
```
.
├── node_modules/         → Ignored in .gitignore
├── public/               → CSS & static assets
│   ├── css/
│   └── image/
├── views/                → EJS templates
├── app.js                → Express server logic
├── .gitignore            → Git exclusion rules
├── package.json
└── package-lock.json
```
6. 💡 Deployment Tips
✅ Do not upload .env file to GitHub — store secrets in Render's environment tab

✅ Ensure node_modules/ is excluded via .gitignore

✅ Use npm install as your build command on Render

✅ Clean up deprecated options from mongoose.connect()

7.📜 License
This project is open-source and free to use under the MIT License.


####👨‍💻 Author
sv — Passionate MERN developer focused on security, responsiveness, and user-centric web solutions. GitHub: ```

svlive-138

LIVE DEMO: ```
https://secure-login-a2w9.onrender.com




