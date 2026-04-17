import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppDataProvider } from "./context/AppDataContext";
import Home from "./Home";
import Centres from "./pages/Centres";
import Groups from "./pages/Groups";

export default function App() {
  return (
    <BrowserRouter>
      <AppDataProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/centres" element={<Centres />} />
          <Route path="/groups" element={<Groups />} />
        </Routes>
      </AppDataProvider>
    </BrowserRouter>
  );
}
