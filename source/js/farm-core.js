(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.BlogFarm = factory();
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';
  // Sprite cells include transparent padding. Sizes describe the whole cell;
  // anchors describe the contact point with the ground, not its lower edge.
  var sprites = {
    player: {size:44, cols:6, rows:3, face:1, anchor:.8125, speed:23, stride:24},
    horse: {size:48, cols:6, rows:1, face:1, anchor:.96875, speed:17, stride:16},
    cow: {size:48, cols:4, rows:1, face:-1, anchor:1, speed:11, stride:20},
    sheep: {size:32, cols:4, rows:1, face:-1, anchor:1, speed:10, stride:16},
    rabbit: {size:14, cols:4, rows:1, face:-1, anchor:1, speed:0, stride:12},
    babychick: {size:12, cols:4, rows:1, face:-1, anchor:1, speed:7, stride:10},
    duck: {size:14, cols:4, rows:1, face:-1, anchor:.84, speed:6, stride:12}
  };
  var buildings = {
    school:[214,154], workshop:[240,147], wizard:[60,135], about:[95,104],
    news:[38,46], painters:[80,120], archive:[94,113], mahjong:[174,123], aitown:[104,59]
  };
  var scenes = {
    desktop: {
      width:1200,height:720,unit:1,
      lots:{school:[165,190],workshop:[825,230],wizard:[1090,165],about:[420,380],news:[720,415],painters:[970,530],archive:[620,625],mahjong:[180,580],aitown:[1090,655]},
      beds:[350,60,260,130],pond:[70,265,270,155],
      trees:[[30,170],[310,125],[660,165],[1030,295],[1150,495],[320,485],[805,655],[65,690]],
      roads:[[[165,215],[315,230],[500,210],[640,235],[825,255],[990,220],[1090,190]],[[420,405],[520,440],[700,445],[900,560],[1080,685]],[[340,410],[420,405]],[[640,235],[655,350],[620,440]],[[520,440],[520,470],[470,470],[470,650]],[[180,605],[330,630],[470,650],[620,650],[800,680]]],
      routes:{player:[[520,440],[520,470],[470,470],[470,585]],cow:[[515,320],[615,320]],horse:[[865,660],[960,660]],sheep:[[300,565],[390,565]],rabbit:[[1070,365]],babychick:[[800,450],[850,450]]}
    },
    compact: {
      width:720,height:910,unit:.85,
      lots:{school:[130,185],workshop:[380,340],wizard:[620,195],about:[120,490],news:[630,440],painters:[580,690],archive:[145,765],mahjong:[340,805],aitown:[610,850]},
      beds:[290,70,200,100],pond:[300,440,245,150],
      trees:[[30,65],[250,310],[520,140],[680,345],[35,540],[200,700],[500,785],[695,880]],
      roads:[[[130,209],[270,195],[420,190],[620,218]],[[380,363],[265,395],[240,535],[170,530],[120,513]],[[270,195],[265,395]],[[530,570],[590,590],[580,715],[610,876]],[[240,535],[240,625],[300,625],[420,625],[590,590]],[[240,625],[240,665],[145,790],[340,830],[475,850]]],
      routes:{player:[[240,535],[240,625],[420,625]],cow:[[60,325],[180,325]],horse:[[440,865],[515,865]],sheep:[[50,620],[135,620]],rabbit:[[645,555]],babychick:[[432,710],[475,710]]}
    },
    mobile: {
      width:360,height:1160,unit:.72,
      lots:{school:[90,155],workshop:[112,385],wizard:[300,340],about:[278,575],news:[64,740],painters:[282,780],archive:[92,935],mahjong:[269,1015],aitown:[100,1120]},
      beds:[195,65,150,96],pond:[22,470,178,138],
      trees:[[22,48],[185,300],[335,480],[30,840],[195,1000],[328,1125]],
      roads:[[[90,174],[140,202],[220,202],[258,245],[260,375]],[[112,404],[160,430],[230,414],[300,359]],[[230,414],[230,470],[230,595],[235,630]],[[278,595],[235,630],[205,680],[220,790],[282,800]],[[195,593],[235,630]],[[64,760],[130,755],[205,680]],[[220,790],[190,850],[155,905],[92,955]],[[155,905],[170,1030],[269,1035]],[[170,1030],[150,1090],[100,1140]]],
      routes:{player:[[230,450],[230,595]],cow:[[62,244],[146,244]],sheep:[[65,650],[130,650]],rabbit:[[315,860]],babychick:[[250,870],[285,870]]}
    }
  };
  function layout(width) {
    var key=width<=575?'mobile':width<=1000?'compact':'desktop';
    var scene=scenes[key], scale=Math.min(1,(Math.max(280,width)-24)/scene.width);
    return {key:key,scene:scene,scale:scale};
  }
  function create(kind, route, delay, unit) {
    return {kind:kind,route:route,x:route[0][0],y:route[0][1],target:1,step:1,
      wait:delay||0,turn:0,velocity:0,distance:0,moving:false,dx:1,dy:0,unit:unit||1};
  }
  function advance(a, dt) {
    dt=Math.max(0,Math.min(.05,dt));
    if(!dt || a.route.length<2)return;
    a.moving=false;
    if(a.wait>0){a.wait=Math.max(0,a.wait-dt);return;}
    var to=a.route[a.target],dx=to[0]-a.x,dy=to[1]-a.y,remaining=Math.hypot(dx,dy);
    if(remaining<.02){
      a.x=to[0];a.y=to[1];a.velocity=0;
      var endpoint=a.target===0 || a.target===a.route.length-1;
      if(endpoint)a.step=-a.step;
      a.target+=a.step;
      a.wait=endpoint?(a.kind==='duck'?1.4:3.2):.25;
      a.turn=0;return;
    }
    // Face the next segment before taking a step; never flip a moving sprite.
    a.dx=dx/remaining;a.dy=dy/remaining;
    if(a.turn<.22){a.turn+=dt;return;}
    var speed=sprites[a.kind].speed*a.unit, accel=speed*3;
    a.velocity=Math.min(speed,a.velocity+accel*dt,Math.sqrt(2*accel*remaining));
    var step=Math.min(remaining,a.velocity*dt);
    a.x+=a.dx*step;a.y+=a.dy*step;a.distance+=step;a.moving=step>.00001;
  }
  function pose(a) {
    var s=sprites[a.kind],horizontal=Math.abs(a.dx)>=Math.abs(a.dy);
    var row=a.kind==='player'?(horizontal?2:a.dy<0?1:0):0;
    var flip=horizontal && (a.dx<0?-1:1)!==s.face;
    var count=a.kind==='horse'?2:s.cols;
    // Footfall cadence follows distance, so slowing down cannot cause skating.
    var frame=a.moving?Math.floor(a.distance/(s.stride*a.unit)*count)%count:0;
    if(a.kind==='horse')frame+=(horizontal?4:a.dy<0?2:0);
    if(a.kind==='duck' || a.kind==='rabbit')frame=0;
    return {frame:frame,row:row,flip:flip};
  }
  return {sprites:sprites,buildings:buildings,scenes:scenes,layout:layout,create:create,advance:advance,pose:pose};
});
