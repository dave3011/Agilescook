<?php
/* @var $this PostReplyController */
/* @var $model PostReply */

$this->breadcrumbs=array(
	'Post Replies'=>array('index'),
	$model->id=>array('view','id'=>$model->id),
	'Update',
);

$this->menu=array(
	array('label'=>'List PostReply', 'url'=>array('index')),
	array('label'=>'Create PostReply', 'url'=>array('create')),
	array('label'=>'View PostReply', 'url'=>array('view', 'id'=>$model->id)),
	array('label'=>'Manage PostReply', 'url'=>array('admin')),
);
?>

<h1>Update PostReply <?php echo $model->id; ?></h1>

<?php $this->renderPartial('_form', array('model'=>$model)); ?>