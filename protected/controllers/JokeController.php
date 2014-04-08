<?php 
class JokeController extends Controller{
    private $jokes=array(
        array('jokeWitz 0', '<p>Was ist der Unterschied zwischen Lehrern und Gott?</p><p>Gott weiß alles, Lehrer wissen alles besser!</p>'),
        array('jokeWitz 1', '<p>"Peter, was weißt du von den alten Römern?", fragt der Lehrer.</p><p>Peter überlegt kurz und sagt dann: "Sie sind alle tot."</p>'),
        array('jokeWitz 2', '<p>Brief des Lehrers an die Eltern: "Ihr Sohn schwatzt im Unterricht zu viel. Bitte mit Unterschrift zurück."</p><p>Antwort des Vaters: "Sie sollten erst mal seine Mutter hören. Gezeichnet: Huber."</p>'),
        array('jokeWitz 3', '<p>Der Deutschlehrer trägt vor: "Ich gehe, du gehst, er geht, wir gehen, ihr geht, sie gehen. Fritzchen, kannst du mir sagen, was das bedeutet?"</p><p>"Tja, Ich würde sagen, alle sind weg!"</p>'),
        array('jokeWitz 4', '<p>Schüler: "Herr Lehrer, was heißt das, was Sie unter meinen Aufsatz geschrieben haben?"</p><p>Lehrer: "Du musst deutlicher schreiben!"</p>')        
    );
    
    public function GetRandomJoke(){
        return $this->jokes[array_rand($this->jokes, 1)];
    }
    
    function actionGetJoke(){
        $this->renderPartial('_joke', array(
            'joke'=>$this->getRandomJoke()
        ));
    } 
}