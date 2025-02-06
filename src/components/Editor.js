import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import ACTIONS from '../Actions';


const Editor = ({socketRef, roomId}) => {
  const editorRef = useRef(null)

    useEffect(() => {
        async function init(){
            editorRef.current = Codemirror.fromTextArea(document.getElementById('realTimeEditor'),{
                mode:{name:'javascript', json:true},
                theme:'dracula',
                autoCloseTag:true,
                autoCloseBrackets:true,
                lineNumbers:true,
            })

            

            editorRef.current.on('change', (instance, changes) => {
              console.log('changes', changes)
              const {origin} = changes 
              const code = instance.getValue() // copies content of the editor to the code variable
              if(origin !== 'setValue'){
                socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                  roomId,
                  code
                })
              }

            }) 
            // change is an event that is fired when the content of the editor is changed.
            // instance and changes are the parameters that are passed to the callback function. 
            // These parameters are used to get the instance of the editor and the changes that are made in the editor.

            
          }
        init()
    }, [])

    // the socketref does not load initially and may not receive data on time.
    useEffect(() => {
      if(socketRef.current){
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({code}) => {
        if(code !== null){
          editorRef.current.setValue(code)
        }
      })
    }
    }, [socketRef.current]) 


  return (
    <textarea id='realTimeEditor'placeholder='Start coding here...'></textarea>
  )
}

export default Editor
