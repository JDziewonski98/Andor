import { Window } from "./window";
import { game } from "../api/game";


export class dropgoldwindow extends Window {
    private text;
    private element;
    private gameinstance: game;
    private chatwindow: any;

    public constructor(key, data, windowData = { x: 10, y: 10, width: 1, height: 1 }) {
        super(key, windowData);
        this.gameinstance = data.controller
        /**
        var self = this;
        this.gameinstance.recieve(function update(msg) {
            self.gameinstance.appendToChatLog(msg)
            var paragraph = document.createElement('p');
            paragraph.append(msg);
            try {
                document.getElementById("history").append(paragraph);
            }
            catch {
                console.log('error in adding chat info to history')
            }

        })
         */
    }

    public preload() {
        this.load.html('dropgoldform', './assets/dropgold.html');
    }

    protected initialize() {
        //console.log(this)
        var self = this;
        this.text = "";
        this.cameras.main.setBackgroundColor(0xffffff)

        this.element = this.add.dom(200, 140).createFromCache('dropgoldform');

        this.element.addListener('click');
        this.element.on('click', function (event) {

            //to drop some gold to the tile
            if (event.target.name === 'dropButton') {
                var inputText = this.getChildByName('inputField');
                console.log("clicking on drop")
                console.log(inputText.value)
                //  must have some input amount
                if (inputText.value !== '') {
                    console.log('here1') //not printed
                    event.preventDefault();
                    //check  if input is a number
                    if (!isNaN(inputText.value)) {
                        //function to call in client api
                        console.log('herexxxxxxxxxxxxx') //not printed
                        /*self.gameinstance.dropGold(new Number(inputText.value), function () {
                            inputText.value = "drop attempted!";
                        })*/
                    }
                    else {
                        inputText.value = "enter a valid number!"
                    }


                    /*self.gameinstance.send(inputText.value, function (msg) {
                        inputText.value = "";
                        //update(msg)
                    })*/

                }
            }
            //to retrieve some gold from tile
            /*else if (event.target.name === 'pickupButton') {
                var inputText = this.getChildByName('inputField');
                //  Have they entered anything?
                if (inputText.value !== '') {
                    event.preventDefault();
                    //check  if input is a number
                    if (!isNaN(inputText.value)) {
                        //function to call in client api

                        //TODO: implement pickupGold()

                        *//*self.gameinstance.pickupGold(new Number(inputText.value), function () {
                            inputText.value = "pickup attempted!";
                        })*//*
                    }
                    else {
                        inputText.value = "enter a valid number!"
                    }
            }*/
        });
        /**
        function update(msg) {

            console.log(msg)
            self.gameinstance.appendToChatLog(msg)
            var paragraph = document.createElement('p');
            paragraph.append(msg);
            try {
                document.getElementById("history").append(paragraph);
            }
            catch {
                console.log('error in adding chat info to history')
            }

        }

        this.gameinstance.getChatLog().forEach(element => {
            let p = document.createElement('p')
            p.append(element)
            document.getElementById("history").append(p)
        });
        */
    }

}