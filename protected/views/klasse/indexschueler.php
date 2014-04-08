<?php
/* @var $this KlasseController */
/* @var $dataProvider CActiveDataProvider */
?>

    <script type="text/javascript">
         $(document).ready(function() {  
          pckry = new Packery( document.querySelector('#container'), { "itemSelector": ".kachel", "gutter": ".gutter-sizer" } );
          imagesLoaded( container, function() {               
              pckry.layout();
            });
        });
    </script>
    <div id="subhead">
    <a class="gohigher" href="<?php echo Yii::app()->baseUrl;?>"></a>
    Meine Klassenverwaltung
</div>

<!-- Start of the main content area -->
        <div id="main">
             <div id="container">  
             <div class="gutter-sizer"></div> 
             <div class="kachel nobackground dottedborder">
                <div class="kachelcontent ">
                    <p>&nbsp;</p>
                    <p class="textaligncenter">
                    <?php echo CHtml::link('+ &nbsp;&nbsp;neue Klasse anlegen', $this->createUrl('create'), array('class' => 'cta_button_red', 'id'=>'create_new_class'));?>
                    <p>&nbsp;</p>
                </div>
           </div>   

            <?php $this->widget('application.widgets.KachelCListView', array(
            	'dataProvider'=>$dataProvider,
            	'itemView'=>'_singleclasskachelschueler',
                'enablePagination'=>false,
                'summaryText'=>false,
            )); ?>
            </div>
        </div>