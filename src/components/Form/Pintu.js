/**
 * 拼图 - 支持ie9+
 * 参考：https://github.com/yeild/jigsaw，https://www.jb51.net/article/137129.htm
 * globalCompositeOperation： 'destination-over' 兼容Edge、IE
 * IE浏览器下，阻止跨域图片的渲染。drawImage
 */
import styles from './Pintu.less';

let errorNum = 0;       //拼图错误次数

const l = 42, // 滑块边长
  r = 9, // 滑块半径
  w = 320, // canvas宽度
  h = 160, // canvas高度
  PI = Math.PI;
const L = l + r * 2 + 3; // 滑块实际边长

//生成随机数
function randNum(min, max) {
  return Math.floor(min + Math.random() * (max - min))
}

function getRandomNumberByRange(start, end) {
  return Math.round(Math.random() * (end - start) + start)
}

function createCanvas(width, height) {
  const canvas = createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas
}

function createImg(onload) {
  const img = createElement('img');
  img.crossOrigin = "Anonymous";
  img.onload = onload;
  img.onerror = () => {
    img.src = getRandomImg()
  };
  img.src = getRandomImg();
  return img
}

function createElement(tagName) {
  return document.createElement(tagName)
}

function addClass(tag, className) {
  tag.classList.add(className)
}

function removeClass(tag, className) {
  tag.classList.remove(className)
}

function getRandomImg() {
  //let url = 'https://picsum.photos/300/160/?image=' + getRandomNumberByRange(0, 1084);
  let num = randNum(0, 50);
  return require('@/assets/pintu/pintu' + num + '.jpeg');
}

function draw(ctx, x, y, operation) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.arc(x + l / 2, y - r + 2, r, 0.72*PI, 2.26 * PI);
  ctx.lineTo(x + l, y);
  ctx.arc(x + l + r - 2, y + l / 2, r, 1.21*PI, 2.78 * PI);
  ctx.lineTo(x + l, y + l);
  ctx.lineTo(x, y + l);
  ctx.arc(x + r - 2, y + l / 2, r + 0.4, 2.76 * PI, 1.24 * PI, true);
  ctx.lineTo(x, y);
  ctx.lineWidth = 2;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.stroke();
  ctx[operation]();
  ctx.globalCompositeOperation = 'destination-over'
}

function sum(x, y) {
  return x + y
}

function square(x) {
  return x * x
}

//IE 10以前的版本兼容 document element 的classList
if (!("classList" in document.documentElement)) {
  Object.defineProperty(HTMLElement.prototype, 'classList', {
    get: function() {
      let self = this;
      function update(fn) {
        return function(value) {
          let classes = self.className.split(/\s+/g),
            index = classes.indexOf(value);

          fn(classes, index, value);
          self.className = classes.join(" ");
        }
      }

      return {
        add: update(function(classes, index, value) {
          if (!~index) classes.push(value);
        }),

        remove: update(function(classes, index) {
          if (~index) classes.splice(index, 1);
        }),

        toggle: update(function(classes, index, value) {
          if (~index)
            classes.splice(index, 1);
          else
            classes.push(value);
        }),

        contains: function(value) {
          return !!~self.className.split(/\s+/g).indexOf(value);
        },

        item: function(i) {
          return self.className.split(/\s+/g)[i] || null;
        }
      };
    }
  });
}

//拼图类
class jigsaw {

  constructor({el, onSuccess, onFail, onRefresh}) {
    el.style.position = el.style.position || 'relative';
    this.el = el;
    this.onSuccess = onSuccess;
    this.onFail = onFail;
    this.onRefresh = onRefresh
  }

  init() {
    this.initDOM();
    this.initImg();
    this.bindEvents()
  }

