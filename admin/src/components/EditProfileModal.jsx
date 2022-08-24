import React, {useState} from 'react';
import { Button,Form, Label, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { Fetch } from '../Fetch';
import { getCurrentUser } from '../redux/userSlice';


const EditProfileModal = ({openModal, setOpenModal, setMsg, setError}) => {

    const user = useSelector(state => state.userSlice.user)
    const dispatch = useDispatch()
    const [name, setName] = useState(user.name || "")
    const [email, setEmail] = useState(user.email || "")
    const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "")
    const [address, setAddress] = useState(user.address || "")


    const handleEditProfile = async (e) => {
        e.preventDefault();
        try {
            const res = await Fetch.put(`/users/${user?._id}`, {name, email, phoneNumber, address}, {headers: {token: localStorage.token}})
            dispatch(getCurrentUser(res.data))
        } catch (error) {
            console.log(error)
        }
        setOpenModal(false)
    }

return (
    <div>
        <Modal isOpen={openModal} toggle={() => setOpenModal(!openModal)}>
            <ModalHeader toggle={() => setOpenModal(!openModal)}>EDIT PROFILE</ModalHeader>
            <ModalBody>
            <Form>
                <FormGroup>
                    <Label>NAME</Label>
                    <input 
                    type="text" 
                    className="form-control"
                    placeholder="new name.."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label>EMAIL</Label>
                    <input 
                    type="email" 
                    className="form-control"
                    placeholder="new email.."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label>PHONE NUMBER</Label>
                    <input 
                    type="number" 
                    className="form-control"
                    placeholder="new phone number.."
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(Number(e.target.value))}
                    />
                </FormGroup>
                <FormGroup>
                    <Label>ADDRESS</Label>
                    <input 
                    type="text" 
                    className="form-control"
                    placeholder="new address.."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    />
                </FormGroup>
            </Form>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={(e) => handleEditProfile(e)}>SAVE</Button>
            </ModalFooter>
        </Modal>
    </div>
)}

export default EditProfileModal