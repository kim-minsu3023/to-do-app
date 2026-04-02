Full-Stack Todo Engine (React + Vite)
소프트웨어 공학 프로세스 기반의 데이터 중심 할 일 관리 시스템
본 프로젝트는 창원대학교 컴퓨터공학과 2학년 전공 미니 프로젝트로, 프론트엔드와 백엔드, 클라우드 DB를 통합한 Full-Stack 환경을 구축하고 배포하는 것을 목표로 합니다.

Tech Stack

    Frontend
        Framework: React 19 (Vite 8)
        Styling: Tailwind CSS v4 (PostCSS, Autoprefixer)
        HTTP Client: Axios (REST API Communication)

    Backend & Database  
        Server: Node.js (Express)
        Database: MongoDB Atlas (Mongoose ODM)
        Deployment: Vercel (Serverless Functions)

1. 핵심 기능 (Core Features)
    REST API 기반의 정교한 CRUD
        Create: 실시간 데이터 동기화를 통한 할 일 추가.
        Read: MongoDB 쿼리를 활용한 상태별/날짜별 데이터 조회.
        Update: 인라인 편집 모드를 지원하여 UI 이탈 없이 즉시 수정 가능.    
        Delete: 고유 ID 기반의 데이터 영구 삭제 및 상태 업데이트.

2.  마감 기한(Deadline) 관리 시스템
        실시간 잔여 시간 계산: 현재 시각과 마감 시각을 비교하여 사용자에게 남은 시간을 시각적으로 제공.
        임박 알림 UI: 마감 1시간 이내 항목에 대해 애니메이션 효과와 강조 색상을 적용하여 가독성 증대.
        Time-Over 로직: 마감 기한이 지난 항목은 자동으로 '실패' 상태로 전환 및 체크박스 비활성화 처리.

3. 성취도 분석 (Win Rate) 대시보드
        데이터 시각화: 당일 완료(Success) 건수와 실패(Failure) 건수를 실시간 합산하여 승률(%) 산출.

4. 사용자 맞춤형 데이터 필터링
        날짜별 독립 관리: 캘린더 피커를 통해 과거와 미래 날짜를 선택하여 날짜별 독립된 Todo 리스트 관리 가능.
        중요도(Importance): 별표(Favorite) 표시 기능을 통해 핵심 업무를 상단에 고정하고 우선순위 정렬.

Installation & Running

    1. Prerequisites
        Node.js v20.0.0+
        MongoDB Atlas URI
 
    2. Local Setup
    # 1. 저장소 클론
        git clone https://github.com/kim-minsu3023/to-do-app.git

    # 2. 프론트엔드 실행
        cd frontend
        npm install
        npm run dev

    # 3. 백엔드 실행 (별도 터미널)
        cd backend
        npm install
        npm run dev # Port 5001 사용 (macOS 포트 충돌 방지)


Project Structure
        todo-app/
            ├── frontend/             # React Client
            │   ├── src/
            │   │   ├── App.jsx       # Main Logic & UI
            │   │   └── assets/       # Static Resources (Logo, etc.)
            │   └── vite.config.js    # Build & Proxy Setup
            ├── backend/              # Express Server
            │   └── index.js          # API Endpoints & DB Connection
            └── vercel.json           # Deployment Configuration


Developer
    Minsu Kim (Changwon National University / Computer Engineering)
    Email: 20262407@student.changwon.ac.kr  