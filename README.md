# Mess Application  

A secure billing application with separate **Admin** and **User** functionalities.  

## 🔐 Security Features  

- **IP Authorization**: Only authorized IPs can access the system.  
- **JWT Authentication**: Secure API access using JSON Web Tokens (JWT).  
- **Bearer Token Authorization**: Every request requires a valid token.  
- **Role-Based Access Control (RBAC)**: Ensures users can only perform allowed actions.  

## 🛠 Features  

### **Admin Panel**  
✅ Add, update, and delete users.  
✅ Retrieve user details.  

### **User Panel**  
✅ Add, update, and delete bills.  
✅ Retrieve bill details.  

## ⚙️ Tech Stack  

- **Backend**: Node.js with PostgreSQL  
- **Frontend**: Two separate apps (Admin & User)  
- **Middleware**: Handles authentication, request validation, and **IP restrictions**.  

---

## 🚀 Setup  

### **Backend**  

1. Navigate to the backend folder:  
   ```bash
   cd backend
   ```
2. Install dependencies:  
   ```bash
   npm install
   ```
3. Set up your environment variables (`.env` file):  
   ```env
   PORT=5000
   DATABASE_URL=your_postgres_connection_url
   JWT_SECRET=your_secret_key
   ```
4. Start the backend server:  
   ```bash
   npm start
   ```

### **Frontend**  

1. Navigate to each frontend app (Admin/User) and install dependencies:  
   ```bash
   cd frontend/admin  # or cd frontend/user  
   npm install
   ```
2. Start the frontend application:  
   ```bash
   npm start
   ```

---

## 🔒 API Security & Authentication  

1. **JWT Tokens**  
   - All requests require a **valid JWT token** in the `Authorization` header.  
   - Users receive a token upon successful login.  
   - Tokens expire after a defined period to enhance security.  

2. **IP Authorization**  
   - Only whitelisted IPs (configured in `ALLOWED_IPS`) can access the API.  
   - Requests from unauthorized IPs are blocked.  

3. **Middleware Protection**  
   - Middleware verifies tokens and IPs before processing requests.  
   - Unauthorized access attempts are logged for monitoring.  

---

## 📄 API Documentation  

### **User APIs**  

#### **1. Login**  
- **Endpoint:** `POST /api/user/login`  
- **Body:**  
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```  
- **Response:**  
  ```json
  {
    "token": "your_jwt_token"
  }
  ```  

#### **2. Get Bills** (Protected)  
- **Endpoint:** `GET /api/user/getBills`  
- **Authorization:** Bearer Token  
- **IP Restricted**  

#### **3. Create Bill** (Protected)  
- **Endpoint:** `POST /api/user/createBill`  
- **Authorization:** Bearer Token  
- **Body:**  
  ```json
  {
    "name": "Electricity",
    "amount": 100,
    "status": "Pending"
  }
  ```  

#### **4. Update Bill** (Protected)  
- **Endpoint:** `PUT /api/user/updateBill/:id`  
- **Authorization:** Bearer Token  

#### **5. Delete Bill** (Protected)  
- **Endpoint:** `DELETE /api/user/deleteBill/:id`  
- **Authorization:** Bearer Token  

---

### **Admin APIs**  

#### **1. Login**  
- **Endpoint:** `POST /api/admin/login`  
- **Body:**  
  ```json
  {
    "email": "admin@example.com",
    "password": "adminpassword"
  }
  ```  
- **Response:**  
  ```json
  {
    "token": "your_jwt_token"
  }
  ```  

#### **2. Get Users** (Protected)  
- **Endpoint:** `GET /api/admin/getUsers`  
- **Authorization:** Bearer Token  
- **IP Restricted**  

#### **3. Create User** (Protected)  
- **Endpoint:** `POST /api/admin/createUser`  
- **Authorization:** Bearer Token  

#### **4. Update User** (Protected)  
- **Endpoint:** `PUT /api/admin/updateUser/:id`  
- **Authorization:** Bearer Token  

#### **5. Delete User** (Protected)  
- **Endpoint:** `DELETE /api/admin/deleteUser/:id`  
- **Authorization:** Bearer Token  
