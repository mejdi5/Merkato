import React from 'react'
import styles from '../styles/Chart.module.css'
import { useSelector } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';




const Chart = ({ data, dataKey }) => {

    const orders = useSelector(state => state.orderSlice.orders)

return (
<div className={styles.chart}>
    <ResponsiveContainer width="100%" height="100%">
        <LineChart
        data={data}
        margin={{top: 5, right: 30, left: 20, bottom: 5}}>
            <CartesianGrid strokeDasharray="2 2" />
            <XAxis dataKey={dataKey} />
            <YAxis />
            <Tooltip />
            <Legend/>
            <Line type="monotone" dataKey="Sales" stroke="blue" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="Revenue" stroke="green" activeDot={{ r: 8 }} />
        </LineChart>
    </ResponsiveContainer>
</div>
);
}
export default Chart