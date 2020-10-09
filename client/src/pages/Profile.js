import React, {useState, useEffect} from 'react'
import axios from 'axios'
import EditAccountForm from '../components/Forms/AccountEditForm'
import styles from './styles/index.module.scss'
import Template from '../components/Template'
import Title from '../components/UI/Title'
import FileUpload from '../components/Forms/formElements/UploadFIle'
import ImageCard from '../components/Image'
import { PushSpinner } from "react-spinners-kit";
import addIcon from '../images/add.png'
import editIcon from '../images/edit.png'
import Modal from "react-modal"

Modal.defaultStyles.overlay.backgroundColor = 'rgba(0, 0, 0, 0.7)';

const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)',
      width                 : '50em',
      maxWidth              : '100%',
      minHeight             : '25em',
      backgroundColor       : 'whitesmoke',
    }
  };


const Profile = (props) => {
    const [accountInfo, setAccountInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [isUpload, setIsUpload] = useState(false);
    const [isEditForm, setIsEditForm] = useState(false);
    const [comment, setComment] = useState("");
    const [isOpen, setIsOpen] = useState(false); //modal state

    const token = sessionStorage.getItem('auth-token');


    useEffect(()=>{
        setLoading(true);
        axios({
            method: 'GET',
            url: '/api/account/info',
            headers: {
                'auth-token': token
            }
        }).then(res=> {
            console.log(res);
            setAccountInfo(res.data.account);
            setLoading(false);
        }).catch(err => {
            console.log(err);
            setLoading(false);
        })
        
    },[refresh]);

    const pageRefreshHandler = () => {
        setRefresh(!refresh);
        setIsEditForm(false);
        setIsUpload(false);
    }

    const toggleEdit = () => {
        setIsEditForm(!isEditForm);
    }
        //Control of the modal state
    const closeModal = () => {
        setIsOpen(false)
    }
    const openModal = () => {
        setIsOpen(true)
    }
    const toggleUpload = () => {
        setIsOpen(!isOpen)
    }

    let images = null;
    let uploadSection = null;

    if(accountInfo){
        images = accountInfo.images.map(image => {
            return <ImageCard imageId={image._id} refresh={pageRefreshHandler} account={accountInfo._id} token={token} key={image._id} url={image.downloadUrl} caption={image.caption} /> 
        });
    }
    uploadSection = (<div className={"card " + styles.uploadSection}>
                        <FileUpload refreshAccount={pageRefreshHandler} token={token} />
                    </div>)
    


    if(loading || !accountInfo){
       return (
           <Template>
                <div className={"container "} style={{minHeight: "50em", paddingTop: "24em", paddingLeft: "25%"}}>
                    <PushSpinner size={80} color="#bc4e4e" loading={true} />
                </div> 
           </Template>
       ) 
    }
    return(
        <Template>
           
                <Modal
                    className={styles.uploadModal}
                    isOpen={isOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                >
                {uploadSection}
                </Modal>

            <div className={"row "+ styles.updateRow}>
                <div className={"col-lg-5 p-4 my-4"+styles.formCol}>
                    <Title title="User Info"/>
                    <div className={"row my-2 d-flex justify-content-end "+styles.toggleBtn}>
                        <p>{comment === "edit" && !isEditForm ? comment : ""}</p>
                     <button onMouseOut={()=> setComment('')} onMouseOver={() => setComment('edit')} onClick={toggleEdit} className={"btn btn-danger btn-lg "}>
                        <img src={editIcon} alt="edit info icon" style={{background: "white"}} />
                     </button>
                   </div>
                    {/* display the form */}
                   {
                    !isEditForm ?   <EditAccountForm 
                                        toEdit={false} 
                                        country={accountInfo.country} 
                                        city={accountInfo.city} 
                                        region={accountInfo.region} 
                                        id={accountInfo._id} 
                                        nickname={accountInfo.nickname} 
                                        desc={accountInfo.description} 
                                        interest={accountInfo.interestedIn} 
                                        minAge={accountInfo.matchAgeMin} 
                                        maxAge={accountInfo.matchAgeMax} 
                                    /> : <EditAccountForm 
                                            toEdit={true} 
                                            country={accountInfo.country} 
                                            city={accountInfo.city} 
                                            region={accountInfo.region} 
                                            id={accountInfo._id} 
                                            nickname={accountInfo.nickname} 
                                            desc={accountInfo.description} 
                                            interest={accountInfo.interestedIn} 
                                            minAge={accountInfo.matchAgeMin} 
                                            maxAge={accountInfo.matchAgeMax}
                                            refresh={pageRefreshHandler} 
                                        />
                        
                   }
                </div>
                <div className={"col-lg-7 p-4 "+ styles.imgColumn }>
                    <Title title="User Images"/>   
                   <div className={"row my-2 d-flex flex-row justify-content-end "+styles.toggleBtn}>
                   <p>{comment === "add" && !isUpload ? comment : ""}</p>
                     <button onMouseOut={()=> setComment('')} onMouseOver={() => setComment('add')} onClick={toggleUpload} className={"btn btn-danger btn-lg "}>
                         <img src={addIcon} alt="add image icon" style={{background: "white"}} />
                     </button>
                   </div>
                    <div className={"row "+styles.uploadSection}>
                       
                    </div>
                                        {/* display the images */}
                    <div className={"row " +styles.images}>
                        {images}
                    </div>
                </div>
            </div>        
        </Template>
    )
}

export default Profile;