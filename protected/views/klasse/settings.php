<div id="subhead">
    <a class="gohigher" href="<?php echo Yii::app()->baseUrl;?>/index.php/klasse"></a>
    Mein digitaler Klassenraum mit der Klasse <?php echo $klasse->name;?>
</div>

<div id="main" class="sharing">  
    <div id="leftarea">   
         <div class="whitebox">
            <div class="whiteboxcontent">
                <a title="Zurück zur Klasse" href="../kommunikation/<?php echo $klasse->id;?>">
                    <img class="imgleftalign" src="<?php echo Yii::app()->request->baseUrl;?>/images/icon_default_class.png" width="100%"/>
                    <h2><span class="linkstyle"><b><?php echo $klasse->name;?></b></span></h2>
                    <p><a title="Zurück zur Klasse" href="../kommunikation/<?php echo $klasse->id;?>">Zurück zum Klassenraum</a></p>
                </a>
                
                <p class="meta"></p>
            </div>
            <div class="whiteboxlist">
                <ul>
                    <li> <?php echo $klasse->memberCount;?> Mitglied<?php if($klasse->memberCount != 1) echo "er";?> <span class="grey">(<?php echo $klasse->connectCodesCount;?> Einladungen)</span></li>
                </ul>
                <?php foreach ($schuelerliste->data as $schueler){
                        echo "<div class='floatleft' style='margin-right:2px; text-align:center;'>";
                        if($schueler->users->avatar == 'images/dummy_avatar.png' || $schueler->users->avatar === NULL || empty($schueler->users->avatar)){
                            echo "<span title='" .  $schueler->users->profile->firstname . " " . $schueler->users->profile->lastname . "' style='font-size:24px; color:#999; text-transform:uppercase; text-align:center; display: inline-block; outline:1px solid #ccc; margin-right:2px; width: 55px; line-height:55px;'>" . substr($schueler->users->profile->firstname,0,1).substr($schueler->users->profile->lastname,0,1) . "</span>"; 
                        }
                        else {
                           
                            echo "<img title=" .  $schueler->users->profile->firstname . " " . $schueler->users->profile->lastname . " width='55' src='" . Yii::app()->request->baseUrl . "/" . $schueler->users->avatar . "'/>";
                        }
                        echo "</div>";
                   }
                   echo "<div class='clearboth'></div>";
                   ?> 
            </div><!-- end whiteboxlist-->
            </div><!-- end whitebox-->        
    </div> <!-- end leftarea -->   
    
    <div id="rightarea">  
        <div class="whitebox">
            <div class="whiteboxcontent">
            <br />&nbsp;
                <h1>Einstellungen</h1>
                <br />&nbsp;
                <?php $this->renderPartial('_form_settings', array('model'=>$klasse)); ?>
                
                <h3><?php echo $klasse->memberCount;?> Mitglied<?php if($klasse->memberCount != 1) echo "er";?> in dieser Klasse</h3>
                <ul><?php  $this->widget('zii.widgets.CListView', array(
                    	'dataProvider'=>$schuelerliste,
                    	'itemView'=>'_singleschuelersettings',
                        'enablePagination'=>false,
                        'summaryText'=>false,
                        'emptyText'=>'Noch keine Schüler beigetreten. Haben Sie die Codes verteilt?'
                    )); ?>
                    </ul>
                    <h3>Ihre <?php echo $klasse->connectCodesCount; ?> angelegten Connectcodes</h3>
                    <?php foreach($klasse->connectCodes as $connectCode){
                        echo "<span style='width: 80px; display:inline-block;'>" . $connectCode->connectCode . "</span>"; 
                        if ($connectCode->status == 1){
                            echo " <span style='color:red;'>benutzt</span>"; // . $connectCode->user->profile->firstname . " " . $connectCode->user->profile->lastname ;
                        }
                        else{
                            echo " <span style='color:green;'>offen</span>";
                        }
                        echo "<br/>";
                    }?>
            </div>
        </div>
    </div><!-- End rightarea-->
</div><!-- end main-->

