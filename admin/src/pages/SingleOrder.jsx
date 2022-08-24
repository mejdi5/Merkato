import React,{useState, useEffect} from 'react'
import styles from '../styles/SingleOrder.module.css'
import Sidebar from '../components/Sidebar'
import { Fetch } from '../Fetch';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { AiFillDelete } from 'react-icons/ai'
import ReactDataGrid from 'react-data-grid';
import { getProducts } from '../redux/productSlice';


const SingleOrder = () => {

    const orders = useSelector(state => state.orderSlice.orders)
    const marketPlaces = useSelector(state => state.marketPlaceSlice.marketPlaces)
    const products = useSelector(state => state.productSlice.products)
    const users = useSelector(state => state.userSlice.users)
    const orderId = useParams().orderId
    const currentOrder = orders.find(order => order?._id === orderId)
    const customer = users.find(u => u?._id === currentOrder.userId)
    const domain = marketPlaces.find(m => m?._id === currentOrder.domainId)
    const dispatch = useDispatch()
    const navigate = useNavigate()


    useEffect(() => {
      const getOrderProducts = async () => {
          try {
          const res = await Fetch.get(`/products/${domain?._id}`, {headers: {token: localStorage.token}}); 
          dispatch(getProducts(res.data));
          } catch (error) {
              console.log(error)
          }
      };
      getOrderProducts();
      }, [products]);


    const rows = currentOrder.products.map((item) => {
      const product = products && products.find(p => p?._id === item?.productId)
      return {
      id: product?._id,
      title: (
        <div className={styles.productTitle}>
          <img 
          className={styles.image} 
          src={product?.image} 
          alt="" 
          />
          {product?.title}
        </div>
      ),
      category: product?.category,
      size: product?.size || '',
      color: product?.color || '',
      unit_price: `${product?.price} TND`,
      quantity: item?.quantity,
      price: `${item?.quantity*product?.price} TND` 
      }})
      
      const columns = [
      {
          key: "id",
          name: "PRODUCT ID",
          width: 200
      },
      {
          key: "title",
          name: "TITLE",
      },
      {
          key: "category",
          name: "CATEGORY",
          width: 150
      },
      {
          key: "color",
          name: "COLOR",
          width: 100
      },
      {
          key: "size",
          name: "SIZE",
          width: 100
      },
      {
        key: "unit_price",
        name: "UNIT PRICE",
        width: 100
      },
      {
        key: "quantity",
        name: "QUANTITY",
        width: 100
      },
      {
          key: "price",
          name: "PRICE",
          width: 100
      },
      
  ]


return (
<div className={styles.container}>
    <Sidebar/>
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <h2>ORDER DETAILS</h2>
      </div>
      <div className={styles.info}>
        <div className={styles.orderId}>
          <span className={styles.domainLabel}>ORDER ID:</span>
          <span>{orderId}</span>
        </div>
        <div className={styles.domainId}>
          <span className={styles.domainLabel}>DOMAIN ID:</span>
          <span>{domain?._id}</span>
        </div>
        <div className={styles.domainName}>
          <span className={styles.domainLabel}>DOMAIN NAME:</span>
          <span>{domain?.name}</span>
        </div>
        <div className={styles.domainId}>
          <span className={styles.domainLabel}>CUSTOMER ID:</span>
          <span>{customer?._id}</span>
        </div>
        <div className={styles.domainName}>
          <span className={styles.domainLabel}>CUSTOMER NAME:</span>
          <span>{customer?.name}</span>
        </div>
      </div>
    {/*
    {msg && <div className='user-delete-msg'>{msg}</div>} 
    */}
      <ReactDataGrid
      className={styles.datagrid}
      columns={columns}
      rows={rows}
      />
      <br></br>
      <div className={styles.details}>
        <span>Total Products: {`${currentOrder?.total} TND`}</span> 
        <span>Delivery: {`${currentOrder?.deliveryCost} TND`}</span> 
        <span>Fees: {`${currentOrder?.fees} TND`}</span> 
        <span className={styles.total}>Order total: {`${currentOrder?.totalToPay} TND`}</span>
      </div>
    </div>
</div>)}

export default SingleOrder