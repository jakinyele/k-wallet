import { useNavigation } from '@react-navigation/native';
import BigNumber from 'bignumber.js';
import LottieView from 'lottie-react-native';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Label } from '@/components/Label';
import { SvgIcon } from '@/components/SvgIcon';
import { TokenIcon, TokenIconFallback } from '@/components/TokenIcon';
import { Touchable } from '@/components/Touchable';
import { useAppCurrencyValue } from '@/hooks/useAppCurrencyValue';
import { useAppCurrency } from '@/realm/settings/useAppCurrency';
import { useTokenById } from '@/realm/tokens';
import { RealmPendingTransaction } from '@/realm/transactions';
import { TRANSACTION_PENDING_TYPES } from '@/realm/transactions/const';
import { Routes } from '@/Routes';
import { formatTransactionAddress } from '@/screens/Transactions/utils/formatAddress';
import { TRANSACTIONS_REALM_QUEUE_KEY } from '@/screens/Transactions/utils/types';
import { smallUnit2TokenUnit } from '@/utils/unitConverter';

import { formatTransactionValueAsNegativeOrPositive } from '../utils/formatTransactionValueAsNegativeOrPositive';

import loc from '/loc';
import { formatAppCurrencyValue, tokenAmountShortened } from '/modules/text-utils';

