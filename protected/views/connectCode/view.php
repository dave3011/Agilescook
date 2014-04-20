<?php
/* @var $this ConnectCodeController */
/* @var $model ConnectCode */

$this->breadcrumbs=array(
	'Connect Codes'=>array('index'),
	$model->id,
);

$this->menu=array(
	array('label'=>'List ConnectCode', 'url'=>array('index')),
	array('label'=>'Create ConnectCode', 'url'=>array('create')),
	array('label'=>'Update ConnectCode', 'url'=>array('update', 'id'=>$model->id)),
	array('label'=>'Delete ConnectCode', 'url'=>'#', 'linkOptions'=>array('submit'=>array('delete','id'=>$model->id),'confirm'=>'Are you sure you want to delete this item?')),
	array('label'=>'Manage ConnectCode', 'url'=>array('admin')),
);
?>

<h1>View ConnectCode #<?php echo $model->id; ?></h1>

<?php $this->widget('zii.widgets.CDetailView', array(
	'data'=>$model,
	'attributes'=>array(
		'id',
		'connectCode',
		'klasseId',
		'userId',
		'createTime',
		'status',
	),
)); ?>
