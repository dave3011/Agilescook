<?php

class KlasseController extends Controller
{
	/**
	 * @var string the default layout for the views. Defaults to '//layouts/column2', meaning
	 * using two-column layout. See 'protected/views/layouts/column2.php'.
	 */
	public $layout='//layouts/main';
    public $bodyclass='subhead red';

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
				'actions'=>array('create', 'created', 'update', 'settings', 'step1', 'step3', 'printcodes', 'kommunikation'),
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
	   $dataProvider=new CActiveDataProvider('UserDerKlasse', array(
            'criteria'=>array(
                'condition'=>'klasseId=' . $id . ')', 
                )
            )
        );
        
		$this->render('view',array(
			'model'=>$this->loadModel($id),
		));
	}
    

	/**
	 * Creates a new model.
	 * If creation is successful, the browser will be redirected to the 'view' page.
	 */
	public function actionCreate()
	{
		$model=new Klasse;

		// Uncomment the following line if AJAX validation is needed
		$this->performAjaxValidation($model);

		if(isset($_POST['Klasse']))
		{
			$model->attributes=$_POST['Klasse'];
            
            if($model->save()){
                
                // if classsize is set, then generate invitation codes
                if(isset($_POST['classsize'])){
                    
                    /** Generate connectcodes basing on number given*/
                    $connectCodeList = array();
                    for($i=0; $i < $_POST['classsize']; $i++){
                       $randomcode = substr( md5(time().$i.Yii::app()->user->id ),0,6); 
                       array_push($connectCodeList, $randomcode);                      
                    }
                    
                    foreach($connectCodeList as $singleConnectCode){
                        $connectCodeRow = new ConnectCode;
                        $connectCodeRow->connectCode = $singleConnectCode;    
                        $connectCodeRow->klasseId = $model->id;
                        $connectCodeRow->createTime = time();
                        $connectCodeRow->status = 0;
                        $connectCodeRow->userId = Yii::app()->User->id;  
                        $connectCodeRow->save();                    
                    }
                  
                   $this->redirect(array(
                        'created',
                        'id'=>$model->id,
                        'connectCodeList'=>$connectCodeList)
                    ); 
                    /* $this->render('created',array(
            			'klasse'=>$this->loadModel($model->id),
                        'connectCodeList'=>$connectCodeList,
            		)); */
                }
            }
		}
            //Normal and initial view for Create
    		$this->render('create',array(
    			'model'=>$model,
    		));     
	}
    
    public function actionCreated($id)
	{
	    $this->render('created',array(
			'klasse'=>$this->loadModel($id),
            //'connectCodeList'=>$connectCodeList,
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

		if(isset($_POST['Klasse']))
		{
			$model->attributes=$_POST['Klasse'];
			if($model->save())
				$this->redirect(array('view','id'=>$model->id));
		}

		$this->render('update',array(
			'model'=>$model,
		));
	}
    
    public function actionSettings($id)
	{
	   $model=$this->loadModel($id);

		// Uncomment the following line if AJAX validation is needed
		// $this->performAjaxValidation($model);

		if(isset($_POST['Klasse']))
		{
			$model->attributes=$_POST['Klasse'];
			if($model->save())
				$this->redirect(array('kommunikation','id'=>$model->id));
		}
	       //DB: might be replacable with relation in Model 
        $dataProviderKlassen=new CActiveDataProvider('Klasse', array(
                'criteria'=>array(
                    'condition'=>'deleted!=1 AND userId=' . Yii::app()->user->id, 
                    )
                )
            );
		//DB: might be replacable with relation in Model   
         $dataProviderSchueler=new CActiveDataProvider('UserDerKlasse', array(
                'criteria'=>array(
                    'condition'=>'klasseId=' . $id, 
                    )
                )
            );
            
		$this->render('settings',array( 
             'klasse'=>$this->loadModel($id), 
             'schuelerliste'=>$dataProviderSchueler,
             'klassenliste'=>$dataProviderKlassen          
		));
	}
    
    public function actionStep1()
	{
        $model=new Klasse;
        $outputJs = Yii::app()->request->isAjaxRequest;
		$this->renderPartial('_form_step1',
            array('model'=>$model),
            false,
            $outputJs
        );  
	}
    
    public function actionStep3($id)
	{
        $this->renderPartial('_form_step3', array(
            'id'=>$id,
            'klasse'=>$this->loadModel($id),
        ));
	}
    
    public function actionPrintcodes($id)
	{
	    $klasse=$this->loadModel($id);
        $connectCodeList = $klasse->connectCodes;
        $this->render('printcodes', array(
            'connectCodeList'=>$connectCodeList,
            'klasse'=>$klasse,
        ));
	}
    
    public function actionKommunikation($id)
	{
		
		// Uncomment the following line if AJAX validation is needed
		// $this->performAjaxValidation($model);
        $dataProvider=new CActiveDataProvider('Post', array(
            'criteria'=>array(
                'condition'=>'klasseId=' . $id, 
                'order'=>'createTime DESC', 
                )
            )
        );   
        
        //DB: might be replacable with relation in Model 
        $dataProviderKlassen=new CActiveDataProvider('Klasse', array(
                'criteria'=>array(
                    'condition'=>'deleted!=1 AND userId=' . Yii::app()->user->id, 
                    )
                )
            );
            
         //DB: might be replacable with relation in Model   
         $dataProviderSchueler=new CActiveDataProvider('UserDerKlasse', array(
                'criteria'=>array(
                    'condition'=>'klasseId=' . $id, 
                    )
                )
            );

		$this->render('kommunikation',array(
			'dataProvider'=>$dataProvider, 
             'klasse'=>$this->loadModel($id), 
             'klassenliste'=>$dataProviderKlassen, 
             'schuelerliste'=>$dataProviderSchueler,          
		));

	}

	/**
	 * Deletes a particular model.
	 * If deletion is successful, the browser will be redirected to the 'admin' page.
	 * @param integer $id the ID of the model to be deleted
	 */
	public function actionDelete($id)
	{
        //db: echeck if this works first
		$this->loadModel($id);
        $model->deleted = 1;
        
        if($model->save())
		{
		  if(!isset($_GET['ajax']))
			$this->redirect(isset($_POST['returnUrl']) ? $_POST['returnUrl'] : array('admin'));	
		}
		
		
	}

	/**
	 * Lists all models.
	 */
	public function actionIndex()
	{
	   if(Yii::app()->user->hasRole('Lehrer_auth') || Yii::app()->user->hasRole('Lehrer_nicht_auth')){
    	   $dataProvider=new CActiveDataProvider('Klasse', array(
                'criteria'=>array(
                    'condition'=>'deleted!=1 AND userId=' . Yii::app()->user->id, 
                    )
                )
            );
            
            
    		$this->render('index',array(
    			'dataProvider'=>$dataProvider,
    		));    
	   }
       
       
       else{//User is Pupil 
    	   $dataProvider=new CActiveDataProvider('UserDerKlasse', array(
                'criteria'=>array(
                    'condition'=>'userId=' . Yii::app()->user->id, //deleted!=1 condition is in view where lazyloaded model is loaded or try this one http://stackoverflow.com/questions/11333707/dataprovider-and-relations-yii
                    )
                )
            );
    		$this->render('indexschueler',array(
    			'dataProvider'=>$dataProvider,
    		));           
       }
       
	}

	/**
	 * Manages all models.
	 */
	public function actionAdmin()
	{
		$model=new Klasse('search');
		$model->unsetAttributes();  // clear any default values
		if(isset($_GET['Klasse']))
			$model->attributes=$_GET['Klasse'];

		$this->render('admin',array(
			'model'=>$model,
		));
	}

	/**
	 * Returns the data model based on the primary key given in the GET variable.
	 * If the data model is not found, an HTTP exception will be raised.
	 * @param integer $id the ID of the model to be loaded
	 * @return Klasse the loaded model
	 * @throws CHttpException
	 */
	public function loadModel($id)
	{
		$model=Klasse::model()->findByPk($id);
		if($model===null)
			throw new CHttpException(404,'The requested page does not exist.');
		return $model;
	}

	/**
	 * Performs the AJAX validation.
	 * @param Klasse $model the model to be validated
	 */
	protected function performAjaxValidation($model)
	{
		if(isset($_POST['ajax']) && $_POST['ajax']==='klasse-form')
		{
			echo CActiveForm::validate($model);
			Yii::app()->end();
		}
	}
}
