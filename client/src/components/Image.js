import React from 'react'
import styles from './styles/image.module.scss'
import axios from 'axios'
import firebase from '../Firebase'

const Image = ({url, caption, token, account}) => {

    const setAvatarHandler = (url) => {
        axios({
            method: "POST",
            url: `http://localhost:8080/api/account/update/${account}`,
            data: {
                account:{
                    avatar:url
                }
            },
            headers: {
                'auth-token': token
            }
        }).then(res=> console.log(res))
            .catch(err=> console.log(err))
    }

    return(
        <div className={"card " + styles.imageCard} >
            <img className={"card-img-top " + styles.cardImg} src={url} alt="Card image cap" />
            <div className="card-body text-center d-flex flex-column jusify-content-betwen align-items-center">
                <p className={"card-text mt-1 " + styles.imgCaption}>{caption}</p>
                <div className="mb-1">
                    <button onClick={()=> setAvatarHandler(url)} className="btn btn-link">Set as Avatar</button>
                    <button className="btn btn-link">Delete</button>
                </div>
            </div>
        </div>
    )
}

export default Image;