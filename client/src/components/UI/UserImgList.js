import React from 'react'
import styles from '../styles/UI/index.module.scss';
import {useHistory} from 'react-router-dom'

const UserImgList = (props) => {
    let history = useHistory()

    const viewUserHandler = (id) =>{
        history.push(`/account/${id}`)
    }
    let userList = [];
    if(props.users) {
        userList = props.users.map(user=> {
            return (
                <div onClick={()=> viewUserHandler(user._id)}  className={"col-sm-5 col-md-4 col-lg-3 col-xl-2 mx-3 my-2 p-0 "+styles.userCol} key={user._id}>
                    <img className={styles.userImg} src={user.avatar} alt="Active users profile picture" />
                    <h3>{user.nickname}</h3>
                    <h4>{user.city}, {user.region}</h4>          
                </div>
            )
        })
    }

 

    return(
        <div className={"row p-3 my-3 "+ styles.userImgRow}>
            {props.users ? userList : <h1>Looking for users</h1>}
        </div>
    )

}

export default UserImgList