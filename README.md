# PROBIT Backend API

Backend Express + Sequelize + PostgreSQL untuk project PROBIT.

## Fitur utama

- Register user biasa saja, role selalu `user`
- Admin otomatis dibuat dari `.env` saat server pertama kali dijalankan
- Login JWT Bearer token
- Generated plan mengambil data dari `user_health_profiles`, bukan input manual dari frontend
- Ownership check: user hanya bisa CRUD data miliknya sendiri
- Admin-only CRUD untuk recipes, blogs, users, dan activity logs

## Install

```bash
npm install
cp .env.example .env
npm run dev
```

Buat database PostgreSQL terlebih dahulu sesuai `DB_NAME` di `.env`.

## Admin default

Atur di `.env`:

```env
ADMIN_EMAIL=admin@probit.com
ADMIN_PASSWORD=admin123
```

Admin otomatis masuk tabel `users` saat server jalan.

## Header private endpoint

```http
Authorization: Bearer <token>
```

## Endpoint penting untuk React

### Register

```http
POST /api/auth/register
```

```json
{
  "username": "Arif",
  "email": "arif@mail.com",
  "password": "123456"
}
```

### Login

```http
POST /api/auth/login
```

```json
{
  "email": "admin@probit.com",
  "password": "admin123"
}
```

Response:

```json
{
  "status": "success",
  "token": "jwt_token",
  "user": {
    "id": 1,
    "username": "Admin PROBIT",
    "email": "admin@probit.com",
    "role": "admin"
  }
}
```

### Create health profile

```http
POST /api/user/health-profiles
```

```json
{
  "age": 21,
  "gender": "male",
  "weight": 70,
  "height": 170,
  "activity_level": "medium",
  "goal_type": "cutting",
  "budget_limit": 350000
}
```

### Generate plan dari health profile

```http
POST /api/user/generated-plans
```

```json
{
  "profile_id": 1,
  "plan_period": "weekly"
}
```

## React Axios contoh

```js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

Login:

```js
const res = await api.post("/auth/login", { email, password });
localStorage.setItem("token", res.data.token);
localStorage.setItem("role", res.data.user.role);
```
