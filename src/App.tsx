import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CountryDetail from "./pages/CountryDetail";
import Header from "./components/Header";
import Footer from "./components/Footer";

const App: React.FC = () => (
  <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/country/:code" element={<CountryDetail />} />
    </Routes>
    <Footer />
  </BrowserRouter>
);

export default App;
