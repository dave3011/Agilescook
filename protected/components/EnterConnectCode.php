<?php
class EnterConnectCode extends CInputWidget
{
    public $name_connectcode;
    public $attribute_connectcodefield;
    public $value_connectcodefield;
    public $placeholder_connectcodefield;
    public $submittext_enterconnectcode;
    
    function run(){
            
        echo CHtml::beginForm('', 'post', array(
            'id'=>'enterconnectcode-form'
        )); 
            ?>
            <p class="errormsg" style="display: none;"></p>
            <?php
            echo CHtml::textField('connectcodefield', '', array(
                'placeholder' =>$this->placeholder_connectcodefield,
            ));
            echo CHtml::submitButton($this->submittext_enterconnectcode);
            echo CHtml::endForm(); 
           ?>
           <script type="text/javascript">
 $('#enterconnectcode-form').on('submit', function(){
    send();

    return false;
    
 })
function send()
    {
 
   var data=$("#enterconnectcode-form").serialize();
   $('#enterconnectcode-form .errormsg').hide(); 
 
  $.ajax({
   type: 'POST',
    url: '<?php echo Yii::app()->createAbsoluteUrl("userDerKlasse/enterConnectCode"); ?>',
    data:data,
    success:function(data){                
                $('#enterconnectcode-form .errormsg').html(data).show();
                $('#connectcodefield').val('');
              },
   error: function(data) { // if error occured
         alert("Error occured. Please try again");
    },
 
  dataType:'html'
  });
 
}
</script>
<?php
    }
}
?>

