import React, {useState} from 'react'
import styles from '../styles/formStyles/editaccount.module.scss'
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
            matchAgeMin: minAge,
            country: country,
            region: region, 
            city: city
        }
        try {
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
            console.log(res)
            props.refresh()
        } catch (error) {
            console.log(error)
        }


       
    }
    if(!props.toEdit){
        return( 
        <form className={styles.accountForm}> 
            <div className={"form-group "+styles.inputGroup}>
                <label className={styles.formLabel}>Nickname:</label>
                <input readOnly className={"form-control "+styles.formInputB} type="text" value={nick} />
            </div>
            <div className={"form-group "+styles.inputGroup}>
                <label className={styles.formLabel}>Describe yourself:</label>
                <textarea readOnly className={"form-contol "+ styles.textAreaB} rows="3" value={desc} >
                
                </textarea>
            </div>
            <div className={"form-row align-items-center justify-content-between my-3 "+styles.inputGroup}>
                <div className={"col-md-3"}>
                    <label className={styles.formLabel}>Intersted In:</label>
                    <input readOnly className={"form-control "+styles.formInputB} type="text" value={interest} />
                </div>
                <div className={"col-md-3"}>
                    <label className={styles.formLabel}>Age(min):</label>
                    <input readOnly value={minAge} className={"form-control "+styles.formInputB} type="text" />
                </div>
                <div className={"col-md-3"}>
                    <label className={styles.formLabel}>Age(max):</label>
                    <input readOnly value={maxAge} className={"form-control "+styles.formInputB} type="text" />
                </div>
            </div>
            <div className={"form-row align-items-center justify-content-between my-3 "+styles.inputGroup}>
                <div className={"col-md-3"}>
                    <label className={styles.formLabel}>Country:</label>
                    <input readOnly className={"form-control "+styles.formInputB} type="text" value={country} />
                </div>
                <div className={"col-md-3"}>
                    <label className={styles.formLabel}>Region:</label>
                    <input readOnly className={"form-control "+styles.formInputB} type="text" value={region} />
                </div>
                <div className={"col-md-3"}>
                    <label className={styles.formLabel}>City:</label>
                    <input readOnly className={"form-control "+styles.formInputB} type="text" value={city} />
                </div>
            </div>
        </form> 
        )
    }
    return(
    <form onSubmit={(e) =>editFormSubmission(e)} className={styles.accountForm}> 
        <div className={"form-group "}>
            <label className={styles.formLabel}>Nickname</label>
            <input className={"form-control "+styles.formInput} type="text" value={nick} onChange={(e)=> nickChangeHandler(e)}/>
        </div>
        <div className={"form-group "}>
            <label className={styles.formLabel}>Describe yourself</label>
            <textarea className={"form-contol "+ styles.textArea} rows="3" value={desc} onChange={(e)=> descChangeHandler(e)}>
            
            </textarea>
        </div>
        <div className={"form-row align-items-center justify-content-between my-3 "}>
            <div className={"col-md-3"}>
                <label className={styles.formLabel}>Intersted In</label>
                <select  className={"custom-select mr-sm-2 "+ styles.formInput} onChange={(e)=> interestChangeHandler(e)} value={interest}>
                <option value="none">Choose...</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="everyone">Everyone</option>
                </select>
            </div>
            <div className={"col-md-3"}>
                <label className={styles.formLabel}>Age(min)</label>
                <input value={minAge} onChange={(e)=> ageMinHandler(e)} className={"form-control "+styles.formInput} type="number" min={18} max={100}/>
            </div>
            <div className={"col-md-3"}>
                <label className={styles.formLabel}>Age(max)</label>
                <input value={maxAge} onChange={(e)=> ageMaxHandler(e)} className={"form-control "+styles.formInput} type="number" min={18} max={100}/>
            </div>
        </div>
        <div className={"form-row align-items-center justify-content-between my-3 "}>
            <div className={"col-md-3"}>
                <label className={styles.formLabel}>Country</label>
                <input className={"form-control "+styles.formInput} type="text" value={country} onChange={(e)=> countryChangeHandler(e)}/>
            </div>
            <div className={"col-md-3"}>
                <label className={styles.formLabel}>Region</label>
                <input className={"form-control "+styles.formInput} type="text" value={region} onChange={(e)=> regionChangeHandler(e)}/>
            </div>
            <div className={"col-md-3"}>
                <label className={styles.formLabel}>City</label>
                <input className={"form-control "+styles.formInput} type="text" value={city} onChange={(e)=> cityChangeHandler(e)}/>
            </div>
        </div>
        <button type="submit" className={"btn btn-dark float-right m-1 "+styles.subBtn}>Save Changes</button>
    </form> 
    )
}

export default EditForm