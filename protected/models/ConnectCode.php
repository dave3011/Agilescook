<?php

/**
 * This is the model class for table "connectcode".
 *
 * The followings are the available columns in table 'connectcode':
 * @property integer $id
 * @property string $connectCode
 * @property string $klasseId
 * @property string $userId
 * @property integer $createTime
 * @property integer $status
 *
 * The followings are the available model relations:
 * @property Klasse $klasse
 * @property User $user
 */
class ConnectCode extends CActiveRecord
{
	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return 'connectcode';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			// The following rule is used by search().
			// @todo Please remove those attributes that should not be searched.
			array('id, connectCode, klasseId, userId, createTime, status', 'safe', 'on'=>'search'),
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
			'klasse' => array(self::BELONGS_TO, 'Klasse', 'klasseId'),
			'user' => array(self::BELONGS_TO, 'YumUser', 'userId'),
		);
	}

	/**
	 * @return array customized attribute labels (name=>label)
	 */
	public function attributeLabels()
	{
		return array(
			'id' => 'ID',
			'connectCode' => 'Connect Code',
			'klasseId' => 'Klasse',
			'userId' => 'User',
			'createTime' => 'Create Time',
			'status' => 'Status',
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
		$criteria->compare('connectCode',$this->connectCode,true);
		$criteria->compare('klasseId',$this->klasseId,true);
		$criteria->compare('userId',$this->userId,true);
		$criteria->compare('createTime',$this->createTime);
		$criteria->compare('status',$this->status);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}

	/**
	 * Returns the static model of the specified AR class.
	 * Please note that you should have this exact method in all your CActiveRecord descendants!
	 * @param string $className active record class name.
	 * @return ConnectCode the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}
    
}
