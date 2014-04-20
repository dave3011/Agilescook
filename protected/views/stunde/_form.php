<?php
/* @var $this StundeController */
/* @var $model Stunde */
/* @var $form CActiveForm */
?>

<div class="form">

<?php $form=$this->beginWidget('CActiveForm', array(
	'id'=>'stunde-form',
	// Please note: When you enable ajax validation, make sure the corresponding
	// controller action is handling ajax validation correctly.
	// There is a call to performAjaxValidation() commented in generated controller code.
	// See class documentation of CActiveForm for details on this.
	'enableAjaxValidation'=>true,
    'clientOptions'=>array(
                'validateOnSubmit'=>true,
        ),
)); ?>

	<p class="note">Fields with <span class="required">*</span> are required.</p>

	<?php echo $form->errorSummary($model); ?>

	<div class="row">
		<?php echo $form->labelEx($model,'titel'); ?>
		<?php echo $form->textField($model,'titel',array('size'=>60,'maxlength'=>155)); ?>
		<?php echo $form->error($model,'titel'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'beschreibung'); ?>
		<?php echo $form->textArea($model,'beschreibung',array('rows'=>6, 'cols'=>50)); ?>
		<?php echo $form->error($model,'beschreibung'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'fach'); ?>
		<?php echo $form->textField($model,'fach',array('size'=>60,'maxlength'=>155)); ?>
		<?php echo $form->error($model,'fach'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'createTime'); ?>
		<?php echo $form->textField($model,'createTime'); ?>
		<?php echo $form->error($model,'createTime'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'material'); ?>
		<?php echo $form->textArea($model,'material',array('rows'=>6, 'cols'=>50)); ?>
		<?php echo $form->error($model,'material'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'updateTime'); ?>
		<?php echo $form->textField($model,'updateTime'); ?>
		<?php echo $form->error($model,'updateTime'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'klasseId'); ?>
		<?php echo $form->textField($model,'klasseId',array('size'=>10,'maxlength'=>10)); ?>
		<?php echo $form->error($model,'klasseId'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'userId'); ?>
		<?php echo $form->textField($model,'userId',array('size'=>10,'maxlength'=>10)); ?>
		<?php echo $form->error($model,'userId'); ?>
	</div>

	<div class="row buttons">
		<?php echo CHtml::submitButton($model->isNewRecord ? 'Create' : 'Save'); ?>
	</div>

<?php $this->endWidget(); ?>

</div><!-- form -->