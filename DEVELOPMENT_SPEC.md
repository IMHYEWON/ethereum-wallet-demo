# Ethereum Wallet Demo System - Development Specification

## 프로젝트 개요
Ethereum 및 ERC-20 토큰을 지원하는 단순한 지갑 데모 시스템을 TypeScript로 개발합니다. 
CLI 인터페이스와 함께 Next.js 기반의 웹 인터페이스를 제공하여 사용자 친화적인 경험을 제공합니다.
Vercel을 통한 배포로 실제 사용자들이 접근할 수 있는 온라인 지갑 서비스로 발전시킵니다.

## 기술 스택

### 백엔드
- **언어**: TypeScript 5.x
- **런타임**: Node.js v23.6.0
- **패키지 매니저**: npm
- **암호화 라이브러리**: ethers.js v6.x, crypto-js, bip39, hdkey
- **개발 도구**: TypeScript Compiler, ESLint, Prettier
- **테스트**: Jest
- **빌드 도구**: ts-node, nodemon (개발용)

### 프론트엔드 (Phase 5)
- **프레임워크**: Next.js 14+ (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **상태 관리**: Zustand 또는 React Context
- **UI 컴포넌트**: shadcn/ui 또는 Radix UI
- **암호화**: Web Crypto API

### 배포 및 운영 (Phase 6)
- **호스팅**: Vercel
- **도메인**: 커스텀 도메인 지원
- **SSL**: 자동 SSL 인증서
- **CDN**: 글로벌 CDN 자동 설정

## 핵심 기능 요구사항

### 1. 지갑 생성 및 관리
- [x] 새로운 Ethereum 주소 생성 (개인키/공개키 쌍)
- [x] 기존 지갑 가져오기 (개인키 또는 니모닉)
- [x] 지갑 정보 조회 (주소, 잔액, 트랜잭션 히스토리)
- [x] 지갑 백업 및 복구

### 2. 트랜잭션 처리
- [x] ETH 전송 트랜잭션 생성
- [x] ERC-20 토큰 전송 트랜잭션 생성
- [x] 트랜잭션 사이닝 (개인키로 서명)
- [x] 트랜잭션 브로드캐스트 (네트워크 전송)
- [x] 가스비 추정 및 설정

### 3. 네트워크 지원
- [x] Ethereum 메인넷 (Infura/Alchemy API)
- [x] Sepolia 테스트넷
- [x] 로컬 개발 네트워크 (Hardhat/Ganache)

### 4. 보안 기능
- [x] 개인키 암호화 저장
- [x] 트랜잭션 서명 검증
- [x] 입력값 검증 및 sanitization

## 프로젝트 구조

```
ethereum-wallet-demo/
├── src/
│   ├── core/                  # 백엔드 핵심 로직
│   │   ├── wallet.ts          # 지갑 핵심 로직
│   │   ├── transaction.ts     # 트랜잭션 처리
│   │   └── crypto.ts          # 암호화 유틸리티
│   ├── services/              # 백엔드 서비스
│   │   ├── ethereum.ts        # Ethereum 네트워크 연결
│   │   ├── storage.ts         # 로컬 저장소 관리
│   │   └── api.ts             # 외부 API 연동
│   ├── types/                 # 공통 타입 정의
│   │   ├── wallet.types.ts    # 지갑 관련 타입 정의
│   │   └── transaction.types.ts # 트랜잭션 관련 타입 정의
│   ├── utils/                 # 백엔드 유틸리티
│   │   ├── validation.ts      # 입력값 검증
│   │   └── helpers.ts         # 헬퍼 함수
│   ├── cli/                   # CLI 인터페이스
│   │   └── wallet-cli.ts      # 지갑 CLI
│   └── web/                   # 웹 인터페이스 (Phase 5)
│       ├── app/               # Next.js App Router
│       │   ├── page.tsx       # 메인 페이지
│       │   ├── wallet/        # 지갑 관련 페이지
│       │   ├── transaction/   # 트랜잭션 관련 페이지
│       │   └── layout.tsx     # 레이아웃
│       ├── components/        # React 컴포넌트
│       │   ├── ui/            # 기본 UI 컴포넌트
│       │   ├── wallet/        # 지갑 관련 컴포넌트
│       │   └── transaction/   # 트랜잭션 관련 컴포넌트
│       ├── lib/               # 웹 전용 유틸리티
│       │   ├── wallet-web.ts  # 웹용 지갑 로직
│       │   └── storage-web.ts # 웹용 저장소
│       └── styles/            # 스타일 파일
├── wallets/                   # 지갑 저장소 (Phase 4)
│   ├── wallet-1.json         # 지갑 1 정보
│   ├── wallet-2.json         # 지갑 2 정보
│   └── index.json            # 지갑 목록 인덱스
├── tests/                     # 테스트
│   ├── unit/                  # 단위 테스트
│   ├── integration/           # 통합 테스트
│   └── fixtures/              # 테스트 데이터
├── config/                    # 설정 파일
│   ├── networks.ts            # 네트워크 설정
│   └── constants.ts           # 상수 정의
├── docs/                      # 문서
├── scripts/                   # 빌드 및 배포 스크립트
├── package.json
├── tsconfig.json
├── .eslintrc.js
├── .prettierrc
├── next.config.js             # Next.js 설정 (Phase 5)
├── tailwind.config.js         # Tailwind CSS 설정 (Phase 5)
└── README.md
```

## 개발 단계별 계획

### Phase 1: 프로젝트 설정 및 기본 구조 ✅
- [x] 프로젝트 디렉토리 생성
- [x] Git 저장소 초기화
- [x] package.json 생성 및 의존성 설치
- [x] TypeScript 설정
- [x] ESLint, Prettier 설정
- [x] 기본 프로젝트 구조 생성

**완료일**: 2025년 8월 26일  
**상태**: 모든 기본 설정 및 프로젝트 구조 완성

### Phase 2: 핵심 지갑 기능 구현 ✅
**완료일**: 2025년 8월 26일
**상태**: 핵심 지갑 기능 및 보안 유틸리티 완성
- [x] 지갑 생성 및 관리 클래스 구현
  - `Wallet` 클래스: 생성, 가져오기, 백업, 복구, 정보 조회
  - ethers.js v6 연동으로 안전한 지갑 생성
  - 메모리 기반 지갑 관리 (보안 강화)
  - **지갑 생성 시 비밀번호 설정으로 백업/복구 보안 강화**
- [x] 개인키/공개키 생성 로직
  - 암호학적으로 안전한 랜덤 생성
  - 공개키/개인키 쌍 자동 생성
  - HD 지갑 지원 준비
- [x] 지갑 가져오기 기능
  - 개인키 기반 지갑 가져오기
  - 니모닉 기반 지갑 가져오기
  - **BIP39 라이브러리 기반 정확한 니모닉 검증**
  - 입력값 검증 및 에러 처리
- [x] 기본 암호화 기능
  - `CryptoUtils` 클래스: PBKDF2, AES-256-CBC
  - **Node.js v23 호환성 (createCipheriv 사용)**
  - 개인키 암호화/복호화 (비밀번호 기반)
  - 안전한 백업 및 복구 시스템
- [x] 입력값 검증 유틸리티 구현
  - `ValidationUtils` 클래스: 주소, 개인키, 니모닉 검증
  - **ethers.js 기반 정확한 주소 및 개인키 검증**
  - 금액, 가스비, 비밀번호 유효성 검사
- [x] **CLI 테스트 인터페이스 구현**
  - **확장 가능한 통합 CLI 구조**
  - **Phase별 기능 테스트 메뉴**
  - **실시간 지갑 기능 테스트**

### Phase 3: 트랜잭션 처리 구현 ✅ 완료
- [x] 트랜잭션 생성 로직
- [x] 트랜잭션 서명 기능
- [x] 가스비 계산 및 설정 (모의 모드)
- [x] 트랜잭션 전송 기능 (시뮬레이션)

### Phase 4: 네트워크 연동 및 지갑 영구 저장
- [ ] Ethereum 네트워크 연결 (Sepolia 테스트넷)
- [ ] Infura/Alchemy API 연동
- [ ] 잔액 조회 및 트랜잭션 모니터링
- [ ] 지갑 및 개인키 영구 저장 시스템
- [ ] 암호화된 지갑 파일 관리
- [ ] 실제 트랜잭션 전송 및 모니터링

### Phase 5: 웹 인터페이스 구현 (Next.js)
- [ ] Next.js 프로젝트 설정 및 구조
- [ ] 지갑 생성/가져오기 웹 인터페이스
- [ ] 트랜잭션 처리 웹 인터페이스
- [ ] 반응형 디자인 및 사용자 경험 최적화
- [ ] 지갑 영구 저장 및 관리
- [ ] 보안 강화 (비밀번호 관리, 세션 관리)
- [ ] Web3 지갑 연동 (MetaMask 등)
- [ ] 실시간 잔액 및 트랜잭션 상태 표시

## Phase 6: 배포 및 운영 (Vercel)
- [ ] Vercel 배포 설정
- [ ] 환경변수 및 보안 설정
- [ ] 도메인 설정 및 SSL 인증서
- [ ] 모니터링 및 로그 관리
- [ ] 성능 최적화
- [ ] CI/CD 파이프라인 구축
- [ ] 백업 및 복구 전략

## Phase 7: CLI 인터페이스 및 테스트
- [ ] 명령줄 인터페이스 구현
- [ ] 단위 테스트 작성
- [ ] 통합 테스트 작성
- [ ] 사용자 가이드 작성

## 의존성 패키지

### 핵심 의존성
```json
{
  "ethers": "^6.8.1",
  "crypto-js": "^4.2.0",
  "bip39": "^3.1.0",
  "hdkey": "^2.1.0"
}
```

### 프론트엔드 의존성 (Phase 5)
```json
{
  "next": "^14.0.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "tailwindcss": "^3.3.0",
  "zustand": "^4.4.0",
  "@radix-ui/react-dialog": "^1.0.0",
  "@radix-ui/react-dropdown-menu": "^2.0.0",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.0.0",
  "tailwind-merge": "^2.0.0"
}
```

### 개발 의존성
```json
{
  "typescript": "^5.2.2",
  "@types/node": "^20.8.0",
  "@typescript-eslint/eslint-plugin": "^6.8.0",
  "@typescript-eslint/parser": "^6.8.0",
  "eslint": "^8.50.0",
  "prettier": "^3.0.3",
  "jest": "^29.6.4",
  "@types/jest": "^29.5.5",
  "ts-jest": "^29.1.1",
  "nodemon": "^3.0.1",
  "ts-node": "^10.9.1"
}
```

## 보안 고려사항

### 개인키 보안
- 개인키는 메모리에만 임시 저장
- 파일 시스템에 저장 시 암호화
- 환경변수나 설정 파일에 평문으로 저장 금지

### 트랜잭션 보안
- 모든 트랜잭션 서명 검증
- 가스비 한계 설정
- 트랜잭션 재사용 공격 방지

### 입력값 검증
- 주소 형식 검증
- 금액 범위 검증
- 가스비 상한선 설정

## 테스트 전략

### 단위 테스트
- 지갑 생성 및 관리 기능
- 트랜잭션 생성 및 서명
- 암호화 유틸리티 함수

### 통합 테스트
- 네트워크 연결 및 API 호출
- 전체 트랜잭션 플로우
- 에러 처리 및 복구

### 테스트 네트워크
- Sepolia 테스트넷 사용
- 테스트용 ETH 및 토큰 사용
- 실제 비용 발생 없음

## 성능 요구사항

### 응답 시간
- 지갑 생성: < 1초
- 잔액 조회: < 3초
- 트랜잭션 전송: < 5초

### 동시성
- 여러 지갑 동시 관리 지원
- 트랜잭션 큐 처리

## 배포 및 배포

### 개발 환경
- 로컬 개발 서버
- Hot reload 지원
- 디버깅 도구 연동

### 프로덕션 환경
- TypeScript 컴파일
- 코드 최적화
- 에러 로깅 및 모니터링

## 문서화

### 개발자 문서
- API 레퍼런스
- 아키텍처 가이드
- 개발 가이드

### 사용자 문서
- 설치 가이드
- 사용법 튜토리얼
- FAQ 및 트러블슈팅

## 라이선스
MIT License

## 기여 가이드
- 코드 리뷰 필수
- 테스트 커버리지 80% 이상 유지
- ESLint 규칙 준수
- 커밋 메시지 컨벤션 준수

