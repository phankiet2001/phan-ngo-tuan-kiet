import { InputHTMLAttributes, forwardRef, HTMLAttributes } from "react";
import { useTokens } from "../../hooks/useTokens";
import { cn } from "../../lib/utils";
import { CryptoData, TokenAmount } from "../../types/crypto";
import { getTokenSvgUrl } from "../../utils/svg-token";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { FlexBox } from "./flex-box";

const DEFAULT_CRYPTO_ICON = "/default-crypto.svg";

interface CryptoInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "value"> {
  label: string;
  labelProps?: HTMLAttributes<HTMLLabelElement>;
  containerProps?: HTMLAttributes<HTMLDivElement>;
  onValueChange?: (value: TokenAmount) => void;
  excludeToken?: string;
  defaultValue?: string;
  value: TokenAmount;
}

export const CryptoInput = forwardRef<HTMLInputElement, CryptoInputProps>(
  (
    {
      label,
      labelProps,
      containerProps,
      onValueChange,
      excludeToken,
      defaultValue,
      value: inputValue,
      ...props
    },
    ref
  ) => {
    const { data: cryptoData, exchangeToken } = useTokens();


    const { className: containerClassName } = containerProps || {};
    const { className: inputClassName } = props || {};
    const handleOnChange = (value: string | number, name: string) => {
      onValueChange?.({
        ...inputValue,
        [name]: value,
      });
    };


    return (
      <div
        className={cn(
          "border border-gray-300/30 dark:border-gray-400/30 rounded-md p-4 hover:border-gray-400/50 dark:hover:border-gray-300/50 transition-colors",
          containerClassName
        )}
        {...containerProps}
      >
        <FlexBox>
          <FlexBox className="flex-col items-start">
            <Label
              htmlFor={`crypto-input-${label}`}
              className="text-white/70 text-left"
              {...labelProps}
            >
              {label}
            </Label>
            <Input
              id={`crypto-input-${label}`}
              type="number"
              placeholder="0.0"
              className={cn(
                "my-1 border-none outline-none shadow-none focus-visible:ring-0 bg-transparent rounded-none text-white !text-3xl font-medium [&::-webkit-inner-spin-button]:appearance-none pl-0 ml-0",
                inputClassName
              )}
              ref={ref}
              value={inputValue?.amount || ""}
              onChange={(e) => handleOnChange(Number(e.target.value), "amount")}
              {...props}
            />
            <p className="text-left text-sm text-white/70">{exchangeToken(inputValue, { currency: "USD", amount: 1 })} USD</p>
          </FlexBox>
          <Select
            onValueChange={(value) => {
              handleOnChange(value, "currency");
            }}
            defaultValue={defaultValue}
            value={inputValue?.currency}
          >
            <SelectTrigger className="w-fit bg-purple-800/30 border-purple-700/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-purple-800/30 border-purple-700/30 backdrop-blur-sm">
              {(cryptoData || [])
                .filter(
                  (crypto: CryptoData) => crypto.currency !== excludeToken
                )
                .map((crypto: CryptoData, index) => (
                  <SelectItem
                    key={`${crypto.currency}-${index}`}
                    value={crypto.currency}
                    className="hover:bg-purple-700/30"
                  >
                    <FlexBox className="flex items-center flex-row justify-start gap-2">
                      <img
                        src={getTokenSvgUrl(crypto.currency)}
                        alt={crypto.currency}
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_CRYPTO_ICON;
                        }}
                        className="w-6 h-6"
                      />
                      <p className="text-white/90 font-bold">
                        {crypto.currency}
                      </p>
                    </FlexBox>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </FlexBox>
      </div>
    );
  }
);

CryptoInput.displayName = "CryptoInput";
