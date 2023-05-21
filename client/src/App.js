import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import InvoiceAuto from "./components/InvoiceAuto";
import Footer from "./components/Footer";
import InvoiceManu from "./components/InvoiceManu";
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
              <Footer/>
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
              <Footer/>
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

<Route
          exact
          path="/invoiceManu"
          element={
            <>
            <Navbar/>
              <InvoiceManu />
              <Footer/>
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
