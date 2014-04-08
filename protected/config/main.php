<?php

// uncomment the following to define a path alias
// Yii::setPathOfAlias('local','path/to/local-folder');

// This is the main Web application configuration. Any writable
// CWebApplication properties can be configured here.
return array(
	'basePath'=>dirname(__FILE__).DIRECTORY_SEPARATOR.'..',
	'name'=>'scook it up a bit',

    'language' => 'de',

	// preloading 'log' component
	'preload'=>array('log'),

    //db: bootstrap path alias
    'aliases'=> array(
        'bootstrap' => realpath(__DIR__ . '/../extensions/bootstrap'),//DB added for bootstrap
    ),

	// autoloading model and component classes
	'import'=>array(
		'application.models.*',
		'application.components.*',
        'application.widgets.*',
        'application.modules.user.models.*',
        'bootstrap.helpers.TbArray', //DB added for bootstrap
        'bootstrap.helpers.TbHtml', //DB added for bootstrap
        'bootstrap.behaviors.TbWidget',//DB added for bootstrap
	),

	'modules'=>array(
		'user' => array(
            'debug' => false,
            'userTable' => 'user',
            'translationTable' => 'translation',
        ),
        'usergroup' => array(
            'usergroupTable' => 'usergroup',
            'usergroupMessageTable' => 'user_group_message',
        ),
        'registration' => array(
            'enableCaptcha'=>false,
            'registrationUrl' => array('//registration/registration'),
            'activationUrl' => array('//registration/registration/activation'),
            'recoveryUrl' => array('//registration/registration/recovery'),
        ),
        
        /* DB: Zunächst deaktiviert
        'membership' => array(
            'membershipTable' => 'membership',
            'paymentTable' => 'payment',
        ),
        'friendship' => array(
            'friendshipTable' => 'friendship',
        ),*/
        'profile' => array(
            'privacySettingTable' => 'privacysetting',
            'profileTable' => 'profile',
            'profileCommentTable' => 'profile_comment',
            'profileVisitTable' => 'profile_visit',
            'enableProfileComments' => false,
        ),
        'avatar' => array(
            'enableGravatar'=>false,
        ),
        'role' => array(
            'roleTable' => 'role',
            'userRoleTable' => 'user_role',
            'actionTable' => 'action',
            'permissionTable' => 'permission',
        ),
        'message' => array(
            'messageTable' => 'message',
        ),
        
		'gii'=>array(
			'class'=>'system.gii.GiiModule',
			'password'=>'scook2013',
            'generatorPaths' => array('bootstrap.gii'), //DB added for bootstrap)
			// If removed, Gii defaults to localhost only. Edit carefully to taste.
			'ipFilters'=>array('127.0.0.1','::1'),
		),
	),

	// application components
	'components'=>array(
		'user'=>array(
            'class' => 'application.modules.user.components.YumWebUser',
            'allowAutoLogin'=>true,
            'loginUrl' => array('//user/user/login'),
      ),
        
        //DB: Added for YUM
        'cache' => array('class' => 'system.caching.CDummyCache'),
        
        //DB: added for bootstratp
        'bootstrap' => array(
            'class' => 'bootstrap.components.TbApi',
        ),
        
		// uncomment the following to enable URLs in path-format
		'urlManager'=>array(
			'urlFormat'=>'path',
			'rules'=>array(
				'<controller:\w+>/<id:\d+>'=>'<controller>/view',
				'<controller:\w+>/<action:\w+>/<id:\d+>'=>'<controller>/<action>',
				'<controller:\w+>/<action:\w+>'=>'<controller>/<action>',
			),
		),
		
        
		'db'=>array(
			'connectionString' => 'mysql:host=localhost;dbname=scookyii',
			'emulatePrepare' => true,
			'username' => 'root',
			'password' => '',
			'charset' => 'utf8',
            'tablePrefix' => '',
		),
		
		'errorHandler'=>array(
			// use 'site/error' action to display errors
			'errorAction'=>'site/error',
		),
		'log'=>array(
			'class'=>'CLogRouter',
			'routes'=>array(
				array(
					'class'=>'CFileLogRoute',
					'levels'=>'error, warning',
				),
				/* DB: Not yet wokring
                array(
                    'class'=>'ext.yii-debug-toolbar.YiiDebugToolbarRoute',
                ),?*/
				array(
					'class'=>'CWebLogRoute',
				),
			),
		),
	),

	// application-level parameters that can be accessed
	// using Yii::app()->params['paramName']
	'params'=>array(
		// this is used in contact page
		'adminEmail'=>'webmaster@example.com',
	),
);