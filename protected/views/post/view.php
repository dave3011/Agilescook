<?php
/* @var $this PostController */
/* @var $model Post */


$this->breadcrumbs=array(
	'Posts'=>array('index'),
	$model->title,
);

$this->menu=array(
	array('label'=>'List Post', 'url'=>array('index')),
	array('label'=>'Create Post', 'url'=>array('create')),
	array('label'=>'Update Post', 'url'=>array('update', 'id'=>$model->id)),
	array('label'=>'Delete Post', 'url'=>'#', 'linkOptions'=>array('submit'=>array('delete','id'=>$model->id),'confirm'=>'Are you sure you want to delete this item?')),
	array('label'=>'Manage Post', 'url'=>array('admin')),
);
?>

<h1>View Post #<?php echo $model->id; ?></h1>

<?php $this->widget('zii.widgets.CDetailView', array(
	'data'=>$model,
	'attributes'=>array(
		'id',
		'title',
		'content',
		'status',
		'createTime',
		'updateTime',
		'hasMaterial',
		'authorId',
		'klasseId',
	),
)); ?>

<div id="postreplies" class="message_replies">
    <?php if($model->replyCount>=1): ?>
        <h3>
            <?php echo $model->replyCount . 'Replies'; ?>
        </h3>
 
        <?php $this->renderPartial('_postreplies',array(
            'post'=>$model,
            'postreplies'=>$model->postreplies,
        )); ?>
    <?php endif; ?>
</div>
