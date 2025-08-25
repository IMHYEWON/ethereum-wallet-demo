import { ethers } from 'ethers';
import { CryptoUtils } from '../utils/crypto';
import { ValidationUtils } from '../utils/validation';
import { 
  WalletInfo, 
  WalletBackup, 
  WalletImportOptions, 
  WalletCreateOptions
} from '../types/wallet.types';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../config/constants';

/**
 * Ethereum 지갑 핵심 클래스
 * 지갑 생성, 가져오기, 백업, 복구 등의 기능을 제공
 */
export class Wallet {
  private walletInfo: WalletInfo | null = null;
  private provider: ethers.Provider | null = null;

  constructor() {}

  /**
   * 새로운 지갑 생성
   * @param options 지갑 생성 옵션
   * @returns 생성된 지갑 정보
   */
  create(options: WalletCreateOptions = {}): WalletInfo {
    try {
      // 기본 옵션 설정
      const defaultOptions: WalletCreateOptions = {
        generateMnemonic: true,
        mnemonicLength: 24,
        ...options
      };

      // 새로운 지갑 생성
      const ethersWallet = ethers.Wallet.createRandom();
      
      // 비밀번호 해시 생성 (있는 경우)
      let passwordHash: string | undefined;
      if (defaultOptions.password) {
        passwordHash = CryptoUtils.sha256(defaultOptions.password);
      }

      // 지갑 정보 구성
      this.walletInfo = {
        address: ethersWallet.address,
        privateKey: ethersWallet.privateKey,
        publicKey: ethersWallet.publicKey,
        mnemonic: defaultOptions.generateMnemonic ? ethersWallet.mnemonic?.phrase : undefined,
        balance: '0',
        nonce: 0,
        ...(passwordHash && { passwordHash })
      };

      console.log(SUCCESS_MESSAGES.WALLET_CREATED);
      return this.walletInfo;
    } catch (error) {
      throw new Error(`지갑 생성 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  }

  /**
   * 기존 지갑 가져오기
   * @param options 가져오기 옵션
   * @returns 가져온 지갑 정보
   */
  import(options: WalletImportOptions): WalletInfo {
    try {
      if (!options.privateKey && !options.mnemonic) {
        throw new Error('개인키 또는 니모닉이 필요합니다.');
      }

      let ethersWallet: ethers.Wallet | ethers.HDNodeWallet;

      if (options.privateKey) {
        // 개인키로 가져오기
        if (!ValidationUtils.isValidPrivateKey(options.privateKey)) {
          throw new Error(ERROR_MESSAGES.INVALID_PRIVATE_KEY);
        }
        ethersWallet = new ethers.Wallet(options.privateKey);
      } else if (options.mnemonic) {
        // 니모닉으로 가져오기
        if (!ValidationUtils.isValidMnemonic(options.mnemonic)) {
          throw new Error(ERROR_MESSAGES.INVALID_MNEMONIC);
        }
        ethersWallet = ethers.Wallet.fromPhrase(options.mnemonic);
      } else {
        throw new Error('지원되지 않는 가져오기 방식입니다.');
      }

      // 지갑 정보 구성
      this.walletInfo = {
        address: ethersWallet.address,
        privateKey: ethersWallet.privateKey,
        publicKey: (ethersWallet as any).publicKey || '',
        mnemonic: options.mnemonic,
        balance: '0',
        nonce: 0
      };

      console.log(SUCCESS_MESSAGES.WALLET_IMPORTED);
      return this.walletInfo;
    } catch (error) {
      throw new Error(`지갑 가져오기 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  }

  /**
   * 지갑 백업 (암호화된 형태로)
   * @param password 백업 비밀번호
   * @returns 백업 정보
   */
  backup(password: string): WalletBackup {
    if (!this.walletInfo) {
      throw new Error(ERROR_MESSAGES.WALLET_NOT_FOUND);
    }

    if (!ValidationUtils.isValidPassword(password)) {
      throw new Error(ERROR_MESSAGES.INVALID_PASSWORD);
    }

    // 저장된 비밀번호와 일치하는지 확인
    if (this.walletInfo.passwordHash) {
      const inputPasswordHash = CryptoUtils.sha256(password);
      if (inputPasswordHash !== this.walletInfo.passwordHash) {
        throw new Error('지갑 생성 시 설정한 비밀번호와 일치하지 않습니다.');
      }
    }

    try {
      // 개인키 암호화
      const { encryptedPrivateKey, iv, salt } = CryptoUtils.encryptPrivateKey(
        this.walletInfo.privateKey,
        password
      );

      const backup: WalletBackup = {
        address: this.walletInfo.address,
        encryptedPrivateKey,
        iv,
        salt,
        mnemonic: this.walletInfo.mnemonic,
        createdAt: new Date()
      };

      console.log(SUCCESS_MESSAGES.WALLET_BACKED_UP);
      return backup;
    } catch (error) {
      throw new Error(`백업 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  }

  /**
   * 지갑 복구
   * @param backup 백업 정보
   * @param password 백업 비밀번호
   * @returns 복구된 지갑 정보
   */
  restore(backup: WalletBackup, password: string): WalletInfo {
    if (!ValidationUtils.isValidPassword(password)) {
      throw new Error(ERROR_MESSAGES.INVALID_PASSWORD);
    }

    try {
      // 개인키 복호화
      const privateKey = CryptoUtils.decryptPrivateKey(
        backup.encryptedPrivateKey,
        password,
        backup.iv,
        backup.salt
      );

      // 개인키로 지갑 가져오기
      return this.import({ privateKey });
    } catch (error) {
      throw new Error(`복구 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  }

  /**
   * 지갑 정보 조회
   * @returns 현재 지갑 정보
   */
  getInfo(): WalletInfo | null {
    return this.walletInfo;
  }

  /**
   * 지갑 주소 조회
   * @returns 지갑 주소
   */
  getAddress(): string {
    if (!this.walletInfo) {
      throw new Error(ERROR_MESSAGES.WALLET_NOT_FOUND);
    }
    return this.walletInfo.address;
  }

  /**
   * 개인키 조회 (주의: 보안상 위험할 수 있음)
   * @returns 개인키
   */
  getPrivateKey(): string {
    if (!this.walletInfo) {
      throw new Error(ERROR_MESSAGES.WALLET_NOT_FOUND);
    }
    return this.walletInfo.privateKey;
  }

  /**
   * 공개키 조회
   * @returns 공개키
   */
  getPublicKey(): string {
    if (!this.walletInfo) {
      throw new Error(ERROR_MESSAGES.WALLET_NOT_FOUND);
    }
    return this.walletInfo.publicKey;
  }

  /**
   * 니모닉 조회
   * @returns 니모닉 (있는 경우)
   */
  getMnemonic(): string | undefined {
    if (!this.walletInfo) {
      throw new Error(ERROR_MESSAGES.WALLET_NOT_FOUND);
    }
    return this.walletInfo.mnemonic;
  }

  /**
   * 잔액 조회
   * @returns 잔액 (wei 단위)
   */
  async getBalance(): Promise<string> {
    if (!this.walletInfo) {
      throw new Error(ERROR_MESSAGES.WALLET_NOT_FOUND);
    }

    if (!this.provider) {
      throw new Error('프로바이더가 설정되지 않았습니다.');
    }

    try {
      const balance = await this.provider.getBalance(this.walletInfo.address);
      this.walletInfo.balance = balance.toString();
      return this.walletInfo.balance;
    } catch (error) {
      throw new Error(`잔액 조회 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  }

  /**
   * Nonce 조회
   * @returns nonce 값
   */
  async getNonce(): Promise<number> {
    if (!this.walletInfo) {
      throw new Error(ERROR_MESSAGES.WALLET_NOT_FOUND);
    }

    if (!this.provider) {
      throw new Error('프로바이더가 설정되지 않았습니다.');
    }

    try {
      const nonce = await this.provider.getTransactionCount(this.walletInfo.address);
      this.walletInfo.nonce = nonce;
      return this.walletInfo.nonce;
    } catch (error) {
      throw new Error(`Nonce 조회 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  }

  /**
   * 프로바이더 설정
   * @param provider ethers 프로바이더
   */
  setProvider(provider: ethers.Provider): void {
    this.provider = provider;
  }

  /**
   * 지갑 삭제 (메모리에서)
   */
  clear(): void {
    this.walletInfo = null;
    this.provider = null;
  }

  /**
   * 지갑 존재 여부 확인
   * @returns 지갑이 존재하는지 여부
   */
  exists(): boolean {
    return this.walletInfo !== null;
  }

  /**
   * 지갑 유효성 검증
   * @returns 지갑이 유효한지 여부
   */
  isValid(): boolean {
    if (!this.walletInfo) {
      return false;
    }

    return (
      ValidationUtils.isValidAddress(this.walletInfo.address) &&
      ValidationUtils.isValidPrivateKey(this.walletInfo.privateKey) &&
      ValidationUtils.isValidPublicKey(this.walletInfo.publicKey)
    );
  }
}
