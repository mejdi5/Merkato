import React from 'react'
import styles from '../styles/Loading.module.css'
import {Spinner} from 'reactstrap';

const Loading = () => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
          <Spinner animation="border" variant="primary" className={styles.spinner}/>
          <h2>Loading...</h2>
      </div>
    </div>
  )
}

export default Loading