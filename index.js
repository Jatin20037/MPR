var express = require("express");
const app = express();
const { exec, spawn } = require('child_process');

const { performance } = require('perf_hooks');
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const os = require('os');
const http = require('http');
const { Server } = require("socket.io");
const server = http.createServer(app);
const corss = require("cors");
app.use(corss());
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
})
function execute_TSHARK(callback) {
    let packetCount = 0;
    let lastTime = performance.now();

    const tSharkScript = exec(`C:/"Program Files"/Wireshark/tshark.exe -i ethernet -e frame.time_delta -e dst_port -e ip.len -e tcp.flags.psh -e tcp.flags.urg -e ip.hdr_len -e ((ip.len * frame.time_delta) / frame.len) -e ((total_fwd_packets + total_backward_packets) / frame.time_delta) -Tfields`);


    tSharkScript.stdout.on('data', (data) => {
        packetCount++;

        // Calculate the time since the last packet
        const currentTime = performance.now();
        const elapsedTime = currentTime - lastTime;

        // Update the last time
        lastTime = currentTime;

        // Calculate and log the packet frequency
        const frequency = packetCount / (elapsedTime / 1000); // packets per second
        // console.log(`Packet Frequency: ${frequency.toFixed(2)} packets/second`);
// console.log(datata)
console.log(data)
        var exportData = {
            packet: data,
            frequency: frequency.toFixed(2)
        }
        // console.log(exportData)
        io.on("connection", (socket) => {
            // console.log("connected")
            socket.broadcast.emit("exportData", exportData);
        })
        callback(exportData);



        // console.log(`output: ${data}`);
    });

    tSharkScript.stderr.on('data', (data) => {
        console.error(`error: ${data}`);
    });

    tSharkScript.on('close', (code) => {
        console.log(`close: ${code}`);
    });


}










function getCpuUtilization() {
    const cpus = os.cpus();
    const totalCpuTime = cpus.reduce((acc, cpu) => acc + cpu.times.user + cpu.times.nice + cpu.times.sys + cpu.times.idle + cpu.times.irq, 0);
    const idleCpuTime = cpus.reduce((acc, cpu) => acc + cpu.times.idle, 0);

    const cpuUtilization = 100 - ((idleCpuTime / totalCpuTime) * 100);
    return cpuUtilization.toFixed(2);
}

function getRamUtilization() {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const ramUtilization = (usedMemory / totalMemory) * 100;
    return ramUtilization.toFixed(2);
}

// Example usage
setInterval(() => {
    const cpuUtilization = getCpuUtilization();
    const ramUtilization = getRamUtilization();
    const resourceUtilization = {
        cpu: cpuUtilization,
        ram: ramUtilization
    }
    // console.log(cpuUtilization,ramUtilization)
    io.on("connection", (socket) => {
        // console.log("connected")
        socket.broadcast.emit("utilization", resourceUtilization);
    })

}, 1000);














execute_TSHARK((data) => {
    // Event listener for WebSocket connections

});


server.listen(3001, () => {
    console.log("running");
})






