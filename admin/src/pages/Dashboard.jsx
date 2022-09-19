import React, {useEffect, useState, useMemo} from 'react'
import styles from "../styles/Dashboard.module.css"
import { useDispatch, useSelector } from 'react-redux'
import { Fetch } from '../Fetch';
import Sidebar from "../components/Sidebar"
import FeaturedInfo from '../components/FeaturedInfo';
import Chart from '../components/Chart';
import Domains from '../components/Domains'
import Transactions from '../components/Transactions'
import { getTaxes } from '../redux/taxeSlice';
import { getOrders } from '../redux/orderSlice';

const Dashboard = () => {

  const [userStats, setUserStats] = useState([]);
  const dispatch = useDispatch()
    const orders = useSelector(state => state.orderSlice.orders)

    const monthArray = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const daysArray = ["Sunday", "Monday","Tuesday","Wednesday", "Thursday", "Friday", "Saturday"]

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



  useEffect(() => {
    const postTaxe = async () => {
          try {
            await Fetch.post("/taxes", {}, {headers: {token: localStorage.token}})
          } catch (error) {
            console.log(error)
          }
    }
    const getAllTaxes = async () => {
      try {
        const res = await Fetch.get("/taxes", {headers: {token: localStorage.token}})
        dispatch(getTaxes(res.data))
      } catch (error) {
        console.log(error)
      }
    }
    postTaxe();
    getAllTaxes();
  }, [])

  const data = monthArray.map(month => {
  const incomes = thisYearOrders.filter(order => new Date(order.createdAt).getMonth() === monthArray.indexOf(month))
  .map(order => order.totalToPay)
  const Sales = incomes.length > 0 ? incomes.reduce((a,b) => a + b) : 0
  const revenues = thisYearOrders.filter(order => new Date(order.createdAt).getMonth() === monthArray.indexOf(month))
  .map(order => order.fees)
  const Revenue = revenues.length > 0 ? revenues.reduce((a,b) => a + b) : 0
    return {
      month,
      Sales,
      Revenue
    }
  })

return (
<div className={styles.container}>
  <Sidebar/>
  <div className={styles.wrapper}>
    <div className={styles.top}>
      <FeaturedInfo
      daysArray={daysArray}
      monthArray={monthArray}
      todayIncome={todayIncome}
      todayRevenue={todayRevenue}
      thisWeekIncome={thisWeekIncome}
      thisWeekRevenue={thisWeekRevenue}
      thisMonthIncome={thisMonthIncome}
      thisMonthRevenue={thisMonthRevenue}
      thisYearIncome={thisYearIncome}
      thisYearRevenue={thisYearRevenue}
      />
    </div>
    <div className={styles.center}>
      <Chart
        data={data}
        grid
        dataKey="month"
      />
    </div>
    <div className={styles.bottom}>
      <Domains />
      <Transactions />
    </div>
  </div>
</div>
)}

export default Dashboard