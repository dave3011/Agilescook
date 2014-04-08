<?php
/* @var $this StundeController */
/* @var $data Stunde */
?>

<div class="view">

	<b><?php echo CHtml::encode($data->getAttributeLabel('id')); ?>:</b>
	<?php echo CHtml::link(CHtml::encode($data->id), array('view', 'id'=>$data->id)); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('titel')); ?>:</b>
	<?php echo CHtml::encode($data->titel); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('beschreibung')); ?>:</b>
	<?php echo CHtml::encode($data->beschreibung); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('fach')); ?>:</b>
	<?php echo CHtml::encode($data->fach); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('createTime')); ?>:</b>
	<?php echo CHtml::encode($data->createTime); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('material')); ?>:</b>
	<?php echo CHtml::encode($data->material); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('updateTime')); ?>:</b>
	<?php echo CHtml::encode($data->updateTime); ?>
	<br />

	<?php /*
	<b><?php echo CHtml::encode($data->getAttributeLabel('klasseId')); ?>:</b>
	<?php echo CHtml::encode($data->klasseId); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('userId')); ?>:</b>
	<?php echo CHtml::encode($data->userId); ?>
	<br />

	*/ ?>

</div>