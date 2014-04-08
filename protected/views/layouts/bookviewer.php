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
    
    <script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/jquery-2.0.3.js"></script>
    <script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/jquery.form.js"></script>
    <script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/packery.pkgd.min.js"></script>
    <script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/imagesloaded.pkgd.min.js"></script>

    <script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/TUserDataLocalStorage.js"></script>
    
    <script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/prototype_scripts.js"></script>
    <script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/AppGlobalCSSResources.js"></script>
    <script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/BansheeCoreJS.js"></script>
    <script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/TDocView.js"></script>
    <script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/TMipmapPresenter.js"></script>
    <script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/TCanvasPainter.js"></script>
    <script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/TBookViewer.js"></script>
    <script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/TBookEditorView.js"></script>
    <script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/Bookviewer_App.js"></script>
    <script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/TCommandPanel.js"></script>
    <script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/TSmartLayer.js"></script>
    <script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/TInactivityTimer.js"></script>
    <script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/TGlobalView.js"></script>
    <script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/TThumbnailsPresenter.js"></script>
    <script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/TTextureStrip.js"></script>
    <script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/TThumbnail.js"></script>
    <script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/TThumbnailsHandle.js"></script>
    <script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/TScrollViewerContainer.js"></script>
    <script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/TOccluderManager.js"></script>
    <script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/TOccluder.js"></script>
    <script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/TScreenOccluder.js"></script>
    <script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/TCommentsManager.js"></script>
    <script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/TCommentsWindow.js"></script>
    <script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/THotspotsManager.js"></script>
    <script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/THotspot.js"></script>
    <script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/TCreatorDecorator.js"></script>
    <script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/TPageSelector.js"></script>
    <script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/TVersionSelector.js"></script>
    <script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/TNavigationCommandPanel.js"></script>


    <script type="text/javascript">
 
var m_UserData = [];

function resizeStage() {
    var bookViewerHost = document.getElementById('bookViewerHost');
    m_Banshee.p_SetBounds(0, 0, bookViewerHost.offsetWidth, bookViewerHost.offsetHeight);
}

function bodyMousewheel(event) {
    if (m_Banshee) {
        m_Banshee.p_HandleMouseWheel(event);
    }
}

var m_Banshee = null;
var m_localStorage = null;
var m_BookID = null;

function initStage() {
    /*
     if (!window.attachEvent)
     window.addEventListener('DOMMouseScroll', bodyMousewheel, false);
     */
     
     m_localStorage = new TUserDataLocalStorage();

    var scrollPosition = window.pageYOffset || document.body.scrollTop; //browser compatibility
    var stage = document.getElementById('bookViewerHost');
    m_Banshee = new p_BOOKVIEWER(stage, '../../bv_data/','SUPERUSER');//p_CreateBanshee(stage, 10, 10, 640, 480, p_CreateScookMainlayer);
    m_Banshee.p_OnError = appTraceOut;
    m_Banshee.p_OnStageLoaded = stageLoaded;
    m_Banshee.p_OnBookLoaded = bookLoaded;
    m_Banshee.p_OnSwitchBookVersion = onSwitchBookVersion;
    m_Banshee.p_OnHotspotSelectionChanged = onHotspotSelectionChanged;
    // m_Banshee.p_StartInactivityTimer('/blueprint/servlet/bv/ping/{0}', 1800, 60);
    //m_Banshee.p_GetInactivityTimer().p_inactivityTimerDidNotifyServer = function (sender, errormsg) {
        //alert("InactivityTimer: " + errormsg);
    //};

    m_Banshee.p_OnBeforeChangeStage = onBeforeChangeStage;

    m_Banshee.p_SetBounds(0, 0, 1000, 711);

    m_Banshee.p_SetBounds(0, 0, stage.offsetWidth, stage.offsetHeight);
}
function onSwitchBookVersion() {
    alert("Hier kann man zur Lehrer- bzw. Schülerfassung dieses Buches wechseln");
}


