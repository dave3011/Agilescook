<?php 
$this->pageTitle = Yum::t("change password");


if(isset($expired) && $expired)
	$this->renderPartial('password_expired');
?>

<div class="whitecontent">
    <div class="content70">
        <?php echo '<h1>'. Yum::t('change password') .'</h2>'; ?>
        <?php echo CHtml::beginForm(); ?>
        	
        	<?php echo CHtml::errorSummary($form); ?>
        
        	<?php if(!Yii::app()->user->isGuest) {
        		echo CHtml::activeLabelEx($form,'currentPassword'); 
        		echo CHtml::activePasswordField($form,'currentPassword'); 
        	} ?>
        
        <?php $this->renderPartial(
        		'application.modules.user.views.user.passwordfields', array(
        			'form'=>$form)); ?>
        <?php echo Yum::requiredFieldNote(); ?>
        	<div class="submit">
        	<?php echo CHtml::submitButton(Yum::t("Save"), array('class' => 'btn')); ?>
        	</div>
        
        <?php echo CHtml::endForm(); ?>

    </div>
</div>