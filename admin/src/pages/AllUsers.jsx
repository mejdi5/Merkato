import React, {useEffect, useState} from 'react'
import styles from '../styles/AllUsers.module.css'
import Sidebar from '../components/Sidebar'
import { getAllUsers } from '../redux/userSlice';
import { Fetch } from '../Fetch';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { GrAdd } from 'react-icons/gr'
import { AiFillDelete, AiOutlineCreditCard } from 'react-icons/ai'
import ReactDataGrid from 'react-data-grid';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css';


const AllUsers = () => {

    const users = useSelector(state => state.userSlice.users)
    const orders = useSelector(state => state.orderSlice.orders)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [msg, setMsg] = useState(null)
    const [error, setError] = useState(null)


    const getUserTransactions = id =>  {
      if (orders.some((order) => order.userId === id && order.status !== "declined")) {
        return `${orders.filter((order) => order.userId === id && order.status !== "declined")?.map(order => order.totalToPay)?.reduce((a,b) => a + b)} TND`
      } else {
        return;
      }
    }
    
  const handleDeleteUser = async (id) => {
    try {
      const res = await Fetch.delete(`/users/${id}`, {headers: {token: localStorage.token}})
      setMsg(res.data)
      setTimeout(() => setMsg(null), 5000)
    } catch (error) {
      setError('Action not allowed')
      setTimeout(() => setError(null), 5000)
    }
  };

  const confirmDeletingUser = (id) => {
    const userToDelete = users?.find(u => u?._id === id)
    confirmAlert({
        title: 'Delete User',
        message: `Do you really want to delete ${userToDelete?.name} definitevely ?`,
        buttons: [
        {
            label: 'Yes',
            onClick: () => handleDeleteUser(id)
        },
        {
            label: 'No',
        }
    ]
    });
  };


  useEffect(() => {
    const getUsers = async () => {
        try {
        const res = await Fetch.get("/users", {headers: {token: localStorage.token}}); 
        dispatch(getAllUsers(res.data));
        } catch (error) {
          console.log(error)
        }
    };
    getUsers();
    }, [users]);

    const rows = users.map((user) => {
      return {
      id: user?._id,
      cin: user?.cin,
      name: (
          <div className={styles.name}>
            <img 
            className={styles.image} 
            src={user?.image || "https://crowd-literature.eu/wp-content/uploads/2015/01/no-avatar.gif"}
            alt="" 
            />
            {user?.name?.toUpperCase()}
          </div>
        ),
      email: user?.email,
      phoneNumber: user?.phoneNumber,
      address: user?.address,
      transactions: getUserTransactions(user?._id),
      isVerified: user?.isVerified ? "Verified" : "Unverified",
      action: (
        <div className={styles.action}>
          <AiOutlineCreditCard 
          className={styles.orderIcon} 
          onClick={() => navigate(`/user-orders/${user?._id}`)}
          />
          <AiFillDelete
          className={styles.deleteIcon}
          onClick={() => confirmDeletingUser(user._id)}
          />
        </div>
      )
    }})
    
    const columns = [
      {
        key: "id",
        name: "USER ID",
      },
      {
        key: "cin",
        name: "CIN",
        width: 80
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
        name: "PHONE NUMBER",
        width: 130
      },
      {
        key: "address",
        name: "ADDRESS",
        width: 220
      },
      {
        key: "isVerified",
        name: "STATUS",
        width: 90
      },
      {
        key: "transactions",
        name: "TRANSACTIONS",
        width: 125
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
        <div className={styles.title}><h2>ALL USERS</h2></div>
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

export default AllUsers