import { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {

  const [code,setCode] = useState("");
  const [output,setOutput] = useState("Your output will be here ...");
 
  // const [output,setOutput] = useState("");
  const handleRun = async () => {
    
    const payload = {
      language : "cpp",
      content:code
    };

    try{
     const result = await axios.post("http://localhost:3001/run", payload);
     setOutput(result.data.codeOutput);
    
    } catch(error){
      
      const result = error.response.data.err.stderr;
      const stderrs = result.split("C:");
      let err="";
      stderrs.map((stderr) => {
       err+=stderr.split("\\").slice(-1)[0];
      });
      setOutput(err);
    }
   
  };

  return (
    <div className="App">
      <div className='header'>
        <h1>Online Code Compiler</h1>
        <button className='github'>Github</button>
      </div>
      <hr/>

      <div className='ide'>

        <textarea className='code'
          value={code} 
          onChange={(e)=>{
            setCode(e.target.value)
          }}
          rows={30} 
          cols={100} placeholder='write code here ...'></textarea>

        <div className='output'><tt>{output}</tt></div>

      </div>

      <button className='run' onClick={handleRun}>Run</button>
      
    </div>
  );
}

export default App;
