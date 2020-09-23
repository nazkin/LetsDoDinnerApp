import React from 'react'
import styles from '../styles/UI/index.module.scss'

const UsersImages = (props)=> {

    const imageList = props.images.map(img => {
        return (
            <div className={styles.imageItem}>
                <div className={styles.imageContainer}>
                    <img key={img._id} src={img.downloadUrl} alt="user images" className={styles.image} />
                </div>
                <div className={styles.imgText}>
                    <p>"{img.caption}"</p>
                </div>
            </div>
        )
    })

    return(
        <div className={styles.imageRow}>
            {imageList}
        </div>
    )
}

export default UsersImages