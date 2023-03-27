import './graph.scss';
import Card from 'react-bootstrap/Card';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Line } from 'react-chartjs-2';
import { useState } from 'react';
import { useEffect } from 'react';
  
ChartJS.register(
CategoryScale,
LinearScale,
PointElement,
LineElement,
Title,
Tooltip,
Filler,
Legend
  );



// const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];


function DataGraph(props){
    // const json = "";
    
    // console.log(jsonData)
    // data['data']['rainfall_4907020'][0]['value']['60m']
    // console.log(json['rainfall_4907020'])
    const [label,setLabel] = useState()
    const [isLoading,setisLoading] =useState(false)
    const [dataTime,setDataTime] =useState([])
    const value = []
    const time  = []
    const xlabel = []

    const pushData=()=>{props.data.forEach((items)=>{ 
    time.push(items['time'])
    if (props.datatype.datatype === 0){
      value.push(items['value']['60m'])
    }
    if(props.datatype.datatype === 1){
      value.push(items['value'])
    }
  }
  
    )
}
  pushData();

    // for (const items in props.data){
    //   time.push(items['time'])
    // if (props.datatype.datatype === 0){
    //   value.push(items['value']['60m'])
    // }
    // else{
    //   value.push(items['value'])
    // }
    // }
    // time.push(props.data.xlabel)
    time.map((i)=>{
      xlabel.push(i.split("_")[1])
    })
    // useEffect(()=>{
    //   setDataValue(value)
    // },[]
    
    // )
    

    // console.log(time)
  
  
  

    // setDataTime(time)
    // setDataValue(value)
    
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' 
        },
        title: {
          display: true,
          text: time[0].split("_")[0],
        },
        
        
      },
    };
    const data = {
      labels: xlabel,
      datasets: [
        {
          fill: true,
          label: props.datatype.title,
          data: value,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: "rgba(53, 162, 235, 0.5)",
          
        }
      ],
    };
    // console.log(props.numofGraph)
    if (value[0]===null){
      setisLoading(true);
      return(
        <Card >
            <Card.Body>
                Loading ...
            </Card.Body>
        </Card>
)
    }
    else{
      if(props.numofGraph===1){
        return (
          <Card >
            <Card.Body><strong>{props.stationName}</strong>
            <div>
                <Line width ={11} height={3} options={options} data={data}  /> 
              </div>
            </Card.Body>
        </Card>
        )
      }
      return(
        <Card >
            <Card.Body><strong>{props.stationName}</strong>
                <Line options={options} data={data}  />
            </Card.Body>
        </Card>
)
    }
    
}

export default DataGraph;