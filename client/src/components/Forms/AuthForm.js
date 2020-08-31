import React from 'react'
import styles from '../styles/formStyles/authform.module.scss';

const AuthForm = props => {

    if(!props.nameChange){
        return(
            <form onSubmit={(e)=>props.submitForm(e)} className={styles.authForm}>
                <div className={"form-group "}>
                    <label className={styles.formLabels}>E-mail</label>
                    <input  onChange={(e)=> props.emailChange(e)}  type="email" className={"form-control "+ styles.formInput} />
                </div>
                <div className={"form-group "}>
                    <label className={styles.formLabels}>Password</label>
                    <input onChange={(e)=> props.passChange(e)}  type="password" className={"form-control "+ styles.formInput} />
                </div>
                <button type="submit" className={"btn btn-danger btn-lg " + styles.subBtn}>Log-In</button>
            </form>
        )
    }
    return (
        <form onSubmit={(e)=> props.submitForm(e)} className={styles.authForm}>
            <div className={"form-group " }>
                <label className={styles.formLabels}>Full Name </label>
                <input onChange={(e)=> props.nameChange(e)}  type="text" className={"form-control "+ styles.formInput} />
            </div>
            <div className={"form-group "}>
                <label className={styles.formLabels}>E-mail</label>
                <input  onChange={(e)=> props.emailChange(e)} type="email" className={"form-control "+ styles.formInput} />
            </div>
            <div className={"form-group "}>
                <label className={styles.formLabels}>Password</label>
                <input  onChange={(e)=> props.passChange(e)} type="password" className={"form-control "+ styles.formInput} />
            </div>
            <div className={"form-group "}>
                <label className={styles.formLabels}>Re-Password</label>
                <input  onChange={(e)=> props.passConfirm(e)} type="password" className={"form-control "+ styles.formInput} />
            </div>
            <button type="submit" className={"btn btn-danger btn-lg " + styles.subBtn}>Sign-Up</button>
        </form>
    )
}

export default AuthForm;