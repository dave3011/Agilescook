<?php
/* @var $this UserDerKlasseController */
/* @var $model UserDerKlasse */

$this->breadcrumbs=array(
	'User Der Klasses'=>array('index'),
	$model->id,
);

$this->menu=array(
	array('label'=>'List UserDerKlasse', 'url'=>array('index')),
	array('label'=>'Create UserDerKlasse', 'url'=>array('create')),
	array('label'=>'Update UserDerKlasse', 'url'=>array('update', 'id'=>$model->id)),
	array('label'=>'Delete UserDerKlasse', 'url'=>'#', 'linkOptions'=>array('submit'=>array('delete','id'=>$model->id),'confirm'=>'Are you sure you want to delete this item?')),
	array('label'=>'Manage UserDerKlasse', 'url'=>array('admin')),
);
?>

<h1>View UserDerKlasse #<?php echo $model->id; ?></h1>

<?php $this->widget('zii.widgets.CDetailView', array(
	'data'=>$model,
	'attributes'=>array(
		'id',
		'klasseId',
		'userId',
	),
)); ?>
