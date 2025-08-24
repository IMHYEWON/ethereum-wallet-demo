# Ethereum Wallet Demo System

Ethereum 및 ERC-20 토큰을 지원하는 단순한 지갑 데모 시스템입니다.

## 🚀 주요 기능

- 🔐 새로운 Ethereum 지갑 생성
- 💰 ETH 및 ERC-20 토큰 전송
- 🔑 개인키/공개키 관리
- 📝 트랜잭션 생성 및 서명
- 🌐 Sepolia 테스트넷 지원
- 🛡️ 보안 기능 (암호화 저장, 입력값 검증)

## 🛠️ 기술 스택

- **TypeScript 5.x** - 타입 안전성과 현대적인 JavaScript
- **Node.js v23.6.0** - 런타임 환경
- **ethers.js v6.x** - Ethereum 라이브러리
- **Jest** - 테스트 프레임워크
- **ESLint + Prettier** - 코드 품질 및 포맷팅

## 📋 요구사항

- Node.js v23.6.0 이상
- npm 또는 yarn 패키지 매니저

## 🚀 빠른 시작

### 1. 저장소 클론
```bash
git clone <repository-url>
cd ethereum-wallet-demo
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 개발 서버 실행
```bash
npm run dev
```

### 4. 테스트 실행
```bash
npm test
```

## 📁 프로젝트 구조

```
src/
├── core/           # 핵심 지갑 로직
├── services/       # 외부 서비스 연동
├── types/          # TypeScript 타입 정의
├── utils/          # 유틸리티 함수
└── cli/            # 명령줄 인터페이스
```

## 🔧 사용법

### 지갑 생성
```typescript
import { Wallet } from './src/core/wallet';

const wallet = new Wallet();
const newWallet = wallet.create();
console.log('새 지갑 주소:', newWallet.address);
```

### 트랜잭션 전송
```typescript
import { TransactionService } from './src/services/transaction';

const txService = new TransactionService();
const tx = await txService.sendETH(
  fromAddress,
  toAddress,
  amount,
  privateKey
);
console.log('트랜잭션 해시:', tx.hash);
```

## 🧪 테스트

```bash
# 전체 테스트 실행
npm test

# 단위 테스트만 실행
npm run test:unit

# 통합 테스트만 실행
npm run test:integration

# 테스트 커버리지 확인
npm run test:coverage
```

## 📚 문서

- [개발 명세서](./DEVELOPMENT_SPEC.md)
- [API 레퍼런스](./docs/api.md)
- [사용자 가이드](./docs/user-guide.md)

## 🔒 보안

- 개인키는 암호화되어 저장됩니다
- 모든 입력값은 검증됩니다
- 테스트넷 사용을 권장합니다

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## ⚠️ 면책 조항

이 프로젝트는 교육 및 데모 목적으로만 사용되어야 합니다. 실제 자금을 사용하여 테스트하지 마세요. 개발자는 이 소프트웨어 사용으로 인한 손실에 대해 책임지지 않습니다.

## 📞 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 이슈를 생성해 주세요.

---

**Happy Coding! 🎉**
