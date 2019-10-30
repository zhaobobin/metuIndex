/*
 * 图片列表 - 栅格布局
 * photos: 数组
 * <PhotoListGrid photos={photos}/>
 */
import React, { PureComponent } from 'react';
import RGL, { Responsive, WidthProvider } from "react-grid-layout";
import styles from './PhotoList.less';

const ReactGridLayout = WidthProvider(RGL);
const ResponsiveReactGridLayout = WidthProvider(Responsive);

const photos = [
  {name: '1', src: 'https://source.unsplash.com/2ShvY8Lf6l0/800x599', width: 2, height: 4},     //width: 500, height: 400
  {name: '2', src: 'https://source.unsplash.com/Dm-qxdynoEc/800x799', width: 4, height: 4},     //width: 600, height: 400
  {name: '3', src: 'https://source.unsplash.com/qDkso9nvCg0/600x799', width: 2, height: 4},     //width: 350, height: 200
  {name: '4', src: 'https://source.unsplash.com/iecJiKe_RNg/600x799', width: 4, height: 4},     //width: 400, height: 600

  {name: '5', src: 'https://source.unsplash.com/epcsn8Ed8kY/600x799', width: 4, height: 4},
  {name: '6', src: 'https://source.unsplash.com/NQSWvyVRIJk/800x599', width: 2, height: 4},
  {name: '7', src: 'https://source.unsplash.com/zh7GEuORbUw/600x799', width: 4, height: 4},
  {name: '8', src: 'https://source.unsplash.com/PpOHJezOalU/800x599', width: 2, height: 4},

  {name: '9', src: 'https://source.unsplash.com/2ShvY8Lf6l0/800x599', width: 3, height: 4},
  {name: '10', src: 'https://source.unsplash.com/Dm-qxdynoEc/800x799', width: 2, height: 4},
  {name: '11', src: 'https://source.unsplash.com/qDkso9nvCg0/600x799', width: 4, height: 4},
  {name: '12', src: 'https://source.unsplash.com/iecJiKe_RNg/600x799', width: 3, height: 4},
];

export default class PhotoListGrid extends PureComponent {

  state = {
    photos: photos,

    breakpoint: "md",
    compactType: "vertical",
    mounted: false,
  };

  componentDidMount(){

  }

  generateLayout = () => {

    let {photos, breakpoint} = this.state;

    let rowW = 12,                                //每行栅格数
      rowH = 4,                                   //每行高度
      col = 4;                                    //每行元素个数

    switch(breakpoint){
      case 'lg': rowW = 12;col = 5;break;
      case 'md': rowW = 10;col = 4;break;
      case 'sm': rowW = 6;col = 3;break;
      case 'xs': rowW = 4;col = 2;break;
      case 'xxs': rowW = 2;col = 1;break;
      default: rowW = 12;col = 4;
    }
//console.log(col)
    let currentX = 0, currentY = 0;
    for(let i in photos){
      let width = '';                             //当前元素占据的宽度 100 / col
      if(i > 0){
        currentX += photos[i-1].width;
        if(i%col === 0){                            //每当一行充满时，重X轴坐标，并且叠加Y轴坐标
          currentX = 0;
          currentY += rowH;
        }
      }

      let layout = {
        i: photos[i].name,
        x: i > 0 ? currentX : 0,
        y: i > 0 ? currentY : 0,
        w: photos[i].width,
        h: rowH,
        static: true
      };
      //console.log(layout)
      photos[i]['layout'] = layout;
    }
    return photos.map((item, index) => (
      <div key={item.layout.i} data-grid={item.layout} className={styles.photoItem}>
        <img src={item.src} alt={item.name} />
      </div>
    ))
  };

  onBreakpointChange = breakpoint => {
    this.setState({breakpoint});
  };

  render() {

    return (
      <ResponsiveReactGridLayout
        className={styles.photoGrid}
        rowHeight={80}
        onBreakpointChange={this.onBreakpointChange}
      >
        {this.generateLayout()}
      </ResponsiveReactGridLayout>
    )
  }

}
