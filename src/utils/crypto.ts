import * as crypto from 'crypto';
import { CRYPTO_CONSTANTS } from '../../config/constants';

/**
 * 암호화 유틸리티 클래스
 * 개인키 암호화, 비밀번호 해싱, 키 생성 등을 담당
 */
export class CryptoUtils {
  /**
   * PBKDF2를 사용하여 비밀번호로부터 키 생성
   * @param password 사용자 비밀번호
   * @param salt 솔트 값
   * @returns 생성된 키 (32바이트)
   */
  static deriveKeyFromPassword(password: string, salt: Buffer): Buffer {
    return crypto.pbkdf2Sync(
      password,
      salt,
      CRYPTO_CONSTANTS.PBKDF2_ITERATIONS,
      CRYPTO_CONSTANTS.PBKDF2_KEY_LENGTH,
      CRYPTO_CONSTANTS.PBKDF2_DIGEST
    );
  }

  /**
   * 랜덤 솔트 생성
   * @returns 32바이트 랜덤 솔트
   */
  static generateSalt(): Buffer {
    return crypto.randomBytes(32);
  }

  /**
   * 랜덤 IV(Initialization Vector) 생성
   * @returns 16바이트 랜덤 IV
   */
  static generateIV(): Buffer {
    return crypto.randomBytes(CRYPTO_CONSTANTS.AES_IV_LENGTH);
  }

  /**
   * AES-256-GCM을 사용하여 데이터 암호화
   * @param data 암호화할 데이터
   * @param key 암호화 키 (32바이트)
   * @param iv 초기화 벡터 (16바이트)
   * @returns 암호화된 데이터와 인증 태그
   */
  static encryptAES(data: Buffer, key: Buffer, iv: Buffer): {
    encryptedData: Buffer;
    authTag: Buffer;
  } {
    const cipher = crypto.createCipherGCM(
      CRYPTO_CONSTANTS.AES_ALGORITHM,
      key,
      iv
    );
    
    let encryptedData = cipher.update(data);
    encryptedData = Buffer.concat([encryptedData, cipher.final()]);
    
    return {
      encryptedData,
      authTag: cipher.getAuthTag(),
    };
  }

  /**
   * AES-256-GCM을 사용하여 데이터 복호화
   * @param encryptedData 암호화된 데이터
   * @param key 복호화 키 (32바이트)
   * @param iv 초기화 벡터 (16바이트)
   * @param authTag 인증 태그
   * @returns 복호화된 데이터
   */
  static decryptAES(
    encryptedData: Buffer,
    key: Buffer,
    iv: Buffer,
    authTag: Buffer
  ): Buffer {
    const decipher = crypto.createDecipherGCM(
      CRYPTO_CONSTANTS.AES_ALGORITHM,
      key,
      iv
    );
    
    decipher.setAuthTag(authTag);
    
    let decryptedData = decipher.update(encryptedData);
    decryptedData = Buffer.concat([decryptedData, decipher.final()]);
    
    return decryptedData;
  }

  /**
   * 개인키 암호화
   * @param privateKey 암호화할 개인키 (hex 문자열)
   * @param password 사용자 비밀번호
   * @returns 암호화된 개인키 정보
   */
  static encryptPrivateKey(privateKey: string, password: string): {
    encryptedPrivateKey: string;
    iv: string;
    salt: string;
  } {
    const salt = this.generateSalt();
    const iv = this.generateIV();
    const key = this.deriveKeyFromPassword(password, salt);
    
    const privateKeyBuffer = Buffer.from(privateKey.replace('0x', ''), 'hex');
    const { encryptedData, authTag } = this.encryptAES(privateKeyBuffer, key, iv);
    
    // 암호화된 데이터와 인증 태그를 결합
    const combinedData = Buffer.concat([encryptedData, authTag]);
    
    return {
      encryptedPrivateKey: combinedData.toString('hex'),
      iv: iv.toString('hex'),
      salt: salt.toString('hex'),
    };
  }

  /**
   * 개인키 복호화
   * @param encryptedPrivateKey 암호화된 개인키 (hex 문자열)
   * @param password 사용자 비밀번호
   * @param iv 초기화 벡터 (hex 문자열)
   * @param salt 솔트 (hex 문자열)
   * @returns 복호화된 개인키
   */
  static decryptPrivateKey(
    encryptedPrivateKey: string,
    password: string,
    iv: string,
    salt: string
  ): string {
    const key = this.deriveKeyFromPassword(
      password,
      Buffer.from(salt, 'hex')
    );
    
    const ivBuffer = Buffer.from(iv, 'hex');
    const encryptedData = Buffer.from(encryptedPrivateKey, 'hex');
    
    // 인증 태그는 마지막 16바이트
    const authTag = encryptedData.slice(-16);
    const data = encryptedData.slice(0, -16);
    
    const decryptedData = this.decryptAES(data, key, ivBuffer, authTag);
    
    return '0x' + decryptedData.toString('hex');
  }

  /**
   * SHA-256 해시 생성
   * @param data 해시할 데이터
   * @returns 해시된 데이터 (hex 문자열)
   */
  static sha256(data: string | Buffer): string {
    const hash = crypto.createHash(CRYPTO_CONSTANTS.HASH_ALGORITHM);
    hash.update(data);
    return hash.digest(CRYPTO_CONSTANTS.HASH_ENCODING);
  }

  /**
   * HMAC-SHA256 생성
   * @param data 서명할 데이터
   * @param key 서명 키
   * @returns HMAC 값 (hex 문자열)
   */
  static hmacSha256(data: string | Buffer, key: string | Buffer): string {
    const hmac = crypto.createHmac(CRYPTO_CONSTANTS.HASH_ALGORITHM, key);
    hmac.update(data);
    return hmac.digest(CRYPTO_CONSTANTS.HASH_ENCODING);
  }

  /**
   * 랜덤 바이트 생성
   * @param length 생성할 바이트 길이
   * @returns 랜덤 바이트
   */
  static randomBytes(length: number): Buffer {
    return crypto.randomBytes(length);
  }

  /**
   * 안전한 랜덤 정수 생성
   * @param min 최소값 (포함)
   * @param max 최대값 (포함)
   * @returns 랜덤 정수
   */
  static randomInt(min: number, max: number): number {
    return crypto.randomInt(min, max + 1);
  }
}
