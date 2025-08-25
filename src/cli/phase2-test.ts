#!/usr/bin/env node

import { Wallet } from '../core/wallet';
import { CryptoUtils } from '../utils/crypto';
import { ValidationUtils } from '../utils/validation';
import { WalletBackup } from '../types/wallet.types';
import * as readline from 'readline';

/**
 * Phase 2 기능 테스트 CLI
 * 지갑 생성, 가져오기, 백업, 복구 등의 기능을 테스트
 */
class Phase2TestCLI {
  private wallet: Wallet;
  private rl: readline.Interface;

  constructor() {
    this.wallet = new Wallet();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  /**
   * CLI 실행
   */
  async run(): Promise<void> {
    console.log('🚀 Phase 2: 핵심 지갑 기능 테스트 CLI');
    console.log('=====================================\n');

    while (true) {
      await this.showMenu();
      const choice = await this.getInput('선택하세요 (1-8): ');
      
      try {
        switch (choice) {
          case '1':
            await this.testCreateWallet();
            break;
          case '2':
            await this.testImportWallet();
            break;
          case '3':
            await this.testWalletInfo();
            break;
          case '4':
            await this.testBackupWallet();
            break;
          case '5':
            await this.testRestoreWallet();
            break;
          case '6':
            await this.testValidation();
            break;
          case '7':
            await this.testCrypto();
            break;
          case '8':
            console.log('👋 테스트를 종료합니다.');
            this.rl.close();
            return;
          default:
            console.log('❌ 잘못된 선택입니다. 1-8 중에서 선택해주세요.\n');
        }
      } catch (error) {
        console.log(`❌ 오류 발생: ${error instanceof Error ? error.message : '알 수 없는 오류'}\n`);
      }
    }
  }

  /**
   * 메뉴 표시
   */
  private async showMenu(): Promise<void> {
    console.log('📋 사용 가능한 테스트:');
    console.log('1. 🆕 새 지갑 생성');
    console.log('2. 📥 지갑 가져오기');
    console.log('3. ℹ️  지갑 정보 조회');
    console.log('4. 💾 지갑 백업');
    console.log('5. 🔄 지갑 복구');
    console.log('6. ✅ 입력값 검증 테스트');
    console.log('7. 🔐 암호화 기능 테스트');
    console.log('8. 🚪 종료');
    console.log('');
  }

  /**
   * 새 지갑 생성 테스트
   */
  private async testCreateWallet(): Promise<void> {
    console.log('\n🆕 새 지갑 생성 테스트');
    console.log('------------------------');

    const generateMnemonic = await this.getInput('니모닉을 생성하시겠습니까? (y/n): ') === 'y';
    
    const walletInfo = this.wallet.create({
      generateMnemonic,
      mnemonicLength: 24
    });

    console.log('✅ 지갑이 성공적으로 생성되었습니다!');
    console.log(`📍 주소: ${walletInfo.address}`);
    console.log(`🔑 공개키: ${walletInfo.publicKey.substring(0, 20)}...`);
    if (walletInfo.mnemonic) {
      console.log(`📝 니모닉: ${walletInfo.mnemonic.substring(0, 50)}...`);
    }
    console.log('');
  }

  /**
   * 지갑 가져오기 테스트
   */
  private async testImportWallet(): Promise<void> {
    console.log('\n📥 지갑 가져오기 테스트');
    console.log('------------------------');

    if (!this.wallet.exists()) {
      console.log('❌ 먼저 지갑을 생성하거나 가져와야 합니다.');
      return;
    }

    const importType = await this.getInput('가져오기 방식 선택 (1: 개인키, 2: 니모닉): ');
    
    if (importType === '1') {
      const privateKey = await this.getInput('개인키를 입력하세요 (0x로 시작): ');
      this.wallet.import({ privateKey });
      console.log('✅ 개인키로 지갑을 가져왔습니다.');
    } else if (importType === '2') {
      const mnemonic = await this.getInput('니모닉을 입력하세요: ');
      this.wallet.import({ mnemonic });
      console.log('✅ 니모닉으로 지갑을 가져왔습니다.');
    } else {
      console.log('❌ 잘못된 선택입니다.');
    }
    console.log('');
  }

  /**
   * 지갑 정보 조회 테스트
   */
  private async testWalletInfo(): Promise<void> {
    console.log('\nℹ️  지갑 정보 조회 테스트');
    console.log('------------------------');

    if (!this.wallet.exists()) {
      console.log('❌ 지갑이 존재하지 않습니다.');
      return;
    }

    const walletInfo = this.wallet.getInfo();
    if (walletInfo) {
      console.log('📋 지갑 정보:');
      console.log(`📍 주소: ${walletInfo.address}`);
      console.log(`🔑 공개키: ${walletInfo.publicKey.substring(0, 20)}...`);
      console.log(`💰 잔액: ${walletInfo.balance} wei`);
      console.log(`🔢 Nonce: ${walletInfo.nonce}`);
      if (walletInfo.mnemonic) {
        console.log(`📝 니모닉: ${walletInfo.mnemonic.substring(0, 50)}...`);
      }
      console.log(`✅ 유효성: ${this.wallet.isValid() ? '유효' : '무효'}`);
    }
    console.log('');
  }

  /**
   * 지갑 백업 테스트
   */
  private async testBackupWallet(): Promise<void> {
    console.log('\n💾 지갑 백업 테스트');
    console.log('-------------------');

    if (!this.wallet.exists()) {
      console.log('❌ 지갑이 존재하지 않습니다.');
      return;
    }

    const password = await this.getInput('백업 비밀번호를 입력하세요: ');
    
    try {
      const backup = this.wallet.backup(password);
      console.log('✅ 지갑이 성공적으로 백업되었습니다!');
      console.log(`📍 주소: ${backup.address}`);
      console.log(`🔐 암호화된 개인키: ${backup.encryptedPrivateKey.substring(0, 20)}...`);
      console.log(`🧂 Salt: ${backup.salt}`);
      console.log(`🔑 IV: ${backup.iv}`);
      console.log(`📅 생성일: ${backup.createdAt}`);
      
      // 백업 정보를 파일로 저장 (선택사항)
      const saveToFile = await this.getInput('백업 정보를 파일로 저장하시겠습니까? (y/n): ');
      if (saveToFile === 'y') {
        const fs = require('fs');
        const filename = `wallet-backup-${Date.now()}.json`;
        fs.writeFileSync(filename, JSON.stringify(backup, null, 2));
        console.log(`💾 백업 정보가 ${filename}에 저장되었습니다.`);
      }
    } catch (error) {
      console.log(`❌ 백업 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
    console.log('');
  }

  /**
   * 지갑 복구 테스트
   */
  private async testRestoreWallet(): Promise<void> {
    console.log('\n🔄 지갑 복구 테스트');
    console.log('-------------------');

    const restoreType = await this.getInput('복구 방식 선택 (1: 백업 파일, 2: 수동 입력): ');
    
    try {
      if (restoreType === '1') {
        const filename = await this.getInput('백업 파일명을 입력하세요: ');
        const fs = require('fs');
        const backupData = JSON.parse(fs.readFileSync(filename, 'utf8'));
        const password = await this.getInput('백업 비밀번호를 입력하세요: ');
        
        this.wallet.restore(backupData, password);
        console.log('✅ 지갑이 성공적으로 복구되었습니다!');
      } else if (restoreType === '2') {
        const address = await this.getInput('지갑 주소를 입력하세요: ');
        const encryptedPrivateKey = await this.getInput('암호화된 개인키를 입력하세요: ');
        const iv = await this.getInput('IV를 입력하세요: ');
        const salt = await this.getInput('Salt를 입력하세요: ');
        const password = await this.getInput('백업 비밀번호를 입력하세요: ');
        
        const backup: WalletBackup = {
          address,
          encryptedPrivateKey,
          iv,
          salt,
          createdAt: new Date()
        };
        
        this.wallet.restore(backup, password);
        console.log('✅ 지갑이 성공적으로 복구되었습니다!');
      } else {
        console.log('❌ 잘못된 선택입니다.');
      }
    } catch (error) {
      console.log(`❌ 복구 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
    console.log('');
  }

  /**
   * 입력값 검증 테스트
   */
  private async testValidation(): Promise<void> {
    console.log('\n✅ 입력값 검증 테스트');
    console.log('---------------------');

    // 주소 검증 테스트
    const testAddress = await this.getInput('테스트할 Ethereum 주소를 입력하세요: ');
    console.log(`📍 주소 유효성: ${ValidationUtils.isValidAddress(testAddress) ? '✅ 유효' : '❌ 무효'}`);

    // 개인키 검증 테스트
    const testPrivateKey = await this.getInput('테스트할 개인키를 입력하세요 (0x로 시작): ');
    console.log(`🔑 개인키 유효성: ${ValidationUtils.isValidPrivateKey(testPrivateKey) ? '✅ 유효' : '❌ 무효'}`);

    // 금액 검증 테스트
    const testAmount = await this.getInput('테스트할 금액을 입력하세요: ');
    console.log(`💰 금액 유효성: ${ValidationUtils.isValidAmount(testAmount) ? '✅ 유효' : '❌ 무효'}`);

    // 비밀번호 검증 테스트
    const testPassword = await this.getInput('테스트할 비밀번호를 입력하세요: ');
    console.log(`🔐 비밀번호 유효성: ${ValidationUtils.isValidPassword(testPassword) ? '✅ 유효' : '❌ 무효'}`);

    console.log('');
  }

  /**
   * 암호화 기능 테스트
   */
  private async testCrypto(): Promise<void> {
    console.log('\n🔐 암호화 기능 테스트');
    console.log('----------------------');

    const testData = await this.getInput('암호화할 테스트 데이터를 입력하세요: ');
    const password = await this.getInput('암호화 비밀번호를 입력하세요: ');

    try {
      // 솔트 및 IV 생성
      const salt = CryptoUtils.generateSalt();
      const iv = CryptoUtils.generateIV();
      
      console.log(`🧂 생성된 Salt: ${salt.toString('hex')}`);
      console.log(`🔑 생성된 IV: ${iv.toString('hex')}`);

      // 키 생성
      const key = CryptoUtils.deriveKeyFromPassword(password, salt);
      console.log(`🔑 생성된 키: ${key.toString('hex')}`);

      // 데이터 암호화
      const dataBuffer = Buffer.from(testData, 'utf8');
      const { encryptedData, authTag } = CryptoUtils.encryptAES(dataBuffer, key, iv);
      console.log(`🔐 암호화된 데이터: ${encryptedData.toString('hex')}`);
      console.log(`🏷️  인증 태그: ${authTag.toString('hex')}`);

      // 데이터 복호화
      const decryptedData = CryptoUtils.decryptAES(encryptedData, key, iv, authTag);
      const decryptedText = decryptedData.toString('utf8');
      console.log(`🔓 복호화된 데이터: ${decryptedText}`);
      console.log(`✅ 복호화 성공: ${testData === decryptedText ? '예' : '아니오'}`);

      // 해시 테스트
      const hash = CryptoUtils.sha256(testData);
      console.log(`🔍 SHA-256 해시: ${hash}`);

    } catch (error) {
      console.log(`❌ 암호화 테스트 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
    console.log('');
  }

  /**
   * 사용자 입력 받기
   */
  private getInput(prompt: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(prompt, (answer) => {
        resolve(answer.trim());
      });
    });
  }
}

// CLI 실행
if (require.main === module) {
  const cli = new Phase2TestCLI();
  cli.run().catch(console.error);
}
