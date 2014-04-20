<div id="subhead">
    <a class="gohigher" href="<?php echo Yii::app()->baseUrl;?>/index.php/klasse"></a>
    Mein digitaler Klassenraum mit der Klasse <?php echo $klasse->name;?>
</div>

<div id="main" class="sharing">  
    <div id="leftarea">   
         <div class="whitebox">
            <div class="whiteboxcontent">
                <img class="imgleftalign" src="<?php echo Yii::app()->request->baseUrl;?>/images/icon_default_class.png" width="100%"/>
                <h2><span class="linkstyle"><b><?php echo $klasse->name;?></b></span></h2>
                <p><a href="../settings/<?php echo $klasse->id;?>">Einstellungen</a></p>
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
        <!--
        <div class="whitebox">
            <div class="whiteboxhead">
                Andere Klassen
            </div>
            <div class="whiteboxlist">
                <ul>
                <?php $this->widget('zii.widgets.CListView', array(
                        	'dataProvider'=>$klassenliste,
                        	'itemView'=>'_singleclasswidget',
                            'enablePagination'=>false,
                            'summaryText'=>false
                        )); ?>
                </ul>
            </div>
        </div>
        -->
       <!-- <div class="whitebox">
            <div class="whiteboxhead">
                Mitglieder dieser Klasse
            </div>
            <div class="whiteboxlist">
                
                <ul>
                   <?php /* $this->widget('zii.widgets.CListView', array(
                    	'dataProvider'=>$schuelerliste,
                    	'itemView'=>'_singleschuelerwidget',
                        'enablePagination'=>false,
                        'summaryText'=>false
                    )); */?>
                </ul>
                
                <div class="clearfix">
                   <?php foreach ($schuelerliste->data as $schueler){
                        echo "<div class='floatleft' style='width:55px; height:55px; overflow:hidden; margin-right:2px; text-align:center; line-height:55px;'><img title=" .  $schueler->users->profile->lastname . " " . $schueler->users->profile->lastname . " width='55' src='" . Yii::app()->request->baseUrl . "/" . $schueler->users->avatar . "'/></div>";
                   }?> 
                </div>
                
            </div><!-- end whitebox list-->
        <!--</div><!-- end whitebox-->
    </div> <!-- end leftarea -->   
    
    <div id="rightarea">  
        <div class="whitebox">
            <div class="whiteboxcontent">
                <h3><span class="scookicons">&#58956; </span>Nachricht an ihre Schüler</h3>
                <?php $this->renderPartial('_createpostform', array(
                    'model'=>Post::model(),
                    'klasse'=>$klasse,
                )); ?>
            </div>
        </div>
        
        <div id="messageposts">
        <?php $this->widget('zii.widgets.CListView', array(
        	'dataProvider'=>$dataProvider,
        	'itemView'=>'_singlepost',
            'summaryText'=>'',
            'emptyText'=>'Noch keine Posts vorhanden'
        )); ?>
        </div><!-- end messageposts-->
    </div><!-- End rightarea-->
</div><!-- end main-->