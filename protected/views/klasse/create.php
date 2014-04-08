<?php
/* @var $this KlasseController */
/* @var $model Klasse */

$this->breadcrumbs=array(
	'Klasses'=>array('index'),
	'Create',
);

$this->menu=array(
	array('label'=>'List Klasse', 'url'=>array('index')),
	array('label'=>'Manage Klasse', 'url'=>array('admin')),
);
?>
<div class="whitecontent100" style="margin-top: 25px;">
<h1>Neue Klasse anlegen</h1>

<?php $this->renderPartial('_form', array('model'=>$model)); ?>

</div>