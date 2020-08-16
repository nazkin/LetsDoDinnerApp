import React from 'react'
import styles from '../styles/UI/userImgList.module.scss';

const UserImgList = (props) => {

    const userList = props.users.map(user=> {
        return (
            <div className={"col-sm-11 col-md-2 my-3 "+styles.userCol} key={user._id}>
                <img className={styles.userImg} src={user.images[0].downloadUrl} alt="Active users profile picture" />
                
                    <h3 className={styles.userNick}>{user.nickname}</h3>
                    <h4>{user.city}, {user.region}</h4>
               
            </div>
        )
    })

    return(
        <div className={"row "+ styles.userImgRow}>
            {userList}
        </div>
    )

}

export default UserImgList