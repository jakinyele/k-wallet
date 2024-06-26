


export interface paths {
  "/v1/analyse/address": {
    
    post: operations["AnalyseAddress"];
  };
  "/v1/analyse/domains": {
    
    post: operations["AnalyseDomains"];
  };
  "/v1/balances": {
    
    get: operations["GetBalances"];
  };
  "/v1/broadcast": {
    
    post: operations["Broadcast"];
  };
  "/v1/fee": {
    
    get: operations["GetFees"];
  };
  "/v1/nfts": {
    
    get: operations["GetNfts"];
  };
  "/v1/positions": {
    
    get: operations["GetPositions"];
  };
  "/v2/positions": {
    
    get: operations["GetPositionsV2"];
  };
  "/pow/request": {
    
    post: operations["GetChallenge"];
  };
  "/pow/submit": {
    
    post: operations["SubmitSolution"];
  };
  "/v2/price": {
    
    get: operations["GetPriceDataV2"];
  };
  "/v1/price": {
    
    get: operations["GetPriceData"];
  };
  "/v1/resolveAddressLabels": {
    
    get: operations["ResolveEnsAddresses"];
  };
  "/v1/resolveName": {
    
    get: operations["ResolveEnsName"];
  };
  "/v1/simulate": {
    
    post: operations["Simulate"];
  };
  "/v1/tokenlist": {
    
    get: operations["GetTokenList"];
  };
  "/v1/tokenMetadata": {
    
    get: operations["GetTokenMetadata"];
  };
  "/v1/transactions": {
    
    get: operations["GetTransactions"];
  };
  "/v1/transaction": {
    
    get: operations["GetTransactionStatus"];
  };
  "/v1/utxo": {
    
    get: operations["GetUtxo"];
  };
  "/version": {
    
    get: operations["GetVersion"];
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
    AddressAnalysisWarning: {
      
      severity: "CRITICAL" | "WARNING" | "INFO";
      message: string;
    };
    AddressAnalysisInfo: {
      
      prevSendCount?: number;
    };
    AnalyseAddressResult: {
      address: string;
      network: string;
      warnings: components["schemas"]["AddressAnalysisWarning"][];
      info: components["schemas"]["AddressAnalysisInfo"];
    };
    "Result_AnalyseAddressResult-Array_": {
      content: components["schemas"]["AnalyseAddressResult"][];
    };
    ErrorResult: {
      params?: string;
      message: string;
    };
    DomainAnalysisWarning: {
      
      severity: "CRITICAL" | "WARNING";
      message: string;
    };
    DomainAnalysis: {
      domain: string;
      
      status: "PROCESSED" | "PROCESSING" | "UNPROCESSABLE";
      warnings: components["schemas"]["DomainAnalysisWarning"][];
    };
    AnalyseDomainsResult: {
      analyses: components["schemas"]["DomainAnalysis"][];
    };
    Result_AnalyseDomainsResult_: {
      content: components["schemas"]["AnalyseDomainsResult"];
    };
    TokenReputation: {
      tokenLists: string[];
    } | {
      blacklists: string[];
    };
    TokenMetadata: {
      isSpam?: boolean;
      reputation?: components["schemas"]["TokenReputation"];
      priceUSD?: string;
      logoUrl?: string;
      subLabels?: string[];
      label?: string;
      symbol?: string;
      
      decimals: number;
    };
    
    InternalBalance: {
      metadata?: components["schemas"]["TokenMetadata"];
      value: string;
      token: string;
    };
    "Result_InternalBalance-Array_": {
      content: components["schemas"]["InternalBalance"][];
    };
    BroadcastReceipt: {
      transactionId: string;
    };
    Result_BroadcastReceipt_: {
      content: components["schemas"]["BroadcastReceipt"];
    };
    
    FeeOptionKind: "slow" | "medium" | "fast" | "default";
    DefaultFeeOption: {
      
      estimatedTimeBlocks?: number;
      token: string;
      amount: string;
      kind: components["schemas"]["FeeOptionKind"];
    };
    EVMFeeOption1559: {
      
      estimatedTimeBlocks?: number;
      
      is1559: true;
      kind: components["schemas"]["FeeOptionKind"];
      maxPriorityFeePerGas: string;
      maxFeePerGas: string;
    };
    EVMFeeOptionPre1559: {
      
      estimatedTimeBlocks?: number;
      
      is1559: false;
      kind: components["schemas"]["FeeOptionKind"];
      fee: string;
    };
    EVMFeeOption: components["schemas"]["EVMFeeOption1559"] | components["schemas"]["EVMFeeOptionPre1559"];
    FeeOption: components["schemas"]["DefaultFeeOption"] | components["schemas"]["EVMFeeOption"];
    "Result_FeeOption-Array_": {
      content: components["schemas"]["FeeOption"][];
    };
    
    NFT: {
      
      amount?: number;
      token: string;
    };
    "Result_NFT-Array_": {
      content: components["schemas"]["NFT"][];
    };
    ProtocolPositionToken: {
      address: string;
      network: string;
      symbol: string;
      
      decimals: number;
      
      price: number;
      tokens?: components["schemas"]["ProtocolPositionToken"][];
      
      balanceUsdValue?: number;
      
      balance?: number;
    };
    ProtocolTypedLabel: {
      label: string | number;
      
      type?: "dollar" | "pct";
    };
    ProtocolAncillaryStat: {
      label: string;
      value: string | number;
      
      type?: "string" | "number" | "dollar" | "pct" | "translation";
    };
    ProtocolPositionMetadata: {
      label?: string;
      subLabels?: components["schemas"]["ProtocolTypedLabel"][];
      imageUrls?: string[];
      pricePerShare?: number[];
      ancillaryStats?: components["schemas"]["ProtocolAncillaryStat"][];
    };
    ProtocolPosition: {
      network: string;
      address: string;
      category: string;
      usdValue: string | number;
      tokens: components["schemas"]["ProtocolPositionToken"][];
      metadata: components["schemas"]["ProtocolPositionMetadata"];
    };
    ProtocolProduct: {
      label: string;
      positions: components["schemas"]["ProtocolPosition"][];
      metadata: components["schemas"]["ProtocolAncillaryStat"][];
    };
    
    DeFiProtocol: {
      id: string;
      address: string;
      network: string;
      protocolId: string;
      protocolName: string;
      products: components["schemas"]["ProtocolProduct"][];
      
      protocolUsdBalance: number;
      protocolImageUrl?: string;
    };
    "Result_DeFiProtocol-Array_": {
      content: components["schemas"]["DeFiProtocol"][];
    };
    FiatRates: {
      [key: string]: string;
    };
    "Result__positions-DeFiProtocol-Array--fiatRates-FiatRates__": {
      content: {
        fiatRates: components["schemas"]["FiatRates"];
        positions: components["schemas"]["DeFiProtocol"][];
      };
    };
    Challenge: {
      d: string;
      
      expiry: number;
      
      ts: number;
      
      v: 1;
    };
    TokenPriceFiatValue: {
      source: string;
      value: string;
    };
    TokenPriceV2: {
      fiatValue: {
        [key: string]: components["schemas"]["TokenPriceFiatValue"];
      };
      assetId: string;
    };
    "Result_TokenPriceV2-or-null_": {
      content: components["schemas"]["TokenPriceV2"] | null;
    };
    TokenPrice: {
      exchange?: string;
      provider: string;
      value: string;
      token: string;
    };
    "Result_TokenPrice-or-null_": {
      content: components["schemas"]["TokenPrice"] | null;
    };
    ResolvedAddressLabels: {
      name: string;
      type: string;
    } | null;
    "Result_ResolvedAddressLabels-Array_": {
      content: components["schemas"]["ResolvedAddressLabels"][];
    };
    ENSResolvedName: {
      
      expiresAt?: number;
      address?: string;
      registered: boolean;
      owner?: string;
      manager?: string | null;
      expired?: boolean;
      
      gracePeriodExpiresAt?: number;
      gracePeriodExpired?: boolean;
      contentHash?: string | null;
      email?: string | null;
      avatar?: string;
      url?: string;
    };
    ResolvedName: components["schemas"]["ENSResolvedName"];
    "Result_ResolvedName-or-null_": {
      content: components["schemas"]["ResolvedName"] | null;
    };
    
    ReceiveAsset: {
      amount: string;
      assetId: string;
      sender: string;
      
      type: "receive";
    };
    
    SendAsset: {
      amount: string;
      assetId: string;
      recipient: string;
      
      type: "send";
    };
    
    MintAsset: {
      spentToken?: components["schemas"]["SendAsset"];
      amount?: string;
      assetId: string;
      
      type: "mint";
    };
    
    PurchaseAsset: {
      spentToken: components["schemas"]["SendAsset"];
      amount?: string;
      assetId: string;
      
      type: "purchase";
    };
    
    SwapAssets: {
      spent: components["schemas"]["SendAsset"];
      receive: components["schemas"]["ReceiveAsset"];
      
      type: "swap";
    };
    
    Deposit: {
      receivedToken?: components["schemas"]["ReceiveAsset"];
      depositedAmounts: {
          amount: string;
          assetId: string;
        }[];
      
      type: "deposit";
    };
    
    TokenApproval: {
      amount?: string;
      assetId: string;
      grantee: string;
      
      type: "token-approval";
    };
    TransactionEffect: components["schemas"]["ReceiveAsset"] | components["schemas"]["SendAsset"] | components["schemas"]["MintAsset"] | components["schemas"]["PurchaseAsset"] | components["schemas"]["SwapAssets"] | components["schemas"]["Deposit"] | components["schemas"]["TokenApproval"];
    
    PreventativeAction: "BLOCK" | "WARN" | "NONE";
    SimulationWarning: {
      
      severity: "CRITICAL" | "WARNING";
      message: string;
    };
    EVMSimulationResult: {
      
      status: "success" | "failure";
      effects?: components["schemas"]["TransactionEffect"][];
      preventativeAction?: components["schemas"]["PreventativeAction"];
      warnings?: components["schemas"]["SimulationWarning"][];
      
      gasUsed: number;
      
      nonce: number;
    };
    SolanaSimulationResult: {
      
      status: "success" | "failure";
      effects?: components["schemas"]["TransactionEffect"][];
      preventativeAction?: components["schemas"]["PreventativeAction"];
      warnings?: components["schemas"]["SimulationWarning"][];
      fee: string;
      compiledTransaction: string;
    };
    ISimulationResult: {
      
      status: "success" | "failure";
      effects?: components["schemas"]["TransactionEffect"][];
      preventativeAction?: components["schemas"]["PreventativeAction"];
      warnings?: components["schemas"]["SimulationWarning"][];
    };
    SimulationResult: components["schemas"]["EVMSimulationResult"] | components["schemas"]["SolanaSimulationResult"] | components["schemas"]["ISimulationResult"];
    Result_SimulationResult_: {
      content: components["schemas"]["SimulationResult"];
    };
    SolanaSimulationInputCompiled: {
      dAppOrigin?: string;
      signatory?: string;
      transaction: string;
    };
    SerializedSolanaInstruction: {
      data: string;
      programId: string;
      keys: {
          isWritable: boolean;
          isSigner: boolean;
          pubkey: string;
        }[];
    };
    SolanaSimulationInputPlain: {
      dAppOrigin?: string;
      signatory?: string;
      atas?: {
          instruction: components["schemas"]["SerializedSolanaInstruction"];
          address: string;
        }[];
      feePayer: string;
      instructions: components["schemas"]["SerializedSolanaInstruction"][];
    };
    SolanaSimulationInput: components["schemas"]["SolanaSimulationInputCompiled"] | components["schemas"]["SolanaSimulationInputPlain"];
    
    EVMTransactionSimulationInput: {
      dAppOrigin?: string;
      
      type?: number;
      
      nonce?: number;
      maxPriorityFeePerGas?: string;
      maxFeePerGas?: string;
      gasPrice?: string;
      
      gasLimit?: number;
      value?: string;
      data?: string;
      chainId: string;
      from: string;
      to: string;
    };
    UnsignedTypedStructuredData: {
      message: {
        [key: string]: unknown;
      };
      domain: {
        [key: string]: unknown;
      };
      primaryType: string;
      types: {
        [key: string]: {
            type: string;
            name: string;
          }[];
      };
    };
    EVMMessageSimulationInput: {
      unsignedTypedData?: components["schemas"]["UnsignedTypedStructuredData"];
      unsignedPersonalSignMessage?: string;
      unsignedMessage?: string;
      dAppOrigin?: string;
      signatory: string;
    };
    EVMSimulationInput: components["schemas"]["EVMTransactionSimulationInput"] | components["schemas"]["EVMMessageSimulationInput"];
    SimulationInput: components["schemas"]["SolanaSimulationInput"] | components["schemas"]["EVMSimulationInput"];
    TokenCountType: {
      blacklists: {
        [key: string]: number;
      };
      whitelists: {
        [key: string]: number;
      };
    };
    AggregatedTokenListType: {
      lists: string[];
      logoURI?: string;
      
      decimals?: number;
      symbol?: string;
      name?: string;
      contract_address: string;
      
      chainId: number;
      caipId: string;
    };
    "Result__tokenCount-TokenCountType--whitelist-AggregatedTokenListType-Array--blacklist-AggregatedTokenListType-Array--__": {
      content: {
        blacklist: components["schemas"]["AggregatedTokenListType"][];
        whitelist: components["schemas"]["AggregatedTokenListType"][];
        tokenCount: components["schemas"]["TokenCountType"];
      };
    };
    NFTTrait: {
      value?: string | number | boolean;
      name: string;
    };
    NFTMetadata: {
      isSpam?: boolean;
      reputation?: components["schemas"]["TokenReputation"];
      backgroundColor?: string;
      traits?: components["schemas"]["NFTTrait"][];
      collection?: {
        imageUrl?: string;
        symbol?: string;
        name?: string;
        id: string;
      };
      
      signature?: string;
      contentType?: string;
      contentUrl?: string;
      description?: string;
      name?: string;
      
      isNFT: true;
    };
    "Result_TokenMetadata-or-NFTMetadata-or-null_": {
      content: (components["schemas"]["TokenMetadata"] | components["schemas"]["NFTMetadata"]) | null;
    };
    
    Transaction: {
      protocolInfo?: {
        projectId: string;
      };
      effects: components["schemas"]["TransactionEffect"][];
      metadata?: {
        actionName?: string;
        target?: string;
      };
      fee?: {
        amount: string;
        token: string;
      };
      
      kind: "sent" | "affected";
      
      status: "succeeded" | "failed";
      
      timestamp: number;
      id: string;
    };
    Page_Transaction_: {
      content: components["schemas"]["Transaction"][];
      cursor?: string;
    };
    TransactionStatusComplete: {
      
      blockNumber: number;
      
      status: "confirmed" | "failed";
    };
    TransactionStatusIncomplete: {
      
      status: "unknown" | "pending";
    };
    TransactionStatus: components["schemas"]["TransactionStatusComplete"] | components["schemas"]["TransactionStatusIncomplete"];
    NetworkState: {
      
      latestConfirmedBlock: number;
    };
    TransactionStatusPublic: components["schemas"]["TransactionStatus"] & {
      meta: {
        networkState: components["schemas"]["NetworkState"];
      };
    };
    Result_TransactionStatusPublic_: {
      content: components["schemas"]["TransactionStatusPublic"];
    };
    UTXO: {
      
      blockNumber?: number;
      script: string;
      value: string;
      
      index: number;
      transactionId: string;
    };
    "Result_UTXO-Array_": {
      content: components["schemas"]["UTXO"][];
    };
  };
  responses: {
  };
  parameters: {
  };
  requestBodies: {
  };
  headers: {
  };
  pathItems: never;
}

