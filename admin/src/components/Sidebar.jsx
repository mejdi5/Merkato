import styles from "../styles/Sidebar.module.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from '../redux/userSlice';
import { useDispatch, useSelector } from 'react-redux'
import {BsFillPersonFill, BsCreditCard2Front} from 'react-icons/bs'
import {MdSpaceDashboard} from 'react-icons/md'
import {BiLogOut} from 'react-icons/bi'
import {CgProfile} from 'react-icons/cg'
import {AiFillAppstore, AiOutlineDollarCircle} from 'react-icons/ai'
import {TbTruckDelivery} from 'react-icons/tb'

const Sidebar = () => {

  const user = useSelector(state => state.userSlice.user)
    const dispatch = useDispatch()
    const location = useLocation().pathname
    const navigate = useNavigate()

    const handleLogout = () => {
        dispatch(logoutUser())
    }
    

return (
<div className={styles.container}>
  <div className={styles.header}>
      <img 
      src={user?.image} 
      className={styles.image}
      onClick={() => navigate("/")}
      />
      <span 
      className={styles.logo}
      onClick={() => navigate("/")}
      >MERKATO</span>
  </div>
  <hr className={styles.hr}/>
  <div className={styles.body}>
    <ul className={styles.links}>
      <div>
        <p className={styles.title}>MAIN</p>
        <Link to="/"className={styles.link}>
        <li className={styles.li}>
          <MdSpaceDashboard className={location === '/' ? styles.currentIcon : styles.icon}/>
            <span 
            className={location === '/' ? styles.currentItem : styles.item}
            >Dashboard</span>
        </li>
        </Link>
      </div>
      <div>
        <p className={styles.title}>LISTS</p>
        <Link to="/users"className={styles.link}>
            <li className={styles.li}>
              <BsFillPersonFill 
              className={(location === '/users' || location.includes('user-orders')) 
              ? styles.currentIcon 
              : styles.icon}
              />
                <span 
                className={(location === '/users' || location.includes('user-orders')) 
                ? styles.currentItem 
                : styles.item
              }>Users</span>
            </li>
        </Link>
        <Link to="/delivery-guys"className={styles.link}>
            <li className={styles.li}>
              <TbTruckDelivery 
              className={(location === "/delivery-guys") 
              ? styles.currentIcon 
              : styles.icon}
              />
                <span 
                className={(location === "/delivery-guys") 
                ? styles.currentItem 
                : styles.item
              }>Delivery Guys</span>
            </li>
        </Link>
        <Link to="/domains"className={styles.link}>
            <li className={styles.li}>
              <AiFillAppstore 
              className={location.includes('domain') 
              ? styles.currentIcon 
              : styles.icon
              }/>
              <span 
              className={location.includes('domain') 
              ? styles.currentItem 
              : styles.item
              }>Domains</span>
            </li>
        </Link>
        <Link to="/allOrders"className={styles.link}>
        <li className={styles.li}>
          <BsCreditCard2Front className={location.includes('allOrders') ? styles.currentIcon : styles.icon}/>
            <span 
            className={location.includes('allOrders') ? styles.currentItem : styles.item}
            >Orders</span>
        </li>
        </Link>
        <Link to="/taxes"className={styles.link}>
        <li className={styles.li}>
          < AiOutlineDollarCircle className={location.includes('taxes') ? styles.currentIcon : styles.icon}/>
            <span 
            className={location.includes('taxes') ? styles.currentItem : styles.item}
            >Taxes</span>
        </li>
        </Link>
      </div>
      <div>
        <p className={styles.title}>ADMIN</p>
        <Link to={`/profile/${user?._id}`} className={styles.link}>
            <li className={styles.li}>
              <CgProfile className={location === `/profile/${user?._id}` ? styles.currentIcon : styles.icon}/>
              <span 
              className={location === `/profile/${user?._id}` ? styles.currentItem : styles.item}
              >Profile</span>
            </li>
        </Link>
        <li onClick={handleLogout} className={styles.li}>
            <BiLogOut className={styles.icon}/>
            <span className={styles.item}>Logout</span>
        </li>
      </div>
    </ul>
  </div>
</div>
)}

export default Sidebar