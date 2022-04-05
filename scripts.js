// 获取文档元素
const player = document.querySelector(".player");
// video元素
const video = player.querySelector(".viewer");
// 进度条
const progress = player.querySelector(".progress");
// 当前进度
const progressBar = player.querySelector(".progress__filled");
// 播放/暂停键
const toggle = player.querySelector(".toggle");
// 控制前进后退的两个按钮
const skipButtons = player.querySelectorAll("[data-skip]");
// 控制音量和速度的两个滑块
const ranges = player.querySelectorAll(".player__slider");

// 定义函数处理事件
// 视频的播放与暂停
function togglePlay() {
  // paused是video自带property；play,pause是其自带方法
  video.paused ? video.play() : video.pause();
}
// 更新播放与暂停键图案
function updateButton() {
  toggle.innerText = video.paused ? "►" : "❚ ❚";
}
// 快进与后退
function skip() {
  // this代表被点击的元素，
  // this.dataet.skip 代表该元素 data-skip属性的值
  // 前进键，25；后退键，-10
  // console.log(this.dataset.skip);
  video.currentTime += parseFloat(this.dataset.skip);
  // currentTime是video等media元素内置属性，指当前进度
}
// 倍速和音量
function handleRangeUpdate() {
  // name: 'volume' or 'playbackRate'
  //   console.log(this.name);
  //   console.log(this.value);
  // 由于this.name是string，所以要使用[]notation设置属性值，不能使用dot notation
  video[this.name] = this.value;
}
// 进度条
function handleProgress() {
  // 更新当前进度的方式是调节css中.progress__filled的flex-basis值(%)
  // 计算当前播放位置相对于视频时长的百分比，据其更新当前进度
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}
function scrub(e) {
  console.log(e.offsetX);
  // 计算点击的进度条处相对于进度条总长度之比，乘以视频时长，得到视频当前应播放的位置
  // 不懂为什么把progress换成this就会出错，不都是在progress元素上调用的吗
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  // 更新视频的当前播放位置
  video.currentTime = scrubTime;
  // 当currentTime更新时，发生timeupdate事件，会调用handleProgress更新进度条
}

// 绑定事件处理函数与元素 Hook up the event listeners
video.addEventListener("click", togglePlay);
toggle.addEventListener("click", togglePlay);
// 当视频暂停或播放时，更新播放/暂停键的图案
// 不直接将updateButton写进togglePlay的原因是
// 人们可能还有其他外部控制播放与暂停的方法，如插件，如直接在控制台输入video.play()
video.addEventListener("pause", updateButton);
video.addEventListener("play", updateButton);
// 快进与后退
skipButtons.forEach((skipButton) => skipButton.addEventListener("click", skip));
// 调节音量和速度
ranges.forEach((range) => range.addEventListener("change", handleRangeUpdate));
ranges.forEach((range) =>
  range.addEventListener("mousemove", handleRangeUpdate)
);
// 添加了mousemove后，点击相应滑条，鼠标滚动的过程中音量或速度也会改变，如不添加则只会在鼠标滚完后才改变

// 当视频所在时间改变时更新进度条
video.addEventListener("timeupdate", handleProgress);
// 当用户点击进度条时更新视频的currentTime
progress.addEventListener("click", scrub);
// 当用户按下鼠标并来回拖拽时更新视频的currentTime
let mousedown = false; // 辅助变量，监测用户是否按下了鼠标
progress.addEventListener("mousedown", () => (mousedown = true));
progress.addEventListener("mouseup", () => (mousedown = false));
// 只有当mousedown为真时，才在鼠标移动时更新视频的currentTime
progress.addEventListener("mousemove", (e) => mousedown && scrub(e));
