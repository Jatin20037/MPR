import React from 'react';

function PacketsDisplay(props) {
    return (
        <div>
            <table style={{ width: "100%" }}>
                <thead>
                    <tr>
                        <td>Timestamp</td>
                        <td>Source IP</td>
                        <td>Destination IP</td>
                        <td>Source Port</td>
                        <td>Destination Port</td>
                        <td>Protocol </td>
                        <td>Packet Length</td>
                        <td>Flags</td>
                        <td>Header Length</td>
                        <td>Packet Count</td>
                        <td>Flow Duration </td>
                        <td>Flow Bytes/s</td>
                        <td>Flow Packets/s</td>

                    </tr>
                </thead>
                <tbody>
                {console.log(props.data[0]?.packet)
                //console.log(JSON.parse(props.data[0]?.packet))
                // props.data.map((element,index)=>
                // <tr style={{backgroundColor :index%2==0?"rgba(0,186,255,0.2)":""}}>
                //         <td>{element?.timestamp}</td>
                //         <td>{element?.ip.ip_ip_host}</td>
                //         <td>{element?.ip.ip_ip_dst_host}</td>
                //         <td>Source Port</td>
                //         <td>Destination Port</td>
                //         <td>Protocol </td>
                //         <td>Packet Length</td>
                //         <td>Flags</td>
                //         <td>Header Length</td>
                //         <td>Packet Count</td>
                //         <td>Flow Duration </td>
                //         <td>Flow Bytes/s</td>
                //         <td>Flow Packets/s</td>

                //     </tr>
                    // )
            }
                </tbody>
            </table>
            
        </div>
    );
}

export default PacketsDisplay;