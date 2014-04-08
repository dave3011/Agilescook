<?php

class BookviewerController extends Controller
{
	/**
	 * @var string the default layout for the views. Defaults to '//layouts/column2', meaning
	 * using two-column layout. See 'protected/views/layouts/column2.php'.
	 */
	public $layout='//layouts/bookviewer';
    public $defaultAction='index';
    
    public function accessRules()
	{
		return array(
			array('allow',  
				'actions'=>array(),
				'users'=>array('*'),
			),
			array('allow',
				'actions'=>array('index'),
				'users'=>array('@'),
			),
			array('allow', 
				'actions'=>array(),
				'users'=>array('admin'),
			),
			array('deny',  // deny all users
				'users'=>array('*'),
			),
		);
	}   
    
    public function actionIndex()
	{
		$this->render('bookviewer_3columns',array(
	
		));

	}
    
}