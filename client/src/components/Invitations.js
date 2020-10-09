import React from 'react'
import styles from './styles/core/compIndex.module.scss'
import noInvitesIcon from '../images/invitation.png'

const InvitationList = ({likes, token, type, refresh, viewAccount}) => {

    let likeList = (
                <div className={"row d-flex justify-content-evenly align-items-center py-1 px-1 "+ styles.placeholderBox}>
                    <img src={noInvitesIcon} alt="no invitations placeholder icon" className={styles.placeholderIcon}/>
                    <h1>No new invitations to connect</h1>
                </div>
    );
    
    if(likes && likes.length > 0){
        likeList = likes.map(like => {
            return  (
                <div>
                    <div onClick={()=> viewAccount(like._id)} className={styles.invitationImgBox}>
                        <img src={like.avatar} className={styles.invitationImg} alt="image of a user sent a like" />
                        <p>{like.nickname}</p>
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