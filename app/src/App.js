import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

//npm i nodemon express express-formidable jsonwebtoken multer mongoose express-async-handler dotenv cors cookie-parser concurrently bcryptjs passport passport-google-oauth20 cookie-session
//npm i slick-carousel react-slick react-toastify react-router react-router-dom react-redux react-icons apexcharts react-apexcharts moment flowbite axios @reduxjs/toolkit @paypal/react-paypal-js

import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from 'react-router-dom';
import Root from './components/Root';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Cookies from 'js-cookie';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/password/ForgotPassword'
import ResetPassword from './pages/password/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';
import Profile from './pages/Profile';
import AdminRoutes from './pages/admin/AdminRoutes';
import UserList from './pages/admin/userList/UserList';
import RefreshToken from './pages/auth/RefreshToken';
import CategoryList from './pages/admin/CategoryList';
import ProductsList from './pages/admin/products/ProductsList';
import PorductsEdit from './pages/admin/products/ProductsEdit'
import AddProduct from './pages/admin/products/AddProduct';
import OrdersList from './pages/admin/orders/OrdersList';
import SingleOrder from './pages/admin/orders/SingleOrder';

function App() {

  const accessToken = Cookies.get('accessToken') ? Cookies.get('accessToken') : null;
  const jwt = Cookies.get('jwt') ? Cookies.get('jwt') : null;
  const userInfo = Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')) : null
  console.log(userInfo)



  const router = createBrowserRouter(createRoutesFromElements(
    <Route path='/' element={<Root />}>
      <Route index element={<Home />} />
      <Route path='auth'>
        <Route path='login' element={accessToken && userInfo.isVerified ?
          <Navigate to={'/'} replace /> : <Login />} />
        <Route path='register' element={accessToken && userInfo.isVerified ?
          <Navigate to={'/'} replace /> : <Register />} />
        <Route path='verify/:id/:accessToken' element={<VerifyEmail />} />
      </Route>
      <Route path='password'>
        <Route path='forgot' element={<ForgotPassword />} />
        <Route path={`reset/:id/:accessToken`} element={<ResetPassword />} />
      </Route>



      {/* Admin Routes */}
      <Route path='admin' element={accessToken && userInfo.isAdmin && userInfo.isVerified ? <AdminRoutes /> : <Navigate to={'/auth/login'} replace />} >
        <Route path='userList' element={<UserList />} />
        <Route path='profile' element={<Profile />} />
        <Route path='categoryList' element={<CategoryList />} />
        <Route path='productsList' element={<ProductsList />} />
        <Route path='PorductsEdit/:id' element={<PorductsEdit />} />
        <Route path='productsList/AddProduct' element={<AddProduct />} />
        <Route path='orderList' element={<OrdersList />} />
        <Route path='orderList/:id' element={<SingleOrder />} />
      </Route>


    </Route>
  ));


  return <>
    {jwt && <RefreshToken />}
    <RouterProvider router={router} />
  </>
}

export default App;
