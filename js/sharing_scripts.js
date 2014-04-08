var filesadded = 0;
var fileslist = ""; 

   $(document).ready(function() {
       $('#messageform').submit(function() { // catch the form's submit event 
            $.ajax({ // create an AJAX call...
                data: $(this).serialize(), // get the form data
                type: $(this).attr('method'), // GET or POST
                url: $(this).attr('action'), // the file to call
                success: function(response) { // on success..
                    $('#message_text').val("");
                    $('#messageposts').prepend(response); // update the DIV
                }
            });
            fileslist = "";  
            $('#message_files').html('<ul></ul>');   
        return false; // cancel original event to prevent form submitting
        }); 
        
        $('#message_file').on('change', function(){
            var filename = $(this).val(); 
            $('#message_files ul').append("<li class='delete_file'><a title='Datei entfernen'><img src='images/delete.png'/></a> <span class='smaller'>&nbsp;&nbsp;" + filename +"</span><li>");
            $(this).val("");
            fileslist = fileslist + "§" + filename;
            $('#file_list').val(fileslist);
        });
        
         $('#message_files').on('click', '.delete_file', function(){
            $(this).remove();
         });
        
        $('#communicationcontrol').on('click', function(){
            $('.type_reply').toggle();
        })
        
        
        $('#messageposts').on('submit', '.type_reply_form', function() { // catch the form's submit event
                $this = $(this); 
                    $.ajax({ // create an AJAX call...
                    data: $(this).serialize(), // get the form data
                    type: $(this).attr('method'), // GET or POST
                    url: $(this).attr('action'), // the file to call
                    success: function(response) { // on success..
                        $this.children('.reply_input').val("");
                        $this.parents('.whitebox').find('.message_replies').append(response);// update the DIV
                    }
                });      
            return false; // cancel original event to prevent form submitting
            }); 
        
        
        //Show details of form when Focussing in Messagefield
        $( "#message_text" ).focus(function() {
            $(this).css('height', '90px');
            $(this).addClass('focused');
            $('#message_options').show();
        });
        
        $( "#message_text" ).focusout(function() {
            $(this).removeClass('focused');
        });
        
        
        
        //Show details of form when Focussing in materialfind-textfield
        $( "#materialsuche_textfeld" ).focus(function() {
            $(this).addClass('focused');
        });
        
        $( "#materialsuche_textfeld" ).focusout(function() {
            $(this).removeClass('focused');
        });
        
        
        //Show details of form when Focussing in replyinput field
        $( "#messageposts" ).on('focus', ".reply_input", function() {
            $this = $(this);
            $this.addClass('focused');
            $this.css('width', '80%')
            $this.siblings('.inputsubmit').show();
        });
        
        $( "#messageposts" ).on('focus', ".reply_input", function() {
            $(this).removeClass('focused');
        });
   }); //end document ready
    
    
    
    function formValidated( $form ){
            var empty = 0;
            $('textarea', $form).each(function(){
                $(this).removeClass('formerror');
            	if( !$(this).val() ){
            		empty++;
                    $(this).addClass('formerror');
               }
            });
            $('#errormsg').html("<p>Bitte geben Sie eine Nachricht ein.</p>");
            return (( empty==0 ) ? true : false );
        }