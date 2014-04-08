<?php
/* @var $this StundeController */
/* @var $model Stunde */
/* @var $form CActiveForm */
?>

<div class="wide form">

<?php $form=$this->beginWidget('CActiveForm', array(
	'action'=>Yii::app()->createUrl($this->route),
	'method'=>'get',
)); ?>

	<div class="row">
		<?php echo $form->label($model,'id'); ?>
		<?php echo $form->textField($model,'id'); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'titel'); ?>
		<?php echo $form->textField($model,'titel',array('size'=>60,'maxlength'=>155)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'beschreibung'); ?>
		<?php echo $form->textArea($model,'beschreibung',array('rows'=>6, 'cols'=>50)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'fach'); ?>
		<?php echo $form->textField($model,'fach',array('size'=>60,'maxlength'=>155)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'createTime'); ?>
		<?php echo $form->textField($model,'createTime'); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'material'); ?>
		<?php echo $form->textArea($model,'material',array('rows'=>6, 'cols'=>50)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'updateTime'); ?>
		<?php echo $form->textField($model,'updateTime'); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'klasseId'); ?>
		<?php echo $form->textField($model,'klasseId',array('size'=>10,'maxlength'=>10)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'userId'); ?>
		<?php echo $form->textField($model,'userId',array('size'=>10,'maxlength'=>10)); ?>
	</div>

	<div class="row buttons">
		<?php echo CHtml::submitButton('Search'); ?>
	</div>

<?php $this->endWidget(); ?>

</div><!-- search-form -->