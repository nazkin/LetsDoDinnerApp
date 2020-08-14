import React, {useState, useEffect} from 'react'
import axios from 'axios'
import EditAccountForm from '../components/Forms/AccountEditForm'
import styles from './styles/profile.module.scss'
import Template from '../components/Template'
import FileUpload from '../components/Forms/formElements/UploadFIle'
import ImageCard from '../components/Image'

const Profile = (props) => {
    const [accountInfo, setAccountInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);

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
            console.log(res.data.account);
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

    let images = null;
    if(accountInfo){
        images = accountInfo.images.map(image => {
            return <ImageCard key={image._id} url={image.downloadUrl} caption={image.caption} /> 
        });
    }
    return(
        <Template>
            <div className={"row "+ styles.updateRow}>
                <div className={"col-lg-6 px-5 py-1"}>
                    <h1 className={styles.formTitle}>General Information</h1>
                    <hr className={styles.hLine}/>
                    {/* display the form */}
                   {!accountInfo ? null : <EditAccountForm id={accountInfo._id} nickname={accountInfo.nickname} desc={accountInfo.description} interest={accountInfo.interestedIn} minAge={accountInfo.matchAgeMin} maxAge={accountInfo.matchAgeMax} />}
                </div>
                <div className={"col-lg-6 "}>
                    {/* display the images */}
                    <div className={styles.images}>
                        {images}
                    </div>
                    
                    <div className={"row d-flex justify-content-center my-2"}>
                        <div className={"card " + styles.uploadSection}>
                            <FileUpload refreshAccount={pageRefreshHandler} token={token} />
                        </div>
                    </div>
                </div>
            </div>
            
        </Template>
    )
}

export default Profile;