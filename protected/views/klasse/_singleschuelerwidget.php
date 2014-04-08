<?php
/* @var $this KlasseController */
/* @var $data Klasse */
?>
<li>
<?php echo $data->users->profile->firstname . " " . $data->users->profile->lastname; ?>
<!--<?php echo CHtml::link($data->users->profile->firstname, $this->CreateUrl('/klasse/kommunikation/', array('id'=>$data->id)));?>-->
</li>
