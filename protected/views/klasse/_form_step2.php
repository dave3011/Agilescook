<?php
/* @var $this KlasseController */
/* @var $data Klasse */
?>
<p><strong>Ihre Klasse <?php echo $klasse->name;?> wurde erfolgreich angelegt.</strong> Bitte drucken Sie die Codes aus, um sie Ihren Schülern als Einladung in ihren digitalen Klassenraum in scook zu verteilen. <br /><br /></p>
<table width="100%">                       
    <tr class="greybg">
        <td width="33%">1. Klasse anlegen</td>
        <td width="33%" class="bgred">2. Einladungen drucken</td>
        <td width="33%">3. Verteilen</td>
    </tr>
</table>

<div>
       <?php 
         echo "<div style='width:50%; margin-top:20px; outline: 2px solid #bbb; float:left;'><p>&nbsp;&nbsp; Ihre " . count($connectCodeList) . " Gruppencodes</p>";
         foreach($connectCodeList as $singleConnectCode){
            echo "<div style='float:left; width:30%; margin:3px 1.5%; background:#eee; padding:8px 0; text-align:center;'>" . $singleConnectCode . "</div>";
          }  
          echo "<div class='clearboth'></div><br/><a href='#' class='cta_button_lightgrey'>Codes Drucken</a>";
          echo "</div>";   
             
       ?> 
        

       <div style='width:50%; margin-top:20px; float:left;'>
            <div style="padding:15px; background:#eee; float: right; font-size:13px;color:#b9294d;width:70%;">
                Ihre Schüler werden über einen dieser Codes Ihrer Klasse / Lerngruppe zugeordnet. Jede Einladung ist einzigartig und kann nur einmal verwendet werden. 
            </div>
       </div>
       <div class="clearboth"></div>
       
       <p>&nbsp;</p>
       <p>Sie können die Codes auch jederzeit später bei den Einstellungen zu Ihren Klassen einsehen, ausdrucken oder weitere Codes erzeugen.</p>
       <?php 
            echo CHtml::ajaxLink(
                'Weiter',         
                array('step3',
                    'id'=>$klasse->id,
                ), // the URL for the AJAX request. If empty, it is assumed to be the current URL.
                array(
                    'update'=>'#steps'
                ),
                array('class'=>'cta_button_red floatright')
            );
        ?>
</div>

        




