<?php
/* @var $this KlasseController */
/* @var $data Klasse */
?>
<li>
<?php echo CHtml::link($data->name, $this->CreateUrl('/klasse/kommunikation/', array('id'=>$data->id)));?>
</li>
