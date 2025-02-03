import React, { useEffect } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';


const Editor = () => {
    useEffect(() => {
        async function init(){
            Codemirror.fromTextArea(document.getElementById('realTimeEditor'),{
                mode:{name:'javascript', json:true},
                theme:'dracula',
                autoCloseTag:true,
                autoCloseBrackets:true,
                lineNumbers:true,
            })
        }
        init()
    },[])
  return (
    <textarea id='realTimeEditor'placeholder='Start coding here...'></textarea>
  )
}

export default Editor
