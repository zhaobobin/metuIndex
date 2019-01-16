import React from 'react';
import { Link } from 'dva/router';
import { SimpleImg, SimpleImgProvider } from 'react-simple-img';
import styles from './PhotoList.less';

const PhotoItem = ({ index, photo, margin }) => {
  return (
    <Link
      key={index}
      className={styles.photoGalleryItem}
      style={{margin, width: photo.width, height: photo.height}}
      to={`/${photo.type}/${photo._id}/${photo.title}-by-${photo.uid.nickname}`}
    >
      <SimpleImg
        src={photo.src} width={photo.width} height={photo.height} alt={photo.title}
        placeholder="#ccc"
      />
      <p className={styles.cover}><span className={styles.title}>{photo.title}</span></p>
    </Link>
  )
};

export default PhotoItem;
