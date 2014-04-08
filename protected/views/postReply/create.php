<?php
/* @var $this PostReplyController */
/* @var $model PostReply */

$this->breadcrumbs=array(
	'Post Replies'=>array('index'),
	'Create',
);

$this->menu=array(
	array('label'=>'List PostReply', 'url'=>array('index')),
	array('label'=>'Manage PostReply', 'url'=>array('admin')),
);
?>

<h1>Create PostReply</h1>

<?php $this->renderPartial('_form', array('model'=>$model)); ?>