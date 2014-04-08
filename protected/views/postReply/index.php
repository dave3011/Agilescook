<?php
/* @var $this PostReplyController */
/* @var $dataProvider CActiveDataProvider */

$this->breadcrumbs=array(
	'Post Replies',
);

$this->menu=array(
	array('label'=>'Create PostReply', 'url'=>array('create')),
	array('label'=>'Manage PostReply', 'url'=>array('admin')),
);
?>

<h1>Post Replies</h1>

<?php $this->widget('zii.widgets.CListView', array(
	'dataProvider'=>$dataProvider,
	'itemView'=>'_view',
)); ?>
