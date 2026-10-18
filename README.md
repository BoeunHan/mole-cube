<img width="800" height="387" alt="demo_2x" src="https://github.com/user-attachments/assets/42ef5c22-9fb5-46c8-8c50-e96d0f3f6364" /><img width="1932" height="509" alt="Mole-Cube 배너" src="https://github.com/user-attachments/assets/fde95226-d5c1-4013-a285-a8a5aee8e8a2" />


# 🐭 두더지큐브

최대 5명의 랜덤 유저와 차례대로 한 면씩 돌려 큐브를 맞추는 실시간 협동 게임

DEMO: [플레이](https://mole-cube.vercel.app)

<img width="640" alt="데모 영상" src="https://github.com/user-attachments/assets/1f89c97b-ce96-4eac-adbc-4ae39d6509e9" />
<img width="800" height="387" alt="demo_2x" src="https://github.com/user-attachments/assets/3bb44c96-848d-48e2-af93-9d6f83a82896" />


<br>

## 📌 프로젝트 소개
 
- **기간**: 2025.08 ~ 2025.12
- **인원**: 1인 개발 (기획 · 디자인 · 프론트엔드 · 백엔드 · 배포)
- **기획 배경**: Three.js와 WebSocket을 경험해보기 위해 두 기술을 접목한 아이디어 구상


### 게임 방식
 
1. 닉네임을 입력하면 자리가 남은 방에 자동 입장 (없으면 새 방 자동 생성)
2. 플레이어들이 10초씩 차례대로 큐브의 한 면을 회전
3. 큐브가 완성되면 기여도에 따라 코인 지급 → 15초 휴식 후 다음 라운드
4. 모은 코인으로 두더지 스킨 구매

<br>

## 🛠 기술 스택
 
| 분류 | 기술 |
|---|---|
| Frontend | Next.js (App Router), React, TypeScript, Three.js, Tailwind CSS, shadcn/ui, [mole-toast](https://www.npmjs.com/package/mole-toast) (자체 제작) |
| Backend | NestJS, Socket.IO |
| Infra | Vercel, AWS EC2, Nginx, PM2, GitHub Actions |

<br>  

## ✨ 주요 기능

### 🎮 실시간 멀티플레이
- 빈자리가 있는 방에 중도 참여, 없으면 새 방 생성
- 방마다 독립된 타이머로 턴 전환 및 '게임 진행 → 휴식' 페이즈 자동 전환
- 차례인 유저가 나가면 다음 유저로 턴 자동 이전, 마지막 유저가 나가면 방 정리
  
### 🧩 3D 큐브 조작
- 드래그로 큐브 전방위 시점 전환
- 면 단위 시계/반시계 회전 애니메이션
- 회전 히스토리로 누가 어떤 면을 돌렸는지 확인

### 💰 보상 · 상점 · 감정표현

- 완성 시 회전 참여 횟수 비율로 코인 차등 지급 (완성시킨 유저 보너스)
- 코인으로 스킨 구매 및 적용, 같은 방 유저에게 실시간 반영
- 감정표현 버튼으로 유저 간 상호작용

<br>

## 🏗 아키텍처
<img width="2046" height="971" alt="Mole Cube 아키텍처" src="https://github.com/user-attachments/assets/07803dd5-0cd2-4136-80ab-242147deae5b" />


<br>



## 💡 구현 포인트

### 1. Three.js 면 회전 애니메이션과 면 색상 상태 분리
- 회전할 면의 큐브 9개를 임시 Group으로 묶어 축 기준 90° 회전
- 애니메이션이 끝나면 큐브를 원래 위치로 되돌리고, 데이터 모델(면별 색상 배열)을 회전시킨 뒤 색상만 다시 칠함
- 큐브 배열의 인덱스가 항상 실제 위치와 같아서, 다음 회전 때 면에 속한 큐브 9개를 인덱스만으로 바로 찾을 수 있고 화면이 항상 데이터 모델과 일치
- 
### 2. 서버 기준으로 모든 화면 동기화
- 큐브 상태, 현재 차례, 타이머를 모두 서버에서 관리하고, 회전 요청은 서버가 차례/라운드 상태를 검증한 뒤 방 전체에 전달
- 회전한 본인도 서버 응답을 받은 뒤 애니메이션을 실행해 모든 유저의 화면 순서가 동일
- 
### 3. 클라이언트마다 다른 시계로 인한 타이머 오차
- 서버가 `timerEndTime`과 함께 `serverNow`를 보내고, 클라이언트는 `serverNow - Date.now()`로 시간 차이를 보정해 남은 시간을 계산
- 기기 시간이 달라도 모든 유저에게 같은 남은 시간이 표시되도록 처리
- 
### 4. 이벤트 기반으로 로직과 통신분리
- 방/라운드 로직(`GameRoomState`)은 소켓을 모르고, `EventEmitter2`로 이벤트만 발행
- Gateway가 이벤트를 받아 해당 방/유저에게 전송 → 게임 로직과 네트워크 코드의 책임 분리

## 📁 프로젝트 구조
 
```
mole-cube
├── client                # Next.js (Vercel 배포)
│   └── src
│       ├── app
│       ├── components    # UI 컴포넌트
│       ├── hooks         # 큐브 조작, 연결 관리
│       └── providers     # 소켓/큐브/오디오 Context
├── server                # NestJS (EC2 배포)
│   └── src
│       ├── gateway       # Socket.IO 이벤트 처리
│       ├── game          # 방/라운드 상태 및 게임 로직
│       └── common        # 큐브 상태, 공통 타입
└── .github/workflows     # 서버 자동 배포
```

<br>

## 🚀 실행 방법
 
```bash
git clone https://github.com/BoeunHan/mole-cube.git
cd mole-cube
 
# 서버
cd server
cp .env.example .env      # CLIENT_URL=http://localhost:3000
npm install
npm run start:dev
 
# 클라이언트 (새 터미널)
cd client
cp .env.example .env      # NEXT_PUBLIC_SERVER_URL=http://localhost:4000
npm install
npm run dev
```
 


