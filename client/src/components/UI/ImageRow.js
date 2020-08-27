import React from 'react'
import styles from '../styles/UI/index.module.scss'
const UsersImages = (props)=> {

    const imageList = props.images.map(img => {
        return <img key={img._id} src={img.downloadUrl} alt="user images" className={styles.image} />
    })

    return(
        <div className={styles.imageRow}>
            {imageList}
        </div>
    )
}

export default UsersImages