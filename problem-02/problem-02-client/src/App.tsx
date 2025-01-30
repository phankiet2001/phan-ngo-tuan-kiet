import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { CryptoSwapCard } from "./components/custom-ui/crypto-swap-card";
import { withTheme } from "./hoc/withTheme";

const CryptoSwapCardWithTheme = withTheme(CryptoSwapCard);

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CryptoSwapCardWithTheme />
    </QueryClientProvider>
  );
}

export default App;
