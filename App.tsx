import { SafeAreaProvider } from "react-native-safe-area-context";
import { HomeScreen } from "./screens";

export default function App() {
  return (
    <SafeAreaProvider>
      <HomeScreen />
    </SafeAreaProvider>
  );
}
