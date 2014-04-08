<?php
/* @var $this StundeController */
/* @var $model Stunde */

$this->breadcrumbs=array(
	'Stundes'=>array('index'),
	'Create',
);

$this->menu=array(
	array('label'=>'List Stunde', 'url'=>array('index')),
	array('label'=>'Manage Stunde', 'url'=>array('admin')),
);
?>

<h1>Create Stunde</h1>

<?php $this->renderPartial('_form', array('model'=>$model)); ?>