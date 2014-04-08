<?php
/* @var $this PostController */
/* @var $model Post */
/* @var $form CActiveForm */
?>

<div class="form">

<?php $form=$this->beginWidget('CActiveForm', array(
	'id'=>'post-form',
	// Please note: When you enable ajax validation, make sure the corresponding
	// controller action is handling ajax validation correctly.
	// There is a call to performAjaxValidation() commented in generated controller code.
	// See class documentation of CActiveForm for details on this.
	'enableAjaxValidation'=>false,
)); ?>

	<p class="note">Fields with <span class="required">*</span> are required.</p>

	<?php echo $form->errorSummary($model); ?>

	<div class="row">
		<?php echo $form->labelEx($model,'title'); ?>
		<?php echo $form->textField($model,'title',array('size'=>60,'maxlength'=>128)); ?>
		<?php echo $form->error($model,'title'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'content'); ?>
		<?php echo $form->textArea($model,'content',array('rows'=>6, 'cols'=>50)); ?>
		<?php echo $form->error($model,'content'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'status'); ?>
		<?php echo $form->textField($model,'status'); ?>
		<?php echo $form->error($model,'status'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'createTime'); ?>
		<?php echo $form->textField($model,'createTime'); ?>
		<?php echo $form->error($model,'createTime'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'updateTime'); ?>
		<?php echo $form->textField($model,'updateTime'); ?>
		<?php echo $form->error($model,'updateTime'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'hasMaterial'); ?>
		<?php echo $form->textField($model,'hasMaterial'); ?>
		<?php echo $form->error($model,'hasMaterial'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'authorId'); ?>
		<?php echo $form->textField($model,'authorId'); ?>
		<?php echo $form->error($model,'authorId'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'klasseId'); ?>
		<?php echo $form->textField($model,'klasseId'); ?>
		<?php echo $form->error($model,'klasseId'); ?>
	</div>

	<div class="row buttons">
		<?php echo CHtml::submitButton($model->isNewRecord ? 'Create' : 'Save'); ?>
	</div>

<?php $this->endWidget(); ?>

</div><!-- form -->