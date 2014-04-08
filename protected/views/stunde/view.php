<?php
/* @var $this StundeController */
/* @var $model Stunde */

$this->breadcrumbs=array(
	'Stundes'=>array('index'),
	$model->id,
);

$this->menu=array(
	array('label'=>'List Stunde', 'url'=>array('index')),
	array('label'=>'Create Stunde', 'url'=>array('create')),
	array('label'=>'Update Stunde', 'url'=>array('update', 'id'=>$model->id)),
	array('label'=>'Delete Stunde', 'url'=>'#', 'linkOptions'=>array('submit'=>array('delete','id'=>$model->id),'confirm'=>'Are you sure you want to delete this item?')),
	array('label'=>'Manage Stunde', 'url'=>array('admin')),
);
?>

<h1>View Stunde #<?php echo $model->id; ?></h1>

<?php $this->widget('zii.widgets.CDetailView', array(
	'data'=>$model,
	'attributes'=>array(
		'id',
		'titel',
		'beschreibung',
		'fach',
		'createTime',
		'material',
		'updateTime',
		'klasseId',
		'userId',
	),
)); ?>
