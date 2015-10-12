# running-cow
  
  该项目是使用egret引擎2.0 制作的一款html5横板游戏。
  微信演示地址:http://gupiao.baidu.com/activity/running/
  
  该项目完成时遗留问题：
  
  1、 重力感应打开时横竖屏切换无法做到，需改变舞台中所有元素坐标，以及侦听事件按钮的区域也需要重新计算。
  
  2、 游戏在iphone5,iphone6中存在失真现象，因为此游戏设计尺寸为568*320，而iphone5、iphone6的分辨率高，需要将canvas宽高翻倍，显示才正常；但若提供高分辨率，anriod机器性能方面会受到很大影响，故保持现状。
