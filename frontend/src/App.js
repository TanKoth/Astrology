import logo from './logo.svg';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import {BrowserRouter as Router, Routes, Route,useLocation} from 'react-router-dom';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import {AppProvider} from './context/AppContext';
import Header from './component/Header';
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
          <Route path = {"/register"} element ={<Register/>} />
          <Route path = {"/dashboard"} element = {<Dashboard/>} />
          {/* Add more routes as needed */} 
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
