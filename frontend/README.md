# To-do List — Frontend

React + Vite 기반 할 일 관리 앱 프론트엔드입니다. 백엔드 API와 연동해 할 일을 조회·추가·수정·삭제합니다.

## 기술 스택

- **React** 19, **Vite** 8
- **Tailwind CSS** v4 (`@tailwindcss/postcss`, PostCSS, Autoprefixer)
- **Axios** (HTTP 클라이언트)
- **ESLint** (코드 스타일)

## 사전 요구 사항

- Node.js 20 이상 권장
- npm (또는 pnpm, yarn)

## 설치

```bash
cd frontend
npm install
```

## 로컬 개발

백엔드(`to-do-list/back`)를 먼저 실행한 뒤 프론트를 띄우는 것을 권장합니다.

```bash
# 터미널 1 — 백엔드 (예: 포트 5000)
cd ../back
npm install
npm run dev
```

```bash
# 터미널 2 — 프론트 (기본 http://localhost:5173)
cd frontend
npm run dev
```

### API 주소

- **프로덕션(Vercel 등)**: `App.jsx`의 `API_URL`이 `/api/todos`로 설정되어 있으면, 같은 도메인의 API로 요청이 갑니다.
- **로컬에서 백엔드만 따로 띄울 때**: Vite 프록시를 쓰거나 `API_URL`을 `http://localhost:5000/api/todos`처럼 백엔드 URL로 바꿔야 합니다. (CORS는 백엔드에서 `cors()`로 허용되어 있어야 합니다.)

## 빌드

```bash
npm run build
```

결과물은 `frontend/dist`에 생성됩니다.

```bash
npm run preview
```

로 프로덕션 빌드를 로컬에서 미리 볼 수 있습니다.

## 기타 스크립트

| 명령 | 설명 |
|------|------|
| `npm run dev` | 개발 서버 (HMR) |
| `npm run build` | 프로덕션 빌드 |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run lint` | ESLint 검사 |

## 전체 프로젝트 배포 (참고)

저장소 루트의 `to-do-list/`에 `vercel.json`이 있으면, 프론트 정적 빌드와 백엔드 서버리스를 함께 묶을 수 있습니다. 배포 시 **Root Directory**를 `to-do-list`로 두고, Vercel 대시보드에서 프론트용 **Build Command**가 `cd frontend && npm install && npm run build`, **Output Directory**가 `frontend/dist`인지 확인하세요. (설정이 다르면 경로를 찾지 못하는 오류가 날 수 있습니다.)

## 폴더 구조 (요약)

```
frontend/
├── index.html
├── vite.config.js
├── postcss.config.js
├── tailwind.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   └── ...
└── public/
```

## 라이선스

개인 미니 프로젝트 용도입니다.
