import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'
import './titlestyle.scss';
import Logo from '.././MDK_logo_new.png';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import React, { useState } from 'react';
import Stack from 'react-bootstrap/Stack';

function SimulateModel(){
    const minMax = {
        dewPt                      :[60,100,"Dew Point"],
        heat_index                 :[70,100,"Heat Index"],
        pressure                   :[29,31,"Pressure"],
        rainfall_4907020_24h       :[0,90, "Rainfall Batu Kurau (24h)"],
        rainfall_4907020_60m       :[0,90, "Rainfall Batu Kurau (60m)"],
        rainfall_5005005_24h       :[0,90,"Rainfall Sg Samagagah (24h)"],
        rainfall_5005005_60m       :[0,90,"Rainfall Sg Samagagah (60m)"],
        rainfall_5006021_24h       :[0,90,"Rainfall Bukit Merah (24h)"],
        rainfall_5006021_60m       :[0,90, "Rainfall Bukit Merah (60m)"],
        rainfall_5108005_24h       :[0,90,"Rainfall Titi Ijok (24h)"],
        rainfall_5108005_60m       :[0,90,"Rainfall Titi Ijok (60m)"],
        rainfall_TGPIANDANG_24h    :[0,90,"Rainfall Tg. Piandang (24h)"],
        rainfall_TGPIANDANG_60m    :[0,90,"Rainfall Tg. Piandang (60m)"],
        rh                         :[40,100,"Relative Humidity (%)"],
        temp                       :[76,100,'Temperature (F)'],
        uv_index                   :[0,15, "Heat Index"],
        waterlevel_4907020         :[20,25.6,"Waterlevel Batu Kurau (m)"],
        waterlevel_5005005         :[0.8,2.4,"Waterlevel Sg Samagagah (m)"],
        waterlevel_5006021         :[8.2,9.4,"Waterlevel Bukit Merah (m)"],
        waterlevel_5108005         :[29,37,"Waterlevel Titi Ijok (m)"],
        waterlevel_BANDARBAHARU    :[0.35,2,"Waterlevel Bdr Baharu (m)"], //0.35,1.75
        wspd                       :[0,15,"Windspeed"],
    }
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const [img, setImg] = useState("");
    const [wait, setWait] = useState("");
    const handleClose = () => {
        setShow(false)
        setImg("");
        setInputslider({
        dewPt                      :77.00,
        heat_index                 :87.00,
        pressure                   :29.80,
        rainfall_4907020_24h       :14.00,
        // rainfall_4907020_60m       :0.00,
        rainfall_5005005_24h       :0.50,
        // rainfall_5005005_60m       :0.00,
        rainfall_5006021_24h       :3.50,
        // rainfall_5006021_60m       :0.00,
        rainfall_5108005_24h       :0.50,
        // rainfall_5108005_60m       :0.50,
        rainfall_TGPIANDANG_24h    :55.00,
        // rainfall_TGPIANDANG_60m    :0.00,
        rh                         :89.00,
        temp                       :81.00,
        uv_index                   :0.00,
        waterlevel_4907020         :21.90,
        waterlevel_5005005         :1.27,
        waterlevel_5006021         :8.67,
        waterlevel_5108005         :33.22,
        waterlevel_BANDARBAHARU    :0.94,
        wspd                       :4.00,
        })
    };
    const handleSubmit = async (req_type) => 
    {
        console.log(inputslider);
        // handleClose();
        setWait("Please wait")
        const requestOptions = 
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body : JSON.stringify(inputslider)
        };
        let response = fetch('https://cloud-model-4uqytml3sq-as.a.run.app/mock_data/'+req_type, requestOptions);
        if(req_type === 'web'){
            response = await response
            const data = await response.blob();
            const imageObjectURL = URL.createObjectURL(data);
            window.open(imageObjectURL, '_blank', 'noopener,noreferrer')
            setImg(imageObjectURL)
            setWait("");
        }
        else{
            alert("Processing Response, view output in Telegram")
            setWait("");
        }
        
    }
    const [inputslider,setInputslider] = useState
    ({
        dewPt                      :77.00,
        heat_index                 :87.00,
        pressure                   :29.80,
        rainfall_4907020_24h       :14.00,
        // rainfall_4907020_60m       :0.00,
        rainfall_5005005_24h       :0.50,
        // rainfall_5005005_60m       :0.00,
        rainfall_5006021_24h       :3.50,
        // rainfall_5006021_60m       :0.00,
        rainfall_5108005_24h       :0.50,
        // rainfall_5108005_60m       :0.50,
        rainfall_TGPIANDANG_24h    :55.00,
        // rainfall_TGPIANDANG_60m    :0.00,
        rh                         :89.00,
        temp                       :81.00,
        uv_index                   :0.00,
        waterlevel_4907020         :21.90,
        waterlevel_5005005         :1.27,
        waterlevel_5006021         :8.67,
        waterlevel_5108005         :33.22,
        waterlevel_BANDARBAHARU    :0.94,
        wspd                       :4.00,
    })
   const keys = Object.keys(inputslider)
//    console.log(inputslider)
    const handleChange = (e) =>{
        setInputslider({
            ...inputslider,
            [e.target.name]: parseFloat(e.target.value)
        })
    }
   
return(
    <div >
            {/* <Row> */}
                {/* <Col className='col-box' ><Card.Img variant="top" src={Logo} className='logo-img'/></Col>
                <Col className='col-box' style={{"textAlign":"center","display":"inline-block"}} xs={6}  ><Card.Body className="title-word">Flood Monitoring Dashboard</Card.Body></Col> */}
                <Button variant="secondary" onClick={handleShow} style={{width:"50.8%"}}>
                    Simulate with Mock Data
                </Button>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Simulate Model with Mock Data</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                                {keys.map((key)=>{
                                    return (
                                    <Stack direction="horizontal" gap={3}>
                                        <Col >
                                         <label className='label-name'>{minMax[key][2]}</label>
                                        </Col>
                                        <Col>
                                            <input type="range" name={key} min={minMax[key][0]} max={minMax[key][1]} onChange={handleChange} step='0.01' value={inputslider[key]}/>
                                            <output id="value">{inputslider[key]}</output>
                                        </Col>
                                    </Stack>
                                    )
                                }
                                )}
                            <Col>
                            {wait}
                            <img style={{width:"100%"}} src={img} />
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Close</Button>
                        <Button variant="primary" onClick={()=> handleSubmit('telegram')}>View in Telegram</Button>
                        <Button variant="primary" onClick={()=> handleSubmit('web')}>View in New Tab</Button>
                    </Modal.Footer>
                </Modal>
            {/* </Row> */}
                
               
        
        
    </div>
)
}

export default SimulateModel;