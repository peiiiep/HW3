window.onload = function(){



var mapSketch = function(p5j){
    p5j.earthquakes;
    p5j.loaded = 0; // 確認是否有讀取檔案
    p5j.canvas;
    //p5j.boundLU, p5j.boundRD; // 西北 東南 經緯度
    p5j.arr = [];


    // 調整 顯示層

    p5j.basic = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }); 

    p5j.mag3= new L.LayerGroup();
    p5j.mag5= new L.LayerGroup();
    p5j.mag7= new L.LayerGroup();

    p5j.overlaying = {
    		"mag3": p5j.mag3,
    		"mag5": p5j.mag5,
    		"mag7": p5j.mag7
    };

    p5j.map = L.map('map',{layers: [p5j.basic]}).setView([0,0], 2); // 經緯度 比例


    L.control.layers(p5j.baseLayer, p5j.overlaying).addTo(p5j.map); // 添加層

    // oop
    var quake = function (c1,c0,mag){
      // 初始化
      this.totalFrame = 10;
      this.currentFrame = 1;
      this.id=0;
      this.mag = mag;
      this.c1 = c1;
      this.c0 = c0;

      if (this.mag>=3&&this.mag<5){
      	this.color = '#922';
      	this.layerGroup = p5j.mag3;
      }else if (this.mag>=5&&this.mag<7){
      	this.color = '#d22';
      	this.layerGroup = p5j.mag5;
      }else {
      	this.color = '#f22';
      	this.layerGroup = p5j.mag7;
      }
      // 定義 marker 物件
      this.marker = L.circle([this.c1, this.c0], { // 緯度在前面
                color: this.color,
                fillOpacity: 0.3,
                stroke: false, // 取消邊線
                radius: this.mag*80000 // 強度 乘上大小單位為公尺
              });
      this.marker.addTo(this.layerGroup).bindPopup('Here is '+this.c1+','+this.c0);
    }


    // 開始動畫
    p5j.preload = function() { // 需要先讀取 json
      // 取得日期段內的強度大於3的地震
      let url = 'https://earthquake.usgs.gov/fdsnws/event/1/query?' +
        'format=geojson&starttime=2020-02-11&endtime=2020-04-12&minmagnitude=3';

      p5j.httpGet(url, 'jsonp', false, function(response) {
        p5j.earthquakes = response; // 會把所有回呼資料存於 earthquakes
      });
    }

    p5j.setup = function(){
    	//p5j.canvas = p5j.createCanvas(1200,600);
    	//p5j.overLayer.addTo(p5j.canvas);
    }
    p5j.draw = function(){
      if (!p5j.earthquakes) {
        // Wait until the earthquake data has loaded before drawing.
        return;
      }else {
        if (p5j.loaded === 1){

          p5j.earthquakes.features.forEach((val)=>{
            p5j.arr.push(new quake(val.geometry.coordinates[1], val.geometry.coordinates[0], val.properties.mag));
          });

        }else{
        	p5j.arr.forEach((q)=>{
            //    	q.curentFrame = (p5j.loaded+q.currentFrame);
                 	//q.update();
            	});
        }
    
        p5j.loaded +=1;
      }    
  }
}
  
new p5(mapSketch, 'map');
}