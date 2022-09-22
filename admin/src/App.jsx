import React from 'react'
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom'
import {useSelector} from 'react-redux'
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Loading from './pages/Loading'
import AllUsers from './pages/AllUsers';
import AllDomains from './pages/AllDomains';
import AllOrders from './pages/AllOrders';
import AllTaxes from './pages/AllTaxes';
import UserOrders from './pages/UserOrders';
import DomainOrders from './pages/DomainOrders';
import DomainProducts from './pages/DomainProducts'
import SingleOrder from './pages/SingleOrder'
import AllDeliveryGuys from './pages/AllDeliveryGuys';
import Profile from './pages/Profile';


function App() {

  const isLoading = useSelector(state => state.userSlice.isLoading) 
  const user = useSelector(state => state.userSlice.user)


return (
<BrowserRouter>
  <Routes>
    <Route path="/" element={
      (user && user.userType === "admin")
      ? 
      <Dashboard/>
      : isLoading ?
      <Loading/>
      :
      <Home/>
    }/>

    <Route path="/users" element={
      (user && user.userType === "admin") 
      ? 
      <AllUsers/> 
      : 
      <Navigate to="/"/>
    }/> 

    <Route path="/delivery-guys" element={
      (user && user.userType === "admin") 
      ? 
      <AllDeliveryGuys/> 
      : 
      <Navigate to="/"/>
    }/> 

    <Route path="/domains" element={
      (user && user.userType === "admin") 
      ? 
      <AllDomains/> 
      : 
      <Navigate to="/"/>
    }/>

    <Route path="/allOrders" element={
      (user && user.userType === "admin") 
      ? 
      <AllOrders/> 
      : 
      <Navigate to="/"/>
    }/>

    <Route path="/taxes" element={
      (user && user.userType === "admin") 
      ? 
      <AllTaxes/> 
      : 
      <Navigate to="/"/>
    }/>

    <Route path="/user-orders/:userId" element={
      (user && user.userType === "admin") 
      ? 
      <UserOrders/> 
      : 
      <Navigate to="/"/>
    }/>

    <Route path="/domain-orders/:domainId" element={
      (user && user.userType === "admin") 
      ? 
      <DomainOrders/> 
      : 
      <Navigate to="/"/>
    }/>

    <Route path="/domain-products/:domainId" element={
      (user && user.userType === "admin") 
      ? 
      <DomainProducts/> 
      : 
      <Navigate to="/"/>
    }/>

    <Route path="/allOrders/:orderId" element={
      (user && user.userType === "admin") 
      ? 
      <SingleOrder/> 
      : 
      <Navigate to="/"/>
    }/>

    <Route path="/user-orders/:userId/:orderId" element={
      (user && user.userType === "admin") 
      ? 
      <SingleOrder/> 
      : 
      <Navigate to="/"/>
    }/>

    <Route path="/domain-orders/:domainId/:orderId" element={
      (user && user.userType === "admin") 
      ? 
      <SingleOrder/> 
      : 
      <Navigate to="/"/>
    }/>

    <Route path="/profile/:adminId" element={
      (user && user.userType === "admin") 
      ? 
      <Profile/> 
      : 
      <Navigate to="/"/>
    }/>
  </Routes>
</BrowserRouter>
)}

export default App;
