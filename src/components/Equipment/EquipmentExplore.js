/*
 * 器材列表
 * <EquipmentExplore />
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card, Row, Col, notification } from 'antd';
import {Storage} from "~/utils/utils";

import styles from './Equipment.less';

@connect(state => ({
  equipments: state.equipments,
}))
export default class EquipmentExplore extends PureComponent {

  state = {
    loading: true,
    camera: [],
    lens: [],
  };

  componentDidMount(){
    //this.queryEquipmentExplore()
  }

  queryEquipmentExplore(){
    this.props.dispatch({
      type: 'equipments/explore',
      payload: {},
      callback: (res) => {
        let camera = [], lens = [];

        for(let i in res.camera){

        }

        this.setState({
          loading: false,
          camera: camera,
          lens: lens
        });
      }
    })
  }

  render(){

    //const {camera, lens} = this.state;

    const colLayout = {xs:24, sm:12, md:12, lg:6};

    return(
      <div className={styles.explore}>

        <div className={styles.section}>
          <div className={styles.title}>
            <h2>数码单反相机</h2>
            <Link to="/equipments/camera">更多</Link>
          </div>
          <div className={styles.con}>
            <Row gutter={10}>
              <Col {...colLayout} className={styles.list}>
                <Card title={<Link className={styles.cardTitle} to="/equipments/camera-canon">Canon(佳能)</Link>}>
                  <ul>
                    <li><Link to="/equipments/camera-canon-eos-5d-mark-iii">EOS 5D Mark III</Link></li>
                    <li><Link to="/equipments/camera-canon-eos-6d">EOS 6D</Link></li>
                    <li><Link to="/equipments/camera-canon-eos-5d-mark-iv">EOS 5D Mark IV</Link></li>
                    <li><Link to="/equipments/camera-canon-eos-5d-mark-ii">EOS 5D Mark II</Link></li>
                    <li><Link to="/equipments/camera-canon-eos-6d-mark-ii">EOS 6D Mark II</Link></li>
                    <li><Link to="/equipments/camera-camera-canon-eos-80d">EOS 80D</Link></li>
                    <li><Link to="/equipments/camera-canon-eos-70d">EOS 70D</Link></li>
                    <li><Link to="/equipments/camera-canon-eos-60d">EOS 60D</Link></li>
                    <li><Link to="/equipments/camera-canon-eos-700d">EOS 700D</Link></li>
                    <li><Link to="/equipments/camera-canon-eos-600d">EOS 600D</Link></li>
                    <li><Link to="/equipments/camera-canon">所有型号…</Link></li>
                  </ul>
                </Card>
              </Col>
              <Col {...colLayout} className={styles.list}>
                <Card title={<Link className={styles.cardTitle} to="/equipments/camera-nikon">Nikon(尼康)</Link>}>
                  <ul>
                    <li><Link to="/equipments/camera-nikon-d750">D750</Link></li>
                    <li><Link to="/equipments/camera-nikon-d810">D810</Link></li>
                    <li><Link to="/equipments/camera-nikon-d7100">D7100</Link></li>
                    <li><Link to="/equipments/camera-nikon-d610">D610</Link></li>
                    <li><Link to="/equipments/camera-nikon-d800">D800</Link></li>
                    <li><Link to="/equipments/camera-nikon-d7200">D7200</Link></li>
                    <li><Link to="/equipments/camera-nikon-d5300">D5300</Link></li>
                    <li><Link to="/equipments/camera-nikon-d7000">D7000</Link></li>
                    <li><Link to="/equipments/camera-nikon-d700">D700</Link></li>
                    <li><Link to="/equipments/camera-nikon-d90">D90</Link></li>
                    <li><Link to="/equipments/camera-nikon">所有型号…</Link></li>
                  </ul>
                </Card>
              </Col>
              <Col {...colLayout} className={styles.list}>
                <Card title={<Link className={styles.cardTitle} to="/equipments/camera-sony">Sony(索尼)</Link>}>
                  <ul>
                    <li><Link to="/equipments/camera-sony-ilce-7m2">ILCE-7M2</Link></li>
                    <li><Link to="/equipments/camera-sony-ilce-7rm2">ILCE-7RM2</Link></li>
                    <li><Link to="/equipments/camera-sony-a6000">ILCE-6000</Link></li>
                    <li><Link to="/equipments/camera-sony-a7">ILCE-7</Link></li>
                    <li><Link to="/equipments/camera-sony-ilce-7rm3">ILCE-7RM3</Link></li>
                    <li><Link to="/equipments/camera-sony-ilce-7m3">ILCE-7M3</Link></li>
                    <li><Link to="/equipments/camera-sony-ilce-6300">ILCE-6300</Link></li>
                    <li><Link to="/equipments/camera-sony-ilce-5100">ILCE-5100</Link></li>
                    <li><Link to="/equipments/camera-sony-a7r">ILCE-7R</Link></li>
                    <li><Link to="/equipments/camera-sony-a5000">ILCE-5000</Link></li>
                    <li><Link to="/equipments/camera-sony">所有型号…</Link></li>
                  </ul>
                </Card>
              </Col>
              <Col {...colLayout} className={styles.list}>
                <Card title={<Link className={styles.cardTitle} to="/equipments/camera-pentax">PENTAX(宾得)</Link>}>
                  <ul>
                    <li><Link to="/equipments/camera-pentax-k-50/">K-50</Link></li>
                    <li><Link to="/equipments/camera-pentax-k-5/">K-5</Link></li>
                    <li><Link to="/equipments/camera-pentax-k-5-ii-s/">K-5 II s</Link></li>
                    <li><Link to="/equipments/camera-pentax-k-30/">K-30</Link></li>
                    <li><Link to="/equipments/camera-pentax-k-5-ii/">K-5 II</Link></li>
                    <li><Link to="/equipments/camera-pentax-k-7/">K-7</Link></li>
                    <li><Link to="/equipments/camera-pentax-k-x/">K-x</Link></li>
                    <li><Link to="/equipments/camera-pentax-k20d/">K20D</Link></li>
                    <li><Link to="/equipments/camera-pentax-k10d/">K10D</Link></li>
                    <li><Link to="/equipments/camera-pentax-k200d/">K200D</Link></li>
                    <li><Link to="/equipments/camera-pentax/">所有型号…</Link></li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.title}>
            <h2>镜头</h2>
            <Link to="/equipments/lens">更多</Link>
          </div>
          <div className={styles.con}>
            <Row gutter={10}>
              <Col {...colLayout} className={styles.list}>
                <Card title={<Link className={styles.cardTitle} to="/equipments/lens-canon">Canon(佳能)</Link>}>
                  <ul>
                    <li><Link to="/equipments/lens-canon-ef-50mm-f-1.4-usm">Canon EF 50mm f/1.4 USM</Link></li>
                    <li><Link to="/equipments/lens-canon-ef-24-105mm-f-4l-is-usm">Canon EF 24-105mm f/4L IS USM</Link></li>
                    <li><Link to="/equipments/lens-canon-ef-70-200mm-f-2.8l-is-ii-usm">Canon EF 70-200mm f/2.8L IS II USM</Link></li>
                    <li><Link to="/equipments/lens-canon-ef-s-18-135mm-f-3.5-5.6-is-stm">Canon EF-S 18-135mm f/3.5-5.6 IS STM</Link></li>
                    <li><Link to="/equipments/lens-canon-ef-24-70mm-f-2.8l-usm">Canon EF 24-70mm f/2.8L USM</Link></li>
                    <li><Link to="/equipments/lens-canon-ef-50mm-f-1.8-ii">Canon EF 50mm f/1.8 II</Link></li>
                    <li><Link to="/equipments/lens-canon-ef-16-35mm-f-2.8l-ii-usm">Canon EF 16-35mm f/2.8L II USM</Link></li>
                    <li><Link to="/equipments/lens-canon-ef-s-18-200mm-f-3.5-5.6-is">Canon EF-S 18-200mm f/3.5-5.6 IS</Link></li>
                    <li><Link to="/equipments/lens-canon-ef-100mm-f-2.8l-macro-is-usm">Canon EF 100mm f/2.8L Macro IS USM</Link></li>
                    <li><Link to="/equipments/lens-canon-ef-85mm-f-1.8-usm">Canon EF 85mm f/1.8 USM</Link></li>
                    <li><Link to="/equipments/lens-canon">所有型号…</Link></li>
                  </ul>
                </Card>
              </Col>
              <Col {...colLayout} className={styles.list}>
                <Card title={<Link className={styles.cardTitle} to="/equipments/lens-nikon">Nikon(尼康)</Link>}>
                  <ul>
                    <li><Link to="/equipments/lens-af-s-zoom-nikkor-24-70mm-f-2.8g-ed/">AF-S Zoom-Nikkor 24-70mm f/2.8G ED</Link></li>
                    <li><Link to="/equipments/lens-af-s-dx-vr-zoom-nikkor-18-105mm-f-3.5-5.6g-ed/">AF-S DX VR Zoom-Nikkor 18-105mm f/3.5-5.6G ED</Link></li>
                    <li><Link to="/equipments/lens-af-s-nikkor-50mm-f-1.8g/">AF-S Nikkor 50mm f/1.8G</Link></li>
                    <li><Link to="/equipments/lens-af-nikkor-50mm-f-1.8d/">AF Nikkor 50mm f/1.8D</Link></li>
                    <li><Link to="/equipments/lens-af-s-nikkor-24-120mm-f-4g-ed-vr/">AF-S Nikkor 24-120mm f/4G ED VR</Link></li>
                    <li><Link to="/equipments/lens-af-s-dx-nikkor-35mm-f-1.8g/">AF-S DX Nikkor 35mm f/1.8G</Link></li>
                    <li><Link to="/equipments/lens-af-s-nikkor-70-200mm-f-2.8g-ed-vr-ii/">AF-S Nikkor 70-200mm f/2.8G ED VR II</Link></li>
                    <li><Link to="/equipments/lens-af-s-nikkor-50mm-f-1.4g/">AF-S Nikkor 50mm f/1.4G</Link></li>
                    <li><Link to="/equipments/lens-af-s-zoom-nikkor-14-24mm-f-2.8g-ed/">AF-S Zoom-Nikkor 14-24mm f/2.8G ED</Link></li>
                    <li><Link to="/equipments/lens-af-s-nikkor-85mm-f-1.8g/">AF-S Nikkor 85mm f/1.8G</Link></li>
                    <li><Link to="/equipments/lens-nikon">所有型号…</Link></li>
                  </ul>
                </Card>
              </Col>
              <Col {...colLayout} className={styles.list}>
                <Card title={<Link className={styles.cardTitle} to="/equipments/lens-sony">Sony(索尼)</Link>}>
                  <ul>
                    <li><Link to="/equipments/lens-fe-16-35mm-f4-za-oss/">FE 16-35mm F4 ZA</Link></li>
                    <li><Link to="/equipments/lens-sony-fe-85mm-f1.4-gm/">Sony FE 85mm F1.4 GM</Link></li>
                    <li><Link to="/equipments/lens-sony-fe-70-200mm-f2.8/">Sony FE 70-200mm F2.8 GM OSS</Link></li>
                    <li><Link to="/equipments/lens-carl-zeiss-vario-sonnar-t*-dt-16-80mm-f3.5-4.5-za/">Carl Zeiss Vario-Sonnar T* DT 16-80mm F3.5-4.5 ZA</Link></li>
                    <li><Link to="/equipments/lens-carl-zeiss-vario-sonnar-t*-24-70mm-f2.8-za-ssm-sal-2470z/">Carl Zeiss Vario-Sonnar T* 24-70mm F2.8 ZA SSM (SAL-2470Z)</Link></li>
                    <li><Link to="/equipments/lens-carl-zeiss-sonnar-t*-135mm-f1.8-za-(sal135f18z)/">Carl Zeiss Sonnar T* 135mm F1.8 ZA (SAL135F18Z)</Link></li>
                    <li><Link to="/equipments/lens-minolta-sony-af-dt-18-70mm-f3.5-5.6-d/">Minolta/Sony AF DT 18-70mm F3.5-5.6 (D)</Link></li>
                    <li><Link to="/equipments/lens-minolta-af-50mm-f1.7/">Minolta AF 50mm F1.7</Link></li>
                    <li><Link to="/equipments/lens-minolta-af-70-210mm-f4-macro/">Minolta AF 70-210mm F4 Macro</Link></li>
                    <li><Link to="/equipments/lens-minolta-sony-af-70-200mm-f2.8-g/">Minolta/Sony AF 70-200mm F2.8 G</Link></li>
                    <li><Link to="/equipments/lens-sony">所有型号…</Link></li>
                  </ul>
                </Card>
              </Col>
              <Col {...colLayout} className={styles.list}>
                <Card title={<Link className={styles.cardTitle} to="/equipments/lens-pentax">PENTAX(宾得)</Link>}>
                  <ul>
                    <li><Link to="/equipments/lens-lumix-g-20mm-f1.7/">LUMIX G 20mm F1.7</Link></li>
                    <li><Link to="/equipments/lens-lumix-g-vario-7-14-f4/">LUMIX G VARIO 7-14/F4</Link></li>
                    <li><Link to="/equipments/lens-olympus-m.17mm-f2.8/">OLYMPUS M.17mm F2.8</Link></li>
                    <li><Link to="/equipments/lens-lumix-g-vario-14-45mm-f3.5-5.6/">LUMIX G VARIO 14-45mm F3.5-5.6</Link></li>
                    <li><Link to="/equipments/lens-olympus-zuiko-digital-ed-12-60mm-f2.8-4swd/">Olympus Zuiko Digital ED 12-60mm F2.8-4SWD</Link></li>
                    <li><Link to="/equipments/lens-olympus-m.zuiko-digital-17mm-f2.8-pancake/">Olympus M.Zuiko Digital 17mm F2.8 Pancake</Link></li>
                    <li><Link to="/equipments/lens-lumix-g-vario-14-42mm-f3.5-5.6-asph.-mega-ois/">Lumix G Vario 14-42mm F3.5-5.6 Asph. Mega OIS</Link></li>
                    <li><Link to="/equipments/lens-olympus-zuiko-digital-40-150mm-f3.5-4.5/">Olympus Zuiko Digital 40-150mm F3.5-4.5</Link></li>
                    <li><Link to="/equipments/lens-olympus-zuiko-digital-11-22mm-f2.8-3.5/">Olympus Zuiko Digital 11-22mm F2.8-3.5</Link></li>
                    <li><Link to="/equipments/lens-olympus-zuiko-digital-ed-14-42mm-f3.5-5.6/">Olympus Zuiko Digital ED 14-42mm F3.5-5.6</Link></li>
                    <li><Link to="/equipments/lens-pentax">所有型号…</Link></li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </div>
        </div>

      </div>
    )
  }

}
