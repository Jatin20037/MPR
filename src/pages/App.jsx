import React, { useEffect, useState } from 'react';
import "../App.css";
import MapComponent from '../components/MapComponent';
import axios from 'axios';
import io from 'socket.io-client';
import { FaLocationArrow, FaNetworkWired } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row } from 'react-bootstrap';
import PacketsDisplay from '../components/packetsDisplay';
import RealTimeChart from '../components/chart';
import CpuUtilization from '../components/cpuutilization';
import RamUtilization from '../components/ramutilization';

function App(props) {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [ip, setIp] = useState("");
  const [packets, setPackets] = useState([]);
  const [singlePacket, setSinglePacket] = useState([]);
  const [resourceUtilization, setResourceUtilization] = useState([]);
  const ENDPOINT = 'http://localhost:3001';
  const socket = io.connect(ENDPOINT);
  useEffect(() => {





    if (navigator.geolocation) {
      // Check if high accuracy is available and request it if possible
      navigator.geolocation.getCurrentPosition(
        showPosition,
        (error) => {
          if (error.code === 1) {
            alert("Geolocation permission denied. Please enable location services in your browser settings.");
          } else if (error.code === 2) {
            alert("Geolocation position is unavailable.");
          } else if (error.code === 3) {
            alert("Geolocation request timed out.");
          } else {
            alert("Unknown geolocation error: " + error.message);
          }
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }

    function showPosition(position) {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    }


  }, [])


  axios.get('https://api.ipify.org?format=json').then((resp) => { setIp(resp.data.ip); })


  useEffect(() => {
    // console.log(resp.data)
    socket.on("exportData", (args) => {
      // console.log(args.packet)
      setPackets((prevData)=>[...prevData, args]);
      setSinglePacket(args);
    })

    socket.on("utilization", (args) => {
      // console.log(args);
      setResourceUtilization(args);
    })



  }, [])



  return (
    <div className='maindiv'>
      <div className='consolebox'>
        <div style={{ display: "flex", justifyContent: "end", alignItems: "center" }}>
          <>

            <FaNetworkWired />&nbsp;&nbsp;{ip}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;<FaLocationArrow />&nbsp;&nbsp;
            {latitude}ºN , {longitude}ºE
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <input className='generalInput' placeholder='Port no' />&nbsp;&nbsp;&nbsp;
            <select className='dropdownSelect'>
              <option>Ethernet eth0</option>
              <option>WIFI</option>

            </select>

          </>
        </div>
      </div>
      <MapComponent />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Row className='row'>
          <Col lg="2" className='columns' style={{ padding: "15px" }}>

            Network Frequency&nbsp;&nbsp;&nbsp;{singlePacket.frequency} Packets/Sec
            <RealTimeChart data={singlePacket} />
            <br />
            CPU Utilization&nbsp;&nbsp;&nbsp;{resourceUtilization.cpu} %
            <CpuUtilization data={resourceUtilization} />
            <br />
            RAM Utilization&nbsp;&nbsp;&nbsp;{resourceUtilization.ram} %
            <RamUtilization data={resourceUtilization} />

          </Col>
          <Col lg="10" className='columns'>
            <PacketsDisplay data={packets} />
          </Col>
          {/* <Col lg="4" className='columns'>
          </Col> */}
        </Row>

      </div>





    </div>
  );
}

export default App;