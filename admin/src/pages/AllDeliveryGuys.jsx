import React, {useEffect, useState} from 'react'
import styles from '../styles/AllDeliveryGuys.module.css'
import Sidebar from '../components/Sidebar'
import { getAllDeliveryGuys } from '../redux/userSlice';
import { getOrders } from '../redux/orderSlice';
import { Fetch } from '../Fetch';
import { useDispatch, useSelector } from 'react-redux'
import { GrAdd } from 'react-icons/gr'
import { AiFillDelete , AiOutlineEuro } from 'react-icons/ai'
import ReactDataGrid from 'react-data-grid';
import AddDeliveryGuyModal from '../components/AddDeliveryGuyModal';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css';
import {HiStatusOnline, HiOutlineStatusOffline} from 'react-icons/hi'
import {BiBlock} from 'react-icons/bi'
import {CgUnblock} from 'react-icons/cg'


const AllDeliveryGuys = () => {

    const deliveryGuys = useSelector(state => state.userSlice.deliveryGuys)
    const orders = useSelector(state => state.orderSlice.orders)
    const dispatch = useDispatch()
    const [msg, setMsg] = useState(null)
    const [error, setError] = useState(null)
    const [show, setShow] = useState(false)
    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [status, setStatus] = useState('all')
    
    const handleDeleteDeliveryGuy = async (id) => {
    try {
        await Fetch.delete(`/users/${id}`, {headers: {token: localStorage.token}})
        const res = await Fetch.get("/users/delivery-guys", {headers: {token: localStorage.token}}); 
        dispatch(getAllDeliveryGuys(res.data));
        setMsg("Delivery guy has been deleted..")
        setTimeout(() => setMsg(null), 5000)
    } catch (error) {
        setError('Action not allowed')
        setTimeout(() => setError(null), 5000)
    }
    };

    const confirmDeletingDeliveryGuy = (id) => {
        const deliveryGuyToDelete = deliveryGuys?.find(u => u?._id === id)
        confirmAlert({
            title: 'Delete Delivery Guy',
            message: `Do you really want to delete ${deliveryGuyToDelete?.name} definitevely ?`,
            buttons: [
            {
                label: 'Yes',
                onClick: () => handleDeleteDeliveryGuy(id)
            },
            {
                label: 'No',
            }
        ]
        });
    };

    const handlePayDeliveryGuy = async (e, id) => {
        e.preventDefault();
    try {
        await Fetch.put(`/users/pay/${id}`, {paymentDate: Date.now()}, {headers: {token: localStorage.token}})
        const res = await Fetch.get("/users/delivery-guys", {headers: {token: localStorage.token}}); 
        dispatch(getAllDeliveryGuys(res.data));
        setMsg("a delivery guy has been set as paid")
        setTimeout(() => setMsg(null), 5000)
    } catch (error) {
        console.log(error)
        setError('Action not allowed')
        setTimeout(() => setError(null), 5000)
    }
    };

    const confirmPayingDeliveryGuy = (e, id) => {
        const deliveryGuyToPay = deliveryGuys?.find(d => d?._id === id)
        confirmAlert({
            title: 'MARK AS PAID',
            message: `Do you really want to set ${deliveryGuyToPay?.name} as paid ? if you type Yes, revenue will be reset to 0 TND`,
            buttons: [
            {
                label: 'Yes',
                onClick: () => handlePayDeliveryGuy(e, id)
            },
            {
                label: 'No',
            }
        ]
        });
    };

    const handleBlockDeliveryGuy = async (e, id) => {
        e.preventDefault();
        try {
            await Fetch.put(`/users/deliveryGuy/${id}`, {isBlocked: true}, {headers: {token: localStorage.token}})
            const res = await Fetch.get("/users/delivery-guys", {headers: {token: localStorage.token}}); 
            dispatch(getAllDeliveryGuys(res.data));
            setMsg("Delivery Guy blocked")
            setTimeout(() => setMsg(null), 5000)
        } catch (error) {
            console.log(error)
            setError('Action not allowed')
            setTimeout(() => setError(null), 5000)
        }
    };

    const handleUnblockDeliveryGuy = async (e, id) => {
        e.preventDefault();
        try {
            await Fetch.put(`/users/deliveryGuy/${id}`, {isBlocked: false}, {headers: {token: localStorage.token}})
            const res = await Fetch.get("/users/delivery-guys", {headers: {token: localStorage.token}}); 
            dispatch(getAllDeliveryGuys(res.data));
            setMsg("Delivery Guy unblocked")
            setTimeout(() => setMsg(null), 5000)
        } catch (error) {
            console.log(error)
            setError('Action not allowed')
            setTimeout(() => setError(null), 5000)
        }
    };

    useEffect(() => {
        const getDeliveryGuys = async () => {
            try {
            const res = await Fetch.get("/users/delivery-guys", {headers: {token: localStorage.token}}); 
            dispatch(getAllDeliveryGuys(res.data));
            } catch (error) {
                console.log(error)
            }
        };
        return () => {
            getDeliveryGuys()
        }
    }, []);

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
    }, []);


    const rows = deliveryGuys?.filter(deliveryGuy => status === "active" 
    ? !deliveryGuy.isBlocked 
    : status === "suspended"
    ? deliveryGuy.isBlocked 
    : (deliveryGuy.isBlocked || !deliveryGuy.isBlocked ))
    .filter(deliveryGuy => deliveryGuy.address.toLowerCase().trim().startsWith(address.toLowerCase().trim()))
    .filter(deliveryGuy => deliveryGuy.name.toLowerCase().trim().startsWith(name.toLowerCase().trim()))
    .map((deliveryGuy) => {
        const deliveryOrders = orders.filter(order => order?.deliveredBy === deliveryGuy?._id)
        const nonPaidDeliveryOrders = deliveryOrders.filter(order => (order.deliveryDate > deliveryGuy.paymentDate || !deliveryGuy.paymentDate))
        const deliveryRevenue = nonPaidDeliveryOrders.length > 0 
            ? nonPaidDeliveryOrders.map(order => order.deliveryCost).reduce((a,b) => a + b)
            : 0
        const merkatoRevenue = deliveryOrders.length > 0 
            ? deliveryOrders.map(order => order.fees).reduce((a,b) => a + b)
            : 0
        const domainsRevenue = deliveryOrders.length > 0 
        ? deliveryOrders.map(order => order.total).reduce((a,b) => a + b)
        : 0
    return {
    cin: deliveryGuy?.cin,
    name: (
        <div className={styles.name}>
            <img 
            className={styles.image} 
            src={deliveryGuy?.image || "https://crowd-literature.eu/wp-content/uploads/2015/01/no-avatar.gif"} 
            alt="" 
            />
            {deliveryGuy?.name?.toUpperCase()}
        </div>
        ),
    email: deliveryGuy?.email,
    phoneNumber: deliveryGuy?.phoneNumber,
    address: deliveryGuy?.address,
    deliveryRevenue: `${deliveryRevenue} TND`,
    merkatoRevenue: `${merkatoRevenue} TND`,
    domainsRevenue: `${domainsRevenue} TND`,
    isBlocked: deliveryGuy?.isBlocked 
        ? (
            <div className={styles.isBlocked}>
                <HiOutlineStatusOffline className={styles.offline}/>
                <span>Suspended</span>
            </div>
        )
        : (
            <div className={styles.isBlocked}>
                <HiStatusOnline className={styles.online}/>
                <span>Active</span>
            </div>
        ),
    action: (
        <div className={styles.action}>
            {!deliveryGuy.isBlocked 
            ? 
            <BiBlock 
            className={styles.blockIcon} 
            onClick={(e) => handleBlockDeliveryGuy(e, deliveryGuy?._id)}
            />
            : 
            <CgUnblock 
            className={styles.unBlockIcon} 
            onClick={(e) => handleUnblockDeliveryGuy(e, deliveryGuy?._id)}
            />
            }
            <AiOutlineEuro
            className={styles.payIcon} 
            onClick={(e) => confirmPayingDeliveryGuy(e, deliveryGuy?._id)}
            />
            <AiFillDelete
            className={styles.deleteIcon}
            onClick={() => confirmDeletingDeliveryGuy(deliveryGuy._id)}
            />
        </div>
    )
    }}).sort((a,b) => Number(b.merkatoRevenue.replace('TND', '').trim()) - Number(a.merkatoRevenue.replace('TND', '').trim()))
    
    const columns = [
    {
        key: "cin",
        name: "CIN",
        width: 80
    },
    {
        key: "name",
        name: "NAME",
        width: 200
    },
    {
        key: "email",
        name: "EMAIL",
        width: 150
    },
    {
        key: "phoneNumber",
        name: "PHONE",
        width: 80
    },
    {
        key: "address",
        name: "ADDRESS",
        width: 150
    },
    {
        key: "deliveryRevenue",
        name: "DELIVERY REVENUE",
        width: 150
    },
    {
        key: "merkatoRevenue",
        name: "MERKATO REVENUE",
        width: 150
    },
    {
        key: "domainsRevenue",
        name: "DOMAINS REVENUE",
        width: 160
    },
    {
        key: "isBlocked",
        name: "STATUS",
        width: 120
    },
    {
        key: "action",
        name: "ACTION",
        width: 80,
    },
    ]


return (
<div className={styles.container}>
    <Sidebar/>
    <div className={styles.wrapper}>
        <div className={styles.title}>
            <h2>ALL DELIVERY GUYS</h2>
        </div>
        <div className={styles.header}>
            <button className={styles.addDeliveryGuy} onClick={() => setShow(true)}>
                <GrAdd className={styles.addDeliveryGuyIcon}/>
            </button>
            <input
            className={styles.search}
            type='text'
            placeholder='Name..'
            value={name}
            onChange={e => setName(e.target.value)}
            />
            <input
            className={styles.search}
            type='text'
            placeholder='Address..'
            value={address}
            onChange={e => setAddress(e.target.value)}
            />
            <select onChange={e => setStatus(e.target.value)} className={styles.search}>
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
            </select>
        </div>
        {msg && <div className={styles.msg}>{msg}</div>} 
        {error && <div className={styles.error}>{error}</div>}
        {deliveryGuys &&
        <ReactDataGrid
        className={styles.datagrid}
        columns={columns}
        rows={rows}
        sortable={true}
        />
        }
        {show && 
        <AddDeliveryGuyModal
        show={show}
        setShow={setShow}
        />}
    </div>
</div>
)}

export default AllDeliveryGuys