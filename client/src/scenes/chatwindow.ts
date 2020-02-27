import { Window } from "./window";
import { game } from "../api/game";

export class Chat extends Window {
    private text;
    private element;
    private gameinstance: game;
    private chatwindow: any;
    private chatlog: any;

    public constructor(key, gameinstance, windowData = { x: 10, y: 10, width: 350, height: 250 }) {
        super(key, windowData);
        this.gameinstance = gameinstance
        this.chatlog = []
        console.log('in constructo')
    }

    public init() {
        var self = this;
        this.gameinstance.getChatLog( function(chatlog) {
            setChatLog(chatlog)
        });
        function setChatLog(chatlog) {
            console.log(chatlog)
            self.chatlog = chatlog;
        }
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
                    //self.gameinstance.chatlog.push({})
                    console.log(self.chatlog)
                    self.populate()
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
        this.populate()

    }

    private populate() {
        //when window is reopened, populate it with the chatlog.
        console.log('populating')
        this.chatlog.forEach(element => {
            console.log(element)
            let p = document.createElement('p')
            p.append(element.author + ': ' + element.content)
            document.getElementById("history").append(p)
        });
    }

}