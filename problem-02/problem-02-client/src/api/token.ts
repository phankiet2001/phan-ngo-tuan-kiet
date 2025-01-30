import { CryptoData } from "../types/crypto";
import { axiosInstance } from "../utils/axios";

export const Token = {
  async getTokens(): Promise<CryptoData[]> {
    const response = await axiosInstance.get("/prices.json");
    const tokens = response.data?.filter((token: CryptoData) => !!token.price);

    const uniqueTokenIds = [
      ...new Set(tokens.map((token: CryptoData) => token.currency)),
    ];
    const uniqueTokens = uniqueTokenIds.map((currency) =>
      tokens.find((token: CryptoData) => token.currency === currency)
    );
    return uniqueTokens;
  },
};