  initDOM() {
    const canvas = createCanvas(w, h); // 画布
    const block = canvas.cloneNode(true); // 滑块
    const sliderContainer = createElement('div');
    const refreshIcon = createElement('div');
    const sliderMask = createElement('div');
    const slider = createElement('div');
    const sliderIcon = createElement('span');
    const text = createElement('span');

    canvas.className = styles.pintuCanvas;
    block.className = styles.pintuBlock;
    sliderContainer.className = styles.sliderContainer;
    refreshIcon.className = styles.refreshIcon;
    sliderMask.className = styles.sliderMask;
    slider.className = styles.slider;
    sliderIcon.className = styles.sliderIcon;
    text.innerHTML = '加载中...';
    text.className = styles.sliderText;

    const el = this.el;
    el.appendChild(canvas);
    el.appendChild(refreshIcon);
    el.appendChild(block);
    slider.appendChild(sliderIcon);
    sliderMask.appendChild(slider);
    sliderContainer.appendChild(sliderMask);
    sliderContainer.appendChild(text);
    el.appendChild(sliderContainer);

    Object.assign(this, {
      canvas,
      block,
      sliderContainer,
      refreshIcon,
      slider,
      sliderMask,
      sliderIcon,
      text,
      canvasCtx: canvas.getContext('2d'),
      blockCtx: block.getContext('2d')
    })
  }

  initImg() {
    const img = createImg(() => {
      this.draw();
      this.canvasCtx.drawImage(img, 0, 0, w, h);
      this.blockCtx.drawImage(img, 0, 0, w, h);
      const y = this.y - r * 2 - 1;

      const ImageData = this.blockCtx.getImageData(this.x - 1, y, L, L);  //误差偏移量
      this.block.width = L;
      this.blockCtx.putImageData(ImageData, 0, y);
      this.sliderContainer.children[1].innerHTML = '向右滑动滑块填充拼图';
    });
    this.img = img
  }

  draw() {
    // 随机创建滑块的位置
    this.x = getRandomNumberByRange(L + 10, w - (L + 10));
    this.y = getRandomNumberByRange(10 + r * 2, h - (L + 10));
    draw(this.canvasCtx, this.x, this.y, 'fill');
    draw(this.blockCtx, this.x, this.y, 'clip');
  }

