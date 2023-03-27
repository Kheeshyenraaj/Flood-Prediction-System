import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import './graph.scss';
import GaugeChart from 'react-gauge-chart'
ChartJS.register(ArcElement, Tooltip, Legend);

function Doughnut_pred(props) {
    var chart_text = ""
    const limeStation = []
    const limeFeature = []
    const indicator   = []
    const predProba   = []
    const feature_words = ['waterlevel','heat_index','pressure','rainfall','rh','temp','uv_index','wspd']
    var textColorInsideDonut = ""
    if (props.data.currentPred==="No Flood")
    {
        var predData = [0,1]
        chart_text = "Low Risk of Flood"
        textColorInsideDonut = "navyblue"
    }
    else
    {
      textColorInsideDonut = "RGB(255,14,14)"
        var predData = [1,0]
        chart_text = "High Risk of Flood"
    }

    predProba.push((props.data.prob['Flood']) )
    predProba.push((props.data.prob['No Flood']))
    
    // predProba.push(0.6 * 100)
    // predProba.push((0.4 * 100))
    
    // console.log(Math.max.apply(null, predProba))
    for(let i = 0; i < 3; i++){
      for (const j in feature_words){
        
        if(props.data.lime[i][0].includes(feature_words[j])){
          limeFeature.push(feature_words[j])
          break;
        }
      }
      if(props.data.lime[i][1] < 0){
        indicator.push("Safe")
      }
      if(props.data.lime[i][1] >= 0){
        indicator.push("Unsafe")
      }
      // let temp = []
      // temp = props.data.lime[i][0].split(" ")
      // limeFeature.push(temp[0].split("_")[0])
      if(props.data.lime[i][0].includes("5006021")){
        limeStation.push("Kolam Air Bukit Merah")
      }
      if(props.data.lime[i][0].includes("TGPIANDANG")){
        limeStation.push("Tanjung piandang")
      }
      if(props.data.lime[i][0].includes("BANDARBAHARU")){
        limeStation.push("Sg. Kerian,Rumah Pam Bandar Baharu")
      }
      if(props.data.lime[i][0].includes("5005005")){
        limeStation.push("Sg. Samagagah")
      }
      if(props.data.lime[i][0].includes("5108005")){
        limeStation.push("Sg. Ijok,Bekalan Ijok")
      }
      if(props.data.lime[i][0].includes("4907020")){
        limeStation.push("Sg. Kurau,Bt. 14 Batu Kurau")
      }
    }
    
  return (
    
      <Col xs={12}>
        <Row>
          <div style={{width:"95%"}}>
            
            <GaugeChart
              id="gauge-chart3"
              nrOfLevels={10}
              colors={["green", "orange", "red"]}
              arcWidth={0.3}
              percent= {Math.round(predProba[0])}
              // percent= {0.5}
              textColor={'black'}
              hideText={true} // If you want to hide the text
            />
            <p className = 'gauge-text'>{predProba[0]*100}%</p>
          </div>
        </Row>
        <div style={{height:"50%"}}> 
          <Row className='mt-4'>
            {indicator[0]==='Unsafe'? 
            <Col className='border-right text-unsafe'><strong>{indicator[0]} {limeFeature[0]} at {limeStation[0]}</strong></Col>
            :
            <Col className='border-right text-safe'><strong>{indicator[0]} {limeFeature[0]} at {limeStation[0]}</strong></Col>
            }

             {indicator[1]==='Unsafe'? 
            <Col className='border-right text-unsafe'><strong>{indicator[1]} {limeFeature[1]} at {limeStation[1]}</strong></Col>
            :
            <Col className='border-right text-safe'><strong>{indicator[1]} {limeFeature[1]} at {limeStation[1]}</strong></Col>
            }

             {indicator[2]==='Unsafe'? 
            <Col className='text-unsafe'><strong>{indicator[2]} {limeFeature[2]} at {limeStation[2]}</strong></Col>
            :
            <Col className='text-safe'><strong>{indicator[2]} {limeFeature[2]} at {limeStation[2]}</strong></Col>
            }

          </Row> 
        </div>        
      </Col>  
     
  );
}
export default Doughnut_pred;
