<?php
/* @var $this KlasseController */
/* @var $data Klasse */
?>

<div class="view widgetitems" >
    <table>
        <tr>
            <td>
                <?php echo CHtml::link('<img style="width:130px;" src="' . Yii::app()->request->baseUrl . '/images/icon_default_class.png" />', array('klasse/kommunikation/', 'id'=>$data->id)); ?>
            </td>
            <td width="10"></td>
            <td valign="top">
            	<b>
                     <?php echo CHtml::link(CHtml::encode($data->name), array('klasse/kommunikation/', 'id'=>$data->id)); ?>
                </b>
            	<br />
                Mathematik, Deutsch
            </td>
        </tr>
    </table>
</div>