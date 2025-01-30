import { useQuery } from "@tanstack/react-query";
import { Token } from "../api/token";
import { CryptoData, TokenAmount } from "../types/crypto";
import { useCallback } from "react";

export const useTokens = () => {
  const tokenResponse = useQuery<CryptoData[]>({
    queryKey: ["tokens"],
    queryFn: Token.getTokens,
  });


  const getExchangeRate = useCallback((from?: Partial<TokenAmount>, to?: Partial<TokenAmount>) => {
    const fromToken = tokenResponse.data?.find((token) => token.currency === from?.currency);
    const toToken = tokenResponse.data?.find((token) => token.currency === to?.currency);

    if (!fromToken || !toToken) return;

    const fromPrice = fromToken.price;
    const toPrice = toToken.price;

    const exchangeRate = fromPrice / toPrice;

    return exchangeRate;
  }, [tokenResponse.data]);

  const exchangeToken = useCallback((from?: Partial<TokenAmount>, to?: Partial<TokenAmount>) => {
    if (from?.amount && from.amount <= 0) return 0;
    const exchangeRate = getExchangeRate(from, to);
    if (!exchangeRate) return;
    
    const exchangedAmount = Number(from?.amount || 0) * exchangeRate;
    return exchangedAmount;
  }, [getExchangeRate]);

  return {
    ...tokenResponse,
    exchangeToken,
    getExchangeRate,
  };
};
