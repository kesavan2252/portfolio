import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Vault } from "./pages/Vault";
import MessagesPage from "./pages/messages";
import { Toaster } from "@/components/ui/toaster";
import VaultEditorProtected from "./components/VaultEditorProtected";

function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/vault" element={<Vault />} />
          <Route path="/vault/z" element={<VaultEditorProtected />} />
          <Route path="/messages" element={<MessagesPage />} />


        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
