(function (root) {
  var PART = "/swimming/parts/";

  function frames(values, wrap, at) {
    var stops;
    if (at && at.length === values.length) {
      stops = values.map(function (value, i) { return [at[i], value]; });
    } else if (values.length === 2) stops = [["0%,100%", values[0]], ["50%", values[1]]];
    else if (values.length === 3) stops = [["0%", values[0]], ["46%", values[1]], ["100%", values[2]]];
    else stops = [["0%", values[0]], ["28%", values[1]], ["58%", values[2]], ["100%", values[3]]];
    return stops.map(function (pair) {
      return pair[0] + "{" + wrap(pair[1]) + "}";
    }).join("");
  }

  function turn(n) { return "transform:rotate(" + n + "deg)"; }

  var SCENES = {
    breath: {
      water: "pool", dur: "5.2s", place: "place-low", flags: ["bubbles", "mouth"], hold: 1,
      doll: [
        "translateY(0px)",
        "translateY(4px)",
        "translateY(4px)",
        "translateY(-58px)"
      ],
      dollAt: ["0%", "14%", "68%", "100%"],
      bubbles: [0, 1, 1, 0],
      bubAt: ["0%", "14%", "74%", "88%"]
    },
    "float-back": {
      water: "pool", dur: "4.4s", flags: ["full"],
      doll: ["rotate(-76deg) scale(0.74)", "rotate(-84deg) scale(0.74)"],
      armL: [68, 82], armR: [-68, -82],
      thighL: [26, 36], thighR: [-26, -36],
      rig: ["translateY(8px)", "translateY(-10px)"]
    },
    "float-tummy": {
      water: "pool", dur: "4.2s", flags: ["full", "face"],
      doll: ["rotate(78deg) scale(0.74)", "rotate(86deg) scale(0.74)"],
      rig: ["translateY(6px)", "translateY(-8px)"]
    },
    glide: {
      water: "pool", dur: "3.2s", flags: ["full", "face"],
      doll: ["rotate(82deg) scale(0.74)"],
      armL: [162], armR: [-162],
      rig: ["translateX(-90px)", "translateX(90px)"]
    },
    flutter: {
      water: "pool", dur: "0.85s", flags: ["full", "face"],
      doll: ["rotate(80deg) scale(0.74)"],
      armL: [155], armR: [-155],
      thighL: [-6, 12], thighR: [6, -12],
      calfL: [-8, 24], calfR: [8, -24],
      rig: ["translateX(-16px)", "translateX(16px)"]
    },
    frog: {
      water: "pool", dur: "2.4s", flags: ["full", "face"], hold: 1,
      doll: ["rotate(80deg) scale(0.74)"],
      thighL: [0, 18, 54], thighR: [0, -18, -54],
      calfL: [8, 115, 12], calfR: [-8, -115, -12],
      rig: ["translateX(-36px)", "translateX(0px)", "translateX(48px)"]
    },
    dolphin: {
      water: "pool", dur: "1.5s", flags: ["full", "face"],
      doll: ["rotate(66deg) scale(0.74)", "rotate(102deg) scale(0.74)", "rotate(70deg) scale(0.74)"],
      rig: ["translate(-36px, 8px)", "translate(8px, 20px)", "translate(52px, 2px)"]
    },
    scull: {
      water: "pool", dur: "1.6s", flags: ["full"],
      doll: ["rotate(-80deg) scale(0.74)"],
      armL: [16, 52], armR: [-16, -52],
      rig: ["translateY(4px)", "translateY(-4px)"]
    },
    tread: {
      water: "pool", dur: "0.9s", place: "place-low",
      armL: [16, 48], armR: [-16, -48],
      calfL: [8, -22], calfR: [-8, 22],
      rig: ["translateY(0px)", "translateY(-16px)"]
    },
    streamline: {
      water: "pool", dur: "2.8s", flags: ["full", "face"],
      doll: ["rotate(86deg) scale(0.72)"],
      armL: [168], armR: [-168],
      rig: ["translateX(-110px)", "translateX(110px)"]
    },
    "roll-breathe": {
      water: "pool", dur: "3s", flags: ["full"], hold: 1,
      doll: ["rotate(86deg) scale(0.74)", "rotate(26deg) scale(0.74)", "rotate(86deg) scale(0.74)"],
      faceOp: [1, 0, 1],
      armL: [140, 36, 140],
      rig: ["translateX(-20px)", "translateX(10px)", "translateX(36px)"]
    },
    "soft-body": {
      water: "pool", dur: "4.8s", flags: ["full"],
      doll: ["rotate(-74deg) scale(0.74)", "rotate(-90deg) scale(0.7)"],
      armL: [16, 42], armR: [-14, -46],
      thighL: [6, 20], thighR: [-6, -22]
    },
    freestyle: {
      water: "pool", dur: "1.35s", flags: ["full", "face"],
      doll: ["rotate(80deg) scale(0.74)"],
      armL: [24, 168], armR: [-168, -24],
      calfL: [0, 18], calfR: [18, 0],
      rig: ["translateX(-24px)", "translateX(24px)"]
    },
    backstroke: {
      water: "pool", dur: "1.45s", flags: ["full"],
      doll: ["rotate(-80deg) scale(0.74)"],
      armL: [24, 168], armR: [-168, -24],
      calfL: [0, 14], calfR: [14, 0],
      rig: ["translateX(24px)", "translateX(-24px)"]
    },
    breaststroke: {
      water: "pool", dur: "2.6s", flags: ["full", "face"],
      doll: ["rotate(80deg) scale(0.74)"],
      armL: [24, 96, 164, 24], armR: [-24, -96, -164, -24],
      thighL: [0, 10, 50, 0], thighR: [0, -10, -50, 0],
      calfL: [0, 108, 10, 0], calfR: [0, -108, -10, 0],
      rig: ["translateX(-30px)", "translateX(0px)", "translateX(20px)", "translateX(56px)"]
    },
    butterfly: {
      water: "pool", dur: "1.45s", flags: ["full", "face"],
      doll: ["rotate(62deg) scale(0.74)", "rotate(104deg) scale(0.74)", "rotate(66deg) scale(0.74)"],
      armL: [36, 162, 36], armR: [-36, -162, -36],
      rig: ["translate(-40px, 10px)", "translate(0px, 22px)", "translate(48px, 4px)"]
    },
    sidestroke: {
      water: "pool", dur: "1.8s", flags: ["full"],
      doll: ["rotate(46deg) scale(0.78)", "rotate(58deg) scale(0.78)"],
      armL: [20, 90], armR: [-10, -36],
      thighL: [0, 42], thighR: [0, -42],
      calfL: [0, 28], calfR: [0, -28],
      rig: ["translateX(-18px)", "translateX(18px)"]
    },
    "elementary-back": {
      water: "pool", dur: "3.2s", flags: ["full"],
      doll: ["rotate(-78deg) scale(0.74)"],
      armL: [0, 86, 8, 0], armR: [0, -86, -8, 0],
      thighL: [0, 10, 48, 0], thighR: [0, -10, -48, 0],
      calfL: [0, 0, 110, 0], calfR: [0, 0, -110, 0]
    },
    "survival-back": {
      water: "pool", dur: "5s", flags: ["full"],
      doll: ["rotate(-80deg) scale(0.74)", "rotate(-86deg) scale(0.74)"],
      armL: [0, 22], armR: [0, -22],
      rig: ["translateY(4px)", "translateY(-6px)"]
    },
    "sit-entry": {
      water: "pool", dur: "3.4s", flags: ["deck"], place: "place-high", hold: 0,
      doll: ["rotate(4deg)", "rotate(10deg)", "rotate(0deg)"],
      thighL: [78], thighR: [-78], calfL: [-74], calfR: [74],
      rig: ["translateY(-30px)", "translateY(36px)", "translateY(110px)"]
    },
    "stand-entry": {
      water: "pool", dur: "3.2s", flags: ["deck"], place: "place-high",
      thighL: [0, -48, 0, 0], calfL: [0, 24, 0, 0],
      rig: ["translateY(-48px)", "translateY(-10px)", "translateY(36px)", "translateY(96px)"]
    },
    "shallow-dive": {
      water: "pool", dur: "2.6s", flags: ["deck"], hold: 2,
      armL: [155], armR: [-155],
      doll: ["rotate(8deg)", "rotate(48deg)", "rotate(82deg)"],
      faceOp: [0, 0.4, 1],
      rig: ["translate(-50px, -36px)", "translate(10px, 8px)", "translate(80px, 28px)"]
    },
    "climb-out": {
      water: "pool", dur: "3.3s", flags: ["deck"], place: "place-low", hold: 1,
      armL: [70, 158], armR: [-70, -158],
      rig: ["translateY(48px)", "translateY(-70px)"]
    },
    "river-entry": {
      water: "river", dur: "3.6s", flags: ["shore"], place: "place-left",
      thighL: [0, -34], thighR: [-34, 0],
      calfL: [0, 18], calfR: [16, 0],
      rig: ["translate(-20px, -10px)", "translate(36px, 28px)"]
    },
    "river-exit": {
      water: "river", dur: "3.6s", flags: ["shore"], place: "place-left",
      thighL: [-30, 10], thighR: [10, -30],
      rig: ["translate(48px, 24px)", "translate(-28px, -8px)"]
    },
    "ocean-entry": {
      water: "ocean", dur: "3.8s", flags: ["shore", "wave"],
      thighL: [0, -32], thighR: [-32, 0],
      rig: ["translateX(-56px)", "translateX(28px)"]
    },
    "ocean-exit": {
      water: "ocean", dur: "3.8s", flags: ["shore", "wave"], hold: 2,
      doll: ["scaleX(1) rotate(0deg)", "scaleX(-1) rotate(0deg)", "scaleX(-1) rotate(0deg)"],
      thighL: [0, 0, -30], thighR: [0, 0, 24],
      rig: ["translateX(36px)", "translateX(36px)", "translateX(-60px)"]
    },
    sighting: {
      water: "lake", dur: "3s", flags: ["full", "mark"], hold: 1,
      doll: ["rotate(84deg) scale(0.74)", "rotate(34deg) scale(0.74)", "rotate(84deg) scale(0.74)"],
      faceOp: [1, 0, 1],
      armL: [150, 50, 150], armR: [-40, -150, -40],
      rig: ["translateX(-30px)", "translateX(8px)", "translateX(40px)"]
    },
    "wave-breath": {
      water: "ocean", dur: "3.2s", flags: ["full", "wave"], hold: 1,
      doll: ["rotate(82deg) scale(0.74)", "rotate(22deg) scale(0.74)", "rotate(80deg) scale(0.74)"],
      faceOp: [1, 0, 1],
      rig: ["translateY(20px)", "translateY(-28px)", "translateY(16px)"]
    },
    "river-cross": {
      water: "river", dur: "2.4s", flags: ["full", "face", "arrows"],
      doll: ["rotate(84deg) scale(0.74)"],
      armL: [40, 165], armR: [-165, -40],
      rig: ["translateX(-80px)", "translateX(80px)"]
    },
    "lake-swim": {
      water: "lake", dur: "4s", flags: ["full", "face", "mark"],
      doll: ["rotate(80deg) scale(0.74)"],
      armL: [36, 160], armR: [-150, -30],
      rig: ["translateX(-70px)", "translateX(50px)"]
    },
    "ocean-trip": {
      water: "ocean", dur: "4.2s", flags: ["shore", "shallow", "wave"],
      thighL: [0, -28, 0], thighR: [-28, 0, -20],
      rig: ["translateX(-64px)", "translateX(8px)", "translateX(-64px)"]
    },
    rip: {
      water: "ocean", dur: "3.4s", flags: ["full", "face", "arrows"],
      doll: ["rotate(82deg) scale(0.74)"],
      armL: [30, 160], armR: [-150, -24],
      rig: ["translateX(-20px)", "translateX(70px)"]
    },
    "help-float": {
      water: "ocean", dur: "4s", flags: ["full"], hold: 1,
      doll: ["rotate(-10deg) scale(0.84)", "rotate(8deg) scale(0.78)"],
      armL: [-36, -58], armR: [36, 58],
      thighL: [96, 112], thighR: [-96, -112],
      calfL: [-36, -58], calfR: [36, 58]
    },
    huddle: {
      water: "ocean", dur: "3.2s", flags: ["friends"], place: "place-low",
      armL: [62, 74], armR: [-62, -74],
      rig: ["translateY(4px)", "translateY(-6px)"]
    },
    "reach-rescue": {
      water: "lake", dur: "2.8s", flags: ["shoreRight", "stick", "ring", "shallow"],
      place: "place-right place-high",
      doll: ["rotate(0deg)", "rotate(-10deg)"],
      armL: [20, 110]
    },
    paddle: {
      water: "ocean", dur: "1.4s", flags: ["face"], board: "prone",
      doll: ["rotate(80deg) scale(0.74)"],
      armL: [46, 166], armR: [-166, -46],
      rig: ["translateX(-18px)", "translateX(22px)"]
    },
    "duck-dive": {
      water: "ocean", dur: "2.8s", flags: ["face", "wave"], board: "prone", hold: 1,
      doll: ["rotate(76deg) scale(0.74)", "rotate(112deg) scale(0.74)", "rotate(74deg) scale(0.74)"],
      armL: [150, 40, 150], armR: [-150, -20, -150],
      rig: ["translate(-10px, 0px)", "translate(16px, 42px)", "translate(64px, -6px)"]
    },
    "turtle-roll": {
      water: "ocean", dur: "3.2s", flags: ["face"], board: "prone", hold: 1,
      doll: ["rotate(78deg) scale(0.74)", "rotate(78deg) scale(0.74)"],
      armL: [8, -46], armR: [-8, 46],
      rig: ["rotate(0deg)", "rotate(180deg)"]
    },
    "pop-up": {
      water: "ocean", dur: "2.8s", board: "prone", hold: 2,
      doll: ["rotate(82deg) scale(0.78)", "rotate(28deg) scale(0.82)", "rotate(0deg) scale(0.9)"],
      armL: [-140, -30, 0], armR: [140, 30, 0],
      boardMove: ["translateY(0px)", "translateY(48px)", "translateY(120px)"]
    },
    takeoff: {
      water: "ocean", dur: "3s", flags: ["wave"], board: "prone", hold: 2,
      doll: ["rotate(80deg) scale(0.78)", "rotate(36deg) scale(0.82)", "rotate(0deg) scale(0.9)"],
      armL: [-40, -150, 0], armR: [-150, 40, 0],
      rig: ["translateY(8px)", "translateY(-18px)", "translateY(-8px)"],
      boardMove: ["translateY(0px)", "translateY(36px)", "translateY(120px)"]
    },
    trim: {
      water: "ocean", dur: "2.6s", board: "sit",
      doll: ["rotate(0deg)"],
      thighL: [84], thighR: [-84],
      rig: ["translateY(0px)", "translateY(-6px)"]
    },
    "bottom-turn": {
      water: "ocean", dur: "2.6s", board: "sit",
      doll: ["rotate(-8deg)", "rotate(10deg)"],
      thighL: [76], thighR: [-76],
      armL: [24, 70],
      rig: ["rotate(-16deg)", "rotate(18deg)"]
    },
    whitewater: {
      water: "ocean", dur: "1.6s", flags: ["face", "foam"], board: "prone",
      doll: ["rotate(74deg) scale(0.74)", "rotate(82deg) scale(0.74)"],
      armL: [18, 36], armR: [-18, -36],
      rig: ["translateX(-28px)", "translateX(40px)"]
    },
    wipeout: {
      water: "ocean", dur: "2.8s", flags: ["foam"], board: "prone", hold: 1,
      doll: ["rotate(64deg)", "rotate(168deg)", "rotate(8deg)"],
      armL: [150, 160, -20], armR: [-150, -160, 16],
      rig: ["translate(-8px, 0px)", "translate(12px, 10px)", "translate(28px, 8px)"]
    },
    "catch-wave": {
      water: "ocean", dur: "2.6s", flags: ["face", "wave", "shoreRight"], board: "prone",
      doll: ["rotate(80deg) scale(0.74)"],
      armL: [48, 160, 110], armR: [-160, -40, -110],
      rig: ["translateX(-78px)", "translateX(-10px)", "translateX(72px)"]
    },
    "tummy-balance": {
      water: "ocean", dur: "3.6s", flags: ["face"], board: "prone",
      doll: ["rotate(80deg) scale(0.74)", "rotate(84deg) scale(0.74)"],
      armL: [140], armR: [-140]
    },
    "knees-balance": {
      water: "ocean", dur: "2.4s", board: "knee",
      armL: [78, 92], armR: [-78, -92],
      thighL: [16], thighR: [-16],
      calfL: [118], calfR: [-118],
      rig: ["rotate(-4deg)", "rotate(5deg)"]
    }
  };

  function add(parent, className) {
    var node = document.createElement("div");
    node.className = className;
    parent.appendChild(node);
    return node;
  }

  function piece(className, file, label) {
    var img = document.createElement("img");
    img.className = "piece " + className;
    img.src = PART + file;
    img.alt = label || "";
    return img;
  }

  root.mountDoll = function (el, move, label) {
    var scene = SCENES[move];
    if (!scene) return false;
    var id = "doll-" + String(move).replace(/[^a-z0-9-]/g, "");
    var dur = scene.dur || "3s";
    var hold = scene.hold || 0;
    el.classList.add("doll-stage", "water-" + (scene.water || "pool"));
    el.setAttribute("data-move", move);
    el.setAttribute("role", "img");
    el.setAttribute("aria-label", label || "Amita");
    (scene.flags || []).forEach(function (flag) { el.classList.add("show-" + flag); });

    add(el, "sea");
    if ((scene.flags || []).indexOf("deck") >= 0) add(el, "deck");
    if ((scene.flags || []).indexOf("shore") >= 0) add(el, "shore");
    if ((scene.flags || []).indexOf("shoreRight") >= 0) add(el, "shore-right");
    if ((scene.flags || []).indexOf("wave") >= 0) add(el, "wave");
    if ((scene.flags || []).indexOf("foam") >= 0) {
      var foam = add(el, "foam");
      foam.appendChild(document.createElement("i"));
      foam.appendChild(document.createElement("i"));
      foam.appendChild(document.createElement("i"));
    }
    if ((scene.flags || []).indexOf("arrows") >= 0) {
      var arrows = add(el, "arrows");
      arrows.appendChild(document.createElement("i"));
      arrows.appendChild(document.createElement("i"));
      arrows.appendChild(document.createElement("i"));
    }
    if ((scene.flags || []).indexOf("friends") >= 0) {
      var friends = add(el, "friends");
      friends.appendChild(document.createElement("i"));
      friends.appendChild(document.createElement("i"));
    }
    if ((scene.flags || []).indexOf("stick") >= 0) add(el, "stick");
    if ((scene.flags || []).indexOf("ring") >= 0) add(el, "ring");
    if ((scene.flags || []).indexOf("mark") >= 0) add(el, "mark");

    var rig = add(el, "rig" + (scene.place ? " " + scene.place : ""));
    var board = null;
    if (scene.board) board = add(rig, "board board-" + scene.board);
    var doll = add(rig, "doll");
    doll.appendChild(piece("body", "body.png", label || "Amita"));
    var armL = piece("arm l", "arm-l.png");
    var armR = piece("arm r", "arm-r.png");
    var limbL = add(doll, "limb l");
    limbL.appendChild(piece("thigh", "thigh-l.png"));
    var calfL = piece("calf l", "calf-l.png");
    limbL.appendChild(calfL);
    var limbR = add(doll, "limb r");
    limbR.appendChild(piece("thigh", "thigh-r.png"));
    var calfR = piece("calf r", "calf-r.png");
    limbR.appendChild(calfR);
    doll.appendChild(armL);
    doll.appendChild(armR);
    var face = add(doll, "face-cover");
    var bubbles = null;
    if ((scene.flags || []).indexOf("bubbles") >= 0) {
      bubbles = add(doll, "bubbles");
      bubbles.appendChild(document.createElement("i"));
      bubbles.appendChild(document.createElement("i"));
      bubbles.appendChild(document.createElement("i"));
    }

    var css = "";
    function bind(node, key, values, wrap, at) {
      if (!node || !values || !values.length) return;
      var shown = values[Math.min(hold, values.length - 1)];
      node.style.transform = wrap(shown).replace("transform:", "");
      if (values.length < 2) return;
      var name = id + "-" + key;
      css += "@keyframes " + name + "{" + frames(values, wrap, at) + "}";
      node.style.animation = name + " " + dur + " ease-in-out infinite";
    }
    function fade(node, key, values, at) {
      if (!node || !values || !values.length) return;
      node.style.opacity = String(values[Math.min(hold, values.length - 1)]);
      if (values.length < 2) return;
      var name = id + "-" + key;
      css += "@keyframes " + name + "{" + frames(values, function (n) { return "opacity:" + n; }, at) + "}";
      node.style.animation = name + " " + dur + " ease-in-out infinite";
    }

    bind(rig, "rig", scene.rig, function (v) { return "transform:" + v; });
    bind(doll, "doll", scene.doll, function (v) { return "transform:" + v; }, scene.dollAt);
    bind(board, "board", scene.boardMove, function (v) { return "transform:" + v; });
    bind(armL, "al", scene.armL, turn);
    bind(armR, "ar", scene.armR, turn);
    bind(limbL, "tl", scene.thighL, turn);
    bind(limbR, "tr", scene.thighR, turn);
    bind(calfL, "cl", scene.calfL, turn);
    bind(calfR, "cr", scene.calfR, turn);
    fade(face, "face", scene.faceOp);
    fade(bubbles, "bub", scene.bubbles, scene.bubAt);

    if (css) {
      var style = document.createElement("style");
      style.textContent = css;
      el.appendChild(style);
    }
    return true;
  };

  root.AMITA_SCENES = SCENES;
})(typeof window === "undefined" ? globalThis : window);
