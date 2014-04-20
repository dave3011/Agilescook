<?php /* @var $this Controller */ ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="language" content="en" />

	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/prototype_styles.css" media="screen, projection" />
	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/print.css" media="print" />
	<!--[if lt IE 8]>
	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/ie.css" media="screen, projection" />
	<![endif]-->

	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/main.css" />
	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/form.css" />
    
    <script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/jquery-2.0.3.js"></script>
    <script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/jquery.form.js"></script>
    <script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/packery.pkgd.min.js"></script>
    <script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/imagesloaded.pkgd.min.js"></script>
    
	<title><?php echo CHtml::encode($this->pageTitle); ?></title>
</head>

<body class="after subhead green">
<div id="wrap">
    <div id="outer">
        <div id="head" class="clearfix">
            <div id="head_floatingleft25">
                <div id="logo" class="clearfix">
                    <div class="floatingleft">
                        <?php echo CHtml::link('', Yii::app()->createAbsoluteUrl('/'), array('id' => 'logo_clickarea'));?>                        
                    </div>
                </div>
            </div>
            <div id="head_floatingleft50">
                Die Plattform für Lehrer und ihre Schüler
            </div>
            <div id="head_floatingleft25" class="textalignright">
               <?php 
               if(Yii::app()->user->isGuest){ 
                    echo CHtml::link('Login', Yii::app()->createAbsoluteUrl('user/auth'), array('class' => 'cta_button_blue login'));
               }
               else{
                    echo "user: " . Yii::app()->user->name;
                    echo CHtml::link('Logout', Yii::app()->createAbsoluteUrl('/site/logout'), array('class' => 'cta_button_blue login')); 
               }
                ?>
            </div>
        </div><!-- end head-->
         
    <!--
	<div id="mainmenu">
		<?php $this->widget('zii.widgets.CMenu',array(
			'items'=>array(
				array('label'=>'Home', 'url'=>array('/site/index')),
				array('label'=>'About', 'url'=>array('/site/page', 'view'=>'about')),
				array('label'=>'Contact', 'url'=>array('/site/contact')),
				array('label'=>'Login', 'url'=>array('/site/login'), 'visible'=>Yii::app()->user->isGuest),
				array('label'=>'Logout ('.Yii::app()->user->name.')', 'url'=>array('/site/logout'), 'visible'=>!Yii::app()->user->isGuest)
			),
		)); ?>
	</div><!-- mainmenu -->
	<?php if(isset($this->breadcrumbs)):?>
		<?php $this->widget('zii.widgets.CBreadcrumbs', array(
			'links'=>$this->breadcrumbs,
		)); ?><!-- breadcrumbs -->
	<?php endif?>

	<?php echo $content; ?>

	<div class="clear"></div>

	<div id="footer">
       <div class="fourcolumns">
            <div class="footerhead">scook</div>
            <ul>
                <li>Die Vision</li>
                <li>Über scook</li>
                <li>Weiterwissen</li>
                <li>Benutzerhandbuch</li>
            </ul>
       </div>
       <div class="fourcolumns">
            <div class="footerhead">Partner</div>
            <ul>
                <li>Lehrerbeirat</li>
                <li>Duden</li>
                <li>Cornelsen</li>
                <li>Oldenbourg Schulverlag</li>
                <li>Volk und Wissen</li>
            </ul>
       </div>
       <div class="fourcolumns">
            <div class="footerhead">Service</div>
            <ul>
                <li>Anmeldung</li>
                <li>Hilfe und FAQ</li>
                <li>Kontakt</li>
            </ul>   
       </div>
       <div class="fourcolumns">
            <div class="footerhead">Information</div>
            <ul>
                <li>Impressum</li>
                <li>AGB</li>
                <li>Datensicherheit</li>
            </ul>   
       </div>
	</div><!-- footer -->
  </div><!-- end outer-->
    
</div><!-- end wrap-->

</body>
</html>
