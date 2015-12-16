function toggleplay() {
    var playbutton = document.getElementById('playbutton');
    if (playbutton.textContent == "pause") {
        playbutton.textContent = "play";
    } else {
        playbutton.textContent = "pause";
        playing();
    }
}

function playing(){
    if (playbutton.textContent == "pause") {
        speed = 400;
        if (document.getElementById("2x").checked) {
            speed = 200;
        }
        playvar = setTimeout(function () {
            moveoneday(1, 0, 120, 0, 200);
            playing();
        }, speed);
    }
}