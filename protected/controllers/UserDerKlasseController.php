<?php

class UserDerKlasseController extends Controller
{
	/**
	 * @var string the default layout for the views. Defaults to '//layouts/column2', meaning
	 * using two-column layout. See 'protected/views/layouts/column2.php'.
	 */
	public $layout='//layouts/column2';

	/**
	 * @return array action filters
	 */
	public function filters()
	{
		return array(
			'accessControl', // perform access control for CRUD operations
			'postOnly + delete', // we only allow deletion via POST request
		);
	}

	/**
	 * Specifies the access control rules.
	 * This method is used by the 'accessControl' filter.
	 * @return array access control rules
	 */
	public function accessRules()
	{
		return array(
			array('allow',  // allow all users to perform 'index' and 'view' actions
				'actions'=>array('index','view'),
				'users'=>array('*'),
			),
			array('allow', // allow authenticated user to perform 'create' and 'update' actions
				'actions'=>array('create','update', 'enterConnectCode'),
				'users'=>array('@'),
			),
			array('allow', // allow admin user to perform 'admin' and 'delete' actions
				'actions'=>array('admin','delete'),
				'users'=>array('admin'),
			),
			array('deny',  // deny all users
				'users'=>array('*'),
			),
		);
	}

	/**
	 * Displays a particular model.
	 * @param integer $id the ID of the model to be displayed
	 */
	public function actionView($id)
	{  
		$this->render('view',array(
			'model'=>$this->loadModel($id),
		));
	}

    /**
	 * Checks if the connectcode exists in Model ConnectCode and adds the user to this Klasse
	 */
	public function actionEnterConnectCode()
	{ 
	
        if(isset($_POST['connectcodefield']) && !empty($_POST['connectcodefield']))
        {
            $connectcode = $_POST['connectcodefield']; //Get connectcode from AJAX Post
            
            //check if the connectcode exists
            $getClass = ConnectCode::model()->find('connectCode=:connectCode', array(':connectCode' => $connectcode)); //find the connectcode in ConnectCode-Model
            if(empty($getClass)){ //Code not found
                echo "Code nicht gültig, erneut probieren";
            }
            elseif($getClass->status == 1){//if status=1 -> code already used, then it's not valid
                echo "Der Code wurde bereits verwendet und ist daher nicht gültig.";
            }
            
            else{ //Code found
                //check if user is not already member of this class
                $alreadymember = UserDerKlasse::model()->findAllByAttributes(
                    array(
                        'userId' => Yii::app()->user->id,
                        'klasseId' => $getClass->klasseId
                    )
                );
                
                if(!empty($alreadymember)){//User is already member of this class
                    echo "<p>Du bist bereit Mitglied der  Klasse <i>" . $getClass->klasseId . "</i></p>";
                }
                else{ //User not yet member of this class, create new UserDerKLasse and add User info
                    $model=new UserDerKlasse;
                    $model->klasseId = $getClass->klasseId;
                    $model->userId = Yii::app()->User->id;
                    $model->timejoined = time();
                    
                    $getClass->status = 1;
                    $getClass->save();
                    //ToDo: Set status to '1' of ConnectCode
                    
                    if($model->save()){
                        echo "<p>Du bist der Klasse <i>" . $getClass->klasse->name . "</i> beigetreten.<br/>" . CHtml::link('Hier gehts zur Klasse', Yii::app()->createAbsoluteUrl("klasse/kommunikation/", array('id'=>$getClass->klasseId))) . "</p>";
    		      }
                }
            }
            
        }
        else{
            echo ('Kein Connectcode eingegeben');
        }
    }

