import Header from "./components/Header";
import Home from "./components/Home";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login/Login.js";
import CreateAccount from "../src/components/Login/CreateAccount.js";


function App() {
  return (
    <div className="App">

      <Header />
      
      <Routes >
        <Route path="/" element={<Home />}> </Route>
        <Route path="/login" element ={<Login />}></Route>
        <Route path="/create-account" element ={<CreateAccount/>}></Route>
      </Routes>

    </div>
  );
}

export default App;