//Needs to be removed
function HotspotTogglePanelRight(){
           if(rightpanelopen == 0){//right panel closed -> OPEN it
              if(leftpanelopen == 0){
                    $('#content_main').css('width','70%');
              }
              else{
                    $('#content_main').css('width','50%');
              }
              
              $('#right_column').css('width','25%');
              $('#toggle_right_column').css('width','20%');
              $('#right_column_content, #heading_right_column, #gohigher_right_column').show();
              $('#materials, #usercontent, #currentStage').show();  
              $('#toggle_right_clickarea').addClass('close');
              
              rightpanelopen = 1;  
              resizeStage();
            }       
          
           else {
           
           }         

           return true;
        }   
         
function filterHotspots(param){
   loadMaterials(m_Banshee.p_GetCurrentStage(),param); 
   $('#umamaterials').show();
   $('#filteruma').prop('checked', true);
   $('#partnermaterials, #ownmaterials').hide();
   $('#filterown, #filterpartner').removeAttr('checked');
}

         
function onHotspotSelectionChanged(param) {
    HotspotTogglePanelRight();
    filterHotspots(param);
}

function onBeforeChangeStage() {
    m_localStorage.WriteStageUserData(m_BookID, m_Banshee.p_GetCurrentStage(), m_Banshee.p_GetStageUserData());
}

function unloadBook() {
    m_localStorage.WriteStageUserData(m_BookID, m_Banshee.p_GetCurrentStage(), m_Banshee.p_GetStageUserData());
    m_localStorage.WriteGlobalUserData(m_BookID, m_Banshee.p_GetCurrentStage());
}

function __book1() {
    var initialStageID = m_localStorage.ReadGlobalUserData(m_BookID);
    m_UserData = [];
    m_Banshee.p_LoadBook("../../bv_data/tiles01/book.txt", "../../bv_data/tiles01/globalView.svg", "../../bv_data/tiles01", null, initialStageID);
    m_BookID = "book1";
    m_Banshee.p_SetIsCorrespondingVersionAvailable(true);
    m_Banshee.p_SetIsTeacherVersion(true);
    m_Banshee.p_SetIsUserLoggedIn(false);
    m_Banshee.p_SetUserRole('pupil');
}

function __book2() {
    var initialStageID = m_localStorage.ReadGlobalUserData(m_BookID);
    m_UserData = [];
    m_Banshee.p_LoadBook("../../bv_data/tiles02/book.txt", "../../bv_data/tiles02/globalView.svg", "../../bv_data/tiles02", null, initialStageID);
    m_BookID = "book2";
    m_Banshee.p_SetIsCorrespondingVersionAvailable(true);
    m_Banshee.p_SetIsTeacherVersion(false);
    m_Banshee.p_SetIsUserLoggedIn(true);
    m_Banshee.p_SetUserRole('pupil');
}

function __book3() {
    var initialStageID = m_localStorage.ReadGlobalUserData(m_BookID);
    m_UserData = [];
    m_Banshee.p_LoadBook("../../bv_data/tiles03/book.txt", "../../bv_data/tiles03/globalView.svg", "../../bv_datadata/tiles03", null, initialStageID);
    m_BookID = "book3";
    m_Banshee.p_SetIsCorrespondingVersionAvailable(false);
    m_Banshee.p_SetIsTeacherVersion(true);
}

function __book4() {
    m_UserData = [];
    m_Banshee.p_LoadBook("../../bv_data/google_maps/book.txt", "../../bv_data/tiles03/globalView.svg", "../../bv_data/google_maps");
    m_BookID = "book4";
    m_Banshee.p_SetIsCorrespondingVersionAvailable(false);
    m_Banshee.p_SetIsTeacherVersion(false);
}

function __book5() {
    m_UserData = [];
    m_Banshee.p_LoadBook("../../bv_data/demobuch_scook/book.txt", "../../bv_data/demobuch_scook/globalView.svg", "../../bv_data/demobuch_scook");
    m_BookID = "book5";
}



