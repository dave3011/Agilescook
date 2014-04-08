<div class="form">
    <?php $activeform = $this->beginWidget('CActiveForm', array(
    			'id'=>'registration-form',
    			'enableAjaxValidation'=>true,
    			'enableClientValidation'=>true,
    			'focus'=>array($form,'username'),
    			));
    ?>
    
    <?php echo Yum::requiredFieldNote(); ?>
    <?php echo CHtml::errorSummary(array($form, $profile)); ?>
    
    <div style="display:none;">
    <?php
    echo $activeform->labelEx($form,'username');
    echo $activeform->textField($form,'username', array('value'=>'willbeoverridden'));
    ?>
    </div>
    
    <?php
    echo $activeform->labelEx($profile,'email');
    echo $activeform->textField($profile,'email');
    ?>
    
    <?php
    echo $activeform->labelEx($profile,'firstname');
    echo $activeform->textField($profile,'firstname');
    ?> 
    
    <?php
    echo $activeform->labelEx($profile,'lastname');
    echo $activeform->textField($profile,'lastname');
    ?> 
    
    <?php echo $activeform->labelEx($form,'password'); ?>
    <?php echo $activeform->passwordField($form,'password'); ?>
    
    <?php echo $activeform->labelEx($form,'verifyPassword'); ?>
    <?php echo $activeform->passwordField($form,'verifyPassword'); ?>
    </div></div>
    
    
    <?php echo $activeform->labelEx($form,'roles'); ?>

    <?php echo $activeform->dropDownList(
        $form,
        'roles', 
        CHtml::listData(YumRole::model()->findAll(), 'id', 'title')
        ); ?>
    </div></div>
    
    <?php if(extension_loaded('gd') 
    			&& Yum::module('registration')->enableCaptcha): ?>
    	<div class="row">
        	<div class="span12">
    		<?php echo CHtml::activeLabelEx($form,'verifyCode'); ?>
    		<div>
    		<?php $this->widget('CCaptcha'); ?>
    		<?php echo CHtml::activeTextField($form,'verifyCode'); ?>
    		</div>
    		<p class="hint">
    		<?php echo Yum::t('Please enter the letters as they are shown in the image above.'); ?>
    		<br/><?php echo Yum::t('Letters are not case-sensitive.'); ?></p>
    	</div></div>
    	<?php endif; ?>
    	
    	<div class="row submit">
        <div class="span12">
    		<?php echo CHtml::submitButton(Yum::t('Registration'), array('class'=>'btn')); ?>
            </div>
    	</div>
    
    <?php $this->endWidget(); ?>
</div><!-- form -->