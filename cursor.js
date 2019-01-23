const cursorobject = document.querySelector(".cursor");

document.addEventListener("mousemove", e => {
    cursorobject.setAttribute("style", "top: "+(e.pageY - 10)+"px; left: "+(e.pageX - 10)+"px; visibility: visible;");
});

document.addEventListener("scroll", e => {
    cursorobject.setAttribute("style","visibility: hidden;");
});

document.addEventListener("click", e => {
    cursorobject.classList.add("expand");

    setTimeout(() => {
        cursorobject.classList.remove("expand");
    }, 500);
});