function GetStagesInfo() {
    var szOut = 'CurrentStage = ' + m_Banshee.p_GetCurrentStage() + '\n';
    szOut += 'NumStages = ' + m_Banshee.p_GetNumStages() + '\n';
    szOut += 'Zoom = ' + m_Banshee.p_GetZoom() + '\n';
    var contentSize = m_Banshee.p_GetContentSize();
    szOut += 'Content: width:' + contentSize[0] + ' height:' + contentSize[1] + '\n';

    var userData = m_Banshee.p_GetStageUserData();
    var iLen = 0;
    if (userData) {
        iLen = userData.length;
    }
    szOut += 'UserData : ' + iLen + ' bytes\n';
    szOut += 'BookSize : ' + m_Banshee.p_GetBookSize() + '\n';
    szOut += 'ContentSize : ' + m_Banshee.p_GetContentSize() + '\n';

    var buchseite = (m_Banshee.p_GetCurrentStage() - 1) * 2;

    if (buchseite > 0)
        szOut += 'Buchseiten:' + buchseite + ' - '+ (buchseite + 1);

    alert(szOut);
}

function TestFunc() {
    alert(navigator.appName + ':'+navigator.appVersion);
}

function bookLoaded() {
    appTraceOut('>>>>BUCH GELADEN.');
}

function stageLoaded() {
    appTraceOut('>>>>STAGE GELADEN.');
    resizeStage();
    resizeStage();

    var stageData = m_localStorage.ReadStageUserData(m_BookID, m_Banshee.p_GetCurrentStage());
    m_Banshee.p_SetStageUserData(stageData);
}

var arrTrace = new Array();
function appTraceOut(s) {
    if (window.console)
        console.log(s);
    var c = document.getElementById('traceWnd');
    if (c) {
        arrTrace.push(s);
        if (arrTrace.length > 20) {
            arrTrace.splice(0, 1);
        }
        c.textContent = '';
        for (var i = 0; i < arrTrace.length; i++) {
            c.textContent += arrTrace[i] + '\n';
        }
    }
}

function InitDrag(evt, iID) {

    var a;
    //prepare the data to transfer
    if (iID == 0) {
        a = "../../bv_data/tiles01/book.txt\ndata/tiles01/globalView.svg\ndata/tiles01";
    }
    else if (iID == 1) {
        a = "../../bv_data/tiles02/book.txt\ndata/tiles02/globalView.svg\ndata/tiles02";
    }
    else if (iID == 2) {
        a = "../../bv_data/tiles03/book.txt\ndata/tiles03/globalView.svg\ndata/tiles03";
    }
    //connect it to the dragevent
    evt.dataTransfer.setData("Text", a);
}


window.onload = function(){
 initStage(); 
  __book2();
 
}
window.onunload = unloadBook;
</script>
    
	<title><?php echo CHtml::encode($this->pageTitle); ?></title>
</head>

