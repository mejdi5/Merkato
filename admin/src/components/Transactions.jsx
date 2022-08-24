import React from 'react'
import styles from '../styles/Transactions.module.css'
import { useSelector, useDispatch } from 'react-redux'
import {format} from "timeago.js"
import { useNavigate } from 'react-router-dom'


const Transactions = () => {

  const orders = useSelector(state => state.orderSlice.orders)
  const users = useSelector(state => state.userSlice.users)
  const marketPlaces = useSelector(state => state.marketPlaceSlice.marketPlaces)
  const navigate = useNavigate()


return (
<div className={styles.transactions}>
    <h3 className={styles.transactionsTitle}>TRANSACTIONS</h3>
    <table className={styles.transactionsTable}>
    <tbody className={styles.transactionsTableBody}>
        <tr className={styles.transactionsTr}>
            <th className={styles.transactionTh}>CUSTOMER</th>
            <th className={styles.transactionTh}>DOMAIN</th>
            <th className={styles.transactionTh}>DATE</th>
            <th className={styles.transactionTh}>AMOUNT</th>
            <th className={styles.transactionTh}>STATUS</th>
        </tr>
        {orders.map((order) => {
          const orderUser = users.find(user => user?._id === order?.userId)
          const orderDomain = marketPlaces.find(domain => domain?._id === order?.domainId)
        return (
        <tr 
        className={styles.transactionsTr} 
        key={order._id}
        onClick={() => navigate(`/allOrders/${order?._id}`)}
        >
            <td>{orderUser?.name}</td>
            <td>{orderDomain?.name}</td>
            <td className={styles.transactionsDate}>{format(order.createdAt)}</td>
            <td className={styles.transactionsAmount}>{order.totalToPay.toFixed(2)} TND</td>
            <td className={styles.transactionsStatus}>
              <span className={order.status === "declined" ? styles.declined : order.status === "delivered" ? styles.delivered : styles.in_progress}>
                {order.status === "declined" 
                ? "Declined" 
                : order.status === "delivered" ? "Delivered"
                : "In Progress"}
              </span>
            </td>
        </tr>
        )}
        )}
    </tbody>
    </table>
</div>)}

export default Transactions