<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" /> 
    <title>Unterrichtsplanung ausdrucken</title>
</head>
<body>
<script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/jquery-2.0.3.js"></script>

<style type="text/css">
<!--
body{
    font-family:Open Sans;
}
#printheader{
    background:#eee url(<?php echo Yii::app()->request->baseUrl; ?>/images/scook_logo.png) 20px center no-repeat;
    width:95%;
    height:75px;
    padding-right:5%;
    line-height:75px;
    font-size:14px;
    color:#999;
    text-align:right;
}

@font-face{
      font-family: 'Open Sans';
      src: url('<?php echo Yii::app()->request->baseUrl; ?>/font/opensans.woff') format('woff');
      font-style: normal;
      font-weight: 400;
    }
    
h2{
    font-size:16px;
    color:#666;
}

h2{
    font-size:24px;
    color:#333;
}

p{
    font-size:14px;
}

.materials{
    border:2px solid #eee;
    background-color:#eee;
    padding:10px 20px;
}

.materials li{
    margin-left:15px;
}


@media print {
    #printheader{
        background:#eee url(<?php echo Yii::app()->request->baseUrl; ?>/images/scook_logo.png) 20px center no-repeat!important;
        width:95%;
        height:75px;
        padding-right:5%;
        line-height:75px;
        font-size:14px;
        color:#999;
        text-align:right;
    }
    
    @font-face{
          font-family: 'Open Sans';
          src: url('<?php echo Yii::app()->request->baseUrl; ?>/font/opensans.woff') format('woff');
          font-style: normal;
          font-weight: 400;
        }
}

-->
</style>

<div id="printheader">www.scook.de</div>

<?php 
         echo "<div style='width:50%; float:left;'><p><strong>Ihre " . count($connectCodeList) . " Gruppencodes für Ihre Klasse " . $klasse->name . "</strong></p>";
         foreach($connectCodeList as $singleConnectCode){
            echo "<div style='float:left;  border: 1px solid #bbb; width:33%; padding:8px 0; text-align:center;'>" . $singleConnectCode . "</div>";
          }  
          echo "</div>";          
       ?> 

</body>
</html>
<script>
$(document).ready(function() {
    window.print();
    }); 
</script>