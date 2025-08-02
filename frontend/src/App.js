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


function AppRoutes() {
  const location = useLocation();
  const hideHeaderRoutes = ["/signup"];

  return (
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
        </Routes>
      
      </div>
    </AppProvider>
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
