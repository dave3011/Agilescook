<?php
/* @var $this PostReplyController */
/* @var $model PostReply */

$this->breadcrumbs=array(
	'Post Replies'=>array('index'),
	$model->id,
);

$this->menu=array(
	array('label'=>'List PostReply', 'url'=>array('index')),
	array('label'=>'Create PostReply', 'url'=>array('create')),
	array('label'=>'Update PostReply', 'url'=>array('update', 'id'=>$model->id)),
	array('label'=>'Delete PostReply', 'url'=>'#', 'linkOptions'=>array('submit'=>array('delete','id'=>$model->id),'confirm'=>'Are you sure you want to delete this item?')),
	array('label'=>'Manage PostReply', 'url'=>array('admin')),
);
?>

<h1>View PostReply #<?php echo $model->id; ?></h1>

<?php $this->widget('zii.widgets.CDetailView', array(
	'data'=>$model,
	'attributes'=>array(
		'id',
		'content',
		'status',
		'createTime',
		'authorId',
		'postId',
	),
)); ?>
