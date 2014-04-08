<?php

/**
 * This is the model class for table "post".
 *
 * The followings are the available columns in table 'post':
 * @property integer $id
 * @property string $title
 * @property string $content
 * @property integer $status
 * @property integer $createTime
 * @property integer $updateTime
 * @property integer $hasMaterial
 * @property integer $authorId
 * @property integer $klasseId
 *
 * The followings are the available model relations:
 * @property Comment[] $comments
 * @property User $author
 * @property Klasse $klasse
 */
class Post extends CActiveRecord
{
	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return 'post';
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
			//DB removed since not from user: array('status, createTime, updateTime, hasMaterial, authorId, klasseId', 'numerical', 'integerOnly'=>true),
			array('title', 'length', 'max'=>128),
			// The following rule is used by search().
			// @todo Please remove those attributes that should not be searched.
			array('id, title, content, status, createTime, updateTime, hasMaterial, authorId, klasseId', 'safe', 'on'=>'search'),
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
			'postreplies' => array(self::HAS_MANY, 'PostReply', 'postId'),
			'author' => array(self::BELONGS_TO, 'YumUser', 'authorId'),
			'klasse' => array(self::BELONGS_TO, 'Klasse', 'klasseId'),
            'replyCount' => array(self::STAT, 'PostReply', 'postId')
		);
	}

	/**
	 * @return array customized attribute labels (name=>label)
	 */
	public function attributeLabels()
	{
		return array(
			'id' => 'ID',
			'title' => 'Betreff',
			'content' => 'Inhalt der Nachricht',
			'status' => 'Status',
			'createTime' => 'Create Time',
			'updateTime' => 'Update Time',
			'hasMaterial' => 'Has Material',
			'authorId' => 'Author',
			'klasseId' => 'Klasse',
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
		$criteria->compare('title',$this->title,true);
		$criteria->compare('content',$this->content,true);
		$criteria->compare('status',$this->status);
		$criteria->compare('createTime',$this->createTime);
		$criteria->compare('updateTime',$this->updateTime);
		$criteria->compare('hasMaterial',$this->hasMaterial);
		$criteria->compare('authorId',$this->authorId);
		$criteria->compare('klasseId',$this->klasseId);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}

	/**
	 * Returns the static model of the specified AR class.
	 * Please note that you should have this exact method in all your CActiveRecord descendants!
	 * @param string $className active record class name.
	 * @return Post the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}
    
    protected function beforeSave()
    {
        if(parent::beforeSave())
        {
            if($this->isNewRecord)
            {
                $this->createTime=$this->updateTime=time();
                $this->authorId=Yii::app()->user->id;
                $this->status = 1;
            }
            else
                $this->updateTime=time();
            return true;
        }
        else
            return false;
    }
}
