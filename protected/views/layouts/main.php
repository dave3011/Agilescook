<?php /* @var $this Controller */ ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="language" content="en" />

	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/styles.css" media="screen, projection" />
	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/print.css" media="print" />
	<!--[if lt IE 8]>
	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/ie.css" media="screen, projection" />
	<![endif]-->

	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/main.css" />
	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/form.css" />
    
    <?php Yii::app()->bootstrap->register(); ?>
     
    <!--<script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/jquery-2.0.3.js"></script>
    <script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/jquery.form.js"></script>-->
    <script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/packery.pkgd.min.js"></script>
    <script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/imagesloaded.pkgd.min.js"></script>
    
	<title><?php echo CHtml::encode($this->pageTitle); ?></title>
</head>

<body class="<?php echo isset($this->bodyclass) ? $this->bodyclass : ''; ?>">
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
                <div class="text">Die Plattform für Lehrer und ihre Schüler</div>
            </div>
            <div id="head_floatingleft25" class="textalignright">
               <?php 
               if(Yii::app()->user->isGuest){ 
                    echo "<div class='login_head'>" . CHtml::link('Login', Yii::app()->createAbsoluteUrl('user/auth'), array('class' => 'cta_button_blue login')) . "</div>";
               }
               else{                                    
                    echo "<div class='floatright'>";                   
                        $this->widget('bootstrap.widgets.TbNav', array(
                            'type' => TbHtml::NAV_TYPE_PILLS,
                            'htmlOptions' => array('class'=>'opensans menu_head'),
                            'items' => array(array('label'=>Yii::app()->user->data()->profile->firstname,'','items' => array(
                                array('label' => 'Mein Profil', 'url' => Yii::app()->createAbsoluteUrl('/profile/profile/view')),
    					       	array('label' => 'Logout', 'url' => Yii::app()->createAbsoluteUrl('/site/logout')),   
                                )
                            ),),
                        ));
                    echo "</div>";
                    
                    echo "<div class='floatright avatar'>";
                        if(empty(Yii::app()->user->data()->avatar)){;
                            echo CHtml::image(Yii::app()->baseUrl . "/images/dummy_avatar.png", Yii::app()->user->data()->profile->firstname, array('align'=>'right'));
                        }
                        else{
                            echo CHtml::image(Yii::app()->request->baseUrl . "/" . Yii::app()->user->data()->avatar, Yii::app()->user->data()->profile->firstname, array('align'=>'right'));   
                        } 
                    echo "</div>";

                 }
                ?>
            </div>
        </div><!-- end head-->

<!-- <div id="mainmenu">
		<?php $this->widget('bootstrap.widgets.TbNav', array(
            'type' => TbHtml::NAV_TYPE_PILLS,
            'items' => array(
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
