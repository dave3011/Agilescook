<?php

/**
 * This is the model class for table "stunde".
 *
 * The followings are the available columns in table 'stunde':
 * @property integer $id
 * @property string $titel
 * @property string $beschreibung
 * @property string $fach
 * @property integer $createTime
 * @property string $material
 * @property integer $updateTime
 * @property string $klasseId
 * @property string $userId
 *
 * The followings are the available model relations:
 * @property Klasse $klasse
 * @property User $user
 */
class Stunde extends CActiveRecord
{
	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return 'stunde';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('titel, klasseId, userId', 'required'),
			array('createTime, updateTime', 'numerical', 'integerOnly'=>true),
			array('titel, fach', 'length', 'max'=>155),
			array('klasseId, userId', 'length', 'max'=>10),
			array('beschreibung, material', 'safe'),
			// The following rule is used by search().
			// @todo Please remove those attributes that should not be searched.
			array('id, titel, beschreibung, fach, createTime, material, updateTime, klasseId, userId', 'safe', 'on'=>'search'),
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
			'user' => array(self::BELONGS_TO, 'User', 'userId'),
		);
	}

	/**
	 * @return array customized attribute labels (name=>label)
	 */
	public function attributeLabels()
	{
		return array(
			'id' => 'ID',
			'titel' => 'Titel',
			'beschreibung' => 'Beschreibung',
			'fach' => 'Fach',
			'createTime' => 'Create Time',
			'material' => 'Material',
			'updateTime' => 'Update Time',
			'klasseId' => 'Klasse',
			'userId' => 'User',
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
		$criteria->compare('titel',$this->titel,true);
		$criteria->compare('beschreibung',$this->beschreibung,true);
		$criteria->compare('fach',$this->fach,true);
		$criteria->compare('createTime',$this->createTime);
		$criteria->compare('material',$this->material,true);
		$criteria->compare('updateTime',$this->updateTime);
		$criteria->compare('klasseId',$this->klasseId,true);
		$criteria->compare('userId',$this->userId,true);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}

	/**
	 * Returns the static model of the specified AR class.
	 * Please note that you should have this exact method in all your CActiveRecord descendants!
	 * @param string $className active record class name.
	 * @return Stunde the static model class
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
                $this->userId=Yii::app()->user->id;
                $this->createTime = time();                
            }
            else // DB: in case of update, e.g. for saving update time
                $this->userId=Yii::app()->user->id;
            return true;
        }
        else
            return false;
    }
}
