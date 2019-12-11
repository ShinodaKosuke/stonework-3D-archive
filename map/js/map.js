$(function(){

  var map = L.map('mapdiv', {
    minZoom: 6,
    maxZoom: 18
  });

  // 迅速測図
  var oldLayer = L.tileLayer(
    'http://www.finds.jp/ws/tmc/1.0.0/Kanto_Rapid-900913-L/{z}/{x}/{y}.png', {
       maxNativeZoom: 17,
       opacity: 0.9,
       attribution: '<a href="http://www.finds.jp/wsdocs/hawms/index.html" target="_blank">歴史的農業環境WMS配信サービス</a>'
  });

  // 地理院地図
  var newLayer = L.tileLayer(
    'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', {
       opacity: 0.6,
       attribution: '<a href="http://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html" target="_blank">国土地理院</a>'
  });

  // レイヤコントロール
  var baseLayers = {
    "現代": newLayer,
    "明治期": oldLayer
  };
  L.control.layers(baseLayers).addTo(map);
  newLayer.addTo(map);

  var markerclusters = new L.markerClusterGroup({
    showCoverageOnHover: false
  });
  map.addLayer(markerclusters);

  $.getJSON( 'https://raw.githubusercontent.com/ShinodaKosuke/stonework-3D-archive/master/stonework-3D-archive.geojson', function(data) {
    var modelLayer = L.geoJson(data, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
        }).bindPopup(
          '<table border>' +
          '<tr><td>タイトル</td><td>' + feature.properties.タイトル + '</td></tr>' +
          '<tr><td>モデル</td><td>' + feature.properties.モデル + '</td></tr>' +
          '<tr><td>サムネイル</td><td>' + feature.properties.サムネイル + '</td></tr>' +
          '<tr><td>分類</td><td>' + feature.properties.分類 + '</td></tr>' +
          '<tr><td>所在地</td><td>' + feature.properties.所在地 + '</td></tr>' +
          '<tr><td>撮影日</td><td>' + feature.properties.撮影日 + '</td></tr>' +
          '</table>'
        );
      }
    });
    markerclusters.addLayer(modelLayer);
    map.fitBounds(markerclusters.getBounds());

  });

  L.easyButton('fa fa-info fa-lg',
    function() {
      $('#about').modal('show');
    },
    'このサイトについて',
    null, {
      position:  'bottomright'
    }).addTo(map);

});
