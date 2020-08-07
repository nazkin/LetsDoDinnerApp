import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import firebase from 'firebase';
import storage from '../Firebase/index';
import axios from 'axios';
import imgPlaceholder from '../images/camera.png';
import styles from './styles/formtwo.module.scss';

const FormB = props => {
    let history = useHistory();

    const [src, setSrc] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [imageUrl, setImageUrl] = useState("");
    const  [caption, setCaption] = useState("");

    const fileChangeHandler = (e) => {
        if(e.target.files[0]){
            const file = e.target.files[0];
            setSrc(file);
        }
    }

    const captionChangeHandler = (e) => {
        setCaption(e.target.value);
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
    //Saving the info effectively
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
            history.push('/');

        } catch (error) {
             console.log(error);
        }


    }
    //Below is code for conditional rendering
    let uploadForm = null;
    let saveForm = <form onSubmit={saveImageInfoHandler} className={styles.uploadForm}>
                        <div className={"form-group "+ styles.inputStyle}>
                            <label className={styles.formLabel}>Add a clever caption</label>
                            <input onChange={(e) => captionChangeHandler(e)} type="text" className={"form-control " } />
                        </div>
                        <button className="btn btn-success" type="submit">Save Result</button>
                    </form>
    if(!imageUrl){
        uploadForm = (<form onSubmit={storeImageHandler} className={styles.uploadForm}>
                        <div className={"form-group "}>
                            <label className={styles.formLabel}>Upload a photo</label>
                            <input onChange={fileChangeHandler} type="file" className={"form-control-file " + styles.uploadInput}  />
                        </div>
                        <button type="submit" className="btn btn-info">Upload</button>
                    </form>)
        saveForm = null;
    } 
    return(
        <div className={'row ' + styles.mainRow}>
            <div className={'col-md-4 '+ styles.imgCol}></div>
            <div className={'col-md-8 '+ styles.formCol}>
                <h1 className="">Step 2: Upload images of yourself</h1>
                {uploadForm}
                {/* <form onSubmit={storeImageHandler} className={styles.uploadForm}>
                        <div className={"form-group "}>
                            <label className={styles.formLabel}>Upload a photo</label>
                            <input onChange={fileChangeHandler} type="file" className={"form-control-file " + styles.uploadInput}  />
                        </div>
                        <button type="submit" className="btn btn-info">Upload</button>
                </form> */}
                <div className={styles.imgDisplay}>
                   {!imageUrl ? <img src={imgPlaceholder} alt="uploaded image placeholder" /> : <img className={styles.uploadedImg} src={imageUrl} alt="uploaded image placeholder" /> }
                </div>
                {saveForm}
                {/* <form className={styles.uploadForm}>
                    <div className={"form-group "+ styles.inputStyle}>
                        <label className={styles.formLabel}>Add a clever caption</label>
                        <input type="text" className={"form-control " } />
                    </div>
                    <button className="btn btn-success" type="submit">Save Result</button>
                </form> */}
            </div>
        </div>
    )
}

export default FormB;