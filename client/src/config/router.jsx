import {createBrowserRouter, createRoutesFromElements, Route, } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Checkout from "../pages/Checkout.jsx";

const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<App />}>
          <Route path="" element={<Home />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/checkout" element={<Checkout />} />
      </>
    )
  );
  
  export default router;