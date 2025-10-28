import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CountryDetail from "./pages/CountryDetail";
import Header from "./components/Header";
import Footer from "./components/Footer";

// wrappat main i en div som staplar element,
// diven bestämmer layouten på element
// main växer dynamiskt så att min footer alltid
// förblir längst ner på hemsidan
// (till skillnad på tidigare där min footer
// flyttades upp när få länder visades.)
const App: React.FC = () => (
  <BrowserRouter>
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow p-4 max-w-7xl mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/country/:code" element={<CountryDetail />} />
        </Routes>
      </main>

      <Footer />
    </div>
  </BrowserRouter>
);

export default App;
