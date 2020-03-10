import { Window } from "./window";
import { game } from "../api/game";

export class Chat extends Window {
    private text;
    private element;
    private gameinstance: game;
    private chatwindow: any;
    //private chatlog: any;
    //private populated: boolean;

    public constructor(key, data, windowData = { x: 10, y: 10, width: 350, height: 250 }) {
        super(key, windowData);
        this.gameinstance = data.controller
        // this.chatlog = []
        // this.populated = false;
        console.log('in constructo')
    }


    public preload() {
        this.load.html('chatform', './assets/chat.html');
    }

    protected initialize() {
        console.log(this)
        var self = this;
        this.text = "";
        this.cameras.main.setBackgroundColor(0xffffff)

        this.element = this.add.dom(200, 140).createFromCache('chatform');
        
        if (this.gameinstance.getChatLog().length == 0) { // only add click event if doesnt exist
            console.log(this.gameinstance.getChatLog().length)
            this.element.addListener('click');
        }

        this.element.on('click', function (event) {

            if (event.target.name === 'playButton' ) {
                var inputText = this.getChildByName('nameField');
                //  Have they entered anything?
                if (inputText.value !== '') {
                    event.preventDefault();
                    //self.gameinstance.chatlog.push({})
                    //console.log(self.chatlog)
                    //self.gameinstance.appendToChatLog(inputText.value)
                    self.gameinstance.send(inputText.value, function (msg) {
                        inputText.value = "";
                        update(msg)
                    })
                }
            }
        });

        function update(msg){
            
            console.log(msg)
            self.gameinstance.appendToChatLog(msg)
            var paragraph = document.createElement('p');
            paragraph.append(msg);
            try{
                document.getElementById("history").append(paragraph);
            }
            catch {
                console.log('error?')
            }
            
        }




        this.gameinstance.getChatLog().forEach(element => {
            let p = document.createElement('p')
            p.append(element)
            document.getElementById("history").append(p)
        });

        this.gameinstance.recieve(update)
        //this.populate()

    }



}