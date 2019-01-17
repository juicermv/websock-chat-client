
function link1() {
    window.open("https://www.google.com");
}
function link2() {
    window.open("https://www.youtube.com")
}
function link3() {
    window.open("https://www.twitter.com")
}
function link4() {
    window.open("https://news.google.com/foryou")
}
function OPENURL() {
    if (document.getElementById("txturl").value == "potato") {
        window.open("https://www.youtube.com/watch?v=yQ9IOEpGlr4");
    }
    else {
        window.open(document.getElementById("txturl").value);
    }
    document.getElementById("txturl").value = "https://";
    
}
