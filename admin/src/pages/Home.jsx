import React, {useRef, useState} from 'react'
import styles from "../styles/Home.module.css"
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button, Label, FormGroup} from 'reactstrap';
import { Link } from 'react-router-dom';
import { Fetch } from '../Fetch';
import { loginUser, load, getError } from "../redux/userSlice"
import ForgetPasswordModal from '../components/ForgetPasswordModal';


const Home = () => {

    const authError = useSelector(state => state.userSlice.authError)
    const email = useRef(null);
    const password = useRef(null)
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false)
    const [msg, setMsg] = useState(null)
    const [error, setError] = useState(null)

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            if(email?.current?.value && password?.current?.value) {
            dispatch(load(true))
            const res = await Fetch.post("/auth/login/admin", { 
                email: email?.current?.value,
                password: password?.current?.value
            })
            dispatch(load(false))
            dispatch(loginUser(res.data))
            }
        } catch (error) {
            dispatch(load(false))
            const msg = error?.response?.data;
            if (msg) {
                dispatch(getError(msg))
            } else {
                dispatch(getError("Something went wrong, retry later.."))
            }
            setTimeout(() => {
                dispatch(getError(null))
            }, 5000)
        }
    }

return (
<div className={styles.container}>
    <div className={styles.wrapper}>
        <div className={styles.header}>
            <h3 className={styles.logo}>MERKATO</h3>
            <h6 className={styles.description}>
            Admin Dashboard
            </h6>
        </div>
        <div className={styles.body}>
            <Form>
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
                <div className={styles.errorWrapper}>
                    <span className={styles.error}>
                        {authError}
                    </span>
                </div>
                <div className={styles.msgWrapper}>
                    <span className={styles.msg}>
                        {msg}
                    </span>
                </div>
                <div className={styles.errorWrapper}>
                    <span className={styles.error}>
                        {error}
                    </span>
                </div>
                
            </Form>
            <div className={styles.forgetPassword} onClick={() => setOpen(true)}>
                Forgot Password ?
            </div>
            {open && 
            <ForgetPasswordModal
            open={open}
            setOpen={setOpen}
            setMsg={setMsg}
            setError={setError}
            />}
        </div>
        <div className={styles.footer}>
            <Button 
            onClick={e => handleLogin(e)}
            color="success" 
            size="lg" 
            block>Login</Button>
        </div>
    </div>
</div>
)}

export default Home