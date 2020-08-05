import React from 'react'
import styles from './styles/formtwo.module.scss'

const FormB = props => {


    return(
        <div className={'row ' + styles.mainRow}>
            <div className={'col-md-4 '+ styles.imgCol}></div>
            <div className={'col-md-8 '+ styles.formCol}>
                <h1 className="float-right">Step 2: Upload images of yourself</h1>
                <form className={styles.uploadForm}>
               
                            <div className={"form-group "}>
                                <label className={styles.formLabel}>Upload a photo</label>
                                <input type="file" className={"form-control-file " + styles.uploadInput}  />
                            </div>
         
                </form>
            </div>
        </div>
    )
}

export default FormB;