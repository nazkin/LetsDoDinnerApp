import React, {useState} from 'react'
import styles from '../styles/editaccount.module.scss'
import axios from 'axios';

const EditForm = (props) => {
    const [nick, setNick] = useState(props.nickname);
    const [desc, setDesc] = useState(props.desc);
    const [interest, setInterest] = useState(props.interest);
    const [maxAge, setMaxAge] = useState(props.maxAge);
    const [minAge, setMinAge] = useState(props.minAge);
    const [city, setCity] = useState(props.city);
    const [country, setCountry] = useState(props.country);
    const [region , setRegion] = useState(props.region);


    const nickChangeHandler = (e) => {
        setNick(e.target.value);
    }
    const descChangeHandler = (e) => {
        setDesc(e.target.value);
    }

    const interestChangeHandler = (e) => {
        setInterest(e.target.value);
    }
    const ageMaxHandler = (e) => {
        setMaxAge(e.target.value);
    }
    const ageMinHandler = (e) => {
        setMinAge(e.target.value);
    }
    const countryChangeHandler = (e) => {
        setCountry(e.target.value);
    }
    const regionChangeHandler = (e) => {
        setRegion(e.target.value);
    }
    const cityChangeHandler = (e) => {
        setCity(e.target.value);
    }

    const editFormSubmission = async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem('auth-token');
        const account = {
            nickname: nick,
            description: desc,
            interestedIn: interest,
            matchAgeMax: maxAge,
            matchAgeMin: minAge
        }

        const res = await axios({
            method: "POST",
            url: `http://localhost:8080/api/account/update/${props.id}`,
            headers: {
                "auth-token": token
            },
            data:{
                account: account
            }
        });
        console.log(res);
    }

    return(
    <form onSubmit={(e) =>editFormSubmission(e)} className={styles.accountForm}> 
        <div className={"form-group "}>
            <label className={styles.formLabel}>Nickname</label>
            <input className={"form-control "} type="text" value={nick} onChange={(e)=> nickChangeHandler(e)}/>
            <small className={"form-text text-muted"}>This name will be viewed by other users on this application. Your real name will remain private</small>
        </div>
        <div className={"form-group "}>
            <label className={styles.formLabel}>Describe yourself</label>
            <textarea className={"form-contol "+ styles.textArea} rows="3" value={desc} onChange={(e)=> descChangeHandler(e)}>
            
            </textarea>
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
                <input value={minAge} onChange={(e)=> ageMinHandler(e)} className={"form-control "} type="number" min={18} max={100}/>
            </div>
            <div className={"col-md-2"}>
                <label className={styles.formLabel}>Age(max)</label>
                <input value={maxAge} onChange={(e)=> ageMaxHandler(e)} className={"form-control "} type="number" min={18} max={100}/>
            </div>
        </div>
        <div className="form-row align-items-center justify-content-between my-3">
            <div className={"col-md-3"}>
                <label className={styles.formLabel}>Country</label>
                <input className={"form-control "} type="text" value={country} onChange={(e)=> countryChangeHandler(e)}/>
            </div>
            <div className={"col-md-3"}>
                <label className={styles.formLabel}>Region</label>
                <input className={"form-control "} type="text" value={region} onChange={(e)=> regionChangeHandler(e)}/>
            </div>
            <div className={"col-md-3"}>
                <label className={styles.formLabel}>City</label>
                <input className={"form-control "} type="text" value={city} onChange={(e)=> cityChangeHandler(e)}/>
            </div>
        </div>
        <button type="submit" className={"btn btn-outline-info btn-lg mt-5"}>Save Changes</button>
    </form> 
    )
}

export default EditForm