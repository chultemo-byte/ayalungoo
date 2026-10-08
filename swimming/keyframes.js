(function (root) {
  var MOVES = {
    "breath": { dur: 5.6, shot: 0 },
    "float-back": { dur: 3.6, shot: 0 },
    "float-tummy": { dur: 3.6, shot: 0 },
    "glide": { dur: 3.6, shot: 0 },
    "flutter": { dur: 3.6, shot: 0 },
    "frog": { dur: 3.6, shot: 0 },
    "dolphin": { dur: 3.2, shot: 1 },
    "scull": { dur: 3.6, shot: 0 },
    "tread": { dur: 3.6, shot: 0 },
    "streamline": { dur: 3.6, shot: 0 },
    "roll-breathe": { dur: 3.6, shot: 0 },
    "soft-body": { dur: 3.6, shot: 0 },
    "freestyle": { dur: 3.6, shot: 0 },
    "backstroke": { dur: 3.6, shot: 0 },
    "breaststroke": { dur: 3.6, shot: 1 },
    "butterfly": { dur: 3.6, shot: 0 },
    "sidestroke": { dur: 3.6, shot: 0 },
    "elementary-back": { dur: 3.6, shot: 0 },
    "survival-back": { dur: 3.6, shot: 0 },
    "sit-entry": { dur: 3.6, shot: 0 },
    "stand-entry": { dur: 3.6, shot: 0 },
    "shallow-dive": { dur: 3.6, shot: 0 },
    "climb-out": { dur: 3.6, shot: 0 },
    "river-entry": { dur: 3.6, shot: 0 },
    "river-exit": { dur: 3.6, shot: 0 },
    "ocean-entry": { dur: 3.6, shot: 0 },
    "ocean-exit": { dur: 3.6, shot: 0 },
    "sighting": { dur: 3.6, shot: 0 },
    "wave-breath": { dur: 3.6, shot: 0 },
    "river-cross": { dur: 3.6, shot: 0 },
    "lake-swim": { dur: 3.6, shot: 0 },
    "ocean-trip": { dur: 3.6, shot: 0 },
    "rip": { dur: 3.6, shot: 0 },
    "help-float": { dur: 3.6, shot: 0 },
    "huddle": { dur: 3.6, shot: 0 },
    "reach-rescue": { dur: 3.6, shot: 0 },
    "paddle": { dur: 3.6, shot: 0 },
    "duck-dive": { dur: 3.6, shot: 0 },
    "turtle-roll": { dur: 3.6, shot: 0 },
    "pop-up": { dur: 3.6, shot: 3 },
    "takeoff": { dur: 3.6, shot: 3 },
    "trim": { dur: 3.6, shot: 0 },
    "bottom-turn": { dur: 3.6, shot: 0 },
    "whitewater": { dur: 3.6, shot: 0 },
    "wipeout": { dur: 3.6, shot: 0 },
    "catch-wave": { dur: 3.6, shot: 0 },
    "tummy-balance": { dur: 3.6, shot: 0 },
    "knees-balance": { dur: 4.2, shot: 0 }
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
