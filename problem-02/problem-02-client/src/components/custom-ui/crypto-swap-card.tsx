import { MoveDown } from "lucide-react";
import { swapSchema, SwapSchema } from "../../schemas/swap-schema";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CryptoInput } from "./crypto-input";
import { FlexBox } from "./flex-box";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { WithThemeProps } from "../../hoc/withTheme";
import { useTokens } from "../../hooks/useTokens";
import { Switch } from "../ui/switch";
import { CryptoSwapMetadata } from "./crypto-swap-metadata";

export const CryptoSwapCard: React.FC<WithThemeProps> = ({
  toggleTheme,
  theme,
}) => {
  const {
    setValue,
    watch,
    formState: { defaultValues },
  } = useForm<SwapSchema>({
    resolver: zodResolver(swapSchema),
    defaultValues: {
      from: {
        currency: "BUSD",
        amount: 0,
      },
      to: {
        currency: "USD",
        amount: 0,
      },
    },
  });

  const { exchangeToken } = useTokens();

  const fromValue = watch("from");
  const toValue = watch("to");

  useEffect(() => {
    const subscription = watch((value) => {
      const amount = exchangeToken(value.from, value.to);
      setValue("to", {
        currency: value.to?.currency || "",
        amount: Number(amount || 0),
      });
    });

    return () => subscription.unsubscribe();
  }, [watch, exchangeToken, setValue]);

  return (
    <Card className="w-full mx-auto bg-gradient-to-b from-purple-900/80 via-purple-900/70 to-purple-950/90 border-none shadow-xl backdrop-blur-sm">
      <CardHeader className="flex justify-between items-center flex-row px-4 md:px-6">
        <CardTitle className="text-white/90 text-2xl font-bold">Swap</CardTitle>
        <FlexBox className="flex justify-between items-center flex-row gap-2">
          <Switch
            checked={theme === "dark"}
            onCheckedChange={toggleTheme}
            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-500/90 data-[state=checked]:to-purple-500/90 data-[state=unchecked]:bg-purple-800/30"
          />
          <p className="text-white/70">Dark Mode</p>
        </FlexBox>
      </CardHeader>
      <CardContent className="space-y-4 px-4 md:px-6">
        <CryptoInput
          label="From"
          value={fromValue}
          onValueChange={(value) => {
            setValue("from", value, {
              shouldValidate: true,
            });
          }}
          excludeToken={toValue.currency}
          defaultValue={defaultValues?.from?.currency}
        />
        <FlexBox className="w-full my-4 justify-center items-center">
          <MoveDown />
        </FlexBox>
        <CryptoInput
          label="To"
          value={toValue}
          defaultValue={defaultValues?.to?.currency}
          onValueChange={(value) => {
            setValue("to", value, {
              shouldValidate: true,
            });
          }}
          excludeToken={fromValue.currency}
        />
        <CryptoSwapMetadata fromValue={fromValue} toValue={toValue} />
      </CardContent>
    </Card>
  );
};