export type $defs = Record<string, never>;

export type external = Record<string, never>;

export interface operations {

  
  AnalyseAddress: {
    
    requestBody: {
      content: {
        "application/json": {
          toAddress: string;
          fromAddress: string;
        };
      };
    };
    responses: {
      
      200: {
        content: {
          "application/json": components["schemas"]["Result_AnalyseAddressResult-Array_"];
        };
      };
      
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResult"];
        };
      };
    };
  };
  
  AnalyseDomains: {
    
    requestBody: {
      content: {
        "application/json": {
          domains: string[];
        };
      };
    };
    responses: {
      
      200: {
        content: {
          "application/json": components["schemas"]["Result_AnalyseDomainsResult_"];
        };
      };
      
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResult"];
        };
      };
    };
  };
  
  GetBalances: {
    parameters: {
      query: {
        
        address: string;
        
        network: string;
        
        backend?: string;
      };
    };
    responses: {
      
      200: {
        content: {
          "application/json": components["schemas"]["Result_InternalBalance-Array_"];
        };
      };
      
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResult"];
        };
      };
    };
  };
  
  Broadcast: {
    parameters: {
      query: {
        
        network: string;
        
        data: string;
      };
    };
    responses: {
      
      200: {
        content: {
          "application/json": components["schemas"]["Result_BroadcastReceipt_"];
        };
      };
      
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResult"];
        };
      };
    };
  };
  
  GetFees: {
    parameters: {
      query: {
        
        network: string;
        backend?: string;
      };
    };
    responses: {
      
      200: {
        content: {
          "application/json": components["schemas"]["Result_FeeOption-Array_"];
        };
      };
      
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResult"];
        };
      };
    };
  };
  
  GetNfts: {
    parameters: {
      query: {
        
        address: string;
        
        network: string;
        
        backend?: string;
      };
    };
    responses: {
      
      200: {
        content: {
          "application/json": components["schemas"]["Result_NFT-Array_"];
        };
      };
      
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResult"];
        };
      };
    };
  };
  
  GetPositions: {
    parameters: {
      query: {
        
        address: string;
        
        backend?: string;
      };
    };
    responses: {
      
      200: {
        content: {
          "application/json": components["schemas"]["Result_DeFiProtocol-Array_"];
        };
      };
      
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResult"];
        };
      };
    };
  };
  
  GetPositionsV2: {
    parameters: {
      query: {
        
        address: string;
        
        backend?: string;
      };
    };
    responses: {
      
      200: {
        content: {
          "application/json": components["schemas"]["Result__positions-DeFiProtocol-Array--fiatRates-FiatRates__"];
        };
      };
      
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResult"];
        };
      };
    };
  };
  
  GetChallenge: {
    responses: {
      
      200: {
        content: {
          "application/json": {
            
            difficulty: number;
            target: string;
            signature: string;
            challenge: components["schemas"]["Challenge"];
          };
        };
      };
    };
  };
  
  SubmitSolution: {
    requestBody: {
      content: {
        "application/json": {
          signature: string;
          challenge: components["schemas"]["Challenge"];
          solution: string;
        };
      };
    };
    responses: {
      
      200: {
        content: {
          "application/json": {
            key: string;
          };
        };
      };
    };
  };
  
  GetPriceDataV2: {
    parameters: {
      query: {
        
        token: string;
        
        backend?: string;
      };
    };
    responses: {
      
      200: {
        content: {
          "application/json": components["schemas"]["Result_TokenPriceV2-or-null_"];
        };
      };
      
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResult"];
        };
      };
    };
  };
  
  GetPriceData: {
    parameters: {
      query: {
        
        token: string;
        
        backend?: string;
      };
    };
    responses: {
      
      200: {
        content: {
          "application/json": components["schemas"]["Result_TokenPrice-or-null_"];
        };
      };
      
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResult"];
        };
      };
    };
  };
  
  ResolveEnsAddresses: {
    parameters: {
      query: {
        addresses: string[];
        network: string;
      };
    };
    responses: {
      
      200: {
        content: {
          "application/json": components["schemas"]["Result_ResolvedAddressLabels-Array_"];
        };
      };
      
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResult"];
        };
      };
    };
  };
  
  ResolveEnsName: {
    parameters: {
      query: {
        name: string;
        network: string;
      };
    };
    responses: {
      
      200: {
        content: {
          "application/json": components["schemas"]["Result_ResolvedName-or-null_"];
        };
      };
      
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResult"];
        };
      };
    };
  };
  
  Simulate: {
    parameters: {
      query: {
        
        network: string;
      };
    };
    
    requestBody: {
      content: {
        "application/json": components["schemas"]["SimulationInput"];
      };
    };
    responses: {
      
      200: {
        content: {
          "application/json": components["schemas"]["Result_SimulationResult_"];
        };
      };
      
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResult"];
        };
      };
    };
  };
  
  GetTokenList: {
    responses: {
      
      200: {
        content: {
          "application/json": components["schemas"]["Result__tokenCount-TokenCountType--whitelist-AggregatedTokenListType-Array--blacklist-AggregatedTokenListType-Array--__"];
        };
      };
      
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResult"];
        };
      };
    };
  };
  
  GetTokenMetadata: {
    parameters: {
      query: {
        
        token: string;
        
        backend?: string;
      };
    };
    responses: {
      
      200: {
        content: {
          "application/json": components["schemas"]["Result_TokenMetadata-or-NFTMetadata-or-null_"];
        };
      };
      
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResult"];
        };
      };
    };
  };
  
  GetTransactions: {
    parameters: {
      query: {
        
        address: string;
        
        network: string;
        
        cursor?: string;
        
        backend?: string;
      };
    };
    responses: {
      
      200: {
        content: {
          "application/json": components["schemas"]["Page_Transaction_"];
        };
      };
      
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResult"];
        };
      };
    };
  };
  
  GetTransactionStatus: {
    parameters: {
      query: {
        
        transactionId: string;
        
        network: string;
        
        backend?: string;
      };
    };
    responses: {
      
      200: {
        content: {
          "application/json": components["schemas"]["Result_TransactionStatusPublic_"];
        };
      };
      
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResult"];
        };
      };
    };
  };
  
  GetUtxo: {
    parameters: {
      query: {
        address: string;
        
        network: string;
        
        backend?: string;
      };
    };
    responses: {
      
      200: {
        content: {
          "application/json": components["schemas"]["Result_UTXO-Array_"];
        };
      };
      
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResult"];
        };
      };
    };
  };
  
  GetVersion: {
    responses: {
      
      200: {
        content: {
          "application/json": {
            version: string;
          };
        };
      };
      
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResult"];
        };
      };
    };
  };
}
