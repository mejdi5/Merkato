import React, {useState, useEffect} from 'react'
import styles from '../styles/Profile.module.css'
import Sidebar from '../components/Sidebar'
import { useSelector, useDispatch } from 'react-redux'
import {AiFillEdit} from 'react-icons/ai'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../firebase'
import { Fetch } from '../Fetch'
import { getCurrentUser } from '../redux/userSlice'
import EditProfileModal from '../components/EditProfileModal'
import EditPasswordModal from '../components/EditPasswordModal'

const Profile = () => {

    const user = useSelector(state => state.userSlice.user)
    const dispatch = useDispatch()
    const [file, setFile] = useState(null);
    const [image, setImage] = useState(null);
    const [percentage, setPercentage] = useState(null);
    const [isReady, setIsReady] = useState(false);
    const [msg, setMsg] = useState(null);
    const [error, setError] = useState(null);
    const [openModal, setOpenModal] = useState(false)
    const [showPasswordModal, setShowPasswordModal] = useState(false)

    const handleEditProfileImage = async (e) => {
        e.preventDefault();
        try {
            const res = await Fetch.put(`/users/${user?._id}`, {image}, {headers: {token: localStorage.token}})
            dispatch(getCurrentUser(res.data))
            setMsg(null)
        } catch (error) {
            console.log(error)
            setError(error)
            setTimeout(() => {
                setError(null)
            }, 4000)
        }
        setIsReady(false)
    }

    const uploadImage = (file) => {
        const name = new Date().getTime() + file.name;
        const storageRef = ref(storage, name);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setMsg("Upload is " + progress + "% done")
            setPercentage(progress);
            switch (snapshot.state) {
                case "paused":
                setMsg("Upload is paused")
                break;
                case "running":
                setMsg("Upload is running")
                break;
                default:
                break;
            }},
            (err) => {
            console.log(err);
            setError("cannot upload image..")
            },
            () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log('File available at', downloadURL);
                setImage(downloadURL);
                setIsReady(true)
                setMsg("Image uploaded")
            });
            }
        );
    };

    useEffect(() => {
        file && uploadImage(file);
    }, [file]);


return (
<div className={styles.container}>
    <Sidebar/>
    <div className={styles.wrapper}>
        <div className={styles.top}>
            <div className={styles.imageWrapper}>
                <img 
                className={styles.image}
                src={user?.image || "https://crowd-literature.eu/wp-content/uploads/2015/01/no-avatar.gif"}
                alt=""
                />
                {!file && 
                <input
                className={styles.input}
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setFile(e.target.files[0])}
                />
                }
                {file && isReady &&
                <button
                className={styles.button} 
                onClick={e => handleEditProfileImage(e)}
                >Click to Upload
                </button>
                }
                {file && percentage &&  percentage > 0 && percentage < 100 && 
                    <div className={styles.wait}>{msg}</div>
                }
                {error && <div className={styles.error}>{error}</div>}
            </div>
        </div>
        <div className={styles.bottom}>
            <div className={styles.info}>
                <div className={styles.item}>
                    <strong>NAME:</strong>
                    <span>{user?.name}</span>
                </div>
                <div className={styles.item}>
                    <strong>EMAIL:</strong>
                    <span>{user?.email}</span>
                </div>
                <div className={styles.item}>
                    <strong>CIN:</strong>
                    <span>{user?.cin}</span>
                </div>
                <div className={styles.item}>
                    <strong>PHONE NUMBER:</strong>
                    <span>{user?.phoneNumber}</span>
                </div>
                <div className={styles.item}>
                    <strong>ADDRESS:</strong>
                    <span>{user?.address}</span>
                </div>
                <div className={styles.item}>
                    <strong>STATUS:</strong>
                    <span>Admin</span>
                </div>
            </div>
        </div>
        <div className={styles.edit}>
            <button 
            className={styles.editButton}
            onClick={() => setOpenModal(true)}
            >
                <AiFillEdit/>
                EDIT PROFILE
            </button>
            <button 
            className={styles.editButton}
            onClick={() => setShowPasswordModal(true)}
            >EDIT PASSWORD
            </button>
            {openModal && 
            <EditProfileModal
            openModal={openModal}
            setOpenModal={setOpenModal}
            />
            }
            {showPasswordModal && 
            <EditPasswordModal
            showPasswordModal={showPasswordModal}
            setShowPasswordModal={setShowPasswordModal}
            />
            }
        </div>
    </div>
</div>
)}

export default Profile