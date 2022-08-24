import React, {useState} from 'react';
import { Button,Form, Label, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { Fetch } from '../Fetch';


const ForgetPasswordModal = ({open, setOpen, setMsg, setError}) => {

    const dispatch = useDispatch()
    const [email, setEmail] = useState("")


    const handleSendPassword = async (e) => {
        e.preventDefault();
        try {
            const res = await Fetch.post(`/auth/send-password`, {email})
            setMsg(res.data)
            setTimeout(() => setMsg(null), 5000)
        } catch (err) {
            if (err?.response?.data) {
                setError(err?.response?.data)
            } else {
                setError("Something went wrong, retry later..")
            }
            setTimeout(() => setError(null), 5000)
        }
        setOpen(false)
    }

return (
    <div>
        <Modal isOpen={open} toggle={() => setOpen(!open)}>
            <ModalHeader toggle={() => setOpen(!open)}>Password will be sent by SMS</ModalHeader>
            <ModalBody>
                <Form>
                    <FormGroup>
                        <Label>EMAIL</Label>
                        <input 
                        type="email" 
                        className="form-control"
                        placeholder="Your email.."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        />
                    </FormGroup>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={(e) => handleSendPassword(e)}>SEND</Button>
            </ModalFooter>
        </Modal>
    </div>
)}

export default ForgetPasswordModal