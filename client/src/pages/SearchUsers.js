import React, {useState, useEffect } from 'react'
import { PushSpinner } from "react-spinners-kit";
import Template from '../components/Template'
import styles from './styles/index.module.scss'
import Title from '../components/UI/Title'
import UserListRow from '../components/UserListRow'
import axios from 'axios'

const SearchUsers = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [userData, setUserData] = useState([])
    //form state
    const [genderInterest, setGenderInterest] = useState("")
    const [maxAge, setMaxAge] = useState(60)
    const [minAge, setMinAge] = useState(18)



    const token = sessionStorage.getItem('auth-token')


    useEffect(() => {
        setLoading(true)
        axios({
            method: "GET",
            url: "/api/account/recent-users",
            headers: {
                'auth-token': token
            }
        }).then(res => {
            setUserData(res.data.accounts)
            setGenderInterest(res.data.user.interestedIn)
            setMaxAge(res.data.user.matchAgeMax)
            setMinAge(res.data.user.matchAgeMin)
            setLoading(false)
        }).catch(err=> {
            console.log(err)
            setLoading(false)
        })
    }, [])


    if(loading || !userData) {
        return(
            <Template>
                <div className={"container "} style={{minHeight: "50em", paddingTop: "24em", paddingLeft: "25%"}}>
                    <PushSpinner size={80} color="#bc4e4e" loading={true} />
                </div> 
            </Template>
        )
    }

  
    return(
        <Template>
            <div className={"row "+styles.searchRoot}>
                <Title title="Filter & Search Users" />
                <UserListRow usersData={userData}/>
                <div className={"col-md-4 "+styles.sortOptions}>
                    <h2>filter and sort</h2>
                    <form>
                        <div className={"form-group row "}>
                            <label className={"col-sm-4 col-form-label "}>Gender</label>
                            <div className={"col-sm-6 "}>
                                <select className="custom-select mr-sm-2" value={genderInterest}>
                                    <option value="none">Choose...</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className={"form-group row "}>
                            <label className={"col-sm-4 col-form-label "}>Age-min</label>
                            <div className={"col-sm-4 "}>
                                <input className={"form-control "} type="number" alt="gender type input" value={minAge} min={18} max={60}/>
                            </div>
                        </div>
                        <div className={"form-group row "}>
                            <label className={"col-sm-4 col-form-label "}>Age-max</label>
                            <div className={"col-sm-4 "}>
                                <input className={"form-control "} type="number" alt="gender type input" value={maxAge} min={18} max={60}/>
                            </div>
                        </div>
                        <div className={"form-group row "}>
                            <label className={"col-sm-4 col-form-label "}>Filter location</label>
                            <div className={"col-sm-6 "}>
                                <select className="custom-select mr-sm-2" value={genderInterest}>
                                    <option value="none">Any</option>
                                    <option value="sameCountry">Same country</option>
                                    <option value="sameRegion">Same region</option>
                                    <option value="sameCity">Same city</option>
                                </select>
                            </div>
                        </div>
                        <div className={"form-group row "}>
                            <label className={"col-sm-4 col-form-label "}>Sort-by</label>
                            <div className={"col-sm-6 "}>
                            <select className="custom-select mr-sm-2">
                                    <option value="none">Random</option>
                                    <option value="youngest">Age (younger-older)</option>
                                    <option value="olders">Age (older-younger)</option>
                                    <option value="newest">Newest member</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <button type="submit" className="btn btn-warning btn-lg">Filter</button>
                        </div>
                    </form>
                </div>
            </div>
        </Template>
    )
}

export default SearchUsers;