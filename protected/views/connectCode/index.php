<?php
/* @var $this ConnectCodeController */
/* @var $dataProvider CActiveDataProvider */

$this->breadcrumbs=array(
	'Connect Codes',
);

$this->menu=array(
	array('label'=>'Create ConnectCode', 'url'=>array('create')),
	array('label'=>'Manage ConnectCode', 'url'=>array('admin')),
);
?>

<h1>Connect Codes</h1>

<?php $this->widget('zii.widgets.CListView', array(
	'dataProvider'=>$dataProvider,
	'itemView'=>'_view',
)); ?>
