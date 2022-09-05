import React, {useEffect} from 'react'
import { Fetch } from '../Fetch';
import styles from '../styles/FeaturedInfo.module.css'
import {useSelector, useDispatch} from 'react-redux'
import {getOrders} from '../redux/orderSlice'

const FeaturedInfo = () => {

    const dispatch = useDispatch()
    const orders = useSelector(state => state.orderSlice.orders)

    const monthArray = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const daysArray = ["Sunday", "Monday","Tuesday","Wednesday", "Thursday", "Friday", "Saturday"]

    useEffect(() => {
        const getAllOrders = async () => {
        try {
            const res = await Fetch.get("/orders", {headers: {token: localStorage.token}});
            dispatch(getOrders(res.data))
        } catch (error) {
            console.log(error)
        }
    };
    getAllOrders();
    }, []);

    //current day
    const todayDate = new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate();
    const todayOrders = orders && orders.filter(order => {
        const orderDate = new Date(order.createdAt).getFullYear()+'-'+(new Date(order.createdAt).getMonth()+1)+'-'+ new Date(order.createdAt).getDate()
        return orderDate === todayDate
    }).filter(order => order.status === "delivered")
    const todayIncome = todayOrders.length > 0 ? todayOrders.map(order => order.totalToPay).reduce((a,b) => a + b) : 0
    const todayRevenue = todayOrders.length > 0 ? todayOrders.map(order => order.fees).reduce((a,b) => a + b) : 0

    //current week
    const lastSunday = new Date(new Date().setDate(new Date().getDate() - new Date().getDay()));
    const lastSundayDate = new Date(lastSunday).getFullYear()+'-'+(new Date(lastSunday).getMonth()+1)+'-'+new Date(lastSunday).getDate();
    const thisWeekOrders = orders && orders.filter(order => {
        const orderDate = new Date(order.createdAt).getFullYear()+'-'+(new Date(order.createdAt).getMonth()+1)+'-'+ new Date(order.createdAt).getDate()
        return (orderDate >= lastSundayDate && new Date(order.createdAt).getDay() - lastSunday.getDay() < 7)
    }).filter(order => order.status === "delivered")
    const thisWeekIncome = thisWeekOrders.length > 0 ? thisWeekOrders.map(order => order.totalToPay).reduce((a,b) => a + b) : 0
    const thisWeekRevenue = thisWeekOrders.length > 0 ? thisWeekOrders.map(order => order.fees).reduce((a,b) => a + b) : 0

    //current month
    const thisMonthOrders = orders && orders.filter(order => {
        return new Date(order.createdAt).getMonth() === new Date().getMonth() &&
        new Date(order.createdAt).getFullYear() === new Date().getFullYear()
    }).filter(order => order.status === "delivered")
    const thisMonthIncome = thisMonthOrders.length > 0 ? thisMonthOrders.map(order => order.totalToPay).reduce((a,b) => a + b) : 0
    const thisMonthRevenue = thisMonthOrders.length > 0 ? thisMonthOrders.map(order => order.fees).reduce((a,b) => a + b) : 0

    //current year
    const thisYearOrders = orders && 
    orders.filter(order => new Date(order.createdAt).getFullYear() === new Date().getFullYear())
    .filter(order => order.status === "delivered")
    const thisYearIncome = thisYearOrders.length > 0 ? thisYearOrders.map(order => order.totalToPay).reduce((a,b) => a + b) : 0
    const thisYearRevenue = thisYearOrders.length > 0 ? thisYearOrders.map(order => order.fees).reduce((a,b) => a + b) : 0



return (
<div className={styles.container}>
    <div className={styles.featuredInfo}>
        <h4>{daysArray[new Date().getDay()].toUpperCase()}</h4>
        <div className={styles.featuredMoneyContainer}>
            <span className={styles.featuredTitle} >Total sales today</span>
            <span className={styles.featuredMoney} >{todayIncome.toFixed(2)} TND</span>
        </div>
        <div className={styles.featuredMoneyContainer}>
            <span className={styles.featuredTitle} >Revenue</span>
            <span className={styles.featuredMoney} >{todayRevenue.toFixed(2)} TND</span>
        </div>
    </div>
    <div className={styles.featuredInfo}>
        <h4>THIS WEEK</h4>
        <div className={styles.featuredMoneyContainer}>
            <span className={styles.featuredTitle} >Total sales from last sunday</span>
            <span className={styles.featuredMoney} >{thisWeekIncome.toFixed(2)} TND</span>
        </div>
        <div className={styles.featuredMoneyContainer}>
            <span className={styles.featuredTitle} >Revenue</span>
            <span className={styles.featuredMoney} >{thisWeekRevenue.toFixed(2)} TND</span>
        </div>
    </div>
    <div className={styles.featuredInfo}>
        <h4>{monthArray[new Date().getMonth()].toUpperCase()}</h4>
        <div className={styles.featuredMoneyContainer}>
            <span className={styles.featuredTitle} >Total sales this month</span>
            <span className={styles.featuredMoney} >{thisMonthIncome.toFixed(2)} TND</span>
        </div>
        <div className={styles.featuredMoneyContainer}>
            <span className={styles.featuredTitle} >Revenue</span>
            <span className={styles.featuredMoney} >{thisMonthRevenue.toFixed(2)} TND</span>
        </div>
    </div>
    <div className={styles.featuredInfo}>
        <h4>{new Date().getFullYear()}</h4>
        <div className={styles.featuredMoneyContainer}>
            <span className={styles.featuredTitle} >Total sales this year</span>
            <span className={styles.featuredMoney} >{thisYearIncome.toFixed(2)} TND</span>
        </div>
        <div className={styles.featuredMoneyContainer}>
            <span className={styles.featuredTitle} >Revenue</span>
            <span className={styles.featuredMoney} >{thisYearRevenue.toFixed(2)} TND</span>
        </div>
    </div>
</div>
)}

export default FeaturedInfo