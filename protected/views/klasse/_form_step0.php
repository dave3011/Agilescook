<?php
/* @var $this KlasseController */
/* @var $data Klasse */
?>
<p>Legen Sie in wenigen Schritten eine Klasse oder Lerngruppe an, verteilen Sie dann die Einladungscodes an Ihre Schüler um Aufgaben und Material zu verteilen und Ihren geschützten Diskussionsbereich mit Ihren Schülern nutzen zu können.<br />&nbsp;</p>
<table width="100%">
 
    <tr class="greybg">
        <td width="33%">1. Klasse anlegen</td>
        <td width="33%">2. Einladungen drucken</td>
        <td width="33%">3. Verteilen</td>
    </tr>
    <tr>
        <td><?php echo '<img width="100%" src="'.Yii::app()->request->baseUrl.'/images/sketch_plus.jpg"/>'; ?></td>
        <td><?php echo '<img width="100%" src="'.Yii::app()->request->baseUrl.'/images/sketch_printer.jpg"/>'; ?></td>
        <td><?php echo '<img width="100%" src="'.Yii::app()->request->baseUrl.'/images/sketch_people.jpg"/>'; ?></td>
    </tr>
    <tr>
        <td valign="top">
            <p>Das dauert weniger als 1 Minute.</p>
        </td>
        <td valign="top">
            <p>Anzahl der Schüler festlegen und Einladungscodes für die Schüler erzeugen und ausdrucken.</p>
        </td>
        <td valign>
            <p>Die ausgedruckten Einladungen verteilen Sie an Ihre Schüler.</p>
            <p>Sobald sich Ihre Schüler registrieren und den Code eingeben, sind diese in ihrem digitalen Klassenzimmer bereit zum Arbeiten.</p>
        </td>
    </tr>
</table>

<?php 
    echo CHtml::ajaxLink(
        'Neue Klasse anlegen',         
        array('step1',
        ), // the URL for the AJAX request. If empty, it is assumed to be the current URL.
        array(
            'update'=>'#steps'
        ),
        array('class'=>'cta_button_red floatright')
    );
?>



