import React, {useState, useRef} from 'react';
import { Button,Form, Label, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import styles from "../styles/AddDeliveryGuyModal.module.css"
import { Fetch } from '../Fetch';

const AddDeliveryGuyModal = ({show, setShow}) => {

    const name = useRef(null)
    const cin = useRef(null)
    const email = useRef(null)
    const password = useRef(null)
    const phoneNumber = useRef(null)
    const address = useRef(null)
    const [error, setError] = useState(null)


    const handleAddDeliveryGuy = async (e) => {
        e.preventDefault();
        try {
            await Fetch.post("/users/delivery-guy",{
                name: name?.current?.value,
                cin: Number(cin?.current?.value),
                email: email?.current?.value,
                password: password?.current?.value,
                phoneNumber: phoneNumber?.current?.value,
                address: address?.current?.value,
            }, {headers: {token: localStorage.token}})
        } catch (error) {
            console.log(error)
            setError("Action not allowed")
            setTimeout(() => {
                setError(null)
            }, 5000)
        }
        setShow(false)
    }

return (
    <div>
        <Modal isOpen={show} toggle={() => setShow(!show)}>
            <ModalHeader toggle={() => setShow(!show)}>NEW DELIVERY GUY</ModalHeader>
            <ModalBody>
            <Form>
                <FormGroup>
                    <Label>NAME <span className={styles.required}>*</span></Label>
                    <input 
                    type="text" 
                    className="form-control"
                    placeholder="Name.."
                    ref={name}
                    required
                    />
                </FormGroup>
                <FormGroup>
                    <Label>CIN <span className={styles.required}>*</span></Label>
                    <input 
                    type="text" 
                    className="form-control"
                    placeholder="cin.."
                    ref={cin}
                    required
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Email address <span className={styles.required}>*</span></Label>
                    <input 
                    type="email" 
                    className="form-control"
                    placeholder="email.."
                    ref={email}
                    required
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Password <span className={styles.required}>*</span></Label>
                    <input 
                    type="password" 
                    placeholder="Password.."
                    required 
                    className="form-control"
                    ref={password}
                    />
                </FormGroup>
                <FormGroup>
                    <Label>PHONE NUMBER <span className={styles.required}>*</span></Label>
                    <input 
                    type="text" 
                    placeholder="Phone Number.."
                    required 
                    className="form-control"
                    ref={phoneNumber}
                    />
                </FormGroup>
                <FormGroup>
                    <Label>ADDRESS</Label>
                    <input 
                    type="text" 
                    placeholder="Address.."
                    className="form-control"
                    ref={address}
                    />
                </FormGroup>
                <div className={styles.errorWrapper}>
                    <span className={styles.error}>
                        {error}
                    </span>
                </div>
            </Form>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={(e) => handleAddDeliveryGuy(e)}>SUBMIT</Button>{' '}
            </ModalFooter>
        </Modal>
    </div>
)}

export default AddDeliveryGuyModal