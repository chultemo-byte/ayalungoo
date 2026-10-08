(function (root) {
  var MOVES = {
    breath: { dur: 5.6, shot: 0 },
    freestyle: { dur: 3.6, shot: 2 },
    backstroke: { dur: 3.6, shot: 0 },
    butterfly: { dur: 3.6, shot: 2 },
    breaststroke: { dur: 3.6, shot: 1 },
    "pop-up": { dur: 3.6, shot: 3 }
  };

  root.mountKeys = function (stage, move) {
    var spec = MOVES[move];
    if (!spec) return false;
    var reduce = false;
    try { reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { reduce = false; }
    stage.classList.add("key-stage");
    stage.dataset.dur = String(spec.dur);
    stage.dataset.shot = String(spec.shot);
    stage.dataset.move = move;
    stage.setAttribute("role", "img");
    var i;
    for (i = 0; i < 4; i++) {
      var img = document.createElement("img");
      img.className = "key-frame";
      img.alt = "";
      img.src = "/swimming/frames/" + move + "-" + i + ".jpg";
      img.style.animationDuration = spec.dur + "s";
      img.style.animationDelay = (-i * spec.dur / 4) + "s";
      if (reduce) {
        img.style.animation = "none";
        img.style.opacity = i === spec.shot ? "1" : "0";
      }
      stage.appendChild(img);
    }
    return true;
  };
})(typeof window === "undefined" ? globalThis : window);
