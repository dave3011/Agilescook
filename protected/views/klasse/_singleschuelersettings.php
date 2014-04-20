<?php
/* @var $this KlasseController */
/* @var $data Klasse */
?>
<li>
<table>
    <tr>
        <td>
          <?php 
          if($data->users->avatar === NULL || empty($data->users->avatar)){
                echo "<span title='" .  $data->users->profile->firstname . " " . $data->users->profile->lastname . "' style='font-size:24px; color:#999; text-transform:uppercase; text-align:center; display: inline-block; outline:1px solid #ccc; margin-right:2px; width: 55px; line-height:55px;'>" . substr($data->users->profile->firstname,0,1).substr($data->users->profile->lastname,0,1) . "</span>"; 
            }
            else {                           
                echo "<img title=" .  $data->users->profile->firstname . " " . $data->users->profile->lastname . " width='55' src='" . Yii::app()->request->baseUrl . "/" . $data->users->avatar . "'/>";
            }
          ?>
            
        </td>
        <td>
            &nbsp;&nbsp;<?php echo $data->users->profile->firstname . " " . $data->users->profile->lastname; ?>
        </td>
         
    </tr>
</table>

<!--<?php echo CHtml::link($data->users->profile->firstname, $this->CreateUrl('/klasse/kommunikation/', array('id'=>$data->id)));?>-->
</li>
