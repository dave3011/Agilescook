<?php
/* @var $this ConnectCodeController */
/* @var $model ConnectCode */

$this->breadcrumbs=array(
	'Connect Codes'=>array('index'),
	$model->id=>array('view','id'=>$model->id),
	'Update',
);

$this->menu=array(
	array('label'=>'List ConnectCode', 'url'=>array('index')),
	array('label'=>'Create ConnectCode', 'url'=>array('create')),
	array('label'=>'View ConnectCode', 'url'=>array('view', 'id'=>$model->id)),
	array('label'=>'Manage ConnectCode', 'url'=>array('admin')),
);
?>

<h1>Update ConnectCode <?php echo $model->id; ?></h1>

<?php $this->renderPartial('_form', array('model'=>$model)); ?>