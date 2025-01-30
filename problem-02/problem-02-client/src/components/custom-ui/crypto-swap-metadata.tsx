import { FC } from "react";

import { FlexBox } from "./flex-box";
import { TokenAmount } from "../../types/crypto";
import { useTokens } from "../../hooks/useTokens";

interface CryptoSwapMetadataProps {
  fromValue: TokenAmount;
  toValue: TokenAmount;
}

export const CryptoSwapMetadata: FC<CryptoSwapMetadataProps> = ({
  fromValue,
  toValue,
}: CryptoSwapMetadataProps) => {
  const { exchangeToken } = useTokens();
  return (
    <div>
      <FlexBox className="mt-2">
        <p className="text-white">Price:</p>
        <p className="text-white">
          1 {fromValue.currency} ={" "}
          {exchangeToken(
            { currency: fromValue.currency, amount: 1 },
            { currency: toValue.currency, amount: 1 }
          )}{" "}
          {toValue.currency}
        </p>
      </FlexBox>
    </div>
  );
};
