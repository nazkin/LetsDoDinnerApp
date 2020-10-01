import React, {useEffect, useState} from 'react'
import Template from '../components/Template'
import axios from 'axios'
import Title from '../components/UI/Title'
import Invitations from '../components/Invitations'
import ConnectList from '../components/ConnectionList'
import { PushSpinner } from "react-spinners-kit";
// import Modal from "react-modal"
// Modal.defaultStyles.overlay.backgroundColor = 'rgba(0, 0, 0, 0.7)';
// const customStyles = {
//     content : {
//       top                   : '50%',
//       left                  : '50%',
//       right                 : 'auto',
//       bottom                : 'auto',
//       marginRight           : '-50%',
//       transform             : 'translate(-50%, -50%)',
//       width                 : '50rem',
//       height                : '50rem',
//       backgroundColor       : 'silver',
//     }
//   };

const Connections = () => {
    const [info, setInfo] = useState({})
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

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
            {/* <button onClick={() => setIsOpen(true)}>Open</button>
            <Modal
              isOpen={isOpen}
              onRequestClose={closeModal}
              style={customStyles}
              contentLabel="Example Modal"
            ></Modal> */}
            <div className="row mt-5 px-5 py-3">
                <Title title="Likes" />
                <Invitations type="invitation" likes={info ? info.invitations: null} token={token} refresh={refreshHandler}/>
            </div>
            <div className="row px-5 py-3">
                <Title title="Connections" />
                <ConnectList connects={info.connections} chats={info.chats} refresh={refreshHandler}/>
            </div>
        </Template>
    )
}

export default Connections;