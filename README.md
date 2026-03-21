# 🚀 Project Name: Mole-Cube

최대 5명의 랜덤한 유저들과 협동하여 큐브를 맞추는 실시간 멀티플레이 게임 




## 🛠 Tech Stack

- **Framework:** Next.js (App Router), NestJS
- **Styling & UI:** Three.js, Tailwind CSS, shadcn/ui, Lucide React
- **Networking:** Socket.IO
- **Infra & DevOps:** AWS EC2, Nginx, PM2, GitHub Actions, Vercel
  

## ✨ Key Features

#### 🎮 실시간 멀티플레이
- 최대 5인까지 동시 참여 가능한 실시간 룸 매칭 알고리즘 구현
- 진행 중인 5인미만 룸이 있을 경우 중도 참여, 없을 경우 신규 룸 생성
- 룸 별로 독립적인 타이머를 구동하여 '게임 진행-휴식' 페이즈 전환 자동화

#### 🧩 3D 큐브
- 드래그를 통한 큐브 전방위 시점 전환
- 개별 면에 대한 시계/반시계 방향 회전

#### 💰 게임 기능
- 큐브 완성 시 기여도를 산출하여 게임 내 코인을 차등 지급
- 획득한 코인을 소모하여 스킨 구매 및 적용
- 실시간 감정 표현을 통한 유저 간 상호작용



## 🚀 Getting Started
### Installation
```bash
# 1. Repository Clone
git clone https://github.com/BoeunHan/mole-cube.git

# 2. Dependency Install
cd client && npm install
cd server && npm install

# 3. Environment Setup
# client, server 폴더 내에 .env.example을 이용해 .env 파일을 생성

# 4. Run Development Server
cd client && npm run dev
cd server && npm run start:dev
```



