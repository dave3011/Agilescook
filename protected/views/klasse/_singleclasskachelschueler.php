<?php
/* @var $this KlasseController */
/* @var $data Klasse */
?>

<div class="kachel rot">
    <div class="kachelcontent vollbild">
        <?php echo CHtml::link(CHtml::image( Yii::app()->baseUrl."/images/icon_default_class.png",''), $this->CreateUrl('/klasse/kommunikation/', array('id'=>$data->klasseId)));?>
        </a>
    </div>
    <div class="kachelhead opensans color333">
        <?php echo CHtml::link($data->klasse->name, $this->CreateUrl('/klasse/kommunikation/', array('id'=>$data->klasseId)));?>
    </div>
</div>


