import logo from './logo.svg';
import "antd/dist/reset.css"; // Ant Design styles reset
import "./index.css"; // Tailwind CSS
import Home from './pages/Home';
import Login from './pages/Login';
import {BrowserRouter as Router, Routes, Route,useLocation} from 'react-router-dom';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import {AppProvider} from './context/AppContext';
import Header from './component/Header';
import ContactUs from './pages/ContactUs/ContactUs';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import EditUserDetails from './pages/EditUserDetails/EditUserDetails';
import{TranslationProvider} from './context/TranslationContext';
import Charts from './pages/Charts/Charts';
import PitraDosh from './pages/Dosh/PitraDosh';
import MangalDosh from './pages/Dosh/MangalDosh';
import KalsarpDosh from './pages/Dosh/KalsarpDosh';
//import Prediction from './pages/Prediction/Prediction';
import LalKitabDebt from './pages/LalKitab/LalKitabDebt';
import LalKitabRemedy from './pages/LalKitab/LalKitabRemedy';
import LalKitabHouse from './pages/LalKitab/LalKitabHouse';
import LalKitabPlanet from './pages/LalKitab/LalKitabPlanet';
import Dasha from './pages/Dasha/Dasha';
import Gemstone from './pages/Report/Gemstone';
import RudrakshReport from './pages/Report/RudrakshReport'
import MoonPrediction from './pages/Prediction/MoonPrediction';
import NakshatraPrediction from './pages/Prediction/NakshatraPrediction';
import RasiPrediction from './pages/Prediction/RasiPrediction';
import PanchangPrediction from './pages/Prediction/PanchangPrediction';
import DailyHoroscope from './pages/Horoscope/DailyPlanner';
import WeeklyHoroscope from './pages/Horoscope/WeeklyPlanner';
import MonthlyHoroscope from './pages/Horoscope/MontlyPlanner';
import YearlyHoroscope from './pages/Horoscope/YearlyPlanner';
import SadeSati from './pages/SadeSati/SadeSati';
import Panchang from './pages/Panchang/Panchang';
import Choghadiya from './pages/Panchang/Choghadiya';
import NakshatraMatching from './pages/Matching/NakshatraMatching';
import Matching from './pages/Matching/Matching';
import ScrollToTop from './utilityFunction/ScrollToTop';
import PlanetKp from "./pages/Planet-KP/PlanetKp";
import MoonSign from "./pages/Calculator/MoonSign";
import SunSign from "./pages/Calculator/SunSign";
import RasiSign from "./pages/Calculator/RasiSign";

function AppRoutes() {
  const location = useLocation();
  const hideHeaderRoutes = ["/signup","/editUserDetails"];

  return (
    <TranslationProvider>
      {/* Translation context provider wraps the entire app to provide translation functionality */}
    <AppProvider>
      <div className="App">
        {!hideHeaderRoutes.includes(location.pathname) && <Header />}
        <ScrollToTop />
        <Routes>
          <Route path={"/"} element = {<Home/>}/>
          <Route path ={"/signup"} element = {<SignUp/>}/>
          <Route path ={"/login"} element = {<Login/>} />
          <Route path = {"/dashboard"} element = {<Dashboard/>} />
          <Route path = {"/contactUS"} element = {<ContactUs/>} />
          <Route path = {"/forgot-password"} element = {<ForgotPassword/>} />
          <Route path = {"/reset-password/:email"} element = {<ResetPassword/>} /> 
          <Route path = {"/editUserDetails"} element= {<EditUserDetails/>} />
          <Route path= {"/charts"} element= {<Charts/>} />
          <Route path= {"/pitra-dosh"} element= {<PitraDosh/>} />
          <Route path= {"/kalsarp-dosh"} element= {<KalsarpDosh/>} />
          <Route path= {"/mangal-dosh"} element= {<MangalDosh/>} />
          {/* <Route path= {"/prediction"} element= {<Prediction/>} /> */}
          <Route path= {"/lalkitab-debt"} element= {<LalKitabDebt/>} />
          <Route path= {"/lalkitab-remedy"} element= {<LalKitabRemedy/>} />
          <Route path= {"/lalkitab-houses"} element= {<LalKitabHouse/>} />
          <Route path= {"/lalkitab-planets"} element= {<LalKitabPlanet/>} />
          <Route path= {"/dasha"} element={<Dasha/>} />
          <Route path= {"/gemstones"} element={<Gemstone/>} />
          <Route path= {"/rudraksh-report"} element={<RudrakshReport/>} />
          <Route path= {"/moon-prediction"} element={<MoonPrediction/>} />
          <Route path= {"/nakshatra-prediction"} element={<NakshatraPrediction/>} />
          <Route path= {"/rasi-prediction"} element={<RasiPrediction/>} />
          <Route path= {"/panchang-prediction"} element={<PanchangPrediction/>} />
          <Route path= {"/weekly-horoscope"} element={<WeeklyHoroscope/>} />
          <Route path= {"/daily-horoscope"} element={<DailyHoroscope/>} />
          <Route path= {"/monthly-horoscope"} element={<MonthlyHoroscope/>} />
          <Route path= {"/yearly-horoscope"} element={<YearlyHoroscope/>} />
          <Route path= {"/sade-sati"} element={<SadeSati/>} />
          <Route path= {"/panchang"} element={<Panchang/>} />
          <Route path= {"/choghadiya"} element={<Choghadiya/>} />
          <Route path= {"/matching"} element={<Matching/>} />
          <Route path= {"/nakshatra-matching"} element={<NakshatraMatching/>} />
          <Route path= {"/planet-kp"} element={<PlanetKp/>} />
          <Route path= {"/moon-sign"} element={<MoonSign/>} />
          <Route path= {"/sun-sign"} element={<SunSign/>} />
          <Route path= {"/rasi-sign"} element={<RasiSign/>} />
        </Routes>
      
      </div>
    </AppProvider>
    </TranslationProvider>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
