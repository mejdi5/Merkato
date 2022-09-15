import React, {useEffect, useState} from 'react'
import styles from '../styles/AllOrders.module.css'
import Sidebar from '../components/Sidebar'
import { Fetch } from '../Fetch';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { AiFillDelete, AiFillEye } from 'react-icons/ai'
import { MdDone } from 'react-icons/md'
import { TiDelete } from 'react-icons/ti'
import { RiLoader2Fill } from 'react-icons/ri'
import ReactDataGrid from 'react-data-grid';
import { getOrders } from '../redux/orderSlice';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css';



const AllOrders = () => {

    const users = useSelector(state => state.userSlice.users)
    const orders = useSelector(state => state.orderSlice.orders)
    const marketPlaces = useSelector(state => state.marketPlaceSlice.marketPlaces)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [msg, setMsg] = useState(null)
    const [error, setError] = useState(null)
    const [domainName, setDomainName] = useState('')
    const [customerName, setCustomerName] = useState('')
    const [governorate, setGovernorate] = useState('')
    const [status, setStatus] = useState('all')

    
    const handleDeleteOrder = async (id) => {
    try {
        const res = await Fetch.delete(`/orders/${id}`, {headers: {token: localStorage.token}})
        setMsg(res.data)
        setTimeout(() => setMsg(null), 5000)
    } catch (error) {
        setError('Action not allowed')
        setTimeout(() => setError(null), 5000)
    }
    };

    const confirmDeletingOrder = (id) => {
        confirmAlert({
            title: 'Delete Order',
            message: `Do you really want to delete this order definitevely ?`,
            buttons: [
            {
                label: 'Yes',
                onClick: () => handleDeleteOrder(id)
            },
            {
                label: 'No',
            }
        ]
        });
    };

    useEffect(() => {
    const getAllOrders = async () => {
        try {
        const res = await Fetch.get("/orders", {headers: {token: localStorage.token}}); 
        dispatch(getOrders(res.data));
        } catch (error) {
            console.log(error)
        }
    };
    getAllOrders();
    }, [orders]);


    const rows = orders?.filter(order => 
        status === "delivered" 
        ? order.status === "delivered"
        : status === "declined"
        ? order.status === "declined"
        : status === "in progress"
        ? order.status === "in progress"
        : true
    )
    .filter(order => {
        const customer = users?.find(u => u?._id === order?.userId)
        return customer.name.toLowerCase().trim().startsWith(customerName.toLowerCase().trim())
    })
    .filter(order => order.address.governorate?.toLowerCase().trim().startsWith(governorate.toLowerCase().trim()))
    .filter(order => {
            const domain = marketPlaces?.find(m => m?._id === order?.domainId)
            return domain?.name?.toLowerCase().trim().startsWith(domainName.toLowerCase().trim())
        })
    .map((order) => {
        const user = users?.find(u => u?._id === order?.userId)
        const domain = marketPlaces?.find(m => m?._id === order?.domainId)
    return {
    id: order._id,
    domainName: domain.name,
    userName: user?.name,
    total_products: `${order.total} TND`,
    deliveryCost: `${order.deliveryCost} TND`,
    fees: `${order.fees} TND`,
    total_to_pay: `${order.totalToPay} TND`,
    zipCode: order.address.zipcode || '',
    city: order.address.city || '',
    governorate: order.address.governorate || '',
    status: (
        <div className={styles.status}>
            {order.status === "delivered" 
            ? <MdDone className={styles.deliveredIcon}/>
            : order.status === "declined" 
            ? <TiDelete className={styles.declinedIcon}/>
            : <RiLoader2Fill className={styles.inProgressIcon}/>}
            {order.status}
        </div>
    ),
    action: (
        <div className={styles.action}>
            <AiFillEye 
            onClick={() => navigate(`${order?._id}`)}
            className={styles.visibilityIcon}
            />
            <AiFillDelete
            className={styles.deleteIcon}
            onClick={() => confirmDeletingOrder(order._id)}
            />
        </div>
    )
    }})

    
    
    const columns = [
    {
        key: "id",
        name: "ORDER ID",
        width: 100
    },
    {
        key: "domainName",
        name: "DOMAIN",
        width: 100
    },
    {
        key: "userName",
        name: "CUSTOMER",
        width: 100
    },
    {
        key: "total_products",
        name: "TOTAL PRODUCTS",
        width: 150
    },
    {
        key: "deliveryCost",
        name: "DELIVERY",
        width: 90
    },
    {
        key: "fees",
        name: "FEES",
        width: 40
    },
    {
        key: "total_to_pay",
        name: "TOTAL TO PAY",
        width: 115
    },
    {
        key: "zipcode",
        name: "ZIP CODE",
        width: 50
    },
    {
        key: "city",
        name: "CITY",
        width: 100
    },
    {
        key: "governorate",
        name: "GOVERNORATE",
        width: 130
    },
    {
        key: "status",
        name: "STATUS",
        width: 120
    },
    {
        key: "action",
        name: "ACTION",
        width: 100
    },
]


return (
<div className={styles.container}>
    <Sidebar/>
    <div className={styles.wrapper}>
    <div className={styles.title}><h2>ALL ORDERS</h2></div>
    <div className={styles.header}>
        <input
        className={styles.search}
        type='text'
        placeholder='Domain Name..'
        value={domainName}
        onChange={e => setDomainName(e.target.value)}
        />
        <input
        className={styles.search}
        type='text'
        placeholder='Customer Name..'
        value={customerName}
        onChange={e => setCustomerName(e.target.value)}
        />
        <input
        className={styles.search}
        type='text'
        placeholder='Governorate..'
        value={governorate}
        onChange={e => setGovernorate(e.target.value)}
        />
        <select onChange={e => setStatus(e.target.value)} className={styles.search}>
            <option value="all" defaultValue>All</option>
            <option value="in progress">In Progress</option>
            <option value="delivered">Delivered</option>
            <option value="declined">Declined</option>
        </select>
    </div>
    {msg && <div className={styles.msg}>{msg}</div>} 
    {error && <div className={styles.error}>{error}</div>}
    <ReactDataGrid
    className={styles.datagrid}
    columns={columns}
    rows={rows}
    />
    </div>
</div>
)}

export default AllOrders