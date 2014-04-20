<?php
/* @var $this KlasseController */
/* @var $data Klasse */
?>
<p>Geben Sie nun den Namen Ihrer Klasse/Lerngruppe und die Anzahl von Schülern an, für die Sie Einladungscodes erzeugen möchten.<br />&nbsp;</p>
    
<table width="100%">                       
    <tr class="greybg">
        <td width="33%" class="bgred">1. Klasse anlegen</td>
        <td width="33%">2. Einladungen drucken</td>
        <td width="33%">3. Verteilen</td>
    </tr>
</table>
    
<div class="form" style="margin-top:25px;">
    <?php $form=$this->beginWidget('CActiveForm', array(
    	'id'=>'klasse-form',
        'action' => 'create',
        'focus'=>array($model,'name'),                    
    	// Please note: When you enable ajax validation, make sure the corresponding
    	// controller action is handling ajax validation correctly.
    	// There is a call to performAjaxValidation() commented in generated controller code.
    	// See class documentation of CActiveForm for details on this.
    	'enableAjaxValidation'=>true,
        'clientOptions'=>array(
                    'validateOnSubmit'=>true,
            ),
    )); ?>
    
    	<?php echo $form->errorSummary($model); ?>
    
    <!--	<div class="row">
    		<?php echo $form->labelEx($model,'userId'); ?>
    		<?php echo $form->textField($model,'userId',array('size'=>10,'maxlength'=>10)); ?>
    		<?php echo $form->error($model,'userId'); ?>
    	</div>-->
    
    	<div class="row" style="width:50%;">
    		<?php echo $form->labelEx($model,'name'); ?>
    		<?php echo $form->textField($model,'name',array('size'=>20,'maxlength'=>20)); ?>
    		<?php echo $form->error($model,'name'); ?>
    	</div>
        
        <div class="row">
            <label>Gruppengröße</label>
            <select name="classsize" id="classsize">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="13">13</option>
                <option value="14">14</option>
                <option value="15">15</option>
                <option value="16">16</option>
                <option value="17">17</option>
                <option value="18">18</option>
                <option value="19">19</option>
                <option value="20">20</option>
                <option value="21">21</option>
                <option value="22">22</option>
                <option value="23">23</option>
                <option value="24">24</option>
                <option value="25">25</option>
                <option value="26">26</option>
                <option value="27">27</option>
                <option value="28">28</option>
                <option value="29">29</option>
                <option value="30">30</option>
                <option value="31">31</option>
                <option value="32">32</option>
                <option value="33">33</option>
                <option value="34">34</option>
                <option value="35">35</option>
                <option value="36">36</option>
                <option value="37">37</option>
                <option value="38">38</option>
                <option value="39">39</option>
                <option value="40">40</option>
            </select>
        	Schüler 
    	</div>
        <div class="row">
    		<?php echo $form->checkBox($model,'studentCommunication',array('size'=>3,'maxlength'=>1, 'checked'=>'checked', 'value'=>1, 'uncheckValue'=>0)); ?> Schüler dürfen Nachrichten schreiben
    	</div>
       
        <div class="row buttons">
         <p class="smaller"><br/>Felder mit <span class="required">*</span> sind Pflichtfelder</p>
	<?php echo CHtml::submitButton($model->isNewRecord ? 'Weiter' : 'Save', array('class'=>'cta_button_red floatright')); ?>
    </div>
    <?php $this->endWidget(); ?>
    
</div><!-- form --> 

        




