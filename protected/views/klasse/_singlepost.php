<?php
/* @var $this PostController */
/* @var $data Post */
?>


<div class="whitebox">
    <div class="whiteboxcontent">
        <div class="message_area">
            <?php 
                if(empty($data->author->avatar)){
                    echo CHtml::image(Yii::app()->baseUrl . "/images/dummy_avatar.png", $data->author->profile->firstname, array('width'=>75, 'class'=>'imgleftalign'));
                }
                else{
                    echo CHtml::image(Yii::app()->request->baseUrl . "/" . $data->author->avatar, $data->author->profile->firstname, array('width'=>75, 'class'=>'imgleftalign'));    
                }               
            ?>
            <p class="message_head">
                <span class="linkstyle">
                    <?php if($data->authorId == Yii::app()->user->id){echo "Ich";} else { echo $data->author->profile->firstname . " " . $data->author->profile->lastname;} ?> 
                </span>
                an 
                <span class="linkstyle">
                    <?php echo CHtml::encode($data->klasse->name); ?>
                </span> 
                um 
                <span class="meta"><?php echo date('F j, Y \a\t h:i a',$data->createTime); ?></span>
            </p>
            <p class="message"><b><?php echo CHtml::encode($data->title); ?></b></p>
            <p class="message"><?php echo CHtml::encode($data->content); ?></p>  
        </div>
    </div>
    
    <div class="message_replies">
            <?php if($data->replyCount>=1): ?>
                <p><br />
                    &nbsp;&nbsp;<?php  if($data->replyCount==1){echo $data->replyCount . ' Antwort';} else {echo $data->replyCount . ' Antworten';} ?>
                    <br />&nbsp;
                </p>
         
                <?php $this->renderPartial('_postreplies',array(
                    'postreplies'=>$data->postreplies,
                )); ?>
            <?php endif; ?>
    </div>
    <div class="type_reply">
    
    <?php $this->renderPartial('_postreplyform', array(
        'model'=>PostReply::model(),
        'post'=>$data->id,
        'klasse'=>$data->klasseId
        )); ?>
    </div>
</div>   