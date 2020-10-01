const ascending = (a,b) => {
    let comparison = 0
    const ageA = a.age
    const ageB = b.age

    if(ageA > ageB) {
        comparison = 1
    }else if(ageB < ageA) {
        comparison = -1
    }

    return comparison

}
const descending = (a,b) => {
    let comparison = 0
    const ageA = a.age
    const ageB = b.age

    if(ageA < ageB) {
        comparison = 1
    }else if(ageB > ageA) {
        comparison = -1
    }

    return comparison
}

const calcBirthday = (dateString) => {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

module.exports = {
    ascending,
    descending,
    calcBirthday
}