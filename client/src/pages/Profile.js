import React, {useState, useEffect} from 'react'
import axios from 'axios'
import EditAccountForm from '../components/Forms/AccountEditForm'
import styles from './styles/index.module.scss'
import Template from '../components/Template'
import Title from '../components/UI/Title'
import FileUpload from '../components/Forms/formElements/UploadFIle'
import ImageCard from '../components/Image'

const Profile = (props) => {
    const [accountInfo, setAccountInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [isUpload, setIsUpload] = useState(false);
    const [isEditForm, setIsEditForm] = useState(false);

    const token = sessionStorage.getItem('auth-token');


    useEffect(()=>{
        setLoading(true);
        axios({
            method: 'GET',
            url: 'http://localhost:8080/api/account/info',
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
    }
    const toggleUpload = () => {
        setIsUpload(!isUpload);
    }
    const toggleEdit = () => {
        setIsEditForm(!isEditForm);
    }

    let images = null;
    let uploadSection = null;

    if(accountInfo){
        images = accountInfo.images.map(image => {
            return <ImageCard refresh={pageRefreshHandler} account={accountInfo._id} token={token} key={image._id} url={image.downloadUrl} caption={image.caption} /> 
        });
    }
    if(isUpload){
        uploadSection = (<div className={"card " + styles.uploadSection}>
                            <FileUpload refreshAccount={pageRefreshHandler} token={token} />
                        </div>)
    }


    if(loading || !accountInfo){
       return (
           <Template>
               <h1>Loading...</h1>
           </Template>
       ) 
    }
    return(
        <Template>
            <div className={"row "+ styles.updateRow}>
                <div className={"col-lg-5 px-5 py-1 "+styles.formCol}>
                    <Title title="User Information"/>
                    <div className={"row my-2 d-flex justify-content-end "+styles.toggleBtn}>
                     <button onClick={toggleEdit} className={"btn btn-danger btn-lg "}>edit</button>
                   </div>
                    {/* display the form */}
                   {!isEditForm ? <EditAccountForm toEdit={false} country={accountInfo.country} city={accountInfo.city} region={accountInfo.region} id={accountInfo._id} nickname={accountInfo.nickname} desc={accountInfo.description} interest={accountInfo.interestedIn} minAge={accountInfo.matchAgeMin} maxAge={accountInfo.matchAgeMax} /> : <EditAccountForm toEdit={true} country={accountInfo.country} city={accountInfo.city} region={accountInfo.region} id={accountInfo._id} nickname={accountInfo.nickname} desc={accountInfo.description} interest={accountInfo.interestedIn} minAge={accountInfo.matchAgeMin} maxAge={accountInfo.matchAgeMax} />}
                </div>
                <div className={"col-lg-7 p-0 "+ styles.imgColumn }>
                    <Title title="User Images"/>   
                   <div className={"row my-2 d-flex justify-content-end "+styles.toggleBtn}>
                     <button onClick={toggleUpload} className={"btn btn-danger btn-lg"}>new</button>
                   </div>
                    <div className={"row "+styles.uploadSection}>
                        {uploadSection}
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