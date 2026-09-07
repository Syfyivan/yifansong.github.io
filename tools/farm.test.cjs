'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const farm=require('../source/js/farm-core.js');

test('left-facing animal sheets and right-facing people follow movement direction',()=>{
 for(const kind of Object.keys(farm.sprites)){
  const a=farm.create(kind,[[10,30],[100,30]],0,1);
  a.dx=1;a.dy=0;assert.equal(farm.pose(a).flip,farm.sprites[kind].face===-1,kind+' right');
  a.dx=-1;assert.equal(farm.pose(a).flip,farm.sprites[kind].face===1,kind+' left');
 }
 const person=farm.create('player',[[30,10],[30,100]],0,1);
 person.dx=0;person.dy=1;assert.equal(farm.pose(person).row,0);
 person.dy=-1;assert.equal(farm.pose(person).row,1);
 const horse=farm.create('horse',[[10,30],[100,30]],0,1);
 assert.equal(farm.pose(horse).frame,4);
});

test('an animal completes trips, stops, turns, and never leaves its authored route',()=>{
 const a=farm.create('cow',[[20,40],[80,40]],1,1);let seenRight=false,seenLeft=false,restFrames=0;
 for(let i=0;i<2400;i++){
  const x=a.x;farm.advance(a,1/60);
  assert.ok(a.x>=20&&a.x<=80);assert.equal(a.y,40);
  assert.ok(Math.abs(a.x-x)<=farm.sprites.cow.speed/60+.001);
  if(a.moving){if(a.dx>0)seenRight=true;else seenLeft=true;}
  else restFrames++;
 }
 assert.ok(seenRight&&seenLeft);assert.ok(restFrames>100);
});

test('zero elapsed time freezes position and frames; walking cadence follows distance',()=>{
 const a=farm.create('player',[[20,40],[80,40]],0,1);
 for(let i=0;i<80;i++)farm.advance(a,1/60);
 const before=JSON.stringify(a),pose=farm.pose(a);
 farm.advance(a,0);assert.equal(JSON.stringify(a),before);assert.deepEqual(farm.pose(a),pose);
 a.moving=false;assert.equal(farm.pose(a).frame,0);
 for(const kind of ['duck','rabbit']){
  const b=farm.create(kind,[[10,10],[30,10]],0,1);b.moving=true;b.distance=103;
  assert.equal(farm.pose(b).frame,0,'no land walking frames for '+kind);
 }
});

test('all responsive routes stay on the map and avoid buildings with room for bodies',()=>{
 for(const [name,scene] of Object.entries(farm.scenes)){
  for(const [kind,route] of Object.entries(scene.routes)){
   if(kind!=='player')for(const p of route)assert.equal(p[1],route[0][1],kind+' has only side-view locomotion');
   const a=farm.create(kind,route,0,scene.unit);
   for(let n=0;n<9000;n++){
    farm.advance(a,.05);
    assert.ok(a.x>0&&a.x<scene.width&&a.y>0&&a.y<scene.height);
    // Visible body width is smaller than a padded sprite cell.
    const radius=(kind==='player'?9:kind==='cow'?17:kind==='horse'?20:8)*scene.unit;
    for(const [key,p] of Object.entries(scene.lots)){
     const [w,h]=farm.buildings[key].map(v=>v*scene.unit);
     assert.ok(!(a.x+radius>p[0]-w/2&&a.x-radius<p[0]+w/2&&a.y>p[1]-h&&a.y<p[1]+3),name+' '+kind+' intersects '+key);
    }
   }
  }
 }
});

test('responsive scaling applies equally to the world and inhabitants',()=>{
 for(const width of [320,352,390,575,576,700,768,1000,1001,1280,1920]){
  const {scene,scale}=farm.layout(width);
  assert.ok(scene.width*scale<=width-24+.01);
  assert.ok(scale>0&&scale<=1);
  const person=farm.sprites.player.size*36/64*scene.unit*scale;
  const rabbit=farm.sprites.rabbit.size*13/16*scene.unit*scale;
  const sheep=farm.sprites.sheep.size*16/32*scene.unit*scale;
  assert.ok(rabbit<person*.6);assert.ok(sheep<person*.8);
 }
});

test('sprite metadata agrees with PNG sheets and scenery has no game input or state',()=>{
 for(const [kind,s] of Object.entries(farm.sprites)){
  const png=fs.readFileSync(path.join(__dirname,'../source/img/village',kind+'.png'));
  assert.equal(png.readUInt32BE(16)/s.cols,png.readUInt32BE(20)/s.rows,kind+' square cells');
 }
 const source=fs.readFileSync(path.join(__dirname,'../source/js/farm.js'),'utf8');
 assert.doesNotMatch(source,/localStorage|setInterval|keydown|tabindex|<button|<select|role="status"/);
});
