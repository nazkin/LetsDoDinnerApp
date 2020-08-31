import React from 'react'
import styles from './styles/compIndex.module.scss'
import {useHistory} from 'react-router-dom'
import axios from 'axios'

const InvitationList = ({likes, token, type}) => {
    const history = useHistory();
    
    
    
    const viewInviteAccountHandler = (id) => {
        history.push(`/account/${id}`)
    }

    const acceptInvitationHandler = async (id) => {
        const res = await axios({
            method: 'POST',
            url: `http://localhost:8080/api/send/invitation/accept/${id}`,
            headers: {
                'auth-token': token
            }
        });
        console.log(res);

    }
    let likeList = (
                <div className="row px-5">
                    <h1>No new invitations to connect</h1>
                </div>
    );
    
    if(likes && likes.length > 0){
        likeList = likes.map(like => {
            return  (
                <div>
                    <div onClick={()=> viewInviteAccountHandler(like._id)} className={styles.invitationImgBox}>
                        <img src={like.avatar} className={styles.invitationImg} alt="image of a user sent a like" />
                        <p>{like.nickname}</p>
                    </div>
                    <div className={styles.invitationBtnBox}>
                        <div onClick={()=> acceptInvitationHandler(like._id)} className={styles.invitationAccept}>
                            Accept
                        </div>
                        <div className={styles.invitationDecline}>
                            Decline
                        </div>
                    </div>

                </div>

            )
        })
    }

    return(
        <div className={"col-12 "+styles.invitationContainer}>
           {likeList}
         </div>
    )
}

export default InvitationList