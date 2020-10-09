import React, { useState } from 'react'
import styles from './styles/core/compIndex.module.scss'
import axios from 'axios'
import deleteIcon from '../images/trash.png'
import avatarIcon from '../images/add-user.png'

const Image = ({imageId, url, caption, token, account, refresh}) => {

    const [comment, setComment] = useState('')
    const [commentType, setCommentType] = useState('info') //info, success, fail

    //sets the picture as a profile picture
    const setAvatarHandler = (url) => {
        axios({
            method: "POST",
            url: `/api/account/update/${account}`,
            data: {
                account:{
                    avatar:url
                }
            },
            headers: {
                'auth-token': token
            }
        }).then(res=> {
            console.log(res.data);
            commentHandler('Update Successful', 'success')
            refresh()
        }).catch(err=> console.log(err))
    }
    //deletes the picture from database
    const deleteImage = (imageId) => {
        axios({
            method: "DELETE",
            url: `/api/account/image-delete/${imageId}`,
            headers: {
                'auth-token': token
            }
        }).then(res => {
            console.log(res)
            commentHandler('Image deleted successfully', 'success')
            refresh()
        }).catch(err => {
            console.log(err)
        })
    }

    const commentHandler = (commentTxt, style="info") => {
        setComment(commentTxt)
        setCommentType(style)
    }

    let commentStyle = styles.iconComment;
    if(commentType === "success"){
        commentStyle = styles.iconCommentSuccess
    }else if (commentType === "fail") {
        commentStyle = styles.iconCommentFail
    }
    return(
        <div className={"card " + styles.imageCard} >
            <img className={"card-img-top " + styles.cardImg} src={url} alt="Card image cap" />
                <p className={"card-text "+styles.caption }>"{caption}"</p>
            <div className="card-body text-center d-flex flex-column jusify-content-betwen align-items-center">
                
                <div className="row d-flex flex-row justify-content-evenly">
                    <div className="col-12 d-flex flex-row justify-content-center">
                        <button 
                            onMouseOut={()=> commentHandler("")} 
                            onMouseOver={()=> commentHandler("Set as avatar")} 
                            onClick={()=> setAvatarHandler(url)} 
                            className={"btn btn-link mx-4 "+styles.iconBtn}
                        >
                            <img src={avatarIcon} alt="Add avatar icon" />
                        </button>
                        <button 
                            onMouseOut={()=> commentHandler("")} 
                            onMouseOver={()=> commentHandler("Remove image", "fail")}
                            onClick={() => deleteImage(imageId)} 
                            className={"btn btn-link mx-4 "+styles.delBtn}
                        >
                            <img src={deleteIcon} alt="Delete image icon" />
                        </button>
                    </div>
                    {comment ? <div className={"col-12 "+commentStyle}>{comment}</div> : <div className={"col-12 "+commentStyle} />}
                </div>
            </div>
        </div>
    )
}

export default Image;