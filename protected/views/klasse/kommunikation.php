<div id="subhead">
    <a class="gohigher" href="<?php echo Yii::app()->baseUrl;?>/index.php/klasse"></a>
    Meine Kommunikation mit <?php echo $klasse->name;?>
</div>

<div id="main" class="sharing">  
    <div id="leftarea">   
         <div class="whitebox">
            <div class="whiteboxcontent">
                <img class="imgleftalign" src="<?php echo Yii::app()->request->baseUrl;?>/images/icon_default_class.png" width="100%"/>
                <h2><span class="linkstyle"><b><?php echo $klasse->name;?></b></span></h2>
                <p class="meta"></p>
            </div>
            <div class="whiteboxlist">
                <ul>
                    <li> <?php echo $klasse->memberCount;?> Mitglied<?php if($klasse->memberCount != 1) echo "er";?></li>
                    <li>Connectcode: <?php echo $klasse->connectCode;?></li>
                </ul>
            </div>
        </div>
        
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
        
        <div class="whitebox">
            <div class="whiteboxhead">
                Mitglieder dieser Klasse
            </div>
            <div class="whiteboxlist">
                <ul>
                    <?php $this->widget('zii.widgets.CListView', array(
                        	'dataProvider'=>$schuelerliste,
                        	'itemView'=>'_singleschuelerwidget',
                            'enablePagination'=>false,
                            'summaryText'=>false
                        )); ?>
                </ul>
            </div>
        </div>
        
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
        )); ?>
        </div><!-- end messageposts-->
    </div><!-- End rightarea-->
</div><!-- end main-->