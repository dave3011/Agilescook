<?php

/**
 * This is the model class for table "klasse".
 *
 * The followings are the available columns in table 'klasse':
 * @property integer $id
 * @property string $userId
 * @property string $name
 * @property string $studentCommunication
 * @property integer $createTime
 * @property integer $deleted
 *
 * The followings are the available model relations:
 * @property User $user
 * @property Post[] $posts
 * @property Stunde[] $stundes
 * @property UserDerKlasse[] $userDerKlasses
 */
class Klasse extends CActiveRecord
{
    /**
     * @return string the associated database table name
     */
    public function tableName()
    {
        return 'klasse';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules()
    {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('name', 'required'),
            array('name', 'length', 'max'=>50),
            array('studentCommunication', 'length', 'max'=>1),
            array('studentCommunication', 'numerical', 'integerOnly'=>true),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id, userId, name, studentCommunication, createTime, deleted', 'safe', 'on'=>'search'),
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
            'user' => array(self::BELONGS_TO, 'YumUser', 'userId'),
            'memberCount' => array(self::STAT, 'UserDerKlasse', 'klasseId'),
            'userDerKlasse' => array(self::HAS_MANY, 'UserDerKlasse', 'KlasseId'),
            'posts' => array(self::HAS_MANY, 'Post', 'klasseId'),
            'stunden' => array(self::HAS_MANY, 'Stunde', 'klasseId'), 
            'connectCodes' => array(self::HAS_MANY, 'ConnectCode', 'klasseId'),   
            'connectCodesCount' => array(self::STAT, 'ConnectCode', 'klasseId'),       
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels()
    {
        return array(
            'id' => 'ID',
            'userId' => 'User',
            'name' => 'Name der Klasse/ Lerngruppe',
            'studentCommunication' => 'Schüler dürfen Nachrichten schreiben',
            'createTime' => 'Create Time',
            'deleted' => 'Deleted',
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
        $criteria->compare('userId',$this->userId,true);
        $criteria->compare('name',$this->name,true);
        $criteria->compare('studentCommunication',$this->studentCommunication,true);
        $criteria->compare('createTime',$this->createTime);
        $criteria->compare('deleted',$this->deleted);

        return new CActiveDataProvider($this, array(
            'criteria'=>$criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return Klasse the static model class
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
                $this->createTime=time();
                $this->deleted=0;
            }
            else // DB: in case of update, e.g. for saving update time
                $this->userId=Yii::app()->user->id;
            return true;
        }
        else
            return false;
    }
}