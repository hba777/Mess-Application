# Bill Management Application  

A simple billing application with separate admin and user functionalities.  

## Features  

- **Admin Panel**  
  - Add users.  
  - Retrieve user details.  

- **User Panel**  
  - Add bills.  
  - Retrieve bill details.  

## Tech Stack  

- **Backend**: Node.js with PostgreSQL  
- **Frontend**: Two separate apps (Admin & User)  
- **Middleware**: Handles authentication and request validation  

## Setup  

### Backend  

1. Navigate to the backend folder:  
   ```bash
   cd backend
   ```
2. Install dependencies:  
   ```bash
   npm install
   ```
3. Set up your environment variables (e.g., database connection).  
4. Start the backend server:  
   ```bash
   npm start
   ```

### Frontend  

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

## API Documentation  

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

#### **2. Get Bills**  
- **Endpoint:** `GET /api/user/getBills`  
- **Authorization:** Bearer Token  

#### **3. Create Bill**  
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

#### **4. Update Bill**  
- **Endpoint:** `PUT /api/user/updateBill/:id`  
- **Authorization:** Bearer Token  
- **Body:**  
  ```json
  {
    "amount": 120,
    "status": "Paid"
  }
  ```  

#### **5. Delete Bill**  
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

#### **2. Get Users**  
- **Endpoint:** `GET /api/admin/getUsers`  
- **Authorization:** Bearer Token  

#### **3. Create User**  
- **Endpoint:** `POST /api/admin/createUser`  
- **Authorization:** Bearer Token  
- **Body:**  
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword",
    "role": "user"
  }
  ```  

#### **4. Update User**  
- **Endpoint:** `PUT /api/admin/updateUser/:id`  
- **Authorization:** Bearer Token  
- **Body:**  
  ```json
  {
    "name": "John Updated"
  }
  ```  

#### **5. Delete User**  
- **Endpoint:** `DELETE /api/admin/deleteUser/:id`  
- **Authorization:** Bearer Token  
