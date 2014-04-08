<?php
/* @var $this KlasseController */
/* @var $data Klasse */
?>

<div class="kachel rot">
    <div class="kachelcontent vollbild">
        <?php echo CHtml::link(CHtml::image( Yii::app()->baseUrl."/images/icon_default_class.png",''), $this->CreateUrl('/klasse/kommunikation/', array('id'=>$data->id)));?>
        </a>
    </div>
    <div class="kachelhead opensans color333">
        <?php echo CHtml::link($data->name, $this->CreateUrl('/klasse/kommunikation/', array('id'=>$data->id)));?>
    </div>
    <div class="kachelcontent white color333">
        <p><?php echo $data->memberCount;?> Mitglied<?php if($data->memberCount != 1) echo "er";?></p>
        <p>Connectcode: <?php echo $data->connectCode;?></p>
    </div>
</div>


