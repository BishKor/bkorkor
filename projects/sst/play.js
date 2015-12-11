function toggleplay() {
    var playbutton = document.getElementById('playbutton');
    if (playbutton.textContent == "pause") {
        playbutton.textContent = "play";
        clearInterval(playvar);
    } else {
        speed = 400
        if (document.getElementById("2x").checked){
            speed = 200
        }
        playvar = setInterval(function(){moveoneday(1, 0, 120, 0, 200);}, speed);
        playbutton.textContent = "pause";
    }
}