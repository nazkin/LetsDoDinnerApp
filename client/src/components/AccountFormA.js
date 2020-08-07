import React, {useState} from 'react';
import styles from './styles/formone.module.scss';
import DatePicker from "react-datepicker";
import axios from 'axios';

const FormA = props => {
    const [nickname, setNickname] = useState("");
    const [desc, setDesc] = useState("");
    const [dob, setDob] = useState(new Date());
    const [gender, setGender] = useState("");
    const [interest, setInterest] = useState("");
    const [ageMax, setAgeMax] = useState(60);
    const [ageMin, setAgeMin] = useState(18);
    const [error, setError] = useState(null);

  
   
    //Input handlers*************************************************************************
    const nickChangeHandler = (e) => {
        setNickname(e.target.value);
    }
    const descChangeHandler = (e) => {
        setDesc(e.target.value);
    }
    const dateChangeHandler = (date) => {
        setDob(date);
    }
    const genderChangeHandler = (e) => {
        setGender(e.target.value);
    }
    const interestChangeHandler = (e) => {
        setInterest(e.target.value);
    }
    const ageMaxHandler = (e) => {
        setAgeMax(e.target.value);
    }
    const ageMinHandler = (e) => {
        setAgeMin(e.target.value);
    }
    //Input handlers*************************************************************************

    //Form Submission
    const submitFormHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await axios({
                method: 'POST',
                url: 'http://localhost:8080/api/account/create',
                data: {
                    nickname: nickname,
                    description: desc,
                    gender: gender,
                    dob : dob,
                    interestedIn: interest,
                    ageMax: ageMax,
                    ageMin: ageMin
                },
                headers: {
                    'auth-token': props.token
                }
            });
            props.nextForm();
            
        } catch (err) {
            setError(err);
            console.log(err);
        }
    }

    return (
        <div className={"row "+styles.mainRow}>
            <div className={"col-lg-8 "+ styles.formCol}>
                <h1>Step 1: General Information</h1>
                <form onSubmit={(e) => submitFormHandler(e)} className={styles.accountForm}> 
                    <div className={"form-group "}>
                        <label className={styles.formLabel}>Nickname</label>
                        <input className={"form-control "} type="text" value={nickname} onChange={(e)=> nickChangeHandler(e)}/>
                        <small className={"form-text text-muted"}>This name will be viewed by other users on this application. Your real name will remain private</small>
                    </div>
                    <div className={"form-group "}>
                        <label className={styles.formLabel}>Describe yourself</label>
                        <textarea className={"form-contol "+ styles.textArea} rows="3" value={desc} onChange={(e)=> descChangeHandler(e)}>
                        
                        </textarea>
                    </div>
                    <div className={"form-row align-items-center justify-content-between"}>
                        <div className={"col-md-5"}>
                            <label className={styles.formLabel}>D.O.B</label>
                            <DatePicker selected={dob} onChange={dateChangeHandler}/>
                        </div>
                        <div className = {"col-md-5"}>
                            <label className={styles.formLabel}>Gender</label>
                            <select className="custom-select mr-sm-2" onChange={(e)=>genderChangeHandler(e)} value={gender}>
                                <option value="none">Choose...</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>
                    <div className={"form-row align-items-center justify-content-between my-3"}>
                        <div className={"col-md-4"}>
                            <label className={styles.formLabel}>Intersted In</label>
                            <select  className="custom-select mr-sm-2" onChange={(e)=> interestChangeHandler(e)} value={interest}>
                            <option value="none">Choose...</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="everyone">Everyone</option>
                            </select>
                        </div>
                        <div className={"col-md-2"}>
                            <label className={styles.formLabel}>Age(min)</label>
                            <input value={ageMin} onChange={(e)=> ageMinHandler(e)} className={"form-control "} type="number" min={18} max={100}/>
                        </div>
                        <div className={"col-md-2"}>
                            <label className={styles.formLabel}>Age(max)</label>
                            <input value={ageMax} onChange={(e)=> ageMaxHandler(e)} className={"form-control "} type="number" min={18} max={100}/>
                        </div>
                    </div>
                    <button type="submit" className={"btn btn-outline-info btn-lg mt-5"}>Next</button>
                </form> 
            </div>
            <div className={"col-lg-4 "+styles.imgCol}>
            {/* IMAGE BACKGROUND */}
            </div>
        </div>

    )
}
export default FormA;