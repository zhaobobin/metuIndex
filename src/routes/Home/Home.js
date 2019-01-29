import React from 'react';

import LoadLazy from '~/components/Common/LoadLazy'
import HomeBanner from '~/components/Home/HomeBanner';
import HomeDesc from '~/components/Home/HomeDesc';
import HomePhotoList from '~/components/Home/HomePhotoList';

export default function Home () {

  return(
    <div>

      <LoadLazy height="35%">
        <HomeBanner/>
      </LoadLazy>

      <LoadLazy height="100px">
        <HomeDesc/>
      </LoadLazy>

      <LoadLazy height="50%">
        <HomePhotoList/>
      </LoadLazy>

    </div>
  )

}
