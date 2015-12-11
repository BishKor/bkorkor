function toggleplay() {
    var playbutton = document.getElementById('playbutton');
    if (playbutton.textContent == "pause") {
        playbutton.textContent = "play";
        clearInterval(playvar);
    } else {
        playvar = setInterval(function(){moveoneday(1, 0, 120, 0, 200);}, 500);
        playbutton.textContent = "pause";
    }
}