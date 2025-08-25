// 암호화 관련 상수
export const CRYPTO_CONSTANTS = {
  // PBKDF2 설정
  PBKDF2_ITERATIONS: 100000,
  PBKDF2_KEY_LENGTH: 32,
  PBKDF2_DIGEST: 'sha256',
  
  // AES 설정
  AES_KEY_LENGTH: 32,
  AES_IV_LENGTH: 16,
  AES_ALGORITHM: 'aes-256-cbc',
  
  // 해시 설정
  HASH_ALGORITHM: 'sha256',
  HASH_ENCODING: 'hex',
} as const;

// 지갑 관련 상수
export const WALLET_CONSTANTS = {
  // 주소 형식
  ADDRESS_LENGTH: 42, // 0x + 40 hex chars
  ADDRESS_PREFIX: '0x',
  
  // 개인키 형식
  PRIVATE_KEY_LENGTH: 64, // 32 bytes in hex
  PRIVATE_KEY_PREFIX: '0x',
  
  // 공개키 형식
  PUBLIC_KEY_LENGTH: 130, // 65 bytes in hex (uncompressed)
  PUBLIC_KEY_PREFIX: '0x',
  
  // 니모닉 설정
  MNEMONIC_LENGTHS: [12, 15, 18, 21, 24] as const,
  DEFAULT_MNEMONIC_LENGTH: 24,
  
  // HD 지갑 설정
  HD_PATH: "m/44'/60'/0'/0/",
  HD_DERIVATION_INDEX: 0,
} as const;

// 트랜잭션 관련 상수
export const TRANSACTION_CONSTANTS = {
  // 가스 설정
  DEFAULT_GAS_LIMIT: '21000',
  MAX_GAS_LIMIT: '30000000',
  MIN_GAS_PRICE: '1000000000', // 1 Gwei
  
  // 가스비 설정
  DEFAULT_MAX_PRIORITY_FEE: '1500000000', // 1.5 Gwei
  DEFAULT_MAX_FEE: '20000000000', // 20 Gwei
  
  // 확인 수 설정
  DEFAULT_CONFIRMATIONS: 1,
  MAX_CONFIRMATIONS: 12,
  
  // 타임아웃 설정
  DEFAULT_TIMEOUT: 30000, // 30 seconds
  MAX_TIMEOUT: 300000, // 5 minutes
} as const;

// 네트워크 관련 상수
export const NETWORK_CONSTANTS = {
  // 블록 확인 간격
  BLOCK_CONFIRMATION_INTERVAL: 12000, // 12 seconds
  
  // RPC 요청 재시도
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  
  // 연결 타임아웃
  CONNECTION_TIMEOUT: 10000, // 10 seconds
  REQUEST_TIMEOUT: 30000, // 30 seconds
} as const;

// 보안 관련 상수
export const SECURITY_CONSTANTS = {
  // 비밀번호 최소 길이
  MIN_PASSWORD_LENGTH: 8,
  
  // 입력값 최대 길이
  MAX_ADDRESS_LENGTH: 50,
  MAX_AMOUNT_LENGTH: 100,
  MAX_MNEMONIC_LENGTH: 200,
  
  // 세션 타임아웃
  SESSION_TIMEOUT: 1800000, // 30 minutes
  
  // 최대 로그인 시도
  MAX_LOGIN_ATTEMPTS: 5,
  LOGIN_LOCKOUT_TIME: 900000, // 15 minutes
} as const;

// 파일 관련 상수
export const FILE_CONSTANTS = {
  // 백업 파일 확장자
  BACKUP_FILE_EXTENSION: '.wallet',
  
  // 설정 파일명
  CONFIG_FILE_NAME: 'wallet.config.json',
  
  // 로그 파일명
  LOG_FILE_NAME: 'wallet.log',
  
  // 최대 파일 크기 (10MB)
  MAX_FILE_SIZE: 10 * 1024 * 1024,
} as const;

// 에러 메시지
export const ERROR_MESSAGES = {
  INVALID_ADDRESS: '유효하지 않은 Ethereum 주소입니다.',
  INVALID_PRIVATE_KEY: '유효하지 않은 개인키입니다.',
  INVALID_MNEMONIC: '유효하지 않은 니모닉입니다.',
  INSUFFICIENT_BALANCE: '잔액이 부족합니다.',
  INVALID_AMOUNT: '유효하지 않은 금액입니다.',
  NETWORK_ERROR: '네트워크 연결 오류가 발생했습니다.',
  TRANSACTION_FAILED: '트랜잭션이 실패했습니다.',
  INVALID_PASSWORD: '비밀번호가 올바르지 않습니다.',
  WALLET_NOT_FOUND: '지갑을 찾을 수 없습니다.',
  ENCRYPTION_FAILED: '암호화에 실패했습니다.',
} as const;

// 성공 메시지
export const SUCCESS_MESSAGES = {
  WALLET_CREATED: '지갑이 성공적으로 생성되었습니다.',
  WALLET_IMPORTED: '지갑이 성공적으로 가져와졌습니다.',
  TRANSACTION_SENT: '트랜잭션이 성공적으로 전송되었습니다.',
  BALANCE_UPDATED: '잔액이 업데이트되었습니다.',
  WALLET_BACKED_UP: '지갑이 성공적으로 백업되었습니다.',
  WALLET_RESTORED: '지갑이 성공적으로 복구되었습니다.',
} as const;

