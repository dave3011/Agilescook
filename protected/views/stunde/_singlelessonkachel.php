<?php
/* @var $this KlasseController */
/* @var $data Klasse */
?>

<div class="kachel gruen">
    <div class="kachelhead opensans color333">
        <?php echo CHtml::link($data->titel, $this->CreateUrl('/view/', array('id'=>$data->id)));?>
    </div>
    <div class="kachelcontent white color333">
       
        <p>
            <b><?php echo $data->klasse->name;?></b><br />
            <?php echo $data->beschreibung;?>
        </p> 
    </div>
    <div class="kachelcontent vollbild">
        <?php echo CHtml::link(CHtml::image( Yii::app()->baseUrl."/images/icon_default_lesson.png",''), $this->CreateUrl('view/', array('id'=>$data->id)));?>
        </a>
    </div>
</div>


