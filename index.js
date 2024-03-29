const ipbox = document.getElementById("ip")
const unamebox = document.getElementById("username")
const passbox = document.getElementById("password")
const loginform = document.getElementById("loginform")
const mainpage = document.getElementById("mainpage")
const messagelist = document.getElementById("messagelist")
const msginput = document.getElementById("msginput")
var socket = null;
var token = null;
var timerID = 0; 

mainpage.style.visibility = "hidden";

function keepAlive() { 
    var timeout = 5000;  
    if (socket.readyState == socket.OPEN) {  
        socket.send('PING');  
    }  
    timerID = setTimeout(keepAlive, timeout); 
}

function cancelKeepAlive() {  
    if (timerID) {  
        clearTimeout(timerID);  
    }  
}

// SCookie stuff

function resetCookie(cookie) {
    document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure`;
}

function createCookie(cookie, value) {
    document.cookie = `${cookie}=${value}; SameSite=Lax; Secure`;
}

function getCookie(cookie) {
    return document.cookie
        .split('; ')
        .find(row => row.startsWith(`${cookie}=`))
        .split('=')[1];
}

function checkACookieExists(cookie) {
    return (document.cookie.split(';').some((item) => item.trim().startsWith(`${cookie}=`))) 
}

if (checkACookieExists("server") && checkACookieExists("token"))
{
    ipbox.value = getCookie("server")
    login()
}

// Notif stuff
var timeSinceLastNotif = Date.now()

function requestNotifPermission(){
    if (Notification.permission !== "granted"){
        Notification.requestPermission()
    }
}

function sendNotif(){
    if(Date.now().getTime() - timeSinceLastNotif.getTime() >= 300000){
        new Notification("You have new messages!").onclick = Document.getElementById("chat").focus()
        timeSinceLastNotif = Date.now()
    }
}

requestNotifPermission()

function login(){
    socket = checkACookieExists("server") ? new WebSocket("wss://"+getCookie("server")) : new WebSocket("wss://"+ipbox.value.replace("ws://","").replace("wss://", ""))
    socket.onmessage = onMessage;
    socket.onopen = function (e) {
        if(checkACookieExists("token")) {
            socket.send(`TOKEN_LOGIN ${getCookie("token")}`)
        } 
        else
        {
            socket.send(`LOGIN ${unamebox.value} ${passbox.value}`)
        }
        keepAlive();
    }

    socket.onclose = function (e) {
        alert("Connection terminated.")
        mainpage.style.visibility = "hidden";
        loginform.style.visibility = "visible";
        tm = null;
        cancelKeepAlive();
    }
}

function handleMessage(message){
    const div = ('color' in message["author"]) ? 
    `<div class="messageitem" style="border-left: 5px ${message["author"]["color"]} solid;">
        <h1 style="color: ${message["author"]["color"]};" >${message["author"]["username"]} at ${new Date(message["date"]+" UTC").toLocaleString()}</h1>
        <p>${message["content"]}</p>
    </div>
    ` : `
    <div class="messageitem">
        <h1>${message["author"]["username"]} at ${new Date(message["date"]+" UTC").toLocaleString()}</h1>
        <p>${message["content"]}</p>
    </div>
    `

    messagelist.innerHTML+=div
    messagelist.scrollTop = messagelist.scrollHeight

    sendNotif()
}


msginput.addEventListener("keyup", function(event) {
    if (event.code === "Enter" && msginput.value !== "") {
    	send();
    }
});

function send(){
    socket.send(`SEND ${token} ${msginput.value}`)
    msginput.value = ""
}

function onMessage(e){
    var message = e.data
    var splitmessage = message.split(' ')
    console.log(message)
    switch (splitmessage[0]) {
        case "TOKEN":
            resetCookie("token")
            resetCookie("server")
            if(splitmessage[1] !== "NULL"){
                token = splitmessage[1]
                createCookie("token", token)
                createCookie("server", ipbox.value)
                loginform.style.visibility = "hidden";
                mainpage.style.visibility = "visible";
                socket.send("GET "+ token)
            } else { alert("Login failed."); socket = null }
            break
        case "MSGS":
            messagelist.innerHTML = ""
            var jsons = message.substring(message.indexOf(' ') + 1)
            console.log(jsons)
            
            var json = JSON.parse(jsons)
            for (var i = 0; i < json.length; i++){
                handleMessage(json[i])
            }
            messagelist.innerHTML+='<div class="messageitem" style="text-align: center;"><h1>~~last 100 messages~~</h1></div>'
            break
        case "MSG":
            var jsons = message.substring(message.indexOf(' ') + 1)
            console.log(jsons)
            handleMessage(JSON.parse(jsons))
            break
    }
}