    /**
	 * Outdated Checks if the connectcode exists in Model Klasse and adds the user to this Klasse
	 */
	public function actionEnterConnectCodeOld()
	{ 
	
        if(isset($_POST['connectcodefield']) && !empty($_POST['connectcodefield']))
        {
            $connectcode = $_POST['connectcodefield'];//Get connectcode from AJAX Post
            
            //check if a class with this connectcode exists
            $class = Klasse::model()->find('connectCode=:connectCode', array(':connectCode' => $connectcode));
            if(empty($class)){
                echo "Code nicht gültig, erneut probieren";
            }
            else{
                //check if user is not already member of this class
                $alreadymember = UserDerKlasse::model()->findAllByAttributes(
                    array(
                        'userId' => Yii::app()->user->id,
                        'klasseId' => $class->id
                    )
                );
                
                if(!empty($alreadymember)){
                    echo "<p>Du bist bereit Mitglied der  Klasse <i>" . $class->name . "</i></p>";
                }
                else{
                    $model=new UserDerKlasse;
                    $model->klasseId = $class->id;
                    $model->userId = Yii::app()->User->id;
                    $model->timejoined = time();
                    if($model->save()){
                        echo "<p>Du bist der Klasse <i>" . $class->name . "</i> beigetreten." . CHtml::link('Hier gehts zur Klasse', Yii::app()->createAbsoluteUrl("klasse/kommunikation/", array('id'=>$class->id))) . "</p>";
    		      }
                }
            }
            
        }
        else{
            echo ('Kein Connectcode eingegeben');
        }
    }
        

	/**
	 * Creates a new model.
	 * If creation is successful, the browser will be redirected to the 'view' page.
	 */
	public function actionCreate()
	{
		$model=new UserDerKlasse;
        
		// Uncomment the following line if AJAX validation is needed
		// $this->performAjaxValidation($model);

		if(isset($_POST['UserDerKlasse']))
		{
			$model->attributes=$_POST['UserDerKlasse'];
			if($model->save())
				$this->redirect(array('view','id'=>$model->id));
		}

		$this->render('create',array(
			'model'=>$model,
		));
	}

	/**
	 * Updates a particular model.
	 * If update is successful, the browser will be redirected to the 'view' page.
	 * @param integer $id the ID of the model to be updated
	 */
	public function actionUpdate($id)
	{
		$model=$this->loadModel($id);

		// Uncomment the following line if AJAX validation is needed
		// $this->performAjaxValidation($model);

		if(isset($_POST['UserDerKlasse']))
		{
			$model->attributes=$_POST['UserDerKlasse'];
			if($model->save())
				$this->redirect(array('view','id'=>$model->id));
		}

		$this->render('update',array(
			'model'=>$model,
		));
	}

	/**
	 * Deletes a particular model.
	 * If deletion is successful, the browser will be redirected to the 'admin' page.
	 * @param integer $id the ID of the model to be deleted
	 */
	public function actionDelete($id)
	{
		$this->loadModel($id)->delete();

		// if AJAX request (triggered by deletion via admin grid view), we should not redirect the browser
		if(!isset($_GET['ajax']))
			$this->redirect(isset($_POST['returnUrl']) ? $_POST['returnUrl'] : array('admin'));
	}

	/**
	 * Lists all models.
	public function actionIndex()
	{
		$dataProvider=new CActiveDataProvider('UserDerKlasse');
		$this->render('index',array(
			'dataProvider'=>$dataProvider,
		));
	}

	/**
	 * Manages all models.
	 */
	public function actionAdmin()
	{
		$model=new UserDerKlasse('search');
		$model->unsetAttributes();  // clear any default values
		if(isset($_GET['UserDerKlasse']))
			$model->attributes=$_GET['UserDerKlasse'];

		$this->render('admin',array(
			'model'=>$model,
		));
	}

	/**
	 * Returns the data model based on the primary key given in the GET variable.
	 * If the data model is not found, an HTTP exception will be raised.
	 * @param integer $id the ID of the model to be loaded
	 * @return UserDerKlasse the loaded model
	 * @throws CHttpException
	 */
	public function loadModel($id)
	{
		$model=UserDerKlasse::model()->findByPk($id);
		if($model===null)
			throw new CHttpException(404,'The requested page does not exist.');
		return $model;
	}

	/**
	 * Performs the AJAX validation.
	 * @param UserDerKlasse $model the model to be validated
	 */
	protected function performAjaxValidation($model)
	{
		if(isset($_POST['ajax']) && $_POST['ajax']==='user-der-klasse-form')
		{
			echo CActiveForm::validate($model);
			Yii::app()->end();
		}
	}
}
