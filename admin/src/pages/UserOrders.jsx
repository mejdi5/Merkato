import React, {useEffect, useState} from 'react'
import styles from '../styles/UserOrders.module.css'
import Sidebar from '../components/Sidebar'
import { Fetch } from '../Fetch';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { AiFillDelete, AiFillEye } from 'react-icons/ai'
import {MdDone} from 'react-icons/md'
import {TiDelete} from 'react-icons/ti'
import {RiLoader2Fill} from 'react-icons/ri'
import {BiArrowBack} from 'react-icons/bi'
import ReactDataGrid from 'react-data-grid';
import { getOrders } from '../redux/orderSlice';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css';


const UserOrders = () => {

    const users = useSelector(state => state.userSlice.users)
    const orders = useSelector(state => state.orderSlice.orders)
    const marketPlaces = useSelector(state => state.marketPlaceSlice.marketPlaces)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const userId = useParams().userId
    const [msg, setMsg] = useState(null)
    const user = users?.find(u => u?._id === userId)
    const [domainName, setDomainName] = useState('')
    const [governorate, setGovernorate] = useState('')
    const [status, setStatus] = useState('all')
    
    const handleDeleteOrder = async (id) => {
    try {
        const res = await Fetch.delete(`/orders/${id}`)
        setMsg(res.data.msg)
    } catch (error) {
        console.log(error.message)
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
    const getUserOrders = async () => {
        try {
        const res = await Fetch.get(`/orders/user-orders/${userId}`, {headers: {token: localStorage.token}}); 
        dispatch(getOrders(res.data));
        } catch (error) {
            console.log(error)
        }
    };
    getUserOrders();
    }, []);


    const rows = orders?.filter(order => 
        status === "delivered" 
        ? order.status === "delivered"
        : status === "declined"
        ? order.status === "declined"
        : status === "in progress"
        ? order.status === "in progress"
        : true
    )
    .filter(order => order.address.governorate?.toLowerCase().trim().startsWith(governorate.toLowerCase().trim()))
    .filter(order => {
            const domain = marketPlaces?.find(m => m?._id === order?.domainId)
            return domain?.name?.toLowerCase().trim().startsWith(domainName.toLowerCase().trim())
        })
    .map((order) => {
    const domain = marketPlaces?.find(m => m?._id === order?.domainId)
    return {
    id: order._id,
    domain: domain?.name,
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
        width: 150
    },
    {
        key: "domain",
        name: "DOMAIN",
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
        width: 150
    },
]


return (
<div className={styles.container}>
    <Sidebar/>
    <div className={styles.wrapper}>
    <div className={styles.title}><h2>{user?.name?.toUpperCase()} ORDERS</h2></div>
    <div className={styles.info}>
        <div className={styles.id}>
            <span className={styles.label}>CUSTOMER ID:</span>
            <span>{user?._id}</span>
        </div>
        <div className={styles.name}>
            <span className={styles.label}>CUSTOMER NAME:</span>
            <span>{user?.name}</span>
        </div>
    </div>
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
    {rows.length > 0 
    ?
    <ReactDataGrid
    className={styles.datagrid}
    columns={columns}
    rows={rows}
    />
    :
    <div className={styles.noOrders}>
        <p>This customer has no orders</p>
        <BiArrowBack 
        className={styles.backIcon}
        onClick={() => navigate(-1)}
        />
    </div>
    }
    </div>
</div>
)}

export default UserOrders