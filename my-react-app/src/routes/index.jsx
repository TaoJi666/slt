import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/home/Home.jsx";
import Products from "../pages/products/product/index.jsx";
import Order from "../pages/order/Order.jsx";
import ClientList from "../pages/clientList/ClientList.jsx";
import EmployeeList from "../pages/employeeList/EmployeeList.jsx";
import ShoppingCart from "../pages/shoppingCart/ShoppingCart.jsx";
// import Detail from "../pages/detail/Detail.jsx";
import Login from "../pages/login/Login.jsx";
import ChangePassword from "../pages/changePassword/index.jsx";
// import Accessories from '../pages/accessories/Accessories.jsx'
// import Services from '../pages/services/Services.jsx'
// import EnterpriseInformation from "../pages/aboutUs/enterpriseInformation/EnterpriseInformation.jsx";
// import ContactUs from "../pages/aboutUs/contactUs/ContactUs.jsx";
// import Detail from "../pages/Detail/Detail.jsx";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      {/* 登陆 */}
      <Route path="/login" element={<Login />} />
      {/* 详情页 */}
      {/* <Route path="/detail" element={<Detail />} /> */}
      {/*首页*/}
      <Route path="/home" element={<Home />} />
      {/*产品*/}
      <Route path="/products" element={<Products />} />
      {/*订单*/}
      <Route path="/order" element={<Order />} />
      {/*客户列表*/}
      <Route path="/user-clientList" element={<ClientList />} />
      {/*员工列表*/}
      <Route path="/user-employeeList" element={<EmployeeList />} />
      {/*购物车*/}
      <Route path="/shoppingCart" element={<ShoppingCart />} />
      {/*<Route path='/products/ReciprocatingPistonCompressor' element={<Products/>}/>*/}
      {/*<Route path='/products/CentrifugalCompressor' element={<Products/>}/>*/}
      {/*<Route path='/products/Oil-injectedScrewCompressor' element={<Products/>}/>*/}
      {/*<Route path='/products/Oil-injectedScrewCompressor/detail' element={<Detail/>}/>*/}
      {/*<Route path='/products/Oil-freeAirCompressor' element={<Products/>}/>*/}
      {/*配件*/}
      {/*<Route path='/accessories/AccessoriesDisplay' element={<Accessories/>}/>*/}
      {/*<Route path='/accessories/SelectAccessories' element={<Accessories/>}/>*/}
      {/*服务*/}
      {/*<Route path='/services/OrderInquiry' element={<Services/>}/>*/}
      {/*<Route path='/services/LogisticsTracking' element={<Services/>}/>*/}
      {/*<Route path='/services/FreeQuotation' element={<Services/>}/>*/}
      {/*关于我们*/}
      {/*<Route path='/aboutUs/EnterpriseInformation' element={<EnterpriseInformation/>}/>*/}
      {/*<Route path='/aboutUs/ContactUs' element={<ContactUs/>}/>*/}
    </Routes>
  );
}

export default Router;
