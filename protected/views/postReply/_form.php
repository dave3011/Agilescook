<?php
/* @var $this PostReplyController */
/* @var $model PostReply */
/* @var $form CActiveForm */
?>

<div class="form">

<?php $form=$this->beginWidget('CActiveForm', array(
	'id'=>'post-reply-form',
	// Please note: When you enable ajax validation, make sure the corresponding
	// controller action is handling ajax validation correctly.
	// There is a call to performAjaxValidation() commented in generated controller code.
	// See class documentation of CActiveForm for details on this.
	'enableAjaxValidation'=>false,
)); ?>

	<p class="note">Fields with <span class="required">*</span> are required.</p>

	<?php echo $form->errorSummary($model); ?>

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
		<?php echo $form->labelEx($model,'authorId'); ?>
		<?php echo $form->textField($model,'authorId',array('size'=>10,'maxlength'=>10)); ?>
		<?php echo $form->error($model,'authorId'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'postId'); ?>
		<?php echo $form->textField($model,'postId'); ?>
		<?php echo $form->error($model,'postId'); ?>
	</div>

	<div class="row buttons">
		<?php echo CHtml::submitButton($model->isNewRecord ? 'Create' : 'Save'); ?>
	</div>

<?php $this->endWidget(); ?>

</div><!-- form -->