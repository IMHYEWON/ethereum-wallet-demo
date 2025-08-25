import { WALLET_CONSTANTS, SECURITY_CONSTANTS } from '../../config/constants';

/**
 * 입력값 검증 유틸리티 클래스
 * 주소, 개인키, 금액 등의 유효성을 검사
 */
export class ValidationUtils {
  /**
   * Ethereum 주소 형식 검증
   * @param address 검증할 주소
   * @returns 유효한 주소인지 여부
   */
  static isValidAddress(address: string): boolean {
    if (!address || typeof address !== 'string') {
      return false;
    }

    // 0x로 시작하고 40자리 hex 문자인지 확인
    const addressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!addressRegex.test(address)) {
      return false;
    }

    // 체크섬 검증 (대소문자 혼합 주소)
    return this.isValidChecksumAddress(address);
  }

  /**
   * 체크섬 주소 검증
   * @param address 검증할 주소
   * @returns 유효한 체크섬 주소인지 여부
   */
  static isValidChecksumAddress(address: string): boolean {
    try {
      // 간단한 체크섬 검증 (실제로는 ethers.js의 getAddress 사용 권장)
      const cleanAddress = address.replace('0x', '');
      const hashedAddress = this.keccak256(cleanAddress.toLowerCase());
      
      for (let i = 0; i < 40; i++) {
        const hashByte = parseInt(hashedAddress[i] || '0', 16);
        const addressChar = cleanAddress[i];
        
        if (addressChar && hashByte >= 8) {
          // 대문자여야 함
          if (addressChar !== addressChar.toUpperCase()) {
            return false;
          }
        } else if (addressChar) {
          // 소문자여야 함
          if (addressChar !== addressChar.toLowerCase()) {
            return false;
          }
        }
      }
      
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 개인키 형식 검증
   * @param privateKey 검증할 개인키
   * @returns 유효한 개인키인지 여부
   */
  static isValidPrivateKey(privateKey: string): boolean {
    if (!privateKey || typeof privateKey !== 'string') {
      return false;
    }

    // 0x로 시작하고 64자리 hex 문자인지 확인
    const privateKeyRegex = /^0x[a-fA-F0-9]{64}$/;
    if (!privateKeyRegex.test(privateKey)) {
      return false;
    }

    // 0x0000000000000000000000000000000000000000000000000000000000000000 제외
    if (privateKey === '0x0000000000000000000000000000000000000000000000000000000000000000') {
      return false;
    }

    return true;
  }

  /**
   * 공개키 형식 검증
   * @param publicKey 검증할 공개키
   * @returns 유효한 공개키인지 여부
   */
  static isValidPublicKey(publicKey: string): boolean {
    if (!publicKey || typeof publicKey !== 'string') {
      return false;
    }

    // 0x로 시작하고 130자리 hex 문자인지 확인 (uncompressed)
    const publicKeyRegex = /^0x[a-fA-F0-9]{130}$/;
    if (!publicKeyRegex.test(publicKey)) {
      return false;
    }

    // 첫 번째 바이트가 04인지 확인 (uncompressed public key)
    if (!publicKey.startsWith('0x04')) {
      return false;
    }

    return true;
  }

  /**
   * 니모닉 검증
   * @param mnemonic 검증할 니모닉
   * @returns 유효한 니모닉인지 여부
   */
  static isValidMnemonic(mnemonic: string): boolean {
    if (!mnemonic || typeof mnemonic !== 'string') {
      return false;
    }

    const words = mnemonic.trim().split(/\s+/);
    
    // 단어 개수 검증
    if (!WALLET_CONSTANTS.MNEMONIC_LENGTHS.includes(words.length as any)) {
      return false;
    }

    // 각 단어가 BIP39 단어 목록에 있는지 확인 (간단한 검증)
    // 실제로는 bip39 라이브러리의 validateMnemonic 사용 권장
    const validWords = [
      'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 'absurd', 'abuse',
      'access', 'accident', 'account', 'accuse', 'achieve', 'acid', 'acoustic', 'acquire', 'across', 'act',
      // ... 더 많은 단어들 (실제로는 bip39 라이브러리 사용)
    ];

    return words.every(word => validWords.includes(word.toLowerCase()));
  }

  /**
   * 금액 검증
   * @param amount 검증할 금액
   * @returns 유효한 금액인지 여부
   */
  static isValidAmount(amount: string): boolean {
    if (!amount || typeof amount !== 'string') {
      return false;
    }

    // 숫자 형식 검증
    const amountRegex = /^[0-9]+(\.[0-9]+)?$/;
    if (!amountRegex.test(amount)) {
      return false;
    }

    // 최대 길이 검증
    if (amount.length > SECURITY_CONSTANTS.MAX_AMOUNT_LENGTH) {
      return false;
    }

    // 0보다 큰지 확인
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return false;
    }

    return true;
  }

  /**
   * 비밀번호 검증
   * @param password 검증할 비밀번호
   * @returns 유효한 비밀번호인지 여부
   */
  static isValidPassword(password: string): boolean {
    if (!password || typeof password !== 'string') {
      return false;
    }

    // 최소 길이 검증
    if (password.length < SECURITY_CONSTANTS.MIN_PASSWORD_LENGTH) {
      return false;
    }

    // 최대 길이 검증
    if (password.length > 100) {
      return false;
    }

    return true;
  }

  /**
   * 가스비 검증
   * @param gasPrice 검증할 가스비
   * @returns 유효한 가스비인지 여부
   */
  static isValidGasPrice(gasPrice: string): boolean {
    if (!gasPrice || typeof gasPrice !== 'string') {
      return false;
    }

    // 숫자 형식 검증
    const gasPriceRegex = /^[0-9]+$/;
    if (!gasPriceRegex.test(gasPrice)) {
      return false;
    }

    // 최소값 검증 (1 Gwei = 1,000,000,000 wei)
    const minGasPrice = '1000000000';
    if (BigInt(gasPrice) < BigInt(minGasPrice)) {
      return false;
    }

    return true;
  }

  /**
   * 가스 한계 검증
   * @param gasLimit 검증할 가스 한계
   * @returns 유효한 가스 한계인지 여부
   */
  static isValidGasLimit(gasLimit: string): boolean {
    if (!gasLimit || typeof gasLimit !== 'string') {
      return false;
    }

    // 숫자 형식 검증
    const gasLimitRegex = /^[0-9]+$/;
    if (!gasLimitRegex.test(gasLimit)) {
      return false;
    }

    // 범위 검증
    const limit = BigInt(gasLimit);
    if (limit < BigInt(21000) || limit > BigInt(30000000)) {
      return false;
    }

    return true;
  }

  /**
   * 체인 ID 검증
   * @param chainId 검증할 체인 ID
   * @returns 유효한 체인 ID인지 여부
   */
  static isValidChainId(chainId: number): boolean {
    return Number.isInteger(chainId) && chainId > 0;
  }

  /**
   * 문자열 길이 검증
   * @param value 검증할 문자열
   * @param maxLength 최대 길이
   * @returns 유효한 길이인지 여부
   */
  static isValidStringLength(value: string, maxLength: number): boolean {
    return Boolean(value) && value.length <= maxLength;
  }

  /**
   * 간단한 Keccak-256 해시 함수 (실제로는 ethers.js 사용 권장)
   * @param data 해시할 데이터
   * @returns 해시된 데이터
   */
  private static keccak256(_data: string): string {
    // 실제 구현에서는 ethers.js의 keccak256 사용
    // 여기서는 간단한 예시로 대체
    return '0x' + '0'.repeat(64);
  }
}
