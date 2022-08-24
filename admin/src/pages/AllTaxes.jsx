import React, {useState} from 'react'
import styles from '../styles/AllTaxes.module.css'
import Sidebar from '../components/Sidebar'
import { useSelector } from 'react-redux'
import { AiOutlineEdit } from 'react-icons/ai'
import ReactDataGrid from 'react-data-grid';
import ChangeTaxe from '../components/ChangeTaxeModal'


const AllTaxes = () => {

    const taxes = useSelector(state => state.taxeSlice.taxes)
    const [msg, setMsg] = useState(null)
    const [error, setError] = useState(null)
    const [open, setOpen] = useState(false)
    const [currentTaxe, setCurrentTaxe] = useState(null)


    const rows = taxes.map((taxe) => {
    return {
    governorate: taxe.governorate,
    deliveryCost: `${taxe.deliveryCost} TND`,
    fees: `${taxe.fees} TND`,
    action: (
        <div className={styles.action} key={taxe._id}>
            <AiOutlineEdit
            className={styles.changeTaxe}
            onClick={() => {
                setCurrentTaxe(taxe)
                setOpen(true);
            }
            }/>
        </div>
    )
    }})
    
    const columns = [
        {
            key: "governorate",
            name: "GOVERNORATE",
            width: 150
        },
    {
        key: "deliveryCost",
        name: "DELIVERY",
        width: 90
    },
    {
        key: "fees",
        name: "FEES",
        width: 40
    },
    {
        key: "action",
        name: "ACTION",
        width: 100
    },
]

return (
<div className={styles.container}>
    <Sidebar/>
    <div className={styles.wrapper}>
    <div className={styles.title}><h2>ALL TAXES</h2></div>
    {msg && <div className={styles.msg}>{msg}</div>} 
    {error && <div className={styles.error}>{error}</div>}
    <div className={styles.datagrid}>
        <ReactDataGrid
        className={styles.reactDataGrid}
        columns={columns}
        rows={rows}
        />
    </div>
    {open && 
        <ChangeTaxe
        open={open}
        setOpen={setOpen}
        setMsg={setMsg}
        setError={setError}
        currentTaxe={currentTaxe}
        />
    }
    </div>
</div>
)}

export default AllTaxes