import React, {useEffect, useState} from 'react'
import styles from '../styles/AllDeliveryGuys.module.css'
import Sidebar from '../components/Sidebar'
import { getAllDeliveryGuys } from '../redux/userSlice';
import { Fetch } from '../Fetch';
import { useDispatch, useSelector } from 'react-redux'
import { GrAdd } from 'react-icons/gr'
import { AiFillDelete } from 'react-icons/ai'
import ReactDataGrid from 'react-data-grid';
import AddDeliveryGuyModal from '../components/AddDeliveryGuyModal';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css';

const AllDeliveryGuys = () => {

    const deliveryGuys = useSelector(state => state.userSlice.deliveryGuys)
    const dispatch = useDispatch()
    const [msg, setMsg] = useState(null)
    const [error, setError] = useState(null)
    const [show, setShow] = useState(false)
    
    const handleDeleteDeliveryGuy = async (id) => {
    try {
        const res = await Fetch.delete(`/users/${id}`, {headers: {token: localStorage.token}})
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

    useEffect(() => {
    const getDeliveryGuys = async () => {
        try {
        const res = await Fetch.get("/users/delivery-guys", {headers: {token: localStorage.token}}); 
        dispatch(getAllDeliveryGuys(res.data));
        } catch (error) {
            console.log(error)
        }
    };
    getDeliveryGuys();
    }, [deliveryGuys]);


    const rows = deliveryGuys?.map((deliveryGuy) => {
    return {
    id: deliveryGuy?._id,
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
    action: (
        <div className={styles.action}>
            <AiFillDelete
            className={styles.deleteIcon}
            onClick={() => confirmDeletingDeliveryGuy(deliveryGuy._id)}
            />
        </div>
    )
    }})
    
    const columns = [
    {
        key: "id",
        name: "DELIVERY GUY ID",
    },
    {
        key: "cin",
        name: "CIN",
        width: 100
    },
    {
        key: "name",
        name: "NAME",
        width: 250
    },
    {
        key: "email",
        name: "EMAIL",
        width: 150
    },
    {
        key: "phoneNumber",
        name: "PHONE NUMBER"
    },
    {
        key: "address",
        name: "ADDRESS",
        width: 400
    },
    {
        key: "action",
        name: "ACTION",
        width: 100,
    },
    ]


return (
<div className={styles.container}>
    <Sidebar/>
    <div className={styles.wrapper}>
        <div className={styles.title}><h2>ALL DELIVERY GUYS</h2></div>
        <button className={styles.addDeliveryGuy} onClick={() => setShow(true)}>
            <GrAdd className={styles.addDeliveryGuyIcon}/>
        </button>
        {msg && <div className={styles.msg}>{msg}</div>} 
        {error && <div className={styles.error}>{error}</div>}
        {deliveryGuys &&
        <ReactDataGrid
        className={styles.datagrid}
        columns={columns}
        rows={rows}
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