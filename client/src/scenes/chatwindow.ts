import { Window } from "./window";
import * as io from "socket.io-client";

export class Chat extends Window {
    private socket;
    public constructor (key, windowData={}){
        super(key, windowData);
    }

    public preload() {
        this.load.html('chatform', './assets/chat.html');
    }

    protected initialize(){
        console.log("chat window create")
        this.cameras.main.setBackgroundColor(0xffffff)

        var text = this.add.text(300, 10, 'Please enter your name', { color: 'white', fontSize: '20px '});
        var element = this.add.dom(this.windowData.x, this.windowData.y + 30).createFromCache('chatform');
        element.addListener('click');
        element.on('click', function (event) {
    
            if (event.target.name === 'playButton')
            {
                //**** logic for sending message should go here ****
                var inputText = this.getChildByName('nameField');
    
                //  Have they entered anything?
                if (inputText.value !== '')
                {
                    //  Turn off the click events
                    this.removeListener('click');
    
                    //  Hide the login element
                    this.setVisible(false);
    
                    //  Populate the text with whatever they typed in
                    text.setText('Welcome ' + inputText.value);
                }
            }
    
        });

    }

}