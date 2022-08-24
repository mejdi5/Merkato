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
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css';
import {HiStatusOnline, HiOutlineStatusOffline} from 'react-icons/hi'


const AllDomains = () => {

    const users = useSelector(state => state.userSlice.users)
    const marketPlaces = useSelector(state => state.marketPlaceSlice.marketPlaces)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [msg, setMsg] = useState(null)
    const [error, setError] = useState(null)
    
    const handleDeleteDomain = async (e, id) => {
        e.preventDefault();
    try {
        const res = await Fetch.delete(`/marketPlaces/${id}`, {headers: {token: localStorage.token}})
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

    const handleBlockDomain = async (e, id) => {
        e.preventDefault();
        try {
            const res = await Fetch.put(`/marketPlaces/${id}`, {isBlocked: true}, {headers: {token: localStorage.token}})
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
            const res = await Fetch.put(`/marketPlaces/${id}`, {isBlocked: false}, {headers: {token: localStorage.token}})
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
    }, [marketPlaces]);


    const rows = marketPlaces.map((domain) => {
        const user = users?.find(u => u?._id === domain.userId)
    return {
    id: domain._id,
    userId: domain.userId,
    userName: user?.name,
    name: domain.name,
    category: domain.category,
    position: domain.position,
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
        key: "userId",
        name: "MANAGER ID",
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
        key: "action",
        name: "ACTION",
    },
]


return (
<div className={styles.container}>
    <Sidebar/>
    <div className={styles.wrapper}>
    <div className={styles.title}><h2>ALL DOMAINS</h2></div>
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