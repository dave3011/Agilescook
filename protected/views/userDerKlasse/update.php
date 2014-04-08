<?php
/* @var $this UserDerKlasseController */
/* @var $model UserDerKlasse */

$this->breadcrumbs=array(
	'User Der Klasses'=>array('index'),
	$model->id=>array('view','id'=>$model->id),
	'Update',
);

$this->menu=array(
	array('label'=>'List UserDerKlasse', 'url'=>array('index')),
	array('label'=>'Create UserDerKlasse', 'url'=>array('create')),
	array('label'=>'View UserDerKlasse', 'url'=>array('view', 'id'=>$model->id)),
	array('label'=>'Manage UserDerKlasse', 'url'=>array('admin')),
);
?>

<h1>Update UserDerKlasse <?php echo $model->id; ?></h1>

<?php $this->renderPartial('_form', array('model'=>$model)); ?>