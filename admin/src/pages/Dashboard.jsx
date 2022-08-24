import React, {useEffect} from 'react'
import styles from "../styles/Dashboard.module.css"
import { useDispatch } from 'react-redux'
import { Fetch } from '../Fetch';
import Sidebar from "../components/Sidebar"
import FeaturedInfo from '../components/FeaturedInfo';
import Domains from '../components/Domains'
import Transactions from '../components/Transactions'
import { getTaxes } from '../redux/taxeSlice';

const Dashboard = () => {

  const dispatch = useDispatch()

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

  
return (
<div className={styles.container}>
  <Sidebar/>
  <div className={styles.wrapper}>
    <div className={styles.top}>
      <FeaturedInfo/>
    </div>
    <div className={styles.bottom}>
      <Domains />
      <Transactions />
    </div>
  </div>
</div>
)}

export default Dashboard