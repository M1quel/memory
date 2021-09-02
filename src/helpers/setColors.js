import axios from "axios";

export default function setColors (name, hue, sat, bri, config) {
    var username = config?.username
    var bridgeIP = config?.ip
    var lightID = config?.id;
    var url = `http://${bridgeIP}/api/${username}/lights/${lightID}/state`;
    if(name === "off") {
        axios.put(url, {
            on: false
        })
    } else {
        axios.put(url, {
            on: true,
            "hue": hue,
            bri: bri ? bri : 100,
            sat: sat === 0 ? 0 : 254
        })
    }
}


// username=NuLu5V2ErI50R8dMvPtoHYgw4lKywYQJ0KQIEsAa