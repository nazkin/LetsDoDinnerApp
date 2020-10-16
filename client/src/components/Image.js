import React, { useState } from 'react'
import styles from './styles/core/compIndex.module.scss'
import axios from 'axios'
import { OverlayTrigger, Tooltip, Modal, Button, InputGroup, FormControl, Image} from 'react-bootstrap'
import deleteIcon from '../images/trash.png'
import avatarIcon from '../images/add-user.png'
import textIcon  from '../images/text.png'
import menuIcon from '../images/menuImg.png'
import closeMenu from '../images/closeImgMenu.png'
const ImageInProfile = ({imageId, url, caption, token, account, refresh}) => {

    const [comment, setComment] = useState('')
    const [commentType, setCommentType] = useState('info') //info, success, fail
    const [isDisplayed, setIsDisplayed] = useState(false)
    const [show, setShow] = useState(false)
    const [showDelete, setShowDelete] = useState(false)
    const [showAvatar, setShowAvatar] = useState(false)
    const [captionNew, setCaptionNew] = useState(caption)
    
    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const openDelete= () => setShowDelete(true)
    const cancelDelete = () => setShowDelete(false)
    const openAvatar= () => setShowAvatar(true)
    const cancelAvatar = () => setShowAvatar(false)
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
                        onClick={openAvatar}
                        className={"btn btn-link mx-4 "+styles.iconBtn}
                    >
                        <img src={avatarIcon} alt="Add avatar icon" />
                    </button>
                </OverlayTrigger>

                <OverlayTrigger overlay={<Tooltip  id="tooltip-disabled">remove photo</Tooltip>}>
                    <button 
                        onClick={openDelete}
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
                <Modal.Header closeButton style={{background: "slategrey", color: "white"}}>
                    <Modal.Title>Update Caption</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{display:"flex",flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                    <Image src={url} fluid alt="Displaying the image about to be edited" className="mb-3"/>
                    <InputGroup className="mb-3">
         
                        <FormControl
                        aria-label="Default"
                        aria-describedby="inputGroup-sizing-default"
                        value={captionNew}
                        onChange={(e) => setCaptionNew(e.target.value)}
                        style={{background: "linen", width: '100%', border: "2px solid goldenrod",fontSize: "20px", lineHeight: '2rem', color: "slategrey"}}
                        />
                        <small>To edit caption simply type a new caption above and click submit</small>
                    </InputGroup>
                </Modal.Body>
                <Modal.Footer style={{background: "slategrey", color: "white",}}>
                    <Button variant="dark" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={()=> updateImgHandler()}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showDelete} onHide={cancelDelete}>
                <Modal.Header closeButton style={{background: "darkred", color: "white"}}>
                    <Modal.Title>Are you sure you want to delete this image ?</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{display:"flex",flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                    <Image src={url} fluid alt="Displaying the image about to be edited" className="mb-3"/>
                </Modal.Body>
                <Modal.Footer style={{background: "darkred", color: "white",}}>
                    <Button variant="secondary" onClick={cancelDelete}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={() => deleteImage(imageId)}>
                        Remove
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showAvatar} onHide={cancelAvatar}>
                <Modal.Header closeButton style={{background: "steelblue", color: "white"}}>
                    <Modal.Title>Are you sure you want to set this image as your profile picture ?</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{display:"flex",flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                    <Image src={url} fluid alt="Displaying the image about to be edited" className="mb-3"/>
                </Modal.Body>
                <Modal.Footer style={{background: "steelblue", color: "white",}}>
                    <Button variant="secondary" onClick={cancelAvatar}>
                        Cancel
                    </Button>
                    <Button variant="warning" onClick={()=> setAvatarHandler(url)} >
                        Set Avatar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ImageInProfile;