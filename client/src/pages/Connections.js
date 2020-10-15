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
import manageMenu from '../images/menu.png'
import {ListGroup, Item, OverlayTrigger, Tooltip } from 'react-bootstrap'

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

    const viewUserAccountHandler = (id) => {
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

    const deleteConnectionHandler = (id) => {
        axios({
            method: "DELETE",
            url: `/api/send/connection/remove/${id}`,
            headers: {
                'auth-token': token
            }
        }).then(res => {
            refreshHandler()
        }).catch(err => {
            console.log(err)
        })
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

    let managedConnections;
    if(info.connections){
        managedConnections = info.connections.map(connection => {
            return(
                <div key={connection._id} className={styles.managedConnections}>
                    <section>
                        <img className={styles.modalImg} src={connection.avatar} alt="connections avatar" style={{width: '80px', height: '80px', objectFit: 'cover'}}/>
                    </section>
                    <section>
                        <p><span>Name:</span> {connection.nickname}</p>
                        <p><span>Age:</span> {connection.age}</p>
                        <p><span>From:</span> {connection.city} {connection.country}</p>
                    </section>
                    <section>
                        <button onClick={() => deleteConnectionHandler(connection._id)} className={"btn btn-link "+ styles.removeBtn}>
                            Remove
                        </button>
                        <button onClick={() => viewUserAccountHandler(connection._id)} className={"btn btn-link"}>
                            View Account
                        </button>
                    </section>
                </div>
            )
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
              ariaHideApp={false}
            >
                <div className={styles.modalContent}>
                    <div className={"row "+styles.modalImgRow}>
                        <img src={modalAccount.avatar} alt="Invite profile page" style={{width: "100%", maxHeight: "25rem", objectFit: 'cover', objectPosition: 'center'}}/>
                    </div>
                    <h1>{modalAccount.nickname}</h1>
                    <h4>{modalAccount.city}, {modalAccount.country}</h4>
                </div>
                <ListGroup style={{width: '100%'}}>
                    <ListGroup.Item className={styles.modalItem} onClick={()=> viewUserAccountHandler(modalAccount._id)} action variant="primary">View Profile</ListGroup.Item>
                    <ListGroup.Item className={styles.modalItemA} onClick={()=> acceptInvitationHandler(modalAccount._id)} action variant="success">Accept</ListGroup.Item>
                    <ListGroup.Item className={styles.modalItemB}  onClick={()=> declineInvitationHandler(modalAccount._id)} action variant="danger">Decline</ListGroup.Item>
                </ListGroup>
            </Modal>
            <Modal
                isOpen={openConnect}
                onRequestClose={closeConnectModal}
                style={customStyles}
                contentLabel="Manage Connection"
                ariaHideApp={false}
            >
                <React.Fragment>
                    <button className={"btn btn-link "+styles.connectModalX} onClick={closeConnectModal}>Close</button>
                    <div style={{width: '99%', background: 'whitesmoke', minHeight: '80%',margin: '50px 0px'}}>
                        {managedConnections}
                    </div>
                </React.Fragment>
                
            </Modal>
            <div className={"row "+styles.inviteListBox}>
                <Title title="Likes" />
                <Invitations viewAccount={viewAccountHandler} type="invitation" likes={info ? info.invitations: null} token={token} refresh={refreshHandler}/>
            </div>
            <div className={"row "+ styles.connectionListBox}>
                <Title title="Connections" />
                <div className={styles.conrow}>
                    <OverlayTrigger overlay={<Tooltip  id="tooltip-disabled">Manage Matches</Tooltip>}>
                        <div onClick={() => setOpenConnect(!openConnect)} className={styles.manageBtn}>
                            <img src={manageMenu} alt="Button that allows user to delete matches" />
                        </div>
                    </OverlayTrigger>
                    <ConnectList viewAccount={viewAccountHandler}  connects={info.connections} chats={info.chats} refresh={refreshHandler} />
                </div>

            </div>
        </Template>
    )
}

export default Connections;