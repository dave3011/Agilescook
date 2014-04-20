<?php 
$this->pageTitle = Yum::t( "Profile");
$this->title = Yum::t('Edit profile');
?>

<div class="content70">
<h1>Profil bearbeiten</h1>
<div class="form">

<?php $form=$this->beginWidget('CActiveForm', array(
    'id'=>'profile-form',
)); ?>

<?php echo Yum::requiredFieldNote(); ?>

<?php echo $form->errorSummary(array($user, $profile)); ?>

<?php if(Yum::module()->loginType & UserModule::LOGIN_BY_USERNAME) { ?>

<?php echo $form->LabelEx($user,'username'); ?>
<?php echo $form->textField($user,'username',array(
			'size'=>20,'maxlength'=>20)); ?>
<?php echo $form->error($user,'username'); ?>

<?php } ?>

<?php if(isset($profile) && is_object($profile))
	$this->renderPartial('/profile/_form', array('profile' => $profile, 'form'=>$form)); ?>
	<div>
	<?php

	if(Yum::module('profile')->enablePrivacySetting)
    echo CHtml::button(Yum::t('Privacy settings'), array(
      'submit' => array('/profile/privacy/update'),
      'class' => 'btn')); ?>

	<?php
		if(Yum::hasModule('avatar'))
			echo CHtml::button(Yum::t('Profilbild hochladen'), array(
				'submit' => array('/avatar/avatar/editAvatar'), 'class'=>'btn')); ?>
</div>
	<?php echo CHtml::submitButton($user->isNewRecord 
			? Yum::t('Create my profile') 
			: Yum::t('Save profile changes'), array('class'=>'btn')); ?>


	<?php $this->endWidget(); ?>

	</div><!-- form -->
 </div>
 