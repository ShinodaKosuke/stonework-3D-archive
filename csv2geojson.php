<?php
  setlocale(LC_ALL, 'C');
  mb_internal_encoding("UTF-8");


  $csvfile = fopen("stonework-3D-archive.csv", "r");
  if($csvfile === FALSE) {
    echo 'Failed to open stonework-3D-archive.csv';
    die();
  }

  $jsonfile = fopen("stonework-3D-archive.geojson", "w");
  if($jsonfile === FALSE) {
    echo 'Failed to open stonework-3D-archive.geojson';
    die();
  }

  $geojson = array(
     'type'      => 'FeatureCollection',
     'crs'       => array('type' => 'name',
                          'properties' => array('name' => 'urn:ogc:def:crs:OGC:1.3:CRS84') ),
     'features'  => array()
  );

  $header = fgetcsv($csvfile);
  $types = fgetcsv($csvfile);
  while (($data = fgetcsv($csvfile))) {

    $geo_lon=0; $geo_lat=0;
    $properties = array();

    for( $i=0 ; $i<count($data) ; $i++ ) {
      if( $data[$i] != "" ) {
        if( $types[$i] == "lat" ) {
          $geo_lat = $data[$i];
        } else if ( $types[$i] == "lon" ) {
          $geo_lon = $data[$i];
        } else if ( $types[$i] == "URL" ) {
          $properties = $properties + array($header[$i] => '<a href="'.$data[$i].'">'.$header[$i].'</a>');
        } else if ( $types[$i] == "img" ) {
          $properties = $properties + array($header[$i] => '<img src="'.$data[$i].'" target="_blank"/>');
        } else {
          $properties = $properties + array($header[$i] => $data[$i]);
        }
      }
    }

    $feature = array(
      'type' => 'Feature', 
      'geometry' => array(
        'type' => 'Point',
//        'coordinates' => [floatval($geo_lon), floatval($geo_lat)]
        'coordinates' => [$geo_lon, $geo_lat]
      ),
      'properties' => $properties
    );
    array_push($geojson['features'], $feature);
  }

  fwrite($jsonfile, json_encode($geojson, JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK | JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
  fclose($jsonfile);
  fclose($csvfile);
?>