import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import InvoiceAuto from "./components/InvoiceAuto";
import Footer from "./components/Footer";
import InvoiceManu from "./components/InvoiceManu";
import HandleProducts from "./components/HandleProducts";
import Settings from "./components/Settings";
import NewProduct from "./components/NewProduct";
import InvoicesHistory from "./components/InvoicesHistory";
import HandleClients from "./components/HandleClients";
import NewClient from "./components/NewClient";
import Contact from "./components/Contact";
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
              <Navbar/>
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
            </>
          }
        />

        <Route
          exact
          path="/handleProducts"
          element={
            <>
              <Navbar/>
              <HandleProducts/>
            </>
          }
        />
         <Route
          exact
          path="/HandleClients"
          element={
            <>
              <Navbar/>
              <HandleClients/>
            </>
          }
        />

        <Route
          exact
          path="/settings"
          element={
            <>
              <Navbar/>
              <Settings/>
            </>
          }
        />
        <Route
          exact
          path="/NewProduct"
          element={
            <>
              <Navbar/>
              <NewProduct/>
            </>
          }
        />
        <Route
          exact
          path="/InvoicesHistory"
          element={
            <>
              <Navbar/>
              <InvoicesHistory/>
            </>
          }
        />
        <Route
          exact
          path="/NewClient"
          element={
            <>
              <Navbar/>
              <NewClient/>
            </>
          }
        />
         <Route
          exact
          path="/Contact"
          element={
            <>
              <Navbar/>
              <Contact/>
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
