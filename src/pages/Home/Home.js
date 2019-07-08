/**
 * 首页
 */
import React from 'react';
import LoadLazy from '@/components/Common/LoadLazy'

import HomeBanner from '@/containers/Home/HomeBanner';
import HomeTese from '@/containers/Home/HomeTese';
import HomeDesc from '@/containers/Home/HomeDesc';
import HomePhotoList from '@/containers/Home/HomePhotoList';

export default function Home () {

  return(
    <div>

      <LoadLazy height="35%">
        <HomeBanner/>
      </LoadLazy>

      <LoadLazy height="100px">
        <HomeTese/>
      </LoadLazy>

      <LoadLazy height="100px">
        <HomeDesc/>
      </LoadLazy>

      <LoadLazy height="500px">
        <HomePhotoList/>
      </LoadLazy>

    </div>
  )

}
