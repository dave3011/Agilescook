<?php
/* @var $this ConnectCodeController */
/* @var $model ConnectCode */

$this->breadcrumbs=array(
	'Connect Codes'=>array('index'),
	'Create',
);

$this->menu=array(
	array('label'=>'List ConnectCode', 'url'=>array('index')),
	array('label'=>'Manage ConnectCode', 'url'=>array('admin')),
);
?>

<h1>Create ConnectCode</h1>

<?php $this->renderPartial('_form', array('model'=>$model)); ?>