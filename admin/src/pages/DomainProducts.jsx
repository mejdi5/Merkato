import React, { useState, useEffect } from 'react'
import styles from '../styles/DomainProducts.module.css'
import Sidebar from '../components/Sidebar'
import { Fetch } from '../Fetch';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { AiFillDelete, AiFillEye } from 'react-icons/ai'
import ReactDataGrid from 'react-data-grid';
import {getProducts} from '../redux/productSlice'
import ProductImageModal from '../components/ProductImageModal';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css';
import {MdOfflineBolt} from 'react-icons/md'


const DomainProducts = () => {

    const marketPlaces = useSelector(state => state.marketPlaceSlice.marketPlaces)
    const products = useSelector(state => state.productSlice.products)
    const domainId = useParams().domainId
    const currentDomain = marketPlaces.find(m => m?._id === domainId)
    const dispatch = useDispatch()
    const [msg, setMsg] = useState(null)
    const [error, setError] = useState(null)
    const [showProduct, setShowProduct] = useState(false)
    const [productImage, setProductImage] = useState(null)
    const [title, setTitle] = useState(null)
    const [category, setCategory] = useState('')
    const [color, setColor] = useState('')
    const [size, setSize] = useState('')
    const [status, setStatus] = useState('')

  const handleDeleteProduct = async (id) => {
    try {
      const res = await Fetch.delete(`/products/${id}`, {headers: {token: localStorage.token}})
      const response = await Fetch.get(`/products/${domainId}`, {headers: {token: localStorage.token}}); 
      dispatch(getProducts(response.data));
      setMsg(res.data)
      setTimeout(() => setMsg(null), 5000)
    } catch (error) {
      setError('Action not allowed')
      setTimeout(() => setError(null), 5000)
    }
  };

  const confirmDeletingProduct = (id) => {
    confirmAlert({
        title: 'Delete Product',
        message: `Do you really want to delete this product definitevely ?`,
        buttons: [
        {
            label: 'Yes',
            onClick: () => handleDeleteProduct(id)
        },
        {
            label: 'No',
        }
    ]
    });
};

  useEffect(() => {
    const getDomainProducts = async () => {
        try {
        const res = await Fetch.get(`/products/${domainId}`, {headers: {token: localStorage.token}}); 
        dispatch(getProducts(res.data));
        } catch (error) {
            console.log(error)
        }
    };
    getDomainProducts();
    }, []);

    const rows = products && products.filter(product => 
      status === "in stock" 
      ? product.inStock 
      : status === "out of stock"
      ? !product.inStock 
      : true
      )
      .filter(product => title ? product?.title?.toLowerCase().trim().startsWith(title.toLowerCase().trim()) : true)
      .filter(product => category ? product?.category?.toLowerCase().trim().startsWith(category.toLowerCase().trim()) : true)
      .filter(product => color ? product?.color?.toLowerCase().trim().startsWith(color.toLowerCase().trim()) : true)
      .filter(product => size ? product?.size?.toLowerCase().trim().startsWith(size.toLowerCase().trim()) : true)
    .map((product) => {
    return {
    id: product._id,
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
    category: product.category || '',
    size: product?.size || '',
    color: product?.color || '',
    price: `${product.price} TND`,
    inStock: product.inStock 
    ? (
        <div className={styles.stock}>
            <MdOfflineBolt className={styles.inStock}/>
            <span>In Stock</span>
        </div>
    )
    : (
        <div className={styles.stock}>
            <MdOfflineBolt className={styles.outOfStock}/>
            <span>Out Of Stock</span>
        </div>
    ),
    action: (
        <div className={styles.action}>
            <AiFillEye 
            className={styles.visibilityIcon}
            onClick={() => {product?.image &&
              setProductImage(product.image);
              setShowProduct(true)
              }
            }
            />
            <AiFillDelete
            className={styles.deleteIcon}
            onClick={() => confirmDeletingProduct(product._id)}
            />
            {showProduct && 
            <ProductImageModal
            productImage={productImage}
            setProductImage={setProductImage}
            showProduct={showProduct}
            setShowProduct={setShowProduct}
            />
            }
        </div>
    )}})
    
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
        key: "price",
        name: "PRICE",
        width: 100
    },
    {
        key: "inStock",
        name: "STATUS",
        width: 130
    },
    {
        key: "action",
        name: "ACTION",
        width: 50
    },
]


return (
<div className={styles.container}>
    <Sidebar/>
    <div className={styles.wrapper}>
    <div className={styles.title}><h2>{currentDomain?.name?.toUpperCase()} PRODUCTS</h2></div>
    <div className={styles.info}>
      <div className={styles.domainId}>
        <span className={styles.domainLabel}>DOMAIN ID:</span>
        <span>{currentDomain?._id}</span>
      </div>
      <div className={styles.domainName}>
        <span className={styles.domainLabel}>DOMAIN NAME:</span>
        <span>{currentDomain?.name}</span>
      </div>
    </div>
    <div className={styles.header}>
        <input
        className={styles.search}
        type='text'
        placeholder='Title..'
        value={title}
        onChange={e => setTitle(e.target.value)}
        />
        <input
        className={styles.search}
        type='text'
        placeholder='Category..'
        value={category}
        onChange={e => setCategory(e.target.value)}
        />
        <input
        className={styles.search}
        type='text'
        placeholder='Color..'
        value={color}
        onChange={e => setColor(e.target.value)}
        />
        <input
        className={styles.search}
        type='text'
        placeholder='Size..'
        value={size}
        onChange={e => setSize(e.target.value)}
        />
        <select onChange={e => setStatus(e.target.value)} className={styles.search}>
            <option value="all">All</option>
            <option value="in stock">In Stock</option>
            <option value="out of stock">Out Of Stock</option>
        </select>
    </div>
    {msg && <div className={styles.msg}>{msg}</div>} 
    {error && <div className={styles.error}>{error}</div>}
    {products && products?.length > 0 &&
    <ReactDataGrid
    className={styles.datagrid}
    columns={columns}
    rows={rows}
    />
    }
    </div>
</div>
)}

export default DomainProducts