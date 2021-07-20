/**
 * 首页
 */
import React from 'react';
import LoadLazy from '@/components/Common/LoadLazy'

import HomeBanner from '@/containers/Home/HomeBanner';
// import HomeTese from '@/containers/Home/HomeTese';
import HomePhotoList from '@/containers/Home/HomePhotoList';
import HomeCricle from '@/containers/Home/HomeCricle';
import HomeContest from '@/containers/Home/HomeContest';
import HomeQuestion from '@/containers/Home/HomeQuestion';

export default function Home () {

  return(
    <div style={{background: '#fff'}}>

      <LoadLazy height="35%">
        <HomeBanner/>
      </LoadLazy>

      {/*
      <LoadLazy height="200px">
        <HomeTese/>
      </LoadLazy>
      */}

      <LoadLazy height="500px">
        <HomePhotoList/>
      </LoadLazy>

      <LoadLazy height="200px">
        <HomeCricle/>
      </LoadLazy>

      <LoadLazy height="200px">
        <HomeContest/>
      </LoadLazy>

      <LoadLazy height="200px">
        <HomeQuestion/>
      </LoadLazy>

    </div>
  )

}