<body onresize="resizeStage()" class="bookviewer">
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
                    echo "&nbsp;"; 
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

	<!-- Start of the main content area -->
    <div id="main">
    
         <!-- Start of the left column (Unterrichtsspalte) -->
        <div id="left_column" class="floatingleft">
            <div id="left_column_head">
                <div id="toggle_left_column">
                    <a id="toggle_left_clickarea" title="Grüne Spalte ausblenden"></a>
                </div>
                <div id="heading_left_column" class="salsa">
                    Unterrichtsplanung
                </div>
                <div id="gohigher_left_column">
                    <a id="gohigher_left_clickarea" href="<?php echo Yii::app()->createUrl('/stunde');?>" title="Zur Übersicht aller Unterrichtsstunden"></a>
                </div>
            </div><!-- end left_column_head-->
            
            <div id="left_column_content">
                <div id="lesson">             
                        <div class="create_lesson">
                            <div class="info">
                                <div class="badge"></div>
                                <p>Bereiten Sie mit nur wenigen Klicks Ihre Unterrichtsstunde vor:</p>
                                <ol>
                                    <li>Klasse, Fach und Thema der Stunde festlegen</li>
                                    <li>Material aus der rechten Spalte für Ihren Unterricht hinzufügen oder den Schülern freigeben</li>
                                    <li>Fertig</li>
                                </ol>
                                <p>
                                    <a id="plan_lesson" class="cta_button">Jetzt Unterrichtsstunde anlegen</a>
                                </p>
                            </div>                            
                        </div>

                        <div id="lessondetails">
                            <div class="info">
                                <div class="badge"></div>
                                <p>
                                    <b>1. Geben Sie Fach, Klasse und Thema der Stunde an, um die Stunde jederzeit einfach wiederzufinden.</b>
                                </p>
                            </div>   
                            <div id="errormsg" style="width:100%; padding:10px 0; color:red;"></div>
                            <form id="lessondetailsform" name="Stunde">
                                <select name="Stunde[fach]" id="fach" required>
                                    <option value="">Fach waehlen *</option>
                                    <option value="English">English</option>
                                    <option value="Mathematik">Mathematik</option>
                                    <option value="Biologie">Biologie</option>
                                </select>  
                                
                                <?php echo CHtml::dropDownList(
                                    'Stunde[klasseId]',
                                    '', 
                                    CHtml::listData(Klasse::model()->findAllByAttributes(array('userId'=>Yii::app()->user->id)), 'id', 'name')
                                    ); ?>
                                
                                
                                <input name="Stunde[titel]" id="thema" required="required" type="text" placeholder="Thema / Name der Stunde *"/>
                                <textarea name="Stunde[beschreibung]" id="stundendetails" placeholder="Optionale Beschreibung und Infos zu der Stunde"></textarea>
                                
                                <input id="submitlessondetails" type="button" class="cta_button" value="Unterrichtsstunde anlegen"/>   
                            </form>
                            <div class="submitlessondetails"></div>
                        </div><!-- end lessondetails-->
    
                        <div id="lessonmaterial">
                            
                            <div class="info">
                                <div class="badge"></div>
                                <p>
                                    <b>2. Wählen Sie nun Materialien aus der rechten Spalte und fügen Sie diese Ihrer Stunde hinzu oder teilen Sie es mit ihren Schülern.</b>
                                </p>
                            </div>
                            
                            <div class="lessonwraps lessonarea">
                                <ul id="materiallist">
                                    <p class="smaller"><i>Noch kein Material für den Unterricht hinzugefügt</i></p>                           
                                </ul>
                                <div id="lesson_actions">
                                    <div id="save_lesson">
                                        <input type="button" id="savelessonbutton" value="Stundenplanung speichern" class="cta_button_green"/>
                                    </div>
                                    <div id="use_lesson">
                                        <a id="printlesson" href="php/print.php?fach=Fach&klasse=Klasse&thema=Thema&stundendetails=Stundendetails" target="_blank" class="cta_button_green">Planung drucken</a>
                                        <a id="exportlesson" href="files/unterrichtsstunde.zip" download="unterrichtsstunde.zip" class="cta_button_green">Dateien herunterladen</a>
                                    </div>
                                </div>  
                            </div>
                            
                            
                            <div class="lessonwraps sharearea">                         
                                <div class="materialsheading">Material für meine Schüler</div>
                                <ul id="materiallist4share">  
                                    <p class="smaller"><i>Noch kein Material für Ihre Schüler hinzugefügt</i></p>                         
                                </ul>
                                <div id="share_actions">
                                    <div id="sharematerial">
                                        <input type="button" id="sharenowbutton" value="Jetzt teilen" class="cta_button_red"/>
                                        <input type="button" id="sharelaterbutton" value="Speichern und später teilen" class="cta_button_red"/>
                                    </div>
                                    <div id="sharesavedmaterial">
                                        <input id="sharesavedmaterialbutton" type="button" value="Material jetzt teilen" class="cta_button_red"/>
                                    </div>
                                    <div id="gotoshared">
                                        <a id="gotosharedbutton" href="sharing.php?fach=Fach&klasse=Klasse&thema=Thema&stundendetails=Stundendetails" target="_blank" class="cta_button_red">Zum geteilten Material   </a>
                                    </div>
                                </div>  
                            </div>
                            
                        </div><!-- end lessonmaterial-->
                        

                    </div><!-- end lesson-->
                    
            </div><!-- end left column content-->
            
        </div><!-- end left_column-->
        
        
        
        
        
        <div id="content_main" class="floatingleft">
            <div id="content_main_head"  class="salsa">
                <a href="buchregal.php" title="Zu meinem Buchregal" id="gohigher_book"></a>
            scook - Buchansicht
            </div>
            
            <div id="bookViewerHost">
            </div> <!--end bookviewerhost-->
        </div><!-- end conetent main-->
        
        
        
        
        
        <div id="right_column" class="floatingleft">
            <div id="right_column_head">
  
                <div id="gohigher_right_column">
                    <a id="gohigher_right_clickarea"title="Zur Übersicht aller Materialien"></a>
                </div>
                <div id="heading_right_column"  class="salsa">
                    Material
                </div>
                <div id="toggle_right_column">
                    <a id="toggle_right_clickarea" title="Orange Spalte ausblenden"></a>
                </div>
            </div>
            <div id="right_column_content">
                <div id="usercontent">
                    <div id="usercontentwrap">
                        <div id="uploadcontent">
                          <form id="fileuploadform" action="php/fileupload.php" method="post" enctype="multipart/form-data">
                            <input type="file" id="fileuploadfile" name="myfile"/>
                            <input class="cta_button" type="submit" id="fileuploadsubmit" value="Datei hochladen"/>
                           </form>
                           <!--<div id="progress">
                                <div id="bar"></div>
                                <div id="percent">0%</div >
                           </div>-->
                        </div>
                        <div id="addlink">
                            <p>Hier wird man den eigenen Materialien einen Link hinzufügen können</p>
                        </div>
                        <p id="uploadsuccess" style="display:none;">Upload erfolgreich</p>
                        <a id="uploadfilebutton" class="cta_button_white">Datei hochladen</a>
                        <a id="addlinkbutton" class="cta_button_white">Link hinzufügen</a>
                        <a id="cancelbutton" style="display:none;" class="cta_button_white">Abbrechen</a>
                    </div>
               </div>
               <!--<div id="currentStage" class="materialsheading"></div>-->
               <div id="materials">
                    <div id="filtermaterials">
                        <form>
                            <input type="checkbox" name="filteruma" id="filteruma" checked="checked"/><label class="umafilter" for="filteruma">&nbsp;Cornelsen&nbsp;&nbsp;&nbsp;&nbsp;</label>
                            <input type="checkbox" name="filterown" id="filterown" checked="checked"/><label for="filterown">&nbsp;eigenes Material&nbsp;&nbsp;&nbsp;&nbsp;</label>
                            <input type="checkbox" value="Partner" name="filterpartner" id="filterpartner" checked="checked"/><label for="filterpartner">&nbsp;Partner</label>
                        </form>
                    </div>
                    
                   <div id="loadingitem">Materialien werden für Sie geladen</div>
                   <div class="materials_wrap">
                        <h4 class="uma">Unterrichtsmanager-Materialien</h4>
                        <div id="umamaterials"><p class="smaller">Keine Unterrichtsmanager-Materialien gefunden</p></div>
                   </div>
                   <div class="materials_wrap">
                        <h4>Eigene Materialien</h4>
                        <div id="ownmaterials"><p class="smaller">Keine eigenen Materialien hochgeladen</p></div>
                   </div>
                   <div class="materials_wrap">
                        <h4>Partner-Materialien</h4>
                        <div id="partnermaterials"><p class="smaller">Keine Partner-Materialien gefunden</p></div>
                   </div>                   
               </div>  
               
            </div>
        </div>
        <div class="clearboth"></div>
    </div><!-- end main -->
    
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
