<?php

/**
 * This is the model class for table "post_reply".
 *
 * The followings are the available columns in table 'post_reply':
 * @property integer $id
 * @property string $content
 * @property integer $status
 * @property integer $createTime
 * @property string $authorId
 * @property integer $postId
 *
 * The followings are the available model relations:
 * @property User $author
 * @property Post $post
 */
class PostReply extends CActiveRecord
{
	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return 'post_reply';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('content', 'required'),
			array('status, createTime, postId', 'numerical', 'integerOnly'=>true),
			array('authorId', 'length', 'max'=>10),
			// The following rule is used by search().
			// @todo Please remove those attributes that should not be searched.
			array('id, content, status, createTime, authorId, postId', 'safe', 'on'=>'search'),
		);
	}

	/**
	 * @return array relational rules.
	 */
	public function relations()
	{
		// NOTE: you may need to adjust the relation name and the related
		// class name for the relations automatically generated below.
		return array(
			'author' => array(self::BELONGS_TO, 'YumUser', 'authorId'),
			'post' => array(self::BELONGS_TO, 'Post', 'postId'),
		);
	}

	/**
	 * @return array customized attribute labels (name=>label)
	 */
	public function attributeLabels()
	{
		return array(
			'id' => 'ID',
			'content' => 'Content',
			'status' => 'Status',
			'createTime' => 'Create Time',
			'authorId' => 'Author',
			'postId' => 'Post',
		);
	}

	/**
	 * Retrieves a list of models based on the current search/filter conditions.
	 *
	 * Typical usecase:
	 * - Initialize the model fields with values from filter form.
	 * - Execute this method to get CActiveDataProvider instance which will filter
	 * models according to data in model fields.
	 * - Pass data provider to CGridView, CListView or any similar widget.
	 *
	 * @return CActiveDataProvider the data provider that can return the models
	 * based on the search/filter conditions.
	 */
	public function search()
	{
		// @todo Please modify the following code to remove attributes that should not be searched.

		$criteria=new CDbCriteria;

		$criteria->compare('id',$this->id);
		$criteria->compare('content',$this->content,true);
		$criteria->compare('status',$this->status);
		$criteria->compare('createTime',$this->createTime);
		$criteria->compare('authorId',$this->authorId,true);
		$criteria->compare('postId',$this->postId);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}

	/**
	 * Returns the static model of the specified AR class.
	 * Please note that you should have this exact method in all your CActiveRecord descendants!
	 * @param string $className active record class name.
	 * @return PostReply the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}

     protected function beforeSave()
    {
        if(parent::beforeSave())
        {
            if($this->isNewRecord){
                $this->status = 1;
                $this->authorId = Yii::app()->user->id;
                $this->createTime=time();    
            }
            return true;
        }
        else
            return false;
    }

}
