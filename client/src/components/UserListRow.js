import React from 'react'
import styles from './styles/core/compIndex.module.scss'

const UserListRow = (props) => {


    const userList = props.usersData.map(user => {
        return(
            <div key={user._id} className={styles.userElement}>
                <div className={styles.userElAvatar}>
                    <img src={user.avatar} alt="user avatar" style={{width: "100%", height: "100%", objectFit: "cover", objectPosition: "center"}}/>
                </div>
                <div className={styles.userElTxt}>
                    <h1>{user.nickname} - <span>{user.age}</span></h1>
                    <p>{user.description.length < 60 ? user.description : user.description.substring(0, 60)}...</p>
                    <hr />
                    <h5>{user.city}, {user.country}</h5>
                </div>

            </div>
        )
    })


    return(
        <div className={"col-md-8 "}>
            {userList}
        </div>
    )
}

export default UserListRow;