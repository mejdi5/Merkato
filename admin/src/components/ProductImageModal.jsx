import React from 'react'
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import styles from '../styles/DomainProducts.module.css'


const ProductImageModal = ({productImage, setProductImage, showProduct, setShowProduct}) => {

return (
<Modal isOpen={showProduct} toggle={() => {
    setShowProduct(false);
    setProductImage(null)
    }
}>
    <ModalHeader toggle={() => {
    setShowProduct(false);
    setProductImage(null)
    }}>PRODUCT IMAGE</ModalHeader>
    <ModalBody className={styles.productImageWrapper}>
    {productImage 
    ?
    <img 
    src={productImage}
    alt=""
    className={styles.productImage}
    />
    :
    <div className={styles.noProductImage}>No image available</div>
    }
    </ModalBody>
</Modal>
)}

export default ProductImageModal