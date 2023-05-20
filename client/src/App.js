import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import InvoiceAuto from "./components/InvoiceAuto";
function App() {
  return (
    <Router>
      <Routes>
        <Route
          exact
          path="/"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />
        <Route
          exact
          path="/Home"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />
        <Route
          exact
          path="/Login"
          element={
            <>
              <Login />
            </>
          }
        />
        <Route
          exact
          path="/Register"
          element={
            <>
              <Register />
            </>
          }
        />
        <Route
          exact
          path="/invoiceAuto"
          element={
            <>
              <InvoiceAuto />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
