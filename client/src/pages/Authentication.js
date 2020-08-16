import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import axios from 'axios';
import styles from './styles/authentication.module.scss';
import AuthForm from '../components/Forms/AuthForm';



const Authentication = (props)=> {
    let history = useHistory();

    const [hasAccount, setHasAccount] = useState(false);//controlling sign-up and log-in 
    const [fullName, setFullName] = useState("");//**input handlers 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwdConfirm, setPasswdConfirmed] = useState("");//**input handlers 
    const [error, setError] = useState("");

    const authTypeHandler = ()=>{
        setHasAccount(!hasAccount)
    }
    const signUpHandler = async (e)=>{
        e.preventDefault();
        if(hasAccount){
            return;
        }else if(password !== passwdConfirm){
            setError('Your passwords do not match. Please try again');
            return;
        }
        try {
            const result = await axios.post('http://localhost:8080/api/user/register', {
                name: fullName,
                email: email,
                password: password,
              
            });
            console.log(result);
            sessionStorage.setItem("auth-token", result.data.token);
         
             history.push('/start');
        } catch (err) {
            console.log(err);
           setError('Authentication error. Please try again. ' + err);
        }

    }
    const logInHandler = async (e) => {
        e.preventDefault()
        if(!hasAccount){
            return;
        }
      
        const result = await axios.post('http://localhost:8080/api/user/login', {
            email: email,
            password: password,
         
        })
        console.log(result.data);
        sessionStorage.setItem("auth-token", result.data.token);
        history.push('/');
    }
    const nameInputHandler = (e) => {
        setFullName(e.target.value);
    }
    const emailInputHandler = (e) => {
        setEmail(e.target.value);
    }
    const passwordInputHandler = (e) => {
        setPassword(e.target.value);
    }
    const pswdConfirmInputHandler = (e) => {
        setPasswdConfirmed(e.target.value)
    }

//Type of form selection based on log in or signup state

    let form = <AuthForm 
                    submitForm={signUpHandler}
                    nameChange={nameInputHandler}
                    emailChange={emailInputHandler}
                    passChange={passwordInputHandler}
                    passConfirm={pswdConfirmInputHandler}
                />
    if(hasAccount){
        form = <AuthForm 
                    submitForm={logInHandler} 
                    nameChange={null} 
                    emailChange={emailInputHandler} 
                    passChange={passwordInputHandler} 
                    passConfirm={null}
                />
    }
    let errorText = <p>{error}</p>
    return(
        <div className={"container-fluid "+styles.authContainer}>
            
            <div className={"row "}>
                <div className={"col-md-6 " + styles.authImage}>
                    <h1 className={styles.authTitle}>Welcome to DinnerDates</h1>
                    <h2 className={styles.authTitle}>One of a kind dating experience</h2>
                </div>
                <div className={"col-md-6 " + styles.formColumn}>
                    <h1 className={styles.authTitle}>{hasAccount ? "Log-in to your account" : "Create an account"}</h1>
                    {form}
                    {errorText}
                    <div className={styles.switchAuth}>
                        <p>{hasAccount? "Do not have an account with us?" : "Already have an account with us?" }</p>
                        <button onClick={authTypeHandler} className={"btn btn-link btn-lg" + styles.linkBtn}>{hasAccount ? 'Sign-Up' : 'Log-In'}</button>
                    </div>


                </div>
            </div>
        </div>
    )
}

export default Authentication;