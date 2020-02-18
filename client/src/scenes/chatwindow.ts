import { Window } from "./window";
import { send, recieve } from "../api/chat"

export class Chat extends Window {
    private text;
    private element;
    public constructor(key, windowData = { x: 10, y: 10, width: 350, height: 250 }) {
        super(key, windowData);
    }

    public preload() {
        this.load.html('chatform', './assets/chat.html');
    }

    protected initialize() {
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
                    send(inputText.value, function () {
                        inputText.value = "";
                    })
                }
            }

        });

        recieve(function (msg) {
            console.log(msg)
            var paragraph = document.createElement('p');
            paragraph.append(msg);
            document.getElementById("history").append(paragraph);
        })
        console.log("chat window create", this)

    }

}