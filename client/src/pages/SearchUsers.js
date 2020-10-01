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
    const [location, setLocation] = useState("none")
    const [sort, setSort] = useState("none")
    const [invalid, setInvalid] = useState("")



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


    const submitFiltersHandler = (e) => {
        e.preventDefault()
        setLoading(true)
        if(minAge > maxAge) {
            setInvalid("Minimum has to be smaller than maximum age. Please try again")
        }
        axios({
            method: "POST",
            url: "/api/account/filtered-users",
            data:{
                interestedIn: genderInterest,
                matchAgeMax:  maxAge,
                matchAgeMin:  minAge,
                location:  location,
                sort: sort
            },
            headers: {
                'auth-token': token
            }
        }).then(res=> {
            console.log(res)
            setUserData(res.data.filteredAccounts)
            setLoading(false)
        }).catch(err => {
            console.log(err)
            setLoading(false)
        })
    }


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
                <Title title="Search Users" />
                <UserListRow  usersData={userData}/>
                <div className={"col-lg-4 order-1 "+styles.sortOptions}>
                    <h2>Filters & Sort Options</h2>
                    {invalid ? <p className={styles.invalid}>{invalid}</p> : <p></p>}
                    <form onSubmit={submitFiltersHandler}>
                        <div className={"form-group row "}>
                            <label className={"col-sm-4 col-form-label "}>Interested In</label>
                            <div className={"col-sm-6 "}>
                                <select className="custom-select mr-sm-2" value={genderInterest} onChange={(e)=> setGenderInterest(e.target.value)}>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="everyone">Everyone</option>
                                </select>
                            </div>
                        </div>
                        <div className={"form-group row "}>
                            <label className={"col-sm-4 col-form-label "}>Age-min</label>
                            <div className={"col-sm-4 "}>
                                <input className={"form-control "} type="number" alt="gender type input" min={18} max={100} value={minAge} onChange={(e) => setMinAge(e.target.value)}/>
                            </div>
                        </div>
                        <div className={"form-group row "}>
                            <label className={"col-sm-4 col-form-label "}>Age-max</label>
                            <div className={"col-sm-4 "}>
                                <input className={"form-control "} type="number" alt="gender type input" min={18} max={100} value={maxAge} onChange={(e) => setMaxAge(e.target.value)}/>
                            </div>
                        </div>
                        <div className={"form-group row "}>
                            <label className={"col-sm-4 col-form-label "}>Filter location</label>
                            <div className={"col-sm-6 "}>
                                <select className="custom-select mr-sm-2" value={location} onChange={(e) => setLocation(e.target.value)}>
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
                                <select className="custom-select mr-sm-2" value={sort} onChange={(e) => setSort(e.target.value)}>
                                        <option value="none">Random</option>
                                        <option value="youngest">Age (younger-older)</option>
                                        <option value="oldest">Age (older-younger)</option>
                                        <option value="newest">Newest member</option>
                                </select>
                            </div>
                        </div>
                        <div className={styles.searchBtn}>
                            <button type="submit" className="btn btn-warning btn-lg">Filter</button>
                        </div>
                    </form>
                </div>
            </div>
        </Template>
    )
}

export default SearchUsers;