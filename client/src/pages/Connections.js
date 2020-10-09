import React, {useEffect, useState} from 'react'
import { useHistory } from 'react-router-dom'
import styles from './styles/index.module.scss'
import Template from '../components/Template'
import axios from 'axios'
import Title from '../components/UI/Title'
import Invitations from '../components/Invitations'
import ConnectList from '../components/ConnectionList'
import { PushSpinner } from "react-spinners-kit";
import Modal from "react-modal"
import {ListGroup, Item } from 'react-bootstrap'

Modal.defaultStyles.overlay.backgroundColor = 'rgba(0, 0, 0, 0.7)';
const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)',
      maxWidth              : '99%',
      maxHeight             : '99%',
      width                 : '35rem',
      height                : '50rem',
      backgroundColor       : '#cdcdcd',
      border                : '1px solid darkred',
      display               : 'flex',
      flexDirection         : 'column',
      justifyContent        : 'space-evenly',
      alignItems            : 'center',
      padding               : '20px',
      overflow              : 'hidden',
      
    }
  };

const Connections = () => {
    const history = useHistory()
    const [info, setInfo] = useState({})
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [isOpen, setIsOpen] = useState(false) //invitation modal
    const [openConnect, setOpenConnect] = useState(false)

    const [modalAccount, setModalAccount] = useState({})

    const token = sessionStorage.getItem('auth-token')

    useEffect(()=> {
        setLoading(true)
        axios({
            method: 'GET',
            url: '/api/account/info',
            headers: {
                "auth-token": token
            }
        }).then(res => {
            console.log(res.data);
            setInfo(res.data.account);
            setLoading(false)

        }).catch(err => {
            console.log(err)
            setLoading(false)

        })
    }, [refresh])


    const refreshHandler = () => {
        setRefresh(!refresh)
    }

    const viewInviteAccountHandler = (id) => {
        history.push(`/account/${id}`)
    }

    const acceptInvitationHandler = async (id) => {
        const res = await axios({
            method: 'POST',
            url: `/api/send/invitation/accept/${id}`,
            headers: {
                'auth-token': token
            }
        })
        refreshHandler()
        closeModal()

    }
    const declineInvitationHandler = async (id) => {
        const res = await axios({
            method: 'POST',
            url: `/api/send/invitation/decline/${id}`,
            headers: {
                'auth-token': token
            }
        })
        refreshHandler()
        closeModal()
    }
    const closeModal = () => {
        setIsOpen(false)
    }
    const closeConnectModal = () => {
        setOpenConnect(false)
    }

    const viewAccountHandler = (accountId) => { //type = invite or type = connect
        setLoading(true)
        axios({
            method: "GET",
            url: `/api/account/info/${accountId}`,
            headers:{
                "auth-token": token
            }
        }).then(res => {
            setModalAccount(res.data.account)
            setLoading(false)
            setIsOpen(true)
            console.log(res.data.account)

        }).catch(err => {
            console.log(err)
            setLoading(false)
        })
    }


    if(loading || !info){
        return(
            <Template>
                <div className={"container "} style={{minHeight: "50em", paddingTop: "24em", paddingLeft: "25%"}}>
                    <PushSpinner size={80} color="#bc4e4e" loading={loading} />
                </div>
            </Template>
        )
    }

    return(
        <Template>
            <Modal
              isOpen={isOpen}
              onRequestClose={closeModal}
              style={customStyles}
              contentLabel="Manage Invitation"
            >
                <div className={styles.modalContent}>
                    <div className={"row "+styles.modalImgRow}>
                        <img src={modalAccount.avatar} alt="Invite profile page" style={{width: "100%", maxHeight: "25rem", objectFit: 'cover', objectPosition: 'center'}}/>
                    </div>
                    <h1>{modalAccount.nickname}</h1>
                    <h4>{modalAccount.city}, {modalAccount.country}</h4>
                </div>
                <ListGroup style={{width: '100%'}}>
                    <ListGroup.Item className={styles.modalItem} onClick={()=> viewInviteAccountHandler(modalAccount._id)} action variant="primary">View Profile</ListGroup.Item>
                    <ListGroup.Item className={styles.modalItemA} onClick={()=> acceptInvitationHandler(modalAccount._id)} action variant="success">Accept</ListGroup.Item>
                    <ListGroup.Item className={styles.modalItemB}  onClick={()=> declineInvitationHandler(modalAccount._id)} action variant="danger">Decline</ListGroup.Item>
                </ListGroup>
            </Modal>
            {/* <Modal
                isOpen={openConnect}
                onRequestClose={closeConnectModal}
                style={customStyles}
                contentLabel="Manage Connection"
            >
                <h1>Here goes cheese</h1>
            </Modal> */}
            <div className={"row "+styles.inviteListBox}>
                <Title title="Likes" />
                <Invitations viewAccount={viewAccountHandler} type="invitation" likes={info ? info.invitations: null} token={token} refresh={refreshHandler}/>
            </div>
            <div className={"row "+ styles.connectionListBox}>
                <Title title="Connections" />
                <ConnectList viewAccount={viewAccountHandler}  connects={info.connections} chats={info.chats} refresh={refreshHandler}/>
            </div>
        </Template>
    )
}

export default Connections;