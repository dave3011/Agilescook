<?php
/* @var $this KlasseController */
/* @var $model Klasse */

$this->breadcrumbs=array(
	'Klasses'=>array('index'),
	$model->name,
);

$this->menu=array(
	array('label'=>'List Klasse', 'url'=>array('index')),
	array('label'=>'Create Klasse', 'url'=>array('create')),
	array('label'=>'Update Klasse', 'url'=>array('update', 'id'=>$model->id)),
	array('label'=>'Delete Klasse', 'url'=>'#', 'linkOptions'=>array('submit'=>array('delete','id'=>$model->id),'confirm'=>'Are you sure you want to delete this item?')),
	array('label'=>'Manage Klasse', 'url'=>array('admin')),
);
?>

<h1>View Klasse #<?php echo $model->id; ?></h1>

<?php $this->widget('zii.widgets.CDetailView', array(
	'data'=>$model,
	'attributes'=>array(
		'id',
		'userId',
		'name',
		'studentCommunication',
	),
)); ?>
