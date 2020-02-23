import { Window } from "./window";
//import { send, recieve } from "../api/chat"
import { game } from "../api/game";

export class Chat extends Window {
    private text;
    private element;
    private gameinstance: game;

    public constructor(key, gameinstance, windowData = { x: 10, y: 10, width: 350, height: 250 }) {
        super(key, windowData);
        this.gameinstance = gameinstance
        console.log('in chatwindow:', gameinstance)
    }

    public preload() {
        this.load.html('chatform', './assets/chat.html');
    }

    protected initialize() {
        var self = this;
        this.text = "";
        this.cameras.main.setBackgroundColor(0xffffff)

        this.element = this.add.dom(200, 140).createFromCache('chatform');

        if (!this.element._events.click) { // only add click event if doesnt exist
            this.element.addListener('click');
        }
        this.element.on('click', function (event) {

            if (event.target.name === 'playButton') {
                var inputText = this.getChildByName('nameField');

                //  Have they entered anything?
                if (inputText.value !== '') {
                    event.preventDefault();
                    console.log('ok so we see theres text in chat input')
                    self.gameinstance.send(inputText.value, function (msg) {
                        inputText.value = "";
                        update(msg)
                    })
                }
            }

        });

        function update(msg){
            console.log(msg)
            var paragraph = document.createElement('p');
            paragraph.append(msg);
            document.getElementById("history").append(paragraph);
        }

        this.gameinstance.recieve(update)

    }

}