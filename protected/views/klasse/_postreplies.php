<?php 
/* @var $this PostController */
/* @var $data Post */
?>

<?php foreach($postreplies as $reply): ?>
<div class="message_reply" class="clearfix" id="reply_<?php echo $reply->id; ?>">
   <?php 
    if(empty($reply->author->avatar)){
                    echo CHtml::image(Yii::app()->baseUrl . "/images/dummy_avatar.png", $reply->author->profile->firstname, array('width'=>75, 'align'=>'left'));
                }
                else{
                    echo CHtml::image(Yii::app()->request->baseUrl . "/" . $reply->author->avatar, $reply->author->profile->firstname, array('width'=>40, 'align'=>'left'));    
                }   
    ?>
    <p class="message_head"><span class="linkstyle"><?php echo $reply->author->profile->firstname; echo " " . $reply->author->profile->lastname; ?> </span> <?php echo date('F j, Y \a\t h:i a',$reply->createTime); ?></p>
	<div class="message">
		<?php echo nl2br(CHtml::encode($reply->content)); ?>
	</div>

</div><!--  messae_reply -->
<?php endforeach; ?>

