import { useEffect } from "react";
import { StoreProvider, useStore } from "./context/StoreContext";
import Navbar from "./components/Navbar";
import CartDrawer from "./components/CartDrawer";
import ProductModal from "./components/ProductModal";
import ToastContainer from "./components/Toast";
import {
  Hero, Marquee, Intro, Collections, AIStylist, Products, Newsletter, FinalCTA, Footer
} from "./components/Sections";

function AppContent() {
  const { setSearchOpen, setSearchQuery } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setSearchOpen, setSearchQuery]);

  return (
    <div className="min-h-screen bg-[#080808] text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <Marquee />
      <Intro />
      <Collections />
      <AIStylist />
      <Products />
      <Newsletter />
      <FinalCTA />
      <Footer />
      <CartDrawer />
      <ProductModal />
      <ToastContainer />
    </div>
  );
}

function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}

export default App;
