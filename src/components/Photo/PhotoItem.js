import React from 'react';
import { Link } from 'dva/router';
import LoadLazy from '~/components/Common/LoadLazy'
import styles from './PhotoList.less';

export default function PhotoItem ({ index, photo, margin }) {

  return (
    <Link
      key={index}
      className={styles.photoGalleryItem}
      style={{margin, width: photo.width, height: photo.height}}
      to={`/${photo.type}/${photo._id}/${photo.title}-by-${photo.uid.nickname}`}
    >
      <LoadLazy
        width={photo.width}
        height={photo.height}
      >
        <img src={photo.src} alt={photo.title}/>
      </LoadLazy>
      <p className={styles.cover}><span className={styles.title}>{photo.title}</span></p>
    </Link>
  )

};
