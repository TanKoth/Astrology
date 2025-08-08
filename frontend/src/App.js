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
import Dosh from './pages/Dosh/Dosh';
import Prediction from './pages/Prediction/Prediction';
import LalKitab from './pages/LalKitab/LalKitab';
import Dasha from './pages/Dasha/Dasha';
import Favorable from './pages/Favorable/Favorable';
import MoonPrediction from './pages/Prediction/MoonPrediction';
import NakshatraPrediction from './pages/Prediction/NakshatraPrediction';
import RasiPrediction from './pages/Prediction/RasiPrediction';
import PanchangPrediction from './pages/Prediction/PanchangPrediction';


function AppRoutes() {
  const location = useLocation();
  const hideHeaderRoutes = ["/signup","/editUserDetails"];

  return (
    <TranslationProvider>
      {/* Translation context provider wraps the entire app to provide translation functionality */}
    <AppProvider>
      <div className="App">
        {!hideHeaderRoutes.includes(location.pathname) && <Header />}
      
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
          <Route path= {"/dosh"} element= {<Dosh/>} />
          <Route path= {"/prediction"} element= {<Prediction/>} />
          <Route path= {"/lalkitab"} element= {<LalKitab/>} />
          <Route path= {"/dasha"} element={<Dasha/>} />
          <Route path= {"/favorable"} element={<Favorable/>} />
          <Route path= {"/moon-prediction"} element={<MoonPrediction/>} />
          <Route path= {"/nakshatra-prediction"} element={<NakshatraPrediction/>} />
          <Route path= {"/rasi-prediction"} element={<RasiPrediction/>} />
          <Route path= {"/panchang-prediction"} element={<PanchangPrediction/>} />
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
