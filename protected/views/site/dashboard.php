<?php
/* @var $this SiteController */

$this->pageTitle=Yii::app()->name;
?>
 <script type="text/javascript">
         $(document).ready(function() {
            pckry = new Packery( document.querySelector('#container'), { "itemSelector": ".kachel", "gutter": ".gutter-sizer" } );
            imagesLoaded( container, function() {           
             var itemElems = pckry.getItemElements();
                // for each item...
                for ( var i=0, len = itemElems.length; i < len; i++ ) {
                  var elem = itemElems[i];
                  // make element draggable with Draggabilly
                  var draggie = new Draggabilly( elem, {
                    handle: '.kachelhead'
                  });
                  // bind Draggabilly events to Packery
                  pckry.bindDraggabillyEvents( draggie );
                } 
              
              pckry.layout();
            });
        });
    </script>
        <!-- Start of the main content area -->
        <div id="main">        
            <div id="container"> 
                <div class="gutter-sizer"></div>      
                
                <div class="kachel rot widget">
                    <div class="kachelhead schueler_icon">Meine Klassen</div>
                    <div class="kachelcontent">
                    
                    <?php $this->widget('zii.widgets.CListView', array(
                        	'dataProvider'=>$dataProvider,
                        	'itemView'=>'_singleclass',
                            'enablePagination'=>false,
                            'summaryText'=>false
                        )); ?>
                    </div> 
                    <div class="kachelfoot">
                        <?php echo CHtml::link('Zur Klassenverwaltung ...<span class="scookicons">&#58942;</span>', $this->createUrl('//klasse'), array());?>
                    </div>                    
                </div>
                
                <div class="kachel grau">
                     <div class="kachelcontent">
                         <?php $this->widget('EnterConnectCode', array(
                            'submittext_enterconnectcode' => 'Go',
                            'placeholder_connectcodefield' => 'Connectcode hier eingeben'
                         )); ?>
                     </div>
                </div>
                
                <div class="kachel blau widget">
                    <div class="kachelhead buecher_icon">Meine Bücher</div>
                    <div class="kachelcontent">
                        <ul class="widgetitems">
                            <li>
                                <table>
                                    <tr>
                                        <td valign="top" width="40%"><a href="buchansicht.php"><img src="images/englishg.png" width="130" height="178"/></a></td>
                                        <td valign="top"><b><span class="bigger">English G 21</span><br /></b><br />5. Schuljahr<br />Ausgabe D1 - Band 1<br /><span class="smaller">Schülerbuch</span></td>
                                    </tr>
                                </table>
                            </li>
                            <li>
                                <table>
                                    <tr>
                                        <td valign="top" width="40%"><a href="buchansicht.php"><img src="images/fundamente.png" width="130" height="180"/></a></td>
                                        <td valign="top"><b><span class="bigger">Fundamente der Mathematik</span><br /></b><br />6. Schuljahr<br />Baden-Württemberg<br /><span class="smaller">Lehrerfassung</span></td>
                                    </tr>
                                </table>
                            </li>
                        </ul>
                    </div> 
                    <div class="kachelfoot">
                        <a href="buchregal.php">Zu meinem Bücherregal ...<span class="scookicons">&#58942;</span></a>
                    </div>                    
                </div>
                
                
                <div class="kachel lila widget">
                    <div class="kachelhead weiterwissen_icon">Weiterwissen</div>
                    <div class="kachelcontent">
                        <ul class="widgetitems">
                            <li>
                                <table>
                                    <tr>
                                        <td valign="top"><a href="weiterwissen.php"><img src="images/weiterwissen_1.png" width="145" height="90"/></a></td>
                                        <td valign="top"><span class="smaller">Hinweise zu heutigen Standards</span><br /><b>Qualitätskriterien erfolgreicher Elternarbeit</b></td>
                                    </tr>
                                </table>
                            </li>
                            <li>
                                <table>
                                    <tr>
                                        <td valign="top"><a href="weiterwissen.php"><img src="images/weiterwissen_2.png" width="145" height="96"/></a></td>
                                        <td valign="top"><span class="smaller">Hinweise zu heutigen Standards</span><br /><b>Qualitätskriterien erfolgreicher Elternarbeit</b></td>
                                    </tr>
                                </table>
                            </li>
                             <li>
                                <table>
                                    <tr>
                                        <td valign="top"><a href="weiterwissen.php"><img src="images/weiterwissen_3.png" width="145" height="96"/></a></td>
                                        <td valign="top"><span class="smaller">Hinweise zu heutigen Standards</span><br /><b>Qualitätskriterien erfolgreicher Elternarbeit</b></td>
                                    </tr>
                                </table>
                            </li>
                        </ul>
                    </div> 
                    <div class="kachelfoot">
                        <a href="weiterwissen.php">Zur Weiterwissen-Übersicht ...<span class="scookicons">&#58942;</span></a>
                    </div>                    
                </div>          
                
                <div class="kachel blau">
                    <div class="kachelhead freischalten_icon">Jetzt E-Book freischalten</div>
                    <div class="kachelcontent">
                       <form id="freischalte_widget" method="post" action="buchansicht.php">
                                <input type="text" placeholder="Lizenzcode eingeben" id="freischalten_textfeld" name="freischalten_textfeld"/>                             
                                <input type="submit" value="" class="cta_button_white inputsubmit"/>                            
                            </form>
                            <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br />
                        <p>Der Code in Ihrem Schulbuch erlaubt Ihnen die (kostenlose) Nutzung des E-Books auf scook.</p>
                    </div> 
                    <div class="kachelfoot">
                        <a href="#">Demobuch anschauen ...<span class="scookicons">&#58942;</span></a>
                    </div>                    
                </div>                
                
                <div class="kachel orange">
                    <div class="kachelhead folder_icon">Unterrichtsmaterial finden</div>
                    <div class="kachelcontent">
                        <p>Suchen Sie in unserer riesigen Datenbank nach passendem Material für Ihren Unterricht:</p>
                            <form id="materialsuche_widget" method="post" action="material.php">
                                <input type="text" placeholder="Stichwort eingeben" id="materialsuche_textfeld" name="materialsuche_textfeld"/>                             
                                <input type="submit" value="" class="cta_button_white inputsubmit"/>                            
                            </form>     
                    </div> 
                    <div class="kachelfoot">
                        <a href="#">Zu den Unterrichtsmaterialien ...<span class="scookicons">&#58942;</span></a>
                    </div>                    
                </div>
                
                <div class="kachel gruen widget">
                    <div class="kachelhead grid_icon">Meine Unterrichtsstunden</div>
                    <div class="kachelcontent">
                         <ul class="widgetitems">
                            <li>
                                <span class="smaller">Mathematik</span><br /> 
                                <b><span class="bigger">Klasse 7a: Addition von Brüchen</span></b><br />
                                <p>Zweiter Teil der Reihe zur Addition von Brüchen, Fokus auf Kopfrechnen ...</p>
                                
                            </li>
                            <li>
                                <span class="smaller">Englisch</span><br /> 
                                <b><span class="bigger">Klasse 8b: The pink Panther</span></b><br />
                                <p>Fun introductory lesson for Simple Past...</p>
                                
                            </li>
                            <li>
                                <span class="smaller">Mathematik</span><br /> 
                                <b><span class="bigger">Klasse 12: Lineare Algebra</span></b><br />
                                <p>Ableitungen von Gleichungen</p>
                                
                            </li>
                         </ul>
                    </div> 
                    <div class="kachelfoot">
                        <a href="meine-unterrichtsstunden.php">Zu meinen Unterrichtsstunden ...<span class="scookicons">&#58942;</span></a>
                    </div>                    
                </div>
                
                <div class="kachel grau">
                    <div class="kachelhead">Entdecken Sie scook im Video</div>
                    <div class="kachelcontent vollbild">
                        <img src="images/image_video.png" width="301" height="177"/>
                    </div>                    
                </div>    

                
                <div class="kachel grau">
                    <div class="kachelhead">Ihre Vorteile als Lehrer</div>
                    <div class="kachelcontent">
                        <p>Nur mit einem Nachweis, dass Sie wirklich Lehrer sind können Sie von allen Vorteilen profitieren.</p>
                        <p class="textaligncenter"><a href="#" class="cta_button_blue">Jetzt als Lehrer authentifizieren</a></p>
                    </div>                    
                </div>
                
            </div>
        </div><!-- end main -->

