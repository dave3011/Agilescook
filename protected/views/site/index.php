<?php
/* @var $this SiteController */

$this->pageTitle=Yii::app()->name;
?>
<script type="text/javascript">
         $(document).ready(function() {  
          pckry = new Packery( document.querySelector('#container'), { "itemSelector": ".kachel", "gutter": ".gutter-sizer" } );
          imagesLoaded( container, function() {               
              pckry.layout();
            });
        });
    </script>
<!-- Start of the main content area -->
        <div id="main"> 
            <div id="container" > 
                <div class="gutter-sizer"></div>    
                  
                <div class="kachel breit">
                    <div class="mainvisual_text">
                        <p style="font-size:28px;" class="salsa">alles. einfach. scook.</p>
                        <p>Auf scook finden Sie alles, was Sie für Ihren Unterricht brauchen: Das Schulbuch als E-Book, passendes Material und viele nützliche Angebote und Funktionen. Jederzeit. An jedem Ort. </p>
                    </div>
                    <div class="kachelcontent vollbild">
                        <img src="<?php echo Yii::app()->request->baseUrl; ?>/images/mainvisual.jpg" width="710" height="456"/>
                    </div>
                </div>
                
                <!--<div class="kachel grau">
                     <div class="kachelcontent">
                        <?php $this->widget('application.modules.user.components.LoginWidget'); ?>
                     </div>
                </div>-->
                
                <div class="kachel grau">
                    <div class="kachelhead">Jetzt bei scook anmelden</div>
                    <div class="kachelcontent">
                        <p>Erstellen Sie in wenigen Schritten Ihr persönliches Profil.</p>
                        <p class="textaligncenter">
                            <?php echo CHtml::link('Jetzt anmelden', Yii::app()->createAbsoluteUrl('registration/registration'), array('class' => 'cta_button_blue'));?>
                        </p>
                    </div>                    
                </div>
                
                <div class="kachel grau">
                    <div class="kachelhead">Entdecken Sie scook im Video</div>
                    <div class="kachelcontent vollbild">
                        <img src="<?php echo Yii::app()->request->baseUrl; ?>/images/image_video.png" width="301" height="177"/>
                    </div>                    
                </div>
                
                <div class="kachel blau">
                    <div class="kachelhead buecher_icon">Ihr Schulbuch digital</div>
                    <div class="kachelcontent">
                        <p class="img"><img src="<?php echo Yii::app()->request->baseUrl; ?>/images/image_buecher.png" width="300" height="130"/></p>
                        <p>Das E-Book zu Ihrem Schulbuch steht in Ihrem persönlichen Bücherregal.</p>
                    </div> 
                    <div class="kachelfoot">
                        <a href="#">mehr ...<span class="scookicons">&#58942;</span></a>
                    </div>                    
                </div>
                
                <div class="kachel blau">
                    <div class="kachelhead freischalten_icon">Jetzt E-Book freischalten</div>
                    <div class="kachelcontent">
                       <form id="freischalte_widget" method="post" action="buchansicht.php">
                                <input type="text" placeholder="Lizenzcode eingeben" id="freischalten_textfeld" name="freischalten_textfeld"/>                             
                                <input type="submit" value="" class="cta_button_white inputsubmit"/>                            
                            </form>
                            <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br />
                        <p>Der Code in Ihrem Schulbuch erlaubt Ihnen die (kostenlose) Nutzung des E-Books auf scook.</p>
                    </div> 
                    <div class="kachelfoot">
                        <a href="#">Demobuch anschauen ...<span class="scookicons">&#58942;</span></a>
                    </div>                    
                </div>
                
                <div class="kachel lila">
                    <div class="kachelhead weiterwissen_icon">Weiterwissen</div>
                    <div class="kachelcontent">
                        <p class="img">
                            <?php echo CHtml::link('<img src="'.Yii::app()->request->baseUrl.'/images/image_weiterwissen.png" width="300" height="160"/>', Yii::app()->createAbsoluteUrl('site/page?view=weiterwissen'));?>                            
                        <p>Hier lesen Sie spannende Artikel und finden nützliche Tipps und Angebote.</p>
                    </div> 
                    <div class="kachelfoot">
                         <?php echo CHtml::link('mehr ...<span class="scookicons">&#58942;</span>', Yii::app()->createAbsoluteUrl('site/page?view=weiterwissen'));?>
                    </div>                    
                </div>
                
                <div class="kachel orange">
                    <div class="kachelhead folder_icon">Material suchen</div>
                    <div class="kachelcontent">
                        <p class="img"><img src="<?php echo Yii::app()->request->baseUrl; ?>/images/image_material.png" width="300" height="105"/></p>
                        <p>Sie finden schnell das richtige Material zum Buch - vielfältig und übersichtlich.</p>
                    </div> 
                    <div class="kachelfoot">
                       
                        <a href="#">mehr ...<span class="scookicons">&#58942;</span></a>
                    </div>                    
                </div>
                
                <div class="kachel gruen">
                    <div class="kachelhead grid_icon">Unterricht effektiv planen</div>
                    <div class="kachelcontent">
                        <p class="img"><img src="<?php echo Yii::app()->request->baseUrl; ?>/images/image_planung.png" width="300" height="120"/></p>
                        <p>Mit dem Stundenplaner können Sie künftig Ihre Stunden effizient vorbereiten.</p>
                    </div> 
                    <div class="kachelfoot">
                        <a href="#">mehr ...<span class="scookicons">&#58942;</span></a>
                    </div>                    
                </div>
                
                <div class="kachel rot">
                    <div class="kachelhead">Du bist Schüler?</div>
                    <div class="kachelcontent">
                        <p class="img"><img src="<?php echo Yii::app()->request->baseUrl; ?>/images/image_schueler.png" width="300" height="166"/></p>
                        <p>Kein lästiges Schleppen mehr: scook hat Dein Schulbuch als E-Book. Und bald noch vieles mehr. </p>
                    </div> 
                    <div class="kachelfoot">
                        <a href="#">mehr ...<span class="scookicons">&#58942;</span></a>
                    </div>                    
                </div>
                
                <div class="kachel grau">
                    <div class="kachelhead">scook und seine Partner</div>
                    <div class="kachelcontent">
                        <p class="img"><img src="src="<?php echo Yii::app()->request->baseUrl; ?>/images/image_partner.png" width="300" height="195"/></p>
                        <p>scook ist unabhängig und offen für starke Partner mit hochwertigen Inhalten. </p>
                    </div> 
                    <div class="kachelfoot">
                        <a href="#">mehr ...<span class="scookicons">&#58942;</span></a>
                    </div>                    
                </div>
                
                <div class="kachel grau">
                    <div class="kachelhead">Datenschutz und Sicherheit</div>
                    <div class="kachelcontent">
                        <p class="img"><img src="<?php echo Yii::app()->request->baseUrl; ?>/images/image_sicher.png" width="300" height="60"/></p>
                        <p>Arbeiten Sie sicher: scook setzt auf Datensparsamkeit und maximalen Datenschutz.</p>
                    </div> 
                    <div class="kachelfoot">
                        <a href="#">mehr ...<span class="scookicons">&#58942;</span></a>
                    </div>                    
                </div>
                
                <div class="kachel grau">
                    <div class="kachelhead">Neu</div>
                    <div class="kachelcontent">
                        <p class="img"><img src="<?php echo Yii::app()->request->baseUrl; ?>/images/image_didacta.png" width="300" height="91"/></p>
                        <p>scook schenkt Ihnen Eintrittskarten für die didacta, die weltweit größte internationale Bildungsmesse. </p>
                    </div> 
                    <div class="kachelfoot">
                        <a href="#">Gutschein bestellen ...<span class="scookicons">&#58942;</span></a>
                    </div>                    
                </div>
                
                
            </div>
        </div><!-- end main -->

