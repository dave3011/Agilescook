<?php
/* @var $this PostReplyController */
/* @var $model PostReply */
/* @var $form CActiveForm */
?>

<div class="form">

<?php $form=$this->beginWidget('CActiveForm', array(
	'id'=>'post-reply-form',
    'action' => Yii::app()->createAbsoluteUrl('postReply/createpostreply', array('id'=>$post,'klasse'=>$klasse)),
	// Please note: When you enable ajax validation, make sure the corresponding
	// controller action is handling ajax validation correctly.
	// There is a call to performAjaxValidation() commented in generated controller code.
	// See class documentation of CActiveForm for details on this.
	'enableAjaxValidation'=>false,
)); ?>

	<?php echo $form->errorSummary($model); ?>

	<div class="row">
		
		<?php echo $form->textField($model,'content',array('class='=>'reply_input', 'placeholder'=>'Antwort eingeben')); ?>
		<?php echo $form->error($model,'content'); ?>
	</div>

	<div class="row buttons">
		<?php echo CHtml::submitButton($model->isNewRecord ? 'Antwort schreiben' : 'Antworten', array('class'=>'cta_button')); ?>
	</div>

<?php $this->endWidget(); ?>

</div><!-- form -->