import React, {useState, useEffect} from 'react';
import { Button,Form, Label, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { Fetch } from '../Fetch';
import { getCurrentUser } from '../redux/userSlice';
import {AiOutlineEye, AiOutlineEyeInvisible} from 'react-icons/ai'
import styles from '../styles/Profile.module.css'


const EditProfileModal = ({showPasswordModal, setShowPasswordModal}) => {

    const user = useSelector(state => state.userSlice.user)
    const dispatch = useDispatch()
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmedNewPassword, setConfirmedNewPassword] = useState("")
    const [isMatch, setIsMatch] = useState(false)
    const [msg, setMsg] = useState(null)
    const [error, setError] = useState(null)
    const [oldPasswordInputType, setOldPasswordInputType] = useState("password")
    const [newPasswordInputType, setNewPasswordInputType] = useState("password")
    const [confirmedNewPasswordInputType, setConfirmedNewPasswordInputType] = useState("password")


    const handleEditPassword = async (e) => {
        e.preventDefault();
        try {
            const res = await Fetch.put(`/users/edit-password/${user?._id}`, 
                {oldPassword, newPassword}, 
                {headers: {token: localStorage.token}}
            )
            dispatch(getCurrentUser(res.data))
            setMsg("Password edited..")
            setTimeout(() => {
                setMsg(null)
                setShowPasswordModal(false)
            }, 2000)
        } catch (error) {
            console.log(error)
            setError(error.response.data)
            setTimeout(() => {
                setError(null)
            }, 2000)
        }
    }

    useEffect(() => {
        newPassword === confirmedNewPassword 
        ? setIsMatch(true)
        : setIsMatch(false)
    }, [newPassword, confirmedNewPassword])

return (
    <div>
        <Modal isOpen={showPasswordModal} toggle={() => setShowPasswordModal(!showPasswordModal)}>
            <ModalHeader toggle={() => setShowPasswordModal(!showPasswordModal)}>EDIT PASSWORD</ModalHeader>
            <ModalBody>
            <Form>
                <FormGroup className={styles.password}>
                    <input 
                    type={oldPasswordInputType}
                    className="form-control"
                    placeholder="Your current password.."
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    />
                    {oldPasswordInputType === "password" && 
                    <AiOutlineEye 
                    className={styles.icon}
                    onClick={() => setOldPasswordInputType("text")}/>}
                    {oldPasswordInputType === "text" && 
                    <AiOutlineEyeInvisible 
                    className={styles.icon}
                    onClick={() => setOldPasswordInputType("password")}/>}
                </FormGroup>
                <FormGroup className={styles.password}>
                    <input 
                    type={newPasswordInputType}
                    className="form-control"
                    placeholder="New password.."
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    />
                    {newPasswordInputType === "password" && 
                    <AiOutlineEye 
                    className={styles.icon}
                    onClick={() => setNewPasswordInputType("text")}/>}
                    {newPasswordInputType === "text" && 
                    <AiOutlineEyeInvisible 
                    className={styles.icon}
                    onClick={() => setNewPasswordInputType("password")}/>}
                </FormGroup>
                <FormGroup className={styles.password}>
                    <input 
                    type={confirmedNewPasswordInputType} 
                    className="form-control"
                    placeholder="Retype new password.."
                    value={confirmedNewPassword}
                    onChange={(e) => setConfirmedNewPassword(e.target.value)}
                    />
                    {confirmedNewPasswordInputType === "password" && 
                    <AiOutlineEye 
                    className={styles.icon}
                    onClick={() => setConfirmedNewPasswordInputType("text")}/>}
                    {confirmedNewPasswordInputType === "text" && 
                    <AiOutlineEyeInvisible 
                    className={styles.icon}
                    onClick={() => setConfirmedNewPasswordInputType("password")}/>}
                </FormGroup>
                {(newPassword !== "" || confirmedNewPassword !== "") &&
                <p style={isMatch ? {color: 'green'} : {color: 'red'}}>
                    {isMatch ? "Password matched" : "Password does not match"}
                </p>
                }
            </Form>
            </ModalBody>
            {msg && <div style={{color: 'green', margin: 'auto'}}>{msg}</div>}
            {error && <div style={{color: 'red', margin: 'auto'}}>{error}</div>}
            <ModalFooter>
                <Button 
                color="primary" 
                disabled={!isMatch || oldPassword === "" || newPassword === "" || confirmedNewPassword === ""}
                onClick={(e) => handleEditPassword(e)}
                >SAVE</Button>
            </ModalFooter>
        </Modal>
    </div>
)}

export default EditProfileModal