import { Window } from "./window";
import * as io from "socket.io-client";

export class Chat extends Window {
    private socket;
    private text;
    public constructor (key, windowData={x:10, y:10, width: 350, height: 250}){
        super(key, windowData);
    }

    public preload() {
        this.load.html('chatform', './assets/chat.html');
    }

    protected initialize(){
        console.log("chat window create", this)
        this.text = "";
        this.cameras.main.setBackgroundColor(0xffffff)

        var element = this.add.dom(200,220).createFromCache('chatform');
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
                    this.text.setText('Welcome ' + inputText.value);
                }
            }
    
        });

    }

}