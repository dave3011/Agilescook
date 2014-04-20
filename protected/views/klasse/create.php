<?php
/* @var $this KlasseController */
/* @var $model Klasse */
?>
<div id="main"> 
  <div class="whitecontent"> 
    <div class="content70"> 
        <h1>Neue Klasse anlegen</h1>
        <div id="steps">           
            <?php 
                if(!isset($_GET['step'])){
                    $this->renderPartial('_form_step0', array('model'=>$model));
                }
                else if ($_GET['step'] == 2){
                    $this->renderPartial('_form_step2', array('model'=>$model));
                    foreach($_GET['connectCodeList'] as $connectCode){
                        echo "<br/>" . $connectCode;
                    }     
                }          
             ?>
       </div>  <!-- end steps-->   
    </div><!-- end content70-->
    
    <div class="content30 grey">
        <div class="kachel grau">
            <div class="kachelhead">Ideen oder Fragen zu scook</div>
            <div class="kachelcontent superlightgrey">
                <p>scook funktioniert ganz einfach. Sollte dies noch nicht überall der Fall sein, freuen wir uns über Ihre Rückmeldung und beantworten gerne Ihre Fragen:</p>
                <p class="morepadding"><a href="mailto:support@scook.de" class="cta_button_blue">Jetzt eine E-Mail schreiben</a></p>
                <p class="phoneicon"><b>Anrufen 030 / 5444 5989</b><br />Montag bis Freitag von 10 bis 18 Uhr</p>
            </div>                    
        </div>
    </div><!-- end content30-->
  </div>
</div><!-- #main ends-->
            