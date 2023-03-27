import './style.scss';
import './App.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'
import TitleCard from './Title/title';
import SimulateModel from './Title/popup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { MapContainer, TileLayer, useMap,Popup,Marker,Circle,Tooltip,CircleMarker } from 'react-leaflet'
import React, { useState,useMemo,useEffect,useLayoutEffect } from 'react';
import DataGraph from './Graph/graph';
import Doughnut_pred from './Graph/doughnut_graph';
import Logo from './MDK_logo_new.png';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

function App() {
  const [stationName,setStationName] = useState("Kolam Air Bukit Merah")
  const [jsonData,setJSONData] = useState([])
  const [pred_parit,setPred_parit] = useState([])
  const [pred_bagan,setPred_bagan] = useState([])
  const [isLoading,setIsLoading] = useState(true);
  const eventHandlers1 = useMemo(() => ({click() {setStationName("Kolam Air Bukit Merah")},}),[],)
  const eventHandlers2 = useMemo(() => ({click() {setStationName("Tanjung piandang")},}),[],)
  const eventHandlers3 = useMemo(() => ({click() {setStationName("Rumah Penjaga JPS di Parit Nibong Kedah")},}),[],)
  const eventHandlers4 = useMemo(() => ({click() {setStationName("Sg. Kerian di Rumah Pam Bandar Baharu")},}),[],)
  const eventHandlers5 = useMemo(() => ({click() {setStationName("Kolam Takongan di  Bkt Panchor P.Pinang (RHN)")},}),[],)
  const eventHandlers6 = useMemo(() => ({click() {setStationName("Sg. Kurau di Bt. 14 Batu Kurau")},}),[],)
  const eventHandlers7 = useMemo(() => ({click() {setStationName("Sg. Ijok di Bekalan Ijok")},}),[],)
  const eventHandlers8 = useMemo(() => ({click() {setStationName("Sg. Samagagah di Samagagah")},}),[],)
  
  var stationCode = "5006021"
  if (stationName === "Kolam Air Bukit Merah")
    stationCode = "5006021"
  if (stationName === "Tanjung piandang")
    stationCode = "TGPIANDANG"
  if (stationName === "Sg. Kerian di Rumah Pam Bandar Baharu")
    stationCode = "BANDARBAHARU"
  if (stationName === "Sg. Samagagah di Samagagah")
    stationCode = "5005005"
  if (stationName === "Sg. Ijok di Bekalan Ijok")
    stationCode = "5108005"
  if (stationName === "Sg. Kurau di Bt. 14 Batu Kurau")
    stationCode = "4907020"

  
  useEffect(()=>
      {
        const url1 = "https://us-central1-mdk-flood-detection.cloudfunctions.net/get_data?col=app&doc=latest_5data"
        const url2 = "https://us-central1-mdk-flood-detection.cloudfunctions.net/get_data?col=app&doc=current_pred_kheesh"
        const url3 = "https://us-central1-mdk-flood-detection.cloudfunctions.net/get_data?col=app&doc=current_pred_jeevan"
        const fetchData = async () => {
          const [response_data,response_pred_Parit,response_pred_Bagan] = await Promise.all([
          fetch(url1 , { method: 'GET',headers: {'Accept': 'application/json',},}),
          fetch(url2 , { method: 'GET',headers: {'Accept': 'application/json',},}),
          fetch(url3 , { method: 'GET',headers: {'Accept': 'application/json',},}),
          ])

          const featureData     = await response_data.json()
          const predData_Parit  = await response_pred_Parit.json()
          const predData_Bagan  = await response_pred_Bagan.json() 

          setJSONData(featureData);
          setPred_parit(predData_Parit);
          setPred_bagan(predData_Bagan);
          setIsLoading(false);
          // console.log(predData_Parit['prob']);
          }

          fetchData();
          
          
      },[])

  var dataHolder=[]
  for (const features in jsonData['data']){
    if(features.includes(stationCode))
    dataHolder.push(jsonData['data'][features])
  }

  if(isLoading){
    return (
    <div className="App" style={{backgroundImage: {Logo}}} id='cover-spin'>
      {/* <h1>hello bro</h1> */}
    </div>
    )}

  if (dataHolder.length === 1) //there is only rainfall or waterlevel
  {
    if(Object.keys(dataHolder[0][0]['value']).length === 2)
    {
      var datatype = 0;
      var title = 'Rainfall'
    }
    else
    {
      var datatype = 1;
      var title = 'Waterlevel'
    }
    
    return(
        <div className="App">
          <Row>
            <Col>
              <Row><TitleCard/></Row>   
              <Row>  
                <Col xs={12}>
                  <DataGraph stationName={stationName} stationCode = {stationCode} data= {dataHolder[0]} datatype={{datatype:datatype,title:title}} numofGraph={1} />
                </Col>
              </Row>
                <br/>
              <Row>
                <Col xs={6}>
                  <Card>
                    <Card.Body>
                        <strong>Parit Buntar</strong>
                        <br/>
                      <Doughnut_pred data={{currentPred:pred_parit['current_pred'], lime:JSON.parse(pred_parit['lime']), prob:pred_parit['prob']}} time={pred_parit['_timestamp']}/>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={6}>
                  <Card>
                    <Card.Body>
                      <strong>Bagan Serai/Kuala Kurau</strong>
                      <br/>
                    <Doughnut_pred data={{currentPred:pred_bagan['current_pred'], lime:JSON.parse(pred_bagan['lime']), prob:pred_bagan['prob']}} time={pred_bagan['_timestamp']}/>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <br/>
              <SimulateModel/>
            </Col>
           
            <Col>
            <MapContainer center={[5.0108 ,100.54101]} zoom={11.4} scrollWheelZoom={true} >
                        <TileLayer style={{fillColor:"blue"}} attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                        <Marker position={[5.0183,100.652778]} eventHandlers={eventHandlers1} 
                        // pathOptions={{ fillColor: 'blue' }} radius={600}
                        >
                          <Tooltip>Kolam Air Bukit Merah <br/> <b>(Sensor)</b></Tooltip>
                        </Marker>
                        <Marker position={[5.06997,100.38447]} eventHandlers={eventHandlers2} >
                          <Tooltip>Tanjung piandang <br/> <b>(Sensor)</b></Tooltip>
                        </Marker>
                        <Marker position={[5.095515,100.538394]} eventHandlers={eventHandlers4} >
                          <Tooltip>Sg. Kerian di Rumah Pam Bandar Baharu <br/> <b>(Sensor)</b></Tooltip>
                        </Marker>
                        <Marker position={[4.977639,100.779222]} eventHandlers={eventHandlers6} >
                          <Tooltip>Sg. Kurau di Bt. 14 Batu Kurau <br/> <b>(Sensor)</b></Tooltip>
                        </Marker>
                        <Marker position={[5.120606,100.804141]} eventHandlers={eventHandlers7}>
                          <Tooltip>Sg. Ijok di Bekalan Ijok <br/> <b>(Sensor)</b></Tooltip>
                        </Marker>
                        <Marker position={[5.066667,100.536944]} eventHandlers={eventHandlers8} >
                          <Tooltip>Sg. Samagagah di Samagagah <br/> <b>(Sensor)</b></Tooltip>
                        </Marker>

                        <Circle center={[5.128884, 100.632153]} pathOptions={{ color: 'red' }} radius={600}>
                          <Tooltip>Sekolah Kebangsaan Changkat <br/> <b>(Flood Evacuation Shelter)</b></Tooltip>
                        </Circle>
                        <Circle center={[4.998116867940919, 100.6272402924144]} pathOptions={{ color: 'red' }} radius={600}>
                          <Tooltip>Dewan Orang Ramai Kampung Alor Setanggok <br/> <b>(Flood Evacuation Shelter)</b></Tooltip>
                        </Circle>
                        <Circle center={[5.016808531723165, 100.60057702202226]} pathOptions={{ color: 'red' }} radius={600}>
                          <Tooltip>Sekolah Kebangsaan Parit Haji Aman <br/> <b>(Flood Evacuation Shelter)</b></Tooltip>
                        </Circle>
                        <Circle center={[4.774958365616027, 100.91253328318109]} pathOptions={{ color: 'red' }} radius={600}>
                          <Tooltip>Kampung Talang Masjid Community Hall<br/> <b>(Flood Evacuation Shelter)</b></Tooltip>
                        </Circle>
                        <Circle center={[5.141685779716576, 100.82368527068711]} pathOptions={{ color: 'red' }} radius={600}>
                          <Tooltip>Surau Kampung Teras Hilir<br/> <b>(Flood Evacuation Shelter)</b></Tooltip>
                        </Circle>
                        <Circle center={[5.005889089724553, 100.44933016122282]} pathOptions={{ color: 'red' }} radius={600}>
                          <Tooltip>Surau Haji Hassan, Kampung Baru Pandak Putih<br/> <b>(Flood Evacuation Shelter)</b></Tooltip>
                        </Circle>
                        
                  </MapContainer>
            </Col>
          </Row>
        </div>
    )
  }

  if(dataHolder.length===2)
  {
    if(Object.keys(dataHolder[0][0]['value']).length === 2){ //to check whetherfirst data is rainfall
      return (
        <div className="App">
          <Row>
            <Col >
              <Row><TitleCard/></Row>
              <Row>
                <Col xs={6}><DataGraph stationName={stationName} stationCode ={stationCode} data={dataHolder[0]} datatype={{datatype:0,title:"Rainfall"}} numofGraph={2}/></Col>
                <Col xs={6}><DataGraph stationName={stationName} stationCode ={stationCode} data={dataHolder[1]} datatype={{datatype:1,title:"Waterlevel"}} numofGraph={2}/></Col>
              </Row>
                <br/>
              <Row>
                <Col xs={6}>
                  <Card>
                    <Card.Body>
                        <strong>Parit Buntar</strong>
                        <br/>
                      <Doughnut_pred data={{currentPred:pred_parit['current_pred'], lime:JSON.parse(pred_parit['lime']), prob:pred_parit['prob']}} time={pred_parit['_timestamp']}/>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={6}>
                  <Card>
                    <Card.Body>
                        <strong>Bagan Serai/Kuala Kurau</strong>
                        <br/>
                      <Doughnut_pred data={{currentPred:pred_bagan['current_pred'], lime:JSON.parse(pred_bagan['lime']), prob:pred_bagan['prob']}} time={pred_bagan['_timestamp']}/>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <br/>
              <SimulateModel/>
            </Col>
            
                    <Col>
                    <MapContainer center={[5.0108 ,100.54101]} zoom={11.4} scrollWheelZoom={true} >
                        <TileLayer style={{fillColor:"blue"}} attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                        <Marker position={[5.0183,100.652778]} eventHandlers={eventHandlers1} 
                        // pathOptions={{ fillColor: 'blue' }} radius={600}
                        >
                          <Tooltip>Kolam Air Bukit Merah <br/> <b>(Sensor)</b></Tooltip>
                        </Marker>
                        <Marker position={[5.06997,100.38447]} eventHandlers={eventHandlers2} >
                          <Tooltip>Tanjung piandang <br/> <b>(Sensor)</b></Tooltip>
                        </Marker>
                        <Marker position={[5.095515,100.538394]} eventHandlers={eventHandlers4} >
                          <Tooltip>Sg. Kerian di Rumah Pam Bandar Baharu <br/> <b>(Sensor)</b></Tooltip>
                        </Marker>
                        <Marker position={[4.977639,100.779222]} eventHandlers={eventHandlers6} >
                          <Tooltip>Sg. Kurau di Bt. 14 Batu Kurau <br/> <b>(Sensor)</b></Tooltip>
                        </Marker>
                        <Marker position={[5.120606,100.804141]} eventHandlers={eventHandlers7}>
                          <Tooltip>Sg. Ijok di Bekalan Ijok <br/> <b>(Sensor)</b></Tooltip>
                        </Marker>
                        <Marker position={[5.066667,100.536944]} eventHandlers={eventHandlers8} >
                          <Tooltip>Sg. Samagagah di Samagagah <br/> <b>(Sensor)</b></Tooltip>
                        </Marker>

                        <Circle center={[5.128884, 100.632153]} pathOptions={{ color: 'red' }} radius={600}>
                          <Tooltip>Sekolah Kebangsaan Changkat <br/> <b>(Flood Evacuation Shelter)</b></Tooltip>
                        </Circle>
                        <Circle center={[4.998116867940919, 100.6272402924144]} pathOptions={{ color: 'red' }} radius={600}>
                          <Tooltip>Dewan Orang Ramai Kampung Alor Setanggok <br/> <b>(Flood Evacuation Shelter)</b></Tooltip>
                        </Circle>
                        <Circle center={[5.016808531723165, 100.60057702202226]} pathOptions={{ color: 'red' }} radius={600}>
                          <Tooltip>Sekolah Kebangsaan Parit Haji Aman <br/> <b>(Flood Evacuation Shelter)</b></Tooltip>
                        </Circle>
                        <Circle center={[4.774958365616027, 100.91253328318109]} pathOptions={{ color: 'red' }} radius={600}>
                          <Tooltip>Kampung Talang Masjid Community Hall<br/> <b>(Flood Evacuation Shelter)</b></Tooltip>
                        </Circle>
                        <Circle center={[5.141685779716576, 100.82368527068711]} pathOptions={{ color: 'red' }} radius={600}>
                          <Tooltip>Surau Kampung Teras Hilir<br/> <b>(Flood Evacuation Shelter)</b></Tooltip>
                        </Circle>
                        <Circle center={[5.005889089724553, 100.44933016122282]} pathOptions={{ color: 'red' }} radius={600}>
                          <Tooltip>Surau Haji Hassan, Kampung Baru Pandak Putih<br/> <b>(Flood Evacuation Shelter)</b></Tooltip>
                        </Circle>
                        
                  </MapContainer>
                    </Col>
          </Row>
        </div>
      );
    }
    else{ //if the first data is waterlevel
      return (
        <div className="App">
          <Row>
            <Col >
              <Row><TitleCard/></Row>
              <Row>
                  <Col xs={6}><DataGraph stationName={stationName} stationCode ={stationCode} data={dataHolder[1]} datatype={{datatype:0,title:"Rainfall"}} numofGraph={2}/></Col>
                  <Col xs={6}><DataGraph stationName={stationName} stationCode ={stationCode} data={dataHolder[0]} datatype={{datatype:1,title:"Waterlevel"}} numofGraph={2}/></Col>
              </Row>
                <br/>
              <Row>
                <Col xs={6}>
                  <Card>
                    <Card.Body>
                        <strong>Parit Buntar</strong>
                        <br/>
                      <Doughnut_pred data={{currentPred:pred_parit['current_pred'], lime:JSON.parse(pred_parit['lime']), prob:pred_parit['prob']}} time={pred_parit['_timestamp']}/>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={6}>
                  <Card>
                    <Card.Body>
                      <strong>Bagan Serai/Kuala Kurau</strong>
                      <br/>
                    <Doughnut_pred data={{currentPred:pred_bagan['current_pred'], lime:JSON.parse(pred_bagan['lime']), prob:pred_bagan['prob']}} time={pred_bagan['_timestamp']}/>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <br/>
              <SimulateModel/>
            </Col>
            
              <Col >
                <MapContainer center={[5.0108 ,100.54101]} zoom={11.4} scrollWheelZoom={true} >
                        <TileLayer style={{fillColor:"blue"}} attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                        <Marker position={[5.0183,100.652778]} eventHandlers={eventHandlers1} 
                        // pathOptions={{ fillColor: 'blue' }} radius={600}
                        >
                          <Tooltip>Kolam Air Bukit Merah <br/> <b>(Sensor)</b></Tooltip>
                        </Marker>
                        <Marker position={[5.06997,100.38447]} eventHandlers={eventHandlers2} >
                          <Tooltip>Tanjung piandang <br/> <b>(Sensor)</b></Tooltip>
                        </Marker>
                        <Marker position={[5.095515,100.538394]} eventHandlers={eventHandlers4} >
                          <Tooltip>Sg. Kerian di Rumah Pam Bandar Baharu <br/> <b>(Sensor)</b></Tooltip>
                        </Marker>
                        <Marker position={[4.977639,100.779222]} eventHandlers={eventHandlers6} >
                          <Tooltip>Sg. Kurau di Bt. 14 Batu Kurau <br/> <b>(Sensor)</b></Tooltip>
                        </Marker>
                        <Marker position={[5.120606,100.804141]} eventHandlers={eventHandlers7}>
                          <Tooltip>Sg. Ijok di Bekalan Ijok <br/> <b>(Sensor)</b></Tooltip>
                        </Marker>
                        <Marker position={[5.066667,100.536944]} eventHandlers={eventHandlers8} >
                          <Tooltip>Sg. Samagagah di Samagagah <br/> <b>(Sensor)</b></Tooltip>
                        </Marker>

                        <Circle center={[5.128884, 100.632153]} pathOptions={{ color: 'red' }} radius={600}>
                          <Tooltip>Sekolah Kebangsaan Changkat <br/> <b>(Flood Evacuation Shelter)</b></Tooltip>
                        </Circle>
                        <Circle center={[4.998116867940919, 100.6272402924144]} pathOptions={{ color: 'red' }} radius={600}>
                          <Tooltip>Dewan Orang Ramai Kampung Alor Setanggok <br/> <b>(Flood Evacuation Shelter)</b></Tooltip>
                        </Circle>
                        <Circle center={[5.016808531723165, 100.60057702202226]} pathOptions={{ color: 'red' }} radius={600}>
                          <Tooltip>Sekolah Kebangsaan Parit Haji Aman <br/> <b>(Flood Evacuation Shelter)</b></Tooltip>
                        </Circle>
                        <Circle center={[4.774958365616027, 100.91253328318109]} pathOptions={{ color: 'red' }} radius={600}>
                          <Tooltip>Kampung Talang Masjid Community Hall<br/> <b>(Flood Evacuation Shelter)</b></Tooltip>
                        </Circle>
                        <Circle center={[5.141685779716576, 100.82368527068711]} pathOptions={{ color: 'red' }} radius={600}>
                          <Tooltip>Surau Kampung Teras Hilir<br/> <b>(Flood Evacuation Shelter)</b></Tooltip>
                        </Circle>
                        <Circle center={[5.005889089724553, 100.44933016122282]} pathOptions={{ color: 'red' }} radius={600}>
                          <Tooltip>Surau Haji Hassan, Kampung Baru Pandak Putih<br/> <b>(Flood Evacuation Shelter)</b></Tooltip>
                        </Circle>
                        
                  </MapContainer>
              </Col>
          </Row>
        </div>
      );
    }
 
  }
}

export default App;
