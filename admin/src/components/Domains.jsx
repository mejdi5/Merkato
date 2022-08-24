import React, { useEffect, useState } from 'react'
import styles from '../styles/Domains.module.css'
import {AiFillEye, AiOutlineSearch} from 'react-icons/ai'
import {useSelector, useDispatch} from 'react-redux'
import { Fetch } from '../Fetch'
import {getMarketPlaces} from '../redux/marketPlaceSlice'
import { useNavigate } from 'react-router-dom'


const Domains = () => {

    const marketPlaces = useSelector(state => state.marketPlaceSlice.marketPlaces)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [searchDomain, setSearchDomain] = useState("")
    const [filteredDomains, setFilteredDomains] = useState(marketPlaces)

    useEffect(() => {
    const getAllMarketPlaces = async () => {
        try {
        const res = await Fetch.get("/marketPlaces"); 
        dispatch(getMarketPlaces(res.data));
        } catch (error) {
            console.log(error)
        }
    };
    getAllMarketPlaces();
    }, []);


return (
<div className={styles.container}>
    <div className={styles.header}>
        <span className={styles.title}>DOMAINS</span>
        <div className={styles.search}>
            <AiOutlineSearch 
            className={styles.searchIcon}
            />
            <input
            className={styles.searchInput}
            type="text"
            placeholder='Search..'
            value={searchDomain}
            onChange={e => setSearchDomain(e.target.value)}
            />
        </div>
    </div>
    <ul className={styles.list}>
        {filteredDomains.filter(domain => domain.name.toLowerCase().trim().startsWith(searchDomain.toLowerCase().trim()))
        .map((domain, index) => {
        return (
        <li className={styles.item} key={index}>
            <div className={styles.domain}>
                <span className={styles.domainName}>{domain.name.toUpperCase()}</span>
            </div>
            <div className={styles.buttons}>
                <button 
                className={styles.button}
                onClick={() => navigate(`/domain-products/${domain?._id}`)}
                >
                    <AiFillEye className={styles.icon} />
                    PRODUCTS
                </button>
                <button 
                className={styles.button}
                onClick={() => navigate(`/domain-orders/${domain?._id}`)}
                >
                    <AiFillEye className={styles.icon} />
                    ORDERS
                </button>
            </div>
        </li>)
        })}
    </ul>
</div>
)}

export default Domains