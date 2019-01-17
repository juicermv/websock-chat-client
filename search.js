function search() {
    var iframe = document.getElementById('iframe');
    window.open("https://www.google.com/search?q=" + document.getElementById('searchbox').value);
}