<?php
/* @var $this KlasseController */
/* @var $data Klasse */
?>
<p><strong>Fertig!</strong> Jetzt müssen Sie nur noch die ausgedruckten Einladungen an Ihre Schüler verteilen. <br /><br /></p>
<table width="100%">                       
    <tr class="greybg">
        <td width="33%">1. Klasse anlegen</td>
        <td width="33%">2. Einladungen drucken</td>
        <td width="33%" class="bgred">3. Verteilen</td>
    </tr>
</table>

<div>      <p>&nbsp;</p>
               <p>Sobald sich Ihre Schüler registrieren und den Gruppencode eingeben, werden Sie benachrichtigt. Bis dahin können Sie alle Funktionen bereits testen.</p>
       <?php echo CHtml::link('<b>Zum digitalen Klassenraum der Klasse ' . $klasse->name ."</b>", Yii::app()->createAbsoluteUrl('klasse/kommunikation', array('id'=>$id)), array('class' => 'cta_button_red floatright')); ?>
</div>

        




