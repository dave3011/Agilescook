<?php
/* @var $this KlasseController */
/* @var $data Klasse */
?>

<ul class="widgetitems">
      <?php echo CHtml::link('<li><span class="smaller"> ' . $data->klasse->name . '</span><br /> <b><span class="bigger"> ' . $data->titel .'</span></b><br /><p> ' . $data->beschreibung . '</p></li>', 
        array(
            '/stunde/view', 
            'id'=>$data->id)
        ); ?>  
</ul>
