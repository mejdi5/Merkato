import React, {useEffect, useState} from 'react'
import styles from '../styles/AllDomains.module.css'
import Sidebar from '../components/Sidebar'
import { Fetch } from '../Fetch';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { AiFillDelete, AiOutlineCreditCard } from 'react-icons/ai'
import {MdProductionQuantityLimits} from 'react-icons/md'
import ReactDataGrid from 'react-data-grid';
import { getMarketPlaces } from '../redux/marketPlaceSlice';
import {BiBlock} from 'react-icons/bi'
import {CgUnblock} from 'react-icons/cg'
import {AiOutlineEuro} from 'react-icons/ai'
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css';
import {HiStatusOnline, HiOutlineStatusOffline} from 'react-icons/hi'


const AllDomains = () => {

    const users = useSelector(state => state.userSlice.users)
    const marketPlaces = useSelector(state => state.marketPlaceSlice.marketPlaces)
    const orders = useSelector(state => state.orderSlice.orders)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [msg, setMsg] = useState(null)
    const [error, setError] = useState(null)
    const [name, setName] = useState('')
    const [managerName, setManagerName] = useState('')
    const [category, setCategory] = useState('')
    const [position, setPosition] = useState('')
    const [status, setStatus] = useState('all')
    
    const handleDeleteDomain = async (e, id) => {
        e.preventDefault();
    try {
        const res = await Fetch.delete(`/marketPlaces/${id}`, {headers: {token: localStorage.token}})
        const response = await Fetch.get("/marketPlaces", {headers: {token: localStorage.token}}); 
        dispatch(getMarketPlaces(response.data));
        setMsg(res.data)
        setTimeout(() => setMsg(null), 5000)
    } catch (error) {
        setError('Action not allowed')
        setTimeout(() => setError(null), 5000)
    }
    };

    const confirmDeletingDomain = (e, id) => {
        const domainToDelete = marketPlaces?.find(m => m?._id === id)
        confirmAlert({
            title: 'Delete Domain',
            message: `Do you really want to delete ${domainToDelete?.name} definitevely ?`,
            buttons: [
            {
                label: 'Yes',
                onClick: () => handleDeleteDomain(e, id)
            },
            {
                label: 'No',
            }
        ]
        });
    };

    const handlePayDomain = async (e, id) => {
        e.preventDefault();
    try {
        await Fetch.put(`/marketPlaces/pay/${id}`, {paymentDate: Date.now()}, {headers: {token: localStorage.token}})
        const res = await Fetch.get("/marketPlaces", {headers: {token: localStorage.token}}); 
        dispatch(getMarketPlaces(res.data));
        setMsg("a domain has been set as paid")
        setTimeout(() => setMsg(null), 5000)
    } catch (error) {
        console.log(error)
        setError('Action not allowed')
        setTimeout(() => setError(null), 5000)
    }
    };

    const confirmPayingDomain = (e, id) => {
        const domainToPay = marketPlaces?.find(m => m?._id === id)
        confirmAlert({
            title: 'MARK AS PAID',
            message: `Do you really want to set ${domainToPay?.name} as paid ? if you type Yes, revenue will be reset to 0 TND`,
            buttons: [
            {
                label: 'Yes',
                onClick: () => handlePayDomain(e, id)
            },
            {
                label: 'No',
            }
        ]
        });
    };

    const handleBlockDomain = async (e, id) => {
        e.preventDefault();
        try {
            await Fetch.put(`/marketPlaces/${id}`, {isBlocked: true}, {headers: {token: localStorage.token}})
            const res = await Fetch.get("/marketPlaces", {headers: {token: localStorage.token}}); 
            dispatch(getMarketPlaces(res.data));
            setMsg("Domain blocked")
            setTimeout(() => setMsg(null), 5000)
        } catch (error) {
            console.log(error)
            setError('Action not allowed')
            setTimeout(() => setError(null), 5000)
        }
    };

    const handleUnblockDomain = async (e, id) => {
        e.preventDefault();
        try {
            await Fetch.put(`/marketPlaces/${id}`, {isBlocked: false}, {headers: {token: localStorage.token}})
            const res = await Fetch.get("/marketPlaces", {headers: {token: localStorage.token}}); 
            dispatch(getMarketPlaces(res.data));
            setMsg("Domain unblocked")
            setTimeout(() => setMsg(null), 5000)
        } catch (error) {
            console.log(error)
            setError('Action not allowed')
            setTimeout(() => setError(null), 5000)
        }
    };

    useEffect(() => {
    const getAllMarketPlaces = async () => {
        try {
        const res = await Fetch.get("/marketPlaces", {headers: {token: localStorage.token}}); 
        dispatch(getMarketPlaces(res.data));
        } catch (error) {
            console.log(error)
        }
    };
    getAllMarketPlaces();
    }, []);


    const rows = marketPlaces?.filter(domain => 
    status === "online" 
    ? !domain.isBlocked 
    : status === "offline"
    ? domain.isBlocked 
    : (domain.isBlocked || !domain.isBlocked )
    )
    .filter(domain => category ? domain?.category?.toLowerCase().trim().startsWith(category.toLowerCase().trim()) : true)
    .filter(domain => domain.position?.toLowerCase().trim().startsWith(position.toLowerCase().trim()))
    .filter(domain => domain.name?.toLowerCase().trim().startsWith(name.toLowerCase().trim()))
    .filter(domain => {
        const manager = users?.find(u => u?._id === domain.userId)
        return manager?.name?.toLowerCase().trim().startsWith(managerName.toLowerCase().trim())
    })
    .map((domain) => {
        const user = users?.find(u => u?._id === domain.userId)
        const domainOrders = orders.filter(order => order.status === "delivered" && order.domainId === domain?._id && (order.deliveryDate > domain.paymentDate || !domain.paymentDate))
        const domainEarnings = domainOrders.map(order => order.total)
        const earning = domainEarnings.length > 0 ? domainEarnings.reduce((a,b) => a + b) : 0
    return {
    id: domain._id,
    userName: user?.name,
    name: domain.name,
    category: domain.category,
    position: domain.position,
    earning: `${earning} TND`,
    isBlocked: domain.isBlocked 
        ? (
            <div className={styles.isBlocked}>
                <HiOutlineStatusOffline className={styles.offline}/>
                <span>Offline</span>
            </div>
        )
        : (
            <div className={styles.isBlocked}>
                <HiStatusOnline className={styles.online}/>
                <span>Online</span>
            </div>
        ),
    action: (
        <div className={styles.action}>
            <MdProductionQuantityLimits 
            className={styles.productIcon}
            onClick={() => navigate(`/domain-products/${domain._id}`)}
            />
            <AiOutlineCreditCard 
            className={styles.orderIcon}
            onClick={() => navigate(`/domain-orders/${domain._id}`)}
            />
            {!domain.isBlocked 
            ? 
            <BiBlock 
            className={styles.blockIcon} 
            onClick={(e) => handleBlockDomain(e, domain?._id)}
            />
            : 
            <CgUnblock 
            className={styles.unBlockIcon} 
            onClick={(e) => handleUnblockDomain(e, domain?._id)}
            />
            }
            <AiOutlineEuro
            className={styles.payIcon} 
            onClick={(e) => confirmPayingDomain(e, domain?._id)}
            />
            <AiFillDelete
            className={styles.deleteIcon}
            onClick={(e) => confirmDeletingDomain(e, domain._id)}
            />
        </div>
    )}})
    
    const columns = [
    {
        key: "id",
        name: "DOMAIN ID",
    },
    {
        key: "name",
        name: "NAME",
    },
    {
        key: "userName",
        name: "MANAGER NAME",
    },
    {
        key: "category",
        name: "CATEGORY"
    },
    {
        key: "position",
        name: "POSITION",
        width: 130
    },
    {
        key: "isBlocked",
        name: "STATUS",
        width: 90
    },
    {
        key: "earning",
        name: "REVENUE"
    },
    {
        key: "action",
        name: "ACTION",
    },
]


return (
<div className={styles.container}>
    <Sidebar/>
    <div className={styles.wrapper}>
    <div className={styles.title}><h2>ALL DOMAINS</h2></div>
    <div className={styles.header}>
        <input
        className={styles.search}
        type='text'
        placeholder='Domain Name..'
        value={name}
        onChange={e => setName(e.target.value)}
        />
        <input
        className={styles.search}
        type='text'
        placeholder='Manager Name..'
        value={managerName}
        onChange={e => setManagerName(e.target.value)}
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
        placeholder='Position..'
        value={position}
        onChange={e => setPosition(e.target.value)}
        />
        <select onChange={e => setStatus(e.target.value)} className={styles.search}>
            <option value="all">All</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
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

export default AllDomains