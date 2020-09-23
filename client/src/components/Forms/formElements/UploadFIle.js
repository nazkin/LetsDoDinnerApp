import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import firebase from 'firebase';
import axios from 'axios';
import styles from '../../styles/formStyles/editaccount.module.scss'
import uploadIcon from '../../../images/upload.png'
import placeholder from '../../../images/picture.png';

const UploadFile = (props) => {
    let history = useHistory();

    const [src, setSrc] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [imageUrl, setImageUrl] = useState("");
    const [caption, setCaption] = useState("");

    const fileChangeHandler = (e) => {
        if(e.target.files[0]){
            const file = e.target.files[0];
            setSrc(file);
        }
    }

    const captionChangeHandler = (e) => {
        setCaption(e.target.value);
    }

    const refreshUploadInfo = () => {
        setSrc(null);
        setImageUrl("");
        setCaption("");
        props.refreshAccount();
    }

    const storeImageHandler = (e) => {
        e.preventDefault();

        const image = src;
        const meta = image.type;
        const metadata = {
            contentType: meta
        }

        const storageRef = firebase.storage().ref();
        const uploadTask = storageRef.child('images/'+image.name).put(image,metadata);
        uploadTask.on(
            'state_changed',
            snapshot=> {
              //progress of upload
              const progress = Math.round((snapshot.bytesTransferred/snapshot.totalBytes)*100);
              setUploadProgress(progress);
            },
            error => console.log(error),
            ()=> {
              uploadTask.snapshot.ref.getDownloadURL().then(url=> {
                console.log('File can be retrieved at the following URL =>', url);
                setImageUrl(url);
              });
            }
          ) 
    }

    const saveImageInfoHandler = async (e)=>{
        e.preventDefault();

        try {
            const res = await axios({
                method: "POST",
                url: 'http://localhost:8080/api/account/upload',
                data: {
                    downloadUrl: imageUrl,
                    caption: caption
                },
                headers: {
                    'auth-token': props.token
                }
            });
            console.log(res);
            refreshUploadInfo();
            // history.push('/profile');
            

        } catch (error) {
             console.log(error);
        }


    }
    if(!imageUrl){
        return(
            <div className={styles.uploadContainer}> 
                <form onSubmit={storeImageHandler} className={styles.uploadForm}>
                    <div className={"form-group "}>
                        <span><img src={uploadIcon} alt="upload icon" /><label className={styles.formLabelB}>Upload Here</label></span>   
                        <input onChange={fileChangeHandler} type="file" className={"form-control-file " + styles.uploadInput}  />
                    </div>
                   {src ? <button type="submit" className="btn btn-dark">Upload</button> : null}
                </form>
                <div className={styles.imgDisplay}>
                    <img src={placeholder}  alt="Preview of uploaded image" />
                </div>
            </div>

        )
    }

    return(
        <div className={styles.uploadContainer}>
            <form onSubmit={saveImageInfoHandler} className={styles.uploadForm}>
                <div className={"form-group "+ styles.inputStyle}>
                    <label className={styles.formLabelB}>Add a clever caption</label>
                    <input onChange={(e) => captionChangeHandler(e)} type="text" className={"form-control " } />
                </div>
                <button className="btn btn-success" type="submit">Save Result</button>
            </form>
            <div className={styles.imgDisplay}>
                <img src={imageUrl} className={styles.uploadedImg} alt="Preview of uploaded image" />    
            </div>
        </div>
    )

}

export default UploadFile;