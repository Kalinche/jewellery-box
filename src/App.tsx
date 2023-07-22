import Layout from "./components/Layout";
import './App.css'
import Home from "./pages/Home";
import ErrorPage from "./pages/Error";
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<ErrorPage />}>
      <Route index element={<Home />}></Route>
      <Route path="register" element={<Register />}></Route>
      <Route path="login" element={<Login />}></Route>
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
