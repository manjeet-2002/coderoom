import { useState } from 'react';
import './App.css';
import axios from 'axios';
import CodeMirror from "@uiw/react-codemirror";
import {dracula} from "@uiw/codemirror-theme-dracula";
import { loadLanguage } from '@uiw/codemirror-extensions-langs';
import {ToastContainer,toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {BarLoader} from "react-spinners";
import { FaGithub } from 'react-icons/fa';


function App() {
  

  const [code,setCode] = useState("");
  const [loading,setLoading] = useState(false);
  const [output,setOutput] = useState("Your output will be here ...");

  const notify = () => toast.error("Server Down!",{
                            position:"bottom-right",
                            theme:'colored',
                            hideProgressBar:true,
                            autoClose:3000,
                            pauseOnFocusLoss:false,
                            
                          });
 
  // const [output,setOutput] = useState("");
  const handleRun = async () => {
   
    setLoading(true);
    const payload = {
      language : "cpp",
      content:code
    };

    try{

      const result = await axios.post("http://localhost:3001/run", payload);
      setOutput(result.data.codeOutput);

    } catch(error){
      
      if (error.message==="Network Error") {
        notify();
      } else {
        const res = error.response.data.err.stderr;
        const stderrs = res.split("C:");
        let err="";
        stderrs.map((stderr) => {
          err+=stderr.split("\\").slice(-1)[0];
        });
        setOutput(err);
      }
    }
    setLoading(false);
  };



  return (
    <div className="App">
      <div className='header'>
        <h1>CodeRooms</h1>
        <button className='github'><FaGithub/> GitHub</button>
      </div>
      <hr/>

      <div className='ide'>
        <CodeMirror
          height='75vh'
          width='50vw'
          
          theme={dracula}
          value={"hello world"}
          extensions={[loadLanguage('cpp')]}
          onChange={(editor,change)=>{
            setCode(editor);
          }}
        />
        <div className='output'>
          {!loading?<tt>{output}</tt>:
            <BarLoader 
              color={"white"}
              width="100%"
              />}
        </div>

      </div>
      <div className='run-bar'>
      <button className='run' onClick={handleRun}>Run</button>

      </div>
      <ToastContainer/>

    </div>
  );
}

export default App;
