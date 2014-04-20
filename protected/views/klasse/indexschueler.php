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

            <?php $this->widget('application.widgets.KachelCListView', array(
            	'dataProvider'=>$dataProvider,
            	'itemView'=>'_singleclasskachelschueler',
                'enablePagination'=>false,
                'summaryText'=>false,
            )); ?>
            </div>
        </div>