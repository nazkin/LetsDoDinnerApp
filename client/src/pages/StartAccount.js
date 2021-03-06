import React, {useState} from 'react';
import styles from './styles/index.module.scss';
import FormB from '../components/Forms/AccountFormB';
import FormA from '../components/Forms/AccountFormA';
import axios from 'axios';

const StartAccount = props => {
    const [isFormB, setIsFormB] = useState(false);
    const token = sessionStorage.getItem('auth-token');
    const nextForm = () => {
        setIsFormB(true);
    }

    let formType = <FormA token={token} nextForm={nextForm} />
    if(isFormB){
        formType = <FormB token={token}/>
    }
    return(
        <div className={"container-fluid "+ styles.startContainer}>
            <div className={"row "+styles.titleBox}>
                <p>Lets get you started with an account</p>
            </div>
            {/* Below is the display of forms depending on the account creation phase */}
            {formType}

        </div>
    )
}
export default StartAccount;