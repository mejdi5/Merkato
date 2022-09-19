import React, {useEffect} from 'react'
import styles from '../styles/FeaturedInfo.module.css'


const FeaturedInfo = ({daysArray, monthArray, todayIncome, todayRevenue, thisWeekIncome, thisWeekRevenue, thisMonthIncome, thisMonthRevenue, thisYearIncome, thisYearRevenue}) => {

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