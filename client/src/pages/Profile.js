import React, {useState, useEffect} from 'react'
import axios from 'axios'
import EditAccountForm from '../components/Forms/AccountEditForm'
import styles from './styles/profile.module.scss'
import Template from '../components/Template'
import Title from '../components/UI/Title'
import FileUpload from '../components/Forms/formElements/UploadFIle'
import ImageCard from '../components/Image'

const Profile = (props) => {
    const [accountInfo, setAccountInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [isUpload, setIsUpload] = useState(false);

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

    let images = null;
    let uploadSection = null;

    if(accountInfo){
        images = accountInfo.images.map(image => {
            return <ImageCard account={accountInfo._id} token={token} key={image._id} url={image.downloadUrl} caption={image.caption} /> 
        });
    }
    if(isUpload){
        uploadSection = (<div className={"card " + styles.uploadSection}>
                            <FileUpload refreshAccount={pageRefreshHandler} token={token} />
                        </div>)
    }


    if(loading){
       return (
           <Template>
               <h1>Loading...</h1>
           </Template>
       ) 
    }
    return(
        <Template>
            <div className={"row "+ styles.updateRow}>
                <div className={"col-lg-6 px-5 py-1"}>
                    <Title title="User Information"/>
                    {/* display the form */}
                   {!accountInfo ? null : <EditAccountForm country={accountInfo.country} city={accountInfo.city} region={accountInfo.region} id={accountInfo._id} nickname={accountInfo.nickname} desc={accountInfo.description} interest={accountInfo.interestedIn} minAge={accountInfo.matchAgeMin} maxAge={accountInfo.matchAgeMax} />}
                </div>
                <div className={"col-lg-6 "+ styles.imgColumn }>
                    {/* display the images */}
                    <div className={"row "+styles.images}>
                        {images}
                    </div>
                   <div className="row my-2 d-flex justify-content-center">
                     <button onClick={toggleUpload} className={"btn btn-danger btn-lg float-right " + styles.toggleBtn}>+</button>
                   </div>
                    <div className={"row d-flex justify-content-center my-2"}>
                        {uploadSection}
                    </div>
                </div>
            </div>        
        </Template>
    )
}

export default Profile;