   var leftpanelopen = 0;
   var rightpanelopen = 0;
   var detailssaved = 0;
   var materialadded = 0;
   var materialadded4share = 0;
   
   var umaextended=1;
   var partnerextended=1;
   var ownextended=1;
   
   var lessondetails = "?thema=Material zur Unterrichtsstunde";
   var materiallist = "";
    var materiallist4share = "";
   
   
   
   function updateStage(){
    
            buchseite = (m_Banshee.p_GetCurrentStage() - 1) * 2;
            
            //$('#currentStage').html( "Materialien zu Seite " + buchseite + "/" + (buchseite + 1) );
            
            // get random material number in case of many stages
            //var randommaterial = Math.ceil(Math.random()*9);
            
            //if(rightpanelopen == 1){
               loadMaterials(m_Banshee.p_GetCurrentStage()); 
               console.log("Aktuelle Stage " + m_Banshee.p_GetCurrentStage());
            //}
        }
   
    function loadMaterials(stageId, hotspots){
        if (hotspots === undefined){hotspots = "";}
        $uma = $('#umamaterials');      
        $uma.addClass('loading');
        $.ajax({
                url: '../../bv_data/materials/' + stageId + '_umamaterials' + hotspots + '.html', 
                success: function(data) {
                    $uma.html(data);  
                }
            }).error(function(){
                $uma.removeClass('loading');
                $uma.html("<p class='smaller' style='padding:8px; font-style:italic;'>Ein Fehler ist aufgetreten, die Unterrichtsmanager-Materialien konnten nicht geladen werden</p>");  
            }).success(function(){
               $uma.removeClass('loading');
        });
        
        $own = $('#ownmaterials');      
        $own.addClass('loading');
        $.ajax({
                url: '../../bv_data/materials/' + stageId + '_ownmaterials.html', 
                success: function(data) {
                    $own.html(data);  
                }
            }).error(function(){
                $own.removeClass('loading');
                $own.html("<p class='smaller' style='padding:8px; font-style:italic;'>Ein Fehler ist aufgetreten, die eigenen Materialien konnten nicht geladen werden</p>");  
            }).success(function(){
               $own.removeClass('loading');
        });
        
        $partner = $('#partnermaterials');      
        $partner.addClass('loading');
        $.ajax({
                url: '../../bv_data/materials/' + stageId + '_partnermaterials.html', 
                success: function(data) {
                    $partner.html(data);  
                }
            }).error(function(){
                $partner.removeClass('loading');
                $partner.html("<p>Ein Fehler ist aufgetreten, die Partner-Materialien konnten nicht geladen werden</p>");  
            }).success(function(){
               $partner.removeClass('loading');
        });
      }
        
   $(document).ready(function() {
       $('#toggle_left_column').on('click', function(){
        togglePanelLeft();
       });
       $('#toggle_right_column').on('click', function(){
         togglePanelRight();
       });
       
       /* Toggle Panel LEFT */
        function togglePanelLeft(){
           if(leftpanelopen == 0){//Left panel closed -> OPEN it
              if(rightpanelopen == 0){
                    $('#content_main').css('width','70%');
              }
              else{
                    $('#content_main').css('width','50%');
              }
              
              $('#left_column').css('width','25%');
              $('#toggle_left_column').css('width','20%');
              $('#left_column_content, #heading_left_column, #gohigher_left_column').show();
              $('#toggle_left_clickarea').addClass('close');
             
              leftpanelopen = 1;  
              resizeStage();
            }       
           else if(leftpanelopen == 1){//Left panel open -> CLOSE it
              if(rightpanelopen == 0){
                    $('#content_main').css('width','90%');
              }
              else{
                    $('#content_main').css('width','70%');
              }
              $('#left_column').css('width','5%');
              $('#toggle_left_column').css('width','100%');
              $('#left_column_content, #heading_left_column, #gohigher_left_column').hide();
              $('#toggle_left_clickarea').removeClass('close');

              leftpanelopen = 0;
              resizeStage();
           } 
           else {
            alert("weird state left panel");
           }         

           return true;
        }
        
        /* Toggle Panel RIGHT */
        function togglePanelRight(){
           if(rightpanelopen == 0){//right panel closed -> OPEN it
              if(leftpanelopen == 0){
                    $('#content_main').css('width','70%');
              }
              else{
                    $('#content_main').css('width','50%');
              }
              
              $('#right_column').css('width','25%');
              $('#toggle_right_column').css('width','20%');
              $('#right_column_content, #heading_right_column, #gohigher_right_column').show();
              $('#materials, #usercontent, #currentStage').show();  
              $('#toggle_right_clickarea').addClass('close');
              
              rightpanelopen = 1;  
              resizeStage();
            }       
           else if(rightpanelopen == 1){//Right panel open -> CLOSE it
              if(leftpanelopen == 0){
                    $('#content_main').css('width','90%');
              }
              else{
                    $('#content_main').css('width','70%');
              }
              $('#right_column').css('width','5%');
              $('#toggle_right_column').css('width','100%');
              $('#materials, #usercontent, #currentStage, #heading_right_column, #gohigher_right_column').hide();
              $('#toggle_right_clickarea').removeClass('close');

              rightpanelopen = 0;
              resizeStage();
           } 
           else {
            alert("weird state right panel");
           }         

           return true;
        }       
        
        
        function formValidated( $form ){
            var empty = 0;
            $('input,select', $form).each(function(){
                $(this).removeClass('formerror');
            	if( !$(this).val() ){
            		empty++;
                    $(this).addClass('formerror');
               }
            });
            $('#errormsg').html("<p>Bitte füllen Sie Pflichtfelder aus und klicken Sie auf 'Unterrichtsstunde anlegen'.</p>");
            return (( empty==0 ) ? true : false );
        }
        
        
        /* After clicking "Jetzt Unterricht planen" */
        $('#plan_lesson').on('click', function(){
            $('#lessondetails').fadeIn('slow');  
            $('.create_lesson').hide();
        });
        
        /* After submitting the lesson detail infos (subject, class, details) */
        $('#submitlessondetails').on('click', function(){
          if( formValidated($('#lessondetailsform')) === true){
            $('#lessondetails').show();
            var fach = $('#fach').val();
            var klasse = $('#klasse').val();
            var thema = $('#thema').val();
            var stundendetails = $('#stundendetails').val();
            
               var data=$("#lessondetailsform").serialize();
             
              $.ajax({
               type: 'POST',
                url: '../stunde/ajaxCreate',
                data:data,
                success:function(data){                
                            $('#lessondetails').html(data).show();
                          },
               error: function(data) { // if error occured
                     alert("Error occured. Please try again");
                },
             
              dataType:'html'
              });
            
            $('#lessondetails').html(
                '<div class="success"><p>Stunde erfolgreich angelegt</p></div><div class="fach">' + fach + '</div><div class="klasse">' + klasse +  '</div>' +
                '<strong><span class="bigger green">' + thema + '</span></strong><br/>' +               
                '<span class="smaller">' + stundendetails + '</span>'               
            );
            $('#lessondetails .success').delay(1500).slideUp('slow');
            $('#lessondetailsform').hide();
            $('#lessonmaterial').fadeIn();
            togglePanelRight();     
          } 
          detailssaved = 1;
          $('#exportlesson').attr('download', fach + "_" + klasse + "_" + thema + '.zip');
          lessondetails = '?fach=' + fach + '&klasse=' + klasse + '&thema=' + thema + '&stundendetails=' + stundendetails;
        });
        
        
        
        $('#materials').on('click', '.material',function(){         
           $('.material').removeClass("material_active");
           $(this).addClass("material_active");
           $('.detailinfo').hide();
           $(this).children('.detailinfo').toggle();
        });
        
        $('#materials').on('click', '.addtolesson', function(){
           $('.create_lesson').hide();
           $('#lessonmaterial .info').slideUp();
           $('#lessondetails, #lessonmaterial').show();
           if(materialadded == 0){
               materialadded = 1;
               $('#materiallist').html(''); 
           }
           $('#lesson_actions').show();
           if(leftpanelopen == 0){
              togglePanelLeft(); 
           }        
           $('#materiallist').append("<li>" + $(this).data('file') + "<div class='lessonmaterial_sub'><a class='removefromlesson'>Aus der Stunde entfernen</a></div></li>");
           materiallist = materiallist + "§" + $(this).data('file'); //The weird '§' is for separating the entries, needs to be changed
           $(this).removeClass('addtolesson').addClass('addedtolesson').html('<i>Hinzugefügt</i>');
           //$('#lessonmaterial').html($(this).data('file'));          
        });

        $('#materials').on('click', '.addtoshare', function(){
           $('.create_lesson').hide();
           $('#lessonmaterial .info').slideUp();
           $('#lessondetails, #lessonmaterial').show();
           if(materialadded4share == 0){
               materialadded4share = 1;
               $('#materiallist4share').html(''); 
           }
          
           $('#share_actions').show();
           if(leftpanelopen == 0){
              togglePanelLeft(); 
           }        
           $('#materiallist4share').append("<li>" + $(this).data('file') + "<div class='lessonmaterial_sub'><a class='removefromlesson'>Entfernen</a></div></li>");
           materiallist4share = materiallist4share + "§" +$(this).data('file'); //The weird '§' is for separating the entries, needs to be changed
           $(this).removeClass('addtoshare').addClass('addedtoshare').html('<i>Hinzugefügt</i>');
           //$('#lessonmaterial').html($(this).data('file'));          
        });
        
        $('#materiallist').on('click', 'li',function(){
           $(this).addClass("material_active");
           $(this).siblings('li').removeClass("material_active");
           $('.lessonmaterial_sub').hide();
           $(this).children('.lessonmaterial_sub').toggle();
        });
        
        $('#materiallist').on('click', '.removefromlesson',function(){
            $(this).parents('li').remove();
        });
        
        
        
        $('#savelessonbutton').on('click', function(){          
           if(detailssaved == 1){
                $('#save_lesson').addClass('success').html("<p>Die Stunde wurde gespeichert und der Liste Ihrer Unterrichtsstunden hinzugefügt.</p>").delay(2000).slideUp('slow');
                $('#use_lesson').show();            
                $('#printlesson').attr('href', 'php/print.php' + lessondetails + '&materiallist=' + materiallist); 
           }
            else {
                formValidated($('#lessondetailsform'));
            }       
        });
        
        
        $('#sharenowbutton').on('click', function(){   
            $('#sharematerial').addClass('success').html("<p>Das Material wurde erfolgreich mit Ihren Schülern geteilt.</p>").delay(2000).slideUp('slow');
            $('#gotoshared').show();        
            $('#gotosharedbutton').attr('href', 'sharing.php' +lessondetails + '&materiallist4share=' + materiallist4share); 
        });
        
        
        $('#sharelaterbutton').on('click', function(){         
           if(detailssaved == 1){
                $('#sharematerial').addClass('success').html("<p>Das Material wurde gespeichert und kann später mit den Schülern geteilt werden</p>").delay(2000).slideUp('slow');
                $('#sharesavedmaterial').show();            
           }
            else {
                formValidated($('#lessondetailsform'));
            }       
        });
        
     
     
     $('#filteruma').on('click', function(){
         $('#umamaterials').toggle(); 
     });
     $('#filterown').on('click', function(){
        $('#ownmaterials').toggle(); 
     });
     $('#filterpartner').on('click', function(){
         $('#partnermaterials').toggle();   
     });
     /*
     function toggleUmaMaterials(){        
        if($('#filteruma').is(':checked')){
            console.log('hide');
            $('#umamaterials').hide(); 
            $('#filteruma').removeAttr('checked');         
        }
        else{              
           $('#umamaterials').show(); 
           $('#filteruma').prop('checked', true);
           console.log('show');
        }
     }
     
      function togglePartnerMaterials(){        
        if($('#filterpartner').is(':checked')){
            console.log('hide');
            $('#partnermaterials').hide(); 
            $('#filterpartner').removeAttr('checked');         
        }
        else{              
           $('#partnermaterials').show(); 
           $('#filterpartner').prop('checked', true);
           console.log('show');
        }
     }
     
      function toggleOwnMaterials(){        
        if($('#filterown').is(':checked')){
            console.log('hide');
            $('#ownmaterials').hide(); 
            $('#filterown').removeAttr('checked');         
        }
        else{              
           $('#ownmaterials').show(); 
           $('#filterown').prop('checked', true);
           console.log('show');
        }
     }*/
     
     

       
       
       
        
     $('#uploadfilebutton').on('click', function(){
         $('#uploadcontent, #cancelbutton').show();
         $('#addlink, #uploadfilebutton, #addlinkbutton').hide();
     });  
     
      $('#addlinkbutton').on('click', function(){
         $('#addlink, #cancelbutton').show();
         $('#uploadcontent, #uploadfilebutton, #addlinkbutton').hide();
     }); 
     
     $('#cancelbutton').on('click', function(){
         $('#uploadcontent, #addlink, #cancelbutton').hide();
         $('#uploadfilebutton, #addlinkbutton').show();
     }); 
     
     $('#fileuploadfile').change(function(){
         $('#fileuploadsubmit').show();
     });   
     
    

        
        
    $('#fileuploadsubmit').on('click', function(){
        var filename = $('#fileuploadfile').val();
    });
        
    var fileuploadoptions = { 
    beforeSend: function() 
    {
        $("#progress").show();
        //clear everything
        $("#bar").width('0%');
        $("#message").html("");
        $("#percent").html("0%");
    },
    uploadProgress: function(event, position, total, percentComplete) 
    {
        $("#bar").width(percentComplete+'%');
        $("#percent").html(percentComplete+'%');
    },
    success: function() 
    {
        $("#bar").width('100%');
        $("#percent").html('100%');
        var filename = $('#fileuploadfile').val().replace(/.*(\/|\\)/, '');;
        $('#uploadcontent, #addlink, #cancelbutton').hide(); 
        $('#uploadsuccess').show();      
        setTimeout(function() {
            $('#uploadsuccess').fadeOut(function(){
              $('#uploadfilebutton, #addlinkbutton').show();  
            });          
        }, 2000);
        $(".material_active").removeClass('material_active');
        $('.detailinfo').hide();
        $('#partnermaterials, #umamaterials').hide();
        $('#filteruma, #filterpartner').removeAttr('checked');
        $('#ownmaterials').show();
        $('#filterown').prop('checked', true);
        $('#ownmaterials').prepend("<div class='material material_active own'><h5>" + filename + "</h5><div class='detailinfo show'><p></p><a class='addtolesson' data-file='" + filename + "'>Verwenden</a>&nbsp;<a class='play' target='_blank' href='uploads/" + filename + "'>Ansehen</a></div></div>");
    },
    complete: function(response) 
    {
        $("#message").html("<font color='green'>Completed"+response.responseText+"</font>");
    },
    error: function()
    {
        $("#message").html("<font color='red'> ERROR: unable to upload files</font>");
 
    }
 
    }; 
   
           
   
     $("#fileuploadform").ajaxForm(fileuploadoptions);
        
    }); //end document ready
    
    
  