interface Props {
  item: RealmPendingTransaction;
  contextTokenId?: string;
  succeed: boolean;
  onDisappear?: () => unknown;
  isRecentActivityView?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

const DELAY_TIME_TO_REFRESH_ALL = 3000;

export const TransactionPendingRow: FC<Props> = ({ item, contextTokenId, succeed, onDisappear, containerStyle }) => {
  const tokenId = item.tokenId || contextTokenId;
  const token = useTokenById(tokenId);
  const contextToken = useTokenById(contextTokenId);
  const { wallet } = item;
  const navigation = useNavigation();
  const { amount, from, to, kind, fee } = item;
  const isNft = item.type === 'nft';
  const isNativeAssetView = contextToken?.assetId === wallet.nativeTokenCaipId;

  const title = loc.transactionTile.type[kind];
  const subTitle = kind === 'send' ? formatTransactionAddress(to, kind, true) : formatTransactionAddress(from, kind, true);

  const amountToShow = useMemo(() => {
    if (isNft) {
      return fee ?? '0';
    }

    if (isNativeAssetView && kind === 'send') {
      const tokenAmountAndNetworkFee =
        fee && amount ? (BigNumber(amount).isGreaterThan(0) ? BigNumber(amount).negated() : BigNumber(amount)).minus(BigNumber(fee)).toString(10) : '0';

      return tokenAmountAndNetworkFee;
    }

    return amount ?? '0';
  }, [amount, fee, isNft, isNativeAssetView, kind]);
  const metadata = isNft
    ? { decimals: wallet.nativeTokenDecimals, symbol: wallet.nativeTokenSymbol }
    : { decimals: token?.metadata.decimals ?? 18, symbol: token?.metadata.symbol };
  const appCurrencyValue = formatTransactionValueAsNegativeOrPositive(useAppCurrencyValue(token, amountToShow ?? '0', TRANSACTIONS_REALM_QUEUE_KEY) || 0, kind);
  const { currency } = useAppCurrency();
  const appCurrencyValuePrettified = formatAppCurrencyValue(appCurrencyValue, currency);
  const tokenAmount = useMemo(() => {
    if (amountToShow && token) {
      const amountShortened = tokenAmountShortened({ balance: amountToShow, metadata: { decimals: metadata.decimals } });

      return formatTransactionValueAsNegativeOrPositive(amountShortened, kind);
    } else {
      return '';
    }
  }, [amountToShow, kind, metadata.decimals, token]);
  const tokenAmountWithSymbol = tokenAmount === '' ? '' : `${tokenAmount} ${metadata.symbol}`;

  const detailsAmount = (isNft ? fee : amount) ?? '0';
  const detailsAmountFormatted = useMemo(() => {
    let result = '0';

    if (detailsAmount && token) {
      const amountShortened = tokenAmountShortened({ balance: detailsAmount, metadata: { decimals: metadata.decimals } });

      result = formatTransactionValueAsNegativeOrPositive(amountShortened, kind);
    }

    return result === '' ? '0' : result;
  }, [detailsAmount, kind, metadata.decimals, token]);
  const detailsAmountInCurrency = formatTransactionValueAsNegativeOrPositive(
    useAppCurrencyValue(token, detailsAmount ?? '0', TRANSACTIONS_REALM_QUEUE_KEY) || 0,
    kind,
  );
  const detailsAmountInCurrencyFormatted = formatAppCurrencyValue(detailsAmountInCurrency, currency);

  const isBtc = wallet.type === 'HDsegwitBech32';
  const networkFee = isBtc && item.fee ? smallUnit2TokenUnit(item.fee, metadata.decimals).toFixed() : item.fee;

  const transactionDetailsMetadata = useMemo(() => {
    return {
      title: isNft ? `NFT ${title}` : title,
      description: item.notes?.value || '',
      appCurrencyValue: detailsAmountInCurrencyFormatted,
      tokenAmount: detailsAmountFormatted,
      transactionType: kind === 'send' ? TRANSACTION_PENDING_TYPES.SEND : TRANSACTION_PENDING_TYPES.RECEIVE,
      symbol: metadata.symbol,
      pendingMetadata: {
        to: to ?? '',
        from: from ?? '',
      },
      networkFee,
      isNft,
    };
  }, [isNft, title, item.notes?.value, detailsAmountInCurrencyFormatted, detailsAmountFormatted, kind, metadata.symbol, to, from, networkFee]);

  const openTransactionDetails = useCallback(() => {
    navigation.navigate(Routes.TransactionDetails, {
      assetId: token?.assetId,
      id: item.id,
      transactionDetailsData: transactionDetailsMetadata,
    });
  }, [item.id, token?.assetId, navigation, transactionDetailsMetadata]);

  const [pendingDescription, setPendingDescription] = useState(loc.transactionDetails.state.pending);
  const [isSuccess, setIsSuccess] = useState(false);

  const pendingAnimated = useSharedValue(100);

  const doSuccessTransition = useCallback(() => {
    pendingAnimated.value = 0;
    setTimeout(() => onDisappear?.(), DELAY_TIME_TO_REFRESH_ALL);
  }, [pendingAnimated, onDisappear]);

  useEffect(() => {
    if (succeed) {
      setIsSuccess(true);
      setPendingDescription(loc.transactionDetails.state.success);
      setTimeout(doSuccessTransition, 1500);
    }
  }, [doSuccessTransition, succeed]);

  const pendingStyle = useAnimatedStyle(() => ({
    maxWidth: withTiming(pendingAnimated.value),
    opacity: withTiming(pendingAnimated.value),
  }));

  return (
    <Touchable style={[styles.container, containerStyle]} onPress={openTransactionDetails}>
      <View style={styles.leftContainer}>
        {isNft ? (
          <TokenIconFallback size={40} tokenSymbol="NFT" />
        ) : (
          <TokenIcon tokenId={token?.assetId} tokenSymbol={metadata.symbol} wallet={wallet} forceOmitNetworkIcon />
        )}
        <View style={styles.column}>
          <Label type="boldBody">{title}</Label>
          <View style={styles.description}>
            {isSuccess ? (
              <Animated.View style={pendingStyle}>
                <SvgIcon name="check-circle" color="green500" size={16} style={styles.space} />
              </Animated.View>
            ) : (
              <LottieView source={require('@/assets/lottie/orangeSpinner.json')} autoPlay loop style={styles.lottie} />
            )}
            <View style={styles.description}>
              <Label type="boldCaption1" color={isSuccess ? 'green500' : 'yellow500'} style={pendingStyle} numberOfLines={1}>
                {pendingDescription + ' '}
              </Label>
              <Label type="regularCaption1" color="light50" style={styles.subtitle}>
                {subTitle}
              </Label>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.amountContainer}>
        <Label style={styles.amountFiatText} type="boldLargeMonospace" numberOfLines={1}>
          {appCurrencyValuePrettified}
        </Label>
        <Label style={styles.amountText} type="regularMonospace" color="light50" numberOfLines={1}>
          {tokenAmountWithSymbol}
        </Label>
      </View>
    </Touchable>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 52,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  column: {
    justifyContent: 'space-between',
    marginLeft: 12,
  },
  description: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  space: {
    marginRight: 4,
  },
  amountContainer: {
    paddingLeft: 10,
  },
  amountText: {
    textAlign: 'right',
  },
  amountFiatText: {
    textAlign: 'right',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  lottie: {
    width: 18,
    height: 18,
    marginRight: 2,
  },
  subtitle: {
    alignSelf: 'flex-start',
  },
});
