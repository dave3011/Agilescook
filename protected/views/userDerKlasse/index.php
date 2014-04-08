<?php
/* @var $this UserDerKlasseController */
/* @var $dataProvider CActiveDataProvider */

$this->breadcrumbs=array(
	'User Der Klasses',
);

$this->menu=array(
	array('label'=>'Create UserDerKlasse', 'url'=>array('create')),
	array('label'=>'Manage UserDerKlasse', 'url'=>array('admin')),
);
?>

<h1>User Der Klasses</h1>

<?php $this->widget('zii.widgets.CListView', array(
	'dataProvider'=>$dataProvider,
	'itemView'=>'_view',
)); ?>
