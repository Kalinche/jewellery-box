import Layout from "./components/Layout";
import './App.css'
import Home from "./pages/Home";
import ErrorPage from "./pages/Error";
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import Register from "./components/authentication/RegisterForm";
import Login from "./components/authentication/LoginForm";
import ProfileView from "./components/ProfileView";
import Logout from "./components/authentication/Logout";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddJewellery from "./components/AddJewelleryForm";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} loader={() => sessionStorage.getItem("token")} errorElement={<ErrorPage />}>
      <Route index element={<Home />}></Route>
      <Route path="register" element={<Register />}></Route>
      <Route path="login" element={<Login />}></Route>
      <Route path="logout" element={<Logout />}></Route>
      <Route path="profile" element={<ProfileView />}></Route>
      <Route path="jewelleries">
        <Route index element={<AddJewellery />}></Route>
      </Route>
    </Route>
  )
);

function App() {
  return <div>
    <ToastContainer />
    <RouterProvider router={router} />
  </div>
}

export default App;
