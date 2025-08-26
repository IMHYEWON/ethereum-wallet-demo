import { ethers } from 'ethers';
import { ValidationUtils } from '../utils/validation';
import {
  TransactionRequest,
  GasEstimate,
  TransactionOptions
} from '../types/transaction.types';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../config/constants';

/**
 * 트랜잭션 처리 클래스
 * Ethereum 트랜잭션의 생성, 서명, 전송을 담당
 */
export class Transaction {
  private provider: ethers.Provider | null = null;
  private wallet: ethers.Wallet | null = null;

  constructor() {}

  /**
   * Provider 설정
   * @param provider ethers.js Provider 인스턴스
   */
  setProvider(provider: ethers.Provider): void {
    this.provider = provider;
  }

  /**
   * 지갑 설정
   * @param privateKey 개인키
   */
  setWallet(privateKey: string): void {
    if (!ValidationUtils.isValidPrivateKey(privateKey)) {
      throw new Error(ERROR_MESSAGES.INVALID_PRIVATE_KEY);
    }

    try {
      this.wallet = new ethers.Wallet(privateKey);
      if (this.provider) {
        this.wallet = this.wallet.connect(this.provider);
      }
    } catch (error) {
      throw new Error(`지갑 설정 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  }

  /**
   * 트랜잭션 생성
   * @param request 트랜잭션 요청 정보
   * @param options 트랜잭션 옵션
   * @returns 생성된 트랜잭션
   */
  async createTransaction(
    request: TransactionRequest,
    options: TransactionOptions = {}
  ): Promise<ethers.TransactionRequest> {
    if (!this.wallet) {
      throw new Error('지갑이 설정되지 않았습니다.');
    }

    // 입력값 검증
    this.validateTransactionRequest(request);

    try {
      // Phase 3에서는 기본값으로 트랜잭션 생성 (실제 네트워크 연결 없음)
      if (!this.provider) {
        const transaction: ethers.TransactionRequest = {
          to: request.to,
          value: ethers.parseEther(request.value),
          data: request.data || '0x',
          nonce: options.nonce ?? 0,
          chainId: options.chainId ?? 1, // Ethereum 메인넷
          gasPrice: options.gasPrice ? ethers.parseUnits(options.gasPrice, 'gwei') : ethers.parseUnits('20', 'gwei'),
          gasLimit: options.gasLimit ? ethers.getBigInt(options.gasLimit) : ethers.getBigInt(21000)
        };

        return transaction;
      }

      // 실제 Provider가 있는 경우
      const nonce = options.nonce ?? await this.wallet.getNonce();
      const chainId = options.chainId ?? (await this.provider.getNetwork()).chainId;

      // 가스비 설정
      const gasPrice = options.gasPrice ?? await this.provider.getFeeData().then(fee => fee.gasPrice);
      const maxFeePerGas = options.maxFeePerGas ?? await this.provider.getFeeData().then(fee => fee.maxFeePerGas);
      const maxPriorityFeePerGas = options.maxPriorityFeePerGas ?? await this.provider.getFeeData().then(fee => fee.maxPriorityFeePerGas);

      // 트랜잭션 객체 생성
      const transaction: ethers.TransactionRequest = {
        to: request.to,
        value: ethers.parseEther(request.value),
        data: request.data || '0x',
        nonce,
        chainId
      };

      // 가스비 설정 (EIP-1559 또는 레거시)
      if (maxFeePerGas && maxPriorityFeePerGas) {
        transaction.maxFeePerGas = maxFeePerGas;
        transaction.maxPriorityFeePerGas = maxPriorityFeePerGas;
      } else if (gasPrice) {
        transaction.gasPrice = gasPrice;
      }

      // 가스 한계 설정
      if (options.gasLimit) {
        transaction.gasLimit = ethers.getBigInt(options.gasLimit);
      } else {
        // 가스 한계 자동 추정
        transaction.gasLimit = await this.provider.estimateGas(transaction);
      }

      return transaction;
    } catch (error) {
      throw new Error(`트랜잭션 생성 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  }

  /**
   * 트랜잭션 서명
   * @param transaction 서명할 트랜잭션
   * @returns 서명된 트랜잭션
   */
  async signTransaction(transaction: ethers.TransactionRequest): Promise<string> {
    if (!this.wallet) {
      throw new Error('지갑이 설정되지 않았습니다.');
    }

    try {
      const signedTransaction = await this.wallet.signTransaction(transaction);
      return signedTransaction;
    } catch (error) {
      throw new Error(`트랜잭션 서명 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  }

  /**
   * 트랜잭션 전송
   * @param transaction 전송할 트랜잭션
   * @returns 전송 결과
   */
  async sendTransaction(transaction: ethers.TransactionRequest): Promise<ethers.TransactionResponse> {
    if (!this.wallet) {
      throw new Error('지갑이 설정되지 않았습니다.');
    }

    if (!this.provider) {
      throw new Error('Provider가 설정되지 않았습니다.');
    }

    try {
      const txResponse = await this.wallet.sendTransaction(transaction);
      return txResponse;
    } catch (error) {
      throw new Error(`트랜잭션 전송 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  }

  /**
   * 트랜잭션 생성 및 전송 (원스텝)
   * @param request 트랜잭션 요청 정보
   * @param options 트랜잭션 옵션
   * @returns 전송된 트랜잭션 응답
   */
  async createAndSendTransaction(
    request: TransactionRequest,
    options: TransactionOptions = {}
  ): Promise<ethers.TransactionResponse> {
    try {
      // 1. 트랜잭션 생성
      const transaction = await this.createTransaction(request, options);
      
      // 2. 트랜잭션 전송
      const txResponse = await this.sendTransaction(transaction);
      
      console.log(SUCCESS_MESSAGES.TRANSACTION_SENT);
      return txResponse;
    } catch (error) {
      throw new Error(`트랜잭션 생성 및 전송 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  }

  /**
   * 가스비 추정
   * @param request 트랜잭션 요청 정보
   * @returns 가스비 추정 결과
   */
  async estimateGas(request: TransactionRequest): Promise<GasEstimate> {
    try {
      // Phase 3에서는 모의 가스비 추정 (실제 네트워크 연결 없음)
      if (!this.provider) {
        // 기본 가스비 추정 (테스트용)
        const baseGasLimit = ethers.getBigInt(21000); // 기본 ETH 전송 가스 한계
        const gasPrice = ethers.parseUnits('20', 'gwei'); // 20 gwei
        const totalCost = baseGasLimit * gasPrice;

        return {
          gasLimit: baseGasLimit.toString(),
          gasPrice: gasPrice.toString(),
          totalCost: ethers.formatEther(totalCost)
        };
      }

      // 실제 Provider가 있는 경우
      const gasLimit = await this.provider.estimateGas({
        to: request.to,
        value: ethers.parseEther(request.value),
        data: request.data || '0x'
      });

      const feeData = await this.provider.getFeeData();
      const totalCost = gasLimit * (feeData.gasPrice || ethers.parseUnits('20', 'gwei'));

      const result: GasEstimate = {
        gasLimit: gasLimit.toString(),
        gasPrice: feeData.gasPrice?.toString() || '0',
        totalCost: ethers.formatEther(totalCost)
      };

      if (feeData.maxFeePerGas) {
        result.maxFeePerGas = feeData.maxFeePerGas.toString();
      }
      if (feeData.maxPriorityFeePerGas) {
        result.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas.toString();
      }

      return result;
    } catch (error) {
      throw new Error(`가스비 추정 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  }

  /**
   * 트랜잭션 상태 조회
   * @param hash 트랜잭션 해시
   * @returns 트랜잭션 영수증
   */
  async getTransactionReceipt(hash: string): Promise<ethers.TransactionReceipt | null> {
    if (!this.provider) {
      throw new Error('Provider가 설정되지 않았습니다.');
    }

    try {
      const receipt = await this.provider.getTransactionReceipt(hash);
      return receipt;
    } catch (error) {
      throw new Error(`트랜잭션 상태 조회 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  }

  /**
   * 트랜잭션 확인 대기
   * @param hash 트랜잭션 해시
   * @param confirmations 필요한 확인 수
   * @returns 트랜잭션 영수증
   */
  async waitForTransaction(
    hash: string,
    confirmations: number = 1
  ): Promise<ethers.TransactionReceipt | null> {
    if (!this.provider) {
      throw new Error('Provider가 설정되지 않았습니다.');
    }

    try {
      const receipt = await this.provider.waitForTransaction(hash, confirmations);
      return receipt;
    } catch (error) {
      throw new Error(`트랜잭션 확인 대기 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  }

  /**
   * 트랜잭션 요청 검증
   * @param request 트랜잭션 요청 정보
   */
  private validateTransactionRequest(request: TransactionRequest): void {
    // 수신 주소 검증
    if (!ValidationUtils.isValidAddress(request.to)) {
      throw new Error('유효하지 않은 수신 주소입니다.');
    }

    // 금액 검증
    if (!ValidationUtils.isValidAmount(request.value)) {
      throw new Error('유효하지 않은 금액입니다.');
    }

    // 금액이 0보다 큰지 확인
    const value = parseFloat(request.value);
    if (value <= 0) {
      throw new Error('금액은 0보다 커야 합니다.');
    }
  }

  /**
   * 현재 지갑 주소 조회
   * @returns 지갑 주소
   */
  getAddress(): string {
    if (!this.wallet) {
      throw new Error('지갑이 설정되지 않았습니다.');
    }
    return this.wallet.address;
  }

  /**
   * 현재 지갑 잔액 조회
   * @returns 잔액 (wei)
   */
  async getBalance(): Promise<string> {
    if (!this.wallet || !this.provider) {
      throw new Error('지갑 또는 Provider가 설정되지 않았습니다.');
    }

    try {
      const balance = await this.provider.getBalance(this.wallet.address);
      return balance.toString();
    } catch (error) {
      throw new Error(`잔액 조회 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  }

  /**
   * 현재 Nonce 조회
   * @returns Nonce 값
   */
  async getNonce(): Promise<number> {
    if (!this.wallet || !this.provider) {
      throw new Error('지갑 또는 Provider가 설정되지 않았습니다.');
    }

    try {
      const nonce = await this.wallet.getNonce();
      return nonce;
    } catch (error) {
      throw new Error(`Nonce 조회 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  }
}
