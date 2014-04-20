<?php
/* @var $this KlasseController */
/* @var $model Klasse */
?>
<div id="main"> 
  <div class="whitecontent"> 
    <div class="content70"> 
        <h1>Neue Klasse anlegen</h1>
        
        <div id="steps">
            <p>&nbsp;</p>
            <table width="100%">
                <tr>
                    <td width="33%">1. Anlegen</td>
                    <td width="33%" class="bgred">2. Einladungen drucken</td>
                    <td width="33%">3. Verteilen</td>
                </tr>
                <tr>
                    <td><?php echo '<img src="'.Yii::app()->request->baseUrl.'/images/sketch_plus.jpg"/>'; ?></td>
                    <td><?php echo '<img src="'.Yii::app()->request->baseUrl.'/images/sketch_printer.jpg"/>'; ?></td>
                    <td><?php echo '<img src="'.Yii::app()->request->baseUrl.'/images/sketch_people.jpg"/>'; ?></td>
                </tr>
                <tr>
                    <td valign="top">
                        <p>Das dauert weniger als 1 Minute.</p>
                    </td>
                    <td valign="top">
                        <p>Einladungen für die Schüler erzeugen und ausdrucken.</p>
                    </td>
                    <td valign>
                        <p>Die ausgedruckten Einladungen verteilen Sie an Ihre Schüler.</p>
                        <p>Sobald sich Ihre Schüler registrieren und den Code eingeben, sind sie Ihrer Klasse zugeordnet.</p>
                    </td>
                </tr>
            </table>
            <?php 
                echo CHtml::ajaxLink(
                    'Neue Klasse anlegen',          // the link body (it will NOT be HTML-encoded.)
                    array('step',
                        'step'=>'1'
                    ), // the URL for the AJAX request. If empty, it is assumed to be the current URL.
                    array(
                        'update'=>'#steps'
                    ),
                    array('class'=>'cta_button_red floatright')
                );
            ?>
        </div>  <!-- end steps--> 
        
    </div>
  </div>
</div><!-- #main ends-->