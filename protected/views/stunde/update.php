<?php
/* @var $this StundeController */
/* @var $model Stunde */

$this->breadcrumbs=array(
	'Stundes'=>array('index'),
	$model->id=>array('view','id'=>$model->id),
	'Update',
);

$this->menu=array(
	array('label'=>'List Stunde', 'url'=>array('index')),
	array('label'=>'Create Stunde', 'url'=>array('create')),
	array('label'=>'View Stunde', 'url'=>array('view', 'id'=>$model->id)),
	array('label'=>'Manage Stunde', 'url'=>array('admin')),
);
?>

<h1>Update Stunde <?php echo $model->id; ?></h1>

<?php $this->renderPartial('_form', array('model'=>$model)); ?>