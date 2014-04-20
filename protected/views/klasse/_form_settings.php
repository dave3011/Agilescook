<?php
/* @var $this KlasseController */
/* @var $model Klasse */
/* @var $form CActiveForm */
?>

<div class="form" style="width:50%;">

<?php $form=$this->beginWidget('CActiveForm', array(
	'id'=>'klasse-form',
	// Please note: When you enable ajax validation, make sure the corresponding
	// controller action is handling ajax validation correctly.
	// There is a call to performAjaxValidation() commented in generated controller code.
	// See class documentation of CActiveForm for details on this.
	'enableAjaxValidation'=>true,
)); ?>

	<?php echo $form->errorSummary($model); ?>

<!--	<div class="row">
		<?php echo $form->labelEx($model,'userId'); ?>
		<?php echo $form->textField($model,'userId',array('size'=>10,'maxlength'=>10)); ?>
		<?php echo $form->error($model,'userId'); ?>
	</div>-->

	<div class="row">
		<?php echo $form->labelEx($model,'name'); ?>
		<?php echo $form->textField($model,'name',array('size'=>20,'maxlength'=>20)); ?>
		<?php echo $form->error($model,'name'); ?>
	</div>

<div class="row">
		<?php echo $form->labelEx($model,'studentCommunication'); ?>
		<?php echo $form->checkBox($model,'studentCommunication',array('size'=>3,'maxlength'=>1, 'value'=>1, 'uncheckValue'=>0)); ?>
		<?php echo $form->error($model,'studentCommunication'); ?>
	</div>

	<div class="row buttons">
		<?php echo CHtml::submitButton($model->isNewRecord ? 'Klasse anlegen' : 'Einstellungen speichern', array('class'=>'cta_button_red')); ?>
	</div>

<?php $this->endWidget(); ?>

</div><!-- form -->