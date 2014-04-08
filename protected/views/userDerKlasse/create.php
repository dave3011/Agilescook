<?php
/* @var $this UserDerKlasseController */
/* @var $model UserDerKlasse */

$this->breadcrumbs=array(
	'User Der Klasses'=>array('index'),
	'Create',
);

$this->menu=array(
	array('label'=>'List UserDerKlasse', 'url'=>array('index')),
	array('label'=>'Manage UserDerKlasse', 'url'=>array('admin')),
);
?>

<h1>Create UserDerKlasse</h1>

<?php $this->renderPartial('_form', array('model'=>$model)); ?>