import React, { useState } from 'react'
import styles from './styles/core/compIndex.module.scss'
import axios from 'axios'
import { OverlayTrigger, Tooltip, Modal, Button, InputGroup, FormControl} from 'react-bootstrap'
import deleteIcon from '../images/trash.png'
import avatarIcon from '../images/add-user.png'
import textIcon  from '../images/text.png'
import menuIcon from '../images/menuImg.png'
import closeMenu from '../images/closeImgMenu.png'
const Image = ({imageId, url, caption, token, account, refresh}) => {

    const [comment, setComment] = useState('')
    const [commentType, setCommentType] = useState('info') //info, success, fail
    const [isDisplayed, setIsDisplayed] = useState(false)
    const [show, setShow] = useState(false);
    const [captionNew, setCaptionNew] = useState(caption)
    
    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
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

    //Update image caption

    const updateImgHandler = (id = imageId) => {
        axios({
            method: "POST",
            url: `/api/account/image/update-text/${id}`,
            headers: {
                'auth-token': token
            },
            data:{
                captionUpdate: captionNew
            }
        }).then(res => {
            console.log(res)
            handleClose()
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

    let menuStyle ={background: 'transparent'}
    let imgMenu = null;
    if(isDisplayed){
        menuStyle ={background: 'whitesmoke'}
        imgMenu = (
            <div className="col-12updateImgHandler d-flex flex-row justify-content-center">

                <OverlayTrigger overlay={<Tooltip  id="tooltip-disabled">set as avatar</Tooltip>}>
                    <button 
                        onClick={()=> setAvatarHandler(url)} 
                        className={"btn btn-link mx-4 "+styles.iconBtn}
                    >
                        <img src={avatarIcon} alt="Add avatar icon" />
                    </button>
                </OverlayTrigger>

                <OverlayTrigger overlay={<Tooltip  id="tooltip-disabled">remove photo</Tooltip>}>
                    <button 
                        onClick={() => deleteImage(imageId)} 
                        className={"btn btn-link mx-4 "+styles.delBtn}
                    >
                        <img src={deleteIcon} alt="Delete image icon" />
                    </button>
                </OverlayTrigger>
                <OverlayTrigger overlay={<Tooltip  id="tooltip-disabled">edit caption</Tooltip>}>
                    <button 
                        onClick={handleShow}
                        className={"btn btn-link mx-4 "+styles.editBtn}
                    >
                        <img src={textIcon} alt="Update image caption icon" />
                    </button>
                </OverlayTrigger>

            </div>
        )
    }
    return(
        <div className={"card " + styles.imageCard} >
            <img className={"card-img-top " + styles.cardImg} src={url} alt="Card image cap" />
                <p className={"card-text "+styles.caption }>{caption}</p>
            <div style={menuStyle} className="card-body text-center d-flex flex-column jusify-content-betwen align-items-center py-0">
                            <div 
                                onClick={() => setIsDisplayed(!isDisplayed)}
                                className={styles.menuBtn}
                            >
                                {
                                    isDisplayed ? 
                                        <img src={closeMenu} alt="Add avatar icon" style={{width: '25px', height: 'auto'}}/>
                                        : 
                                        <img src={menuIcon} alt="Add avatar icon" style={{width: '25px', height: 'auto'}}/>
                                }
                            </div>
                <div className="row d-flex flex-row justify-content-center py-2">
                    {imgMenu}
                    {comment ? <div className={"col-12 "+commentStyle}>{comment}</div> : <div className={"col-12 "+commentStyle} />}
                </div>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Update image caption below</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-default">Caption</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                        aria-label="Default"
                        aria-describedby="inputGroup-sizing-default"
                        value={captionNew}
                        onChange={(e) => setCaptionNew(e.target.value)}
                        />
                        <small>To edit caption simply type a new caption above and click submit</small>
                        <small>If you dont want to change the caption click cancel</small>
                    </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={()=> updateImgHandler()}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Image;