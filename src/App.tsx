import { BrowserRouter, Routes, Route } from "react-router";
import { AppShell } from "./components/layout/AppShell";
import { HomePage } from "./pages/HomePage";
import { CotDashboard } from "./pages/CotDashboard";
import { MacroIndicators } from "./pages/MacroIndicators";
import { EconomicCalendar } from "./pages/EconomicCalendar";
import { AnalysisNotes } from "./pages/AnalysisNotes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/cot" element={<CotDashboard />} />
          <Route path="/macro" element={<MacroIndicators />} />
          <Route path="/calendar" element={<EconomicCalendar />} />
          <Route path="/analysis" element={<AnalysisNotes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
