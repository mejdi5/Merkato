import React, {useState} from 'react';
import { Button,Form, Label, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { Fetch } from '../Fetch';
import { getTaxes } from '../redux/taxeSlice';

const ChangeTaxe = ({open, setOpen, setMsg, setError, currentTaxe}) => {

    const [deliveryCost, setDeliveryCost] = useState(currentTaxe.deliveryCost)
    const [fees, setFees] = useState(currentTaxe.fees)
    const dispatch = useDispatch()


    const handleChangeTaxe = async (e) => {
        e.preventDefault();
        try {
            await Fetch.put(`/taxes/${currentTaxe.governorate}`, {deliveryCost, fees}, {headers: {token: localStorage.token}})
            const res = await Fetch.get("/taxes", {headers: {token: localStorage.token}})
            dispatch(getTaxes(res.data))
            setMsg("taxe updated..")
            setTimeout(() => {
                setMsg(null)
            }, 4000)
        } catch (error) {
            console.log(error)
            setError("Action not allowed..")
            setTimeout(() => {
                setError(null)
            }, 4000)
        }
        setOpen(false)
    }

return (
    <div>
        <Modal isOpen={open} toggle={() => setOpen(!open)}>
            <ModalHeader toggle={() => setOpen(!open)}>SET NEW TAXES</ModalHeader>
            <ModalBody>
            <Form>
                <FormGroup>
                    <Label>Governorate</Label>
                    <h6>{currentTaxe.governorate}</h6>
                </FormGroup>
                <FormGroup>
                    <Label>Delivery Cost</Label>
                    <input 
                    type="number" 
                    className="form-control"
                    placeholder="Delivery costs.."
                    value={deliveryCost}
                    onChange={(e) => setDeliveryCost(Number(e.target.value))}
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Fees</Label>
                    <input 
                    type="number" 
                    className="form-control"
                    placeholder="Fees.."
                    value={fees}
                    onChange={(e) => setFees(Number(e.target.value))}
                    />
                </FormGroup>
            </Form>
            </ModalBody>
            <ModalFooter>
                <Button 
                color="primary" 
                onClick={(e) => handleChangeTaxe(e)}
                >Update</Button>{' '}
            </ModalFooter>
        </Modal>
    </div>
)}

export default ChangeTaxe