  bindEvents() {

    this.el.onselectstart = () => false;

    this.refreshIcon.onclick = () => {
      typeof this.onRefresh === 'function' && this.onRefresh();
      this.reset();
    };

    this.sliderContainer.children[1].onclick = () => {
      if(errorNum < 6) return;
      errorNum = 0;
      this.reset();
    };

    let originX, originY, trail = [], isMouseDown = false, blockCanMove = true;

    // pc
    this.slider.addEventListener(
      'mousedown',
      function (e) {
        e.preventDefault();
        if(!blockCanMove) return;
        originX = e.x;
        originY = e.y;
        isMouseDown = true
      },
      { passive: false }
    );

    document.addEventListener(
      'mousemove',
      (e) => {
        //e.preventDefault();
        if (!isMouseDown) return false;
        const moveX = e.x - originX;
        const moveY = e.y - originY;

        if (moveX < 0 || moveX + 38 >= w) return false;
        this.slider.style.left = moveX + 'px';
        let blockLeft = (w - 40 - 20) / (w - 40) * moveX;
        this.block.style.left = blockLeft + 'px';

        addClass(this.sliderContainer, styles.sliderContainer_active);
        this.sliderMask.style.width = moveX + 'px';
        trail.push(moveY)
      },
      { passive: false }
    );

    document.addEventListener(
      'mouseup',
      (e) => {
        e.preventDefault();
        if (!isMouseDown) return false;
        isMouseDown = false;
        if (e.x === originX) return false;
        removeClass(this.sliderContainer, styles.sliderContainer_active);
        this.trail = trail;
        const {spliced, verified} = this.verify();
        if (spliced) {
          if (verified) {
            blockCanMove = false;
            addClass(this.sliderContainer, styles.sliderContainer_success);
            this.refreshIcon.className = '';
            typeof this.onSuccess === 'function' && this.onSuccess()
          } else {
            addClass(this.sliderContainer, styles.sliderContainer_fail);
            this.text.innerHTML = '再试一次';
            this.reset()
          }
        } else {
          errorNum += 1;
          if(errorNum < 6){
            addClass(this.sliderContainer, styles.sliderContainer_fail);
            typeof this.onFail === 'function' && this.onFail();
            setTimeout(() => {
              this.reset()
            }, 1000);
          }else{
            addClass(this.sliderContainer, styles.sliderContainer_refresh);
            typeof this.onRefresh === 'function' && this.onRefresh();
            this.sliderContainer.children[1].innerHTML = "<i></i> 失败过多，点此重试";
          }
        }
      },
      { passive: false }
    );
    // pc end!

    // mobile
    this.slider.addEventListener(
      'touchstart',
      function (e) {
        e.preventDefault();
        if(!blockCanMove) return;
        originX = e.targetTouches[0].clientX;
        originY = e.targetTouches[0].clientY;
        isMouseDown = true
      },
      { passive: false }
    );

    document.addEventListener(
      'touchmove',
      (e) => {
        e.preventDefault();
        if (!isMouseDown) return false;
        const moveX = e.targetTouches[0].clientX - originX;
        const moveY = e.targetTouches[0].clientY - originY;

        if (moveX < 0 || moveX + 38 >= w) return false;
        this.slider.style.left = moveX + 'px';
        let blockLeft = (w - 40 - 20) / (w - 40) * moveX;
        this.block.style.left = blockLeft + 'px';

        addClass(this.sliderContainer, styles.sliderContainer_active);
        this.sliderMask.style.width = moveX + 'px';
        trail.push(moveY)
      },
      { passive: false }
    );

    document.addEventListener(
      'touchend',
      (e) => {
        e.preventDefault();
        if (!isMouseDown) return false;
        isMouseDown = false;
        if (e.targetTouches[0] && e.targetTouches[0].clientX === originX) return false;
        removeClass(this.sliderContainer, styles.sliderContainer_active);
        this.trail = trail;
        const {spliced, verified} = this.verify();
        if (spliced) {
          if (verified) {
            blockCanMove = false;
            addClass(this.sliderContainer, styles.sliderContainer_success);
            this.refreshIcon.className = '';
            typeof this.onSuccess === 'function' && this.onSuccess()
          } else {
            addClass(this.sliderContainer, styles.sliderContainer_fail);
            this.text.innerHTML = '再试一次';
            this.reset()
          }
        } else {
          addClass(this.sliderContainer, styles.sliderContainer_fail);
          typeof this.onFail === 'function' && this.onFail();
          setTimeout(() => {
            this.reset()
          }, 1000)
        }
      },
      { passive: false }
    )
    // mobile end!

  }

  verify() {
    const arr = this.trail; // 拖动时y轴的移动距离
    const average = arr.reduce(sum) / arr.length;
    const deviations = arr.map(x => x - average);
    const stddev = Math.sqrt(deviations.map(square).reduce(sum) / arr.length);
    const left = parseInt(this.block.style.left, 10);

    return {
      spliced: Math.abs(left - this.x) < 5,
      verified: stddev !== 0 , // 简单验证下拖动轨迹，为零时表示Y轴上下没有波动，可能非人为操作
    }
  }

  clean() {
    this.canvasCtx.clearRect(0, 0, w, h);
    this.blockCtx.clearRect(0, 0, w, h);
    this.block.width = w
  }

  reset() {
    this.sliderContainer.className = styles.sliderContainer;
    this.slider.style.left = 0;
    this.block.style.left = 0;
    this.sliderMask.style.width = 0;
    this.sliderContainer.children[1].innerHTML = '加载中...';
    this.clean();
    this.img.src = getRandomImg()
  }

}

const pintu  = {
  init: function (opts) {
    return new jigsaw(opts).init()
  },
};

export default pintu
