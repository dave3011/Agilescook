<?php /* @var $this Controller */ ?>
<?php $this->beginContent('//layouts/main_red'); ?>
<div id="main" class="sharing">   
    <div id="leftarea">   
         <div class="whitebox">
            <div class="whiteboxcontent">
                <img class="imgleftalign" src="images/klasse_8a.jpg" width="100%"/>
                <h2><span class="linkstyle"><b><?php if (isset($_GET['klasse'])){echo $_GET['klasse'];} else echo "Klasse 5a";?></b></span></h2>
                <p class="meta">Englisch, Mathematik, Sport</p>
            </div>
            <div class="whiteboxlist">
                <ul><li>Mitglieder (24)</li></ul>
            </div>
        </div>
        
        <div class="whitebox">
            <div class="whiteboxhead">
                Untergruppen
            </div>
            <div class="whiteboxlist">
                <ul>
                    <li>Fördergruppe</li>
                    <li>Leistungsgruppe</li>
                </ul>
            </div>
        </div>
        
        <div class="whitebox">
            <div class="whiteboxhead">
                Andere Klassen
            </div>
            <div class="whiteboxlist">
                <ul>
                    <li>Klasse 7a</li>
                    <li>Klasse 5a</li>
                    <li>Klasse 12e  </li>
                </ul>
            </div>
        </div>
        
    </div> <!-- end leftarea -->             
            
    <div id="rightarea">        
        <?php echo $content; ?>
    </div> <!-- end rightarea-->     
            
<?php $this->endContent(); ?>