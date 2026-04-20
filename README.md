# Shopmall

React + Express + MongoDB 쇼핑몰 프로젝트 기본 구조입니다.

## 구조

- `frontend/` — React, React Router, Vite
- `backend/` — Express, Mongoose(MongoDB)

## 사전 요구 사항

- Node.js 18+
- MongoDB Atlas 클러스터 및 연결 문자열(`MONGODB_URI`)

## 백엔드 실행

```bash
cd backend
cp .env.example .env
# .env에 Atlas `MONGODB_URI`, `JWT_SECRET` 설정
npm install
npm run dev
```

기본 포트: `5000`  
헬스 체크: `GET http://localhost:5000/api/health`

회원가입/로그인 라우트(빈 구조):

- `POST /api/auth/signup` — body: `{ email, password, nickname }`, bcrypt 해시 저장 후 JWT 반환
- `GET /api/auth/check-nickname?nickname=` — 닉네임 없음: `400` `{ available: false, message }`. 사용 가능: `200` `{ available: true, message: "사용 가능한 닉네임입니다." }`, 중복: `200` `{ available: false, message: "이미 사용 중인 닉네임입니다." }`
- `POST /api/auth/login` — body: `{ email, password }`, JWT 반환

상품 API (`server.js`에 직접 연결):

- `GET /api/products` — query: `category`(all|plate|…), `sort`(all|popular|latest|price_desc|price_asc), `page`, `limit`
- `GET /api/products/:id` — 단일 상품

더미 상품 적재: `backend/seedProducts.js` 안의 `PRODUCTS` 배열만 수정한 뒤 실행합니다. 기존 상품은 전부 삭제된 뒤 다시 넣습니다.

```bash
cd backend
yarn seed
# 또는: npm run seed
```

프론트 `Login` / `Signup` 페이지는 axios로 위 API를 호출하고, 성공 시 `localStorage` 키 `token`에 JWT를 저장합니다.

## 프론트엔드 실행

```bash
cd frontend
npm install
npm run dev
```

기본 주소: `http://localhost:5173`  
개발 시 `/api` 요청은 Vite 프록시로 백엔드(`localhost:5000`)로 전달됩니다.

## 환경 변수 예시

- `backend/.env.example` — 필수 `MONGODB_URI`(Atlas), `JWT_SECRET`, `PORT`, 선택 `CORS_ORIGIN`, `JWT_EXPIRES_IN`
- `frontend/.env.example` — 선택 `VITE_API_URL`

## 페이지 라우트

| 경로 | 페이지 |
|------|--------|
| `/` | Home |
| `/login` | Login |
| `/signup` | Signup |
| `/category` | Category |
| `/products/:id` | ProductDetail |
| `/cart` | Cart |
