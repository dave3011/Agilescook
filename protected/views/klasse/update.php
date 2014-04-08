<?php
/* @var $this KlasseController */
/* @var $model Klasse */

$this->breadcrumbs=array(
	'Klasses'=>array('index'),
	$model->name=>array('view','id'=>$model->id),
	'Update',
);

$this->menu=array(
	array('label'=>'List Klasse', 'url'=>array('index')),
	array('label'=>'Create Klasse', 'url'=>array('create')),
	array('label'=>'View Klasse', 'url'=>array('view', 'id'=>$model->id)),
	array('label'=>'Manage Klasse', 'url'=>array('admin')),
);
?>

<h1>Update Klasse <?php echo $model->id; ?></h1>

<?php $this->renderPartial('_form', array('model'=>$model)); ?>