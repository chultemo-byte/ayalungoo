(function (root) {
  var PART = "/swimming/parts/";

  function frames(values, wrap, at) {
    var list = values.slice();
    if (at && at.length === list.length) {
      return list.map(function (value, i) {
        return at[i] + "{" + wrap(value) + "}";
      }).join("");
    }
    if (list.length === 2) {
      return "0%,100%{" + wrap(list[0]) + "}50%{" + wrap(list[1]) + "}";
    }
    if (String(list[list.length - 1]) !== String(list[0])) list.push(list[0]);
    var last = list.length - 1;
    return list.map(function (value, i) {
      var pct = Math.round((i / last) * 1000) / 10;
      return pct + "%{" + wrap(value) + "}";
    }).join("");
  }

  function turn(n) { return "transform:rotate(" + n + "deg)"; }

  var SCENES = {
    breath: {
      water: "pool", dur: "6s", place: "place-low", flags: ["bubbles", "mouth"], hold: 0,
      ease: "ease-in-out",
      doll: ["translateY(8px)", "translateY(8px)", "translateY(-52px)", "translateY(8px)"],
      dollAt: ["0%", "62%", "78%", "100%"],
      bubbles: [1, 1, 0, 1],
      bubAt: ["0%", "64%", "82%", "100%"],
      armL: [0, 8], armR: [0, -8]
    },
    "float-back": {
      water: "pool", dur: "4.8s", flags: ["full"],
      doll: ["rotate(-88deg) scale(0.72)"],
      armL: [62, 74], armR: [-62, -74],
      thighL: [18, 26], thighR: [-18, -26],
      rig: ["translateY(6px)", "translateY(-8px)"]
    },
    "float-tummy": {
      water: "pool", dur: "4.6s", flags: ["full", "face"],
      doll: ["rotate(86deg) scale(0.72)"],
      armL: [8, 18], armR: [-8, -18],
      rig: ["translateY(5px)", "translateY(-7px)"]
    },
    glide: {
      water: "pool", dur: "4.4s", flags: ["full", "face"],
      doll: ["rotate(84deg) scale(0.72)"],
      armL: [158], armR: [-158],
      rig: ["translateX(-72px)", "translateX(72px)"]
    },
    flutter: {
      water: "pool", dur: "3.2s", kickDur: "0.55s", flags: ["full", "face", "splash"],
      doll: ["rotate(82deg) scale(0.72)"],
      armL: [150], armR: [-150],
      thighL: [-16, 18], thighR: [16, -18],
      calfL: [-8, 16], calfR: [8, -16],
      rig: ["translateX(-18px)", "translateX(18px)"]
    },
    frog: {
      water: "pool", dur: "2.8s", flags: ["full", "face", "splash"],
      doll: ["rotate(82deg) scale(0.72)"],
      armL: [150], armR: [-150],
      thighL: [0, 16, 34, 0], thighR: [0, -16, -34, 0],
      calfL: [0, 28, 74, 0], calfR: [0, -28, -74, 0],
      thighAt: ["0%", "28%", "52%", "100%"],
      calfAt: ["0%", "28%", "52%", "100%"],
      rig: ["translateX(-20px)", "translateX(36px)"]
    },
    dolphin: {
      water: "pool", dur: "1.15s", flags: ["full", "face", "splash"],
      doll: ["rotate(76deg) scale(0.72)", "rotate(90deg) scale(0.72)"],
      armL: [152], armR: [-152],
      thighL: [18, -16], thighR: [18, -16],
      calfL: [12, -8], calfR: [12, -8],
      rig: ["translateX(-14px)", "translateX(14px)"]
    },
    scull: {
      water: "pool", dur: "1.8s", flags: ["full"],
      doll: ["rotate(-84deg) scale(0.72)"],
      armL: [12, 48], armR: [-12, -48],
      rig: ["translateY(3px)", "translateY(-4px)"]
    },
    tread: {
      water: "pool", dur: "1.6s", kickDur: "0.7s", place: "place-low", flags: ["splash"],
      armL: [14, 46], armR: [-14, -46],
      thighL: [8, -10], thighR: [-8, 10],
      calfL: [10, 42], calfR: [-42, -10],
      rig: ["translateY(0px)", "translateY(-12px)"]
    },
    streamline: {
      water: "pool", dur: "3.6s", flags: ["full", "face"],
      doll: ["rotate(88deg) scale(0.66)"],
      armL: [160], armR: [-160],
      rig: ["translateX(-96px)", "translateX(96px)"]
    },
    "roll-breathe": {
      water: "pool", dur: "3.2s", flags: ["full", "splash"], hold: 2,
      doll: ["rotate(86deg) scale(0.72)", "rotate(48deg) scale(0.74)", "rotate(24deg) scale(0.76)", "rotate(86deg) scale(0.72)"],
      dollAt: ["0%", "30%", "48%", "100%"],
      faceOp: [1, 0.35, 0, 1],
      faceAt: ["0%", "30%", "48%", "100%"],
      armL: [148, 148, 40, 148],
      armAt: ["0%", "30%", "48%", "100%"],
      armR: [-40],
      thighL: [-10, 12], thighR: [10, -12],
      kickDur: "0.5s",
      rig: ["translateX(-16px)", "translateX(28px)"]
    },
    "soft-body": {
      water: "pool", dur: "5.5s", flags: ["full"],
      doll: ["rotate(-82deg) scale(0.74)", "rotate(-90deg) scale(0.74)"],
      armL: [6, 28], armR: [-4, -22],
      thighL: [4, 14], thighR: [-4, -12],
      rig: ["translateY(4px)", "translateY(-6px)"]
    },
    freestyle: {
      water: "pool", dur: "1.7s", kickDur: "0.42s", flags: ["full", "splash"],
      armEase: "linear",
      doll: ["rotate(74deg) scale(0.72)", "rotate(88deg) scale(0.72)"],
      armL: [152, 96, 22, 88, 152],
      armR: [-22, -88, -152, -96, -22],
      armAt: ["0%", "22%", "40%", "68%", "100%"],
      thighL: [-14, 18], thighR: [14, -18],
      calfL: [-6, 14], calfR: [6, -14],
      faceOp: [1, 0.15, 1],
      faceAt: ["0%", "50%", "100%"],
      rig: ["translateX(-22px)", "translateX(22px)"]
    },
    backstroke: {
      water: "pool", dur: "1.8s", kickDur: "0.45s", flags: ["full", "splash"],
      armEase: "linear",
      doll: ["rotate(-74deg) scale(0.72)", "rotate(-88deg) scale(0.72)"],
      armL: [150, 88, 18, 90, 150],
      armR: [-18, -90, -150, -88, -18],
      armAt: ["0%", "22%", "40%", "68%", "100%"],
      thighL: [-12, 14], thighR: [12, -14],
      calfL: [-4, 12], calfR: [4, -12],
      rig: ["translateX(20px)", "translateX(-20px)"]
    },
    breaststroke: {
      water: "pool", dur: "3.2s", flags: ["full", "splash"],
      armEase: "linear",
      doll: ["rotate(82deg) scale(0.72)"],
      armL: [156, 156, 92, 24, 156],
      armR: [-156, -156, -92, -24, -156],
      armAt: ["0%", "16%", "36%", "54%", "100%"],
      thighL: [0, 0, 10, 32, 0],
      thighR: [0, 0, -10, -32, 0],
      calfL: [0, 0, 18, 72, 0],
      calfR: [0, 0, -18, -72, 0],
      thighAt: ["0%", "30%", "48%", "70%", "100%"],
      calfAt: ["0%", "30%", "48%", "70%", "100%"],
      faceOp: [1, 1, 0.1, 0.85, 1],
      faceAt: ["0%", "16%", "40%", "62%", "100%"],
      rig: ["translateX(-8px)", "translateX(8px)", "translateX(10px)", "translateX(42px)", "translateX(-8px)"],
      rigAt: ["0%", "20%", "46%", "72%", "100%"]
    },
    butterfly: {
      water: "pool", dur: "1.7s", kickDur: "0.85s", flags: ["full", "splash"],
      armEase: "linear", kickEase: "ease-in-out",
      doll: ["rotate(74deg) scale(0.72)", "rotate(92deg) scale(0.72)"],
      dollEase: "ease-in-out",
      armL: [150, 108, 28, 150],
      armR: [-150, -108, -28, -150],
      armAt: ["0%", "22%", "46%", "100%"],
      thighL: [20, -18], thighR: [20, -18],
      calfL: [14, -10], calfR: [14, -10],
      faceOp: [1, 0.12, 1],
      faceAt: ["0%", "42%", "100%"],
      rig: ["translate(-16px, 4px)", "translate(16px, -2px)"]
    },
    sidestroke: {
      water: "pool", dur: "2.4s", flags: ["full", "splash"],
      doll: ["rotate(50deg) scale(0.76)", "rotate(60deg) scale(0.76)"],
      armL: [18, 108, 18],
      armR: [-12, -42, -12],
      armAt: ["0%", "42%", "100%"],
      thighL: [0, 38, 0], thighR: [0, -38, 0],
      calfL: [0, 22, 0], calfR: [0, -22, 0],
      thighAt: ["0%", "46%", "100%"],
      calfAt: ["0%", "46%", "100%"],
      rig: ["translateX(-16px)", "translateX(22px)"]
    },
    "elementary-back": {
      water: "pool", dur: "3.6s", flags: ["full", "splash"],
      doll: ["rotate(-80deg) scale(0.72)"],
      armL: [0, 82, 8, 0, 0],
      armR: [0, -82, -8, 0, 0],
      armAt: ["0%", "22%", "40%", "78%", "100%"],
      thighL: [0, 0, 30, 6, 0],
      thighR: [0, 0, -30, -6, 0],
      calfL: [0, 0, 70, 8, 0],
      calfR: [0, 0, -70, -8, 0],
      thighAt: ["0%", "36%", "58%", "78%", "100%"],
      calfAt: ["0%", "36%", "58%", "78%", "100%"]
    },
    "survival-back": {
      water: "pool", dur: "6s", flags: ["full"],
      doll: ["rotate(-84deg) scale(0.74)"],
      armL: [0, 0, 24, 0],
      armR: [0, 0, -24, 0],
      armAt: ["0%", "18%", "42%", "100%"],
      rig: ["translateY(3px)", "translateY(-5px)"]
    },
    "sit-entry": {
      water: "pool", dur: "4s", flags: ["deck"], place: "place-high", hold: 0,
      doll: ["rotate(2deg)", "rotate(8deg)", "rotate(0deg)", "rotate(2deg)"],
      dollAt: ["0%", "28%", "55%", "100%"],
      thighL: [76], thighR: [-76], calfL: [-66], calfR: [66],
      rig: ["translateY(-28px)", "translateY(18px)", "translateY(96px)", "translateY(-28px)"],
      rigAt: ["0%", "24%", "52%", "100%"]
    },
    "stand-entry": {
      water: "pool", dur: "3.6s", flags: ["deck"], place: "place-high",
      thighL: [0, -42, 0, 0],
      thighR: [0, 0, -18, 0],
      calfL: [0, 28, 0, 0],
      calfR: [0, 0, 16, 0],
      thighAt: ["0%", "28%", "55%", "100%"],
      calfAt: ["0%", "28%", "55%", "100%"],
      rig: ["translateY(-46px)", "translateY(-8px)", "translateY(70px)", "translateY(-46px)"],
      rigAt: ["0%", "30%", "62%", "100%"]
    },
    "shallow-dive": {
      water: "pool", dur: "3.2s", flags: ["deck"], hold: 2,
      armL: [156], armR: [-156],
      doll: ["rotate(4deg) scale(0.92)", "rotate(36deg) scale(0.86)", "rotate(78deg) scale(0.76)", "rotate(4deg) scale(0.92)"],
      dollAt: ["0%", "28%", "58%", "100%"],
      faceOp: [0, 0.35, 1, 0],
      faceAt: ["0%", "28%", "58%", "100%"],
      rig: ["translate(-40px, -34px)", "translate(8px, 6px)", "translate(70px, 24px)", "translate(-40px, -34px)"],
      rigAt: ["0%", "28%", "58%", "100%"]
    },
    "climb-out": {
      water: "pool", dur: "3.4s", flags: ["deck"], place: "place-low", hold: 1,
      armL: [64, 148], armR: [-64, -148],
      thighL: [8, 24], thighR: [-8, -20],
      rig: ["translateY(52px)", "translateY(-64px)"]
    },
    "river-entry": {
      water: "river", dur: "3.8s", flags: ["shore"], place: "place-left",
      thighL: [0, -32, 0], thighR: [-28, 0, -22],
      calfL: [0, 16, 0], calfR: [14, 0, 10],
      thighAt: ["0%", "50%", "100%"],
      calfAt: ["0%", "50%", "100%"],
      rig: ["translate(-16px, -8px)", "translate(34px, 26px)"]
    },
    "river-exit": {
      water: "river", dur: "3.8s", flags: ["shore"], place: "place-left",
      thighL: [-28, 8, -24], thighR: [8, -28, 6],
      thighAt: ["0%", "50%", "100%"],
      rig: ["translate(46px, 22px)", "translate(-24px, -6px)"]
    },
    "ocean-entry": {
      water: "ocean", dur: "4s", flags: ["shore", "wave"],
      thighL: [0, -30, 0], thighR: [-26, 0, -18],
      thighAt: ["0%", "50%", "100%"],
      rig: ["translateX(-60px)", "translateX(24px)"]
    },
    "ocean-exit": {
      water: "ocean", dur: "4s", flags: ["shore", "wave"], hold: 1,
      doll: ["rotate(0deg)", "rotate(-14deg)", "rotate(0deg)"],
      dollAt: ["0%", "46%", "100%"],
      thighL: [0, -26, 0], thighR: [-22, 0, -16],
      thighAt: ["0%", "50%", "100%"],
      rig: ["translateX(40px)", "translateX(-58px)", "translateX(40px)"],
      rigAt: ["0%", "55%", "100%"]
    },
    sighting: {
      water: "lake", dur: "3.4s", flags: ["full", "mark", "splash"], hold: 2,
      armEase: "linear", kickDur: "0.48s",
      doll: ["rotate(84deg) scale(0.72)", "rotate(52deg) scale(0.74)", "rotate(30deg) scale(0.76)", "rotate(84deg) scale(0.72)"],
      dollAt: ["0%", "32%", "50%", "100%"],
      faceOp: [1, 0.4, 0, 1],
      faceAt: ["0%", "32%", "50%", "100%"],
      armL: [148, 90, 36, 148],
      armR: [-30, -140, -148, -30],
      armAt: ["0%", "34%", "52%", "100%"],
      thighL: [-12, 14], thighR: [12, -14],
      rig: ["translateX(-24px)", "translateX(36px)"]
    },
    "wave-breath": {
      water: "ocean", dur: "3.6s", flags: ["full", "wave"], hold: 1,
      doll: ["rotate(84deg) scale(0.72)", "rotate(28deg) scale(0.76)", "rotate(84deg) scale(0.72)"],
      dollAt: ["0%", "46%", "100%"],
      faceOp: [1, 0, 1],
      faceAt: ["0%", "46%", "100%"],
      armL: [140, 48, 140],
      armR: [-48, -140, -48],
      armAt: ["0%", "46%", "100%"],
      rig: ["translateY(16px)", "translateY(-26px)", "translateY(16px)"],
      rigAt: ["0%", "46%", "100%"]
    },
    "river-cross": {
      water: "river", dur: "1.8s", kickDur: "0.46s", flags: ["full", "splash", "arrows"],
      armEase: "linear",
      doll: ["rotate(84deg) scale(0.72)"],
      armL: [150, 86, 20, 90, 150],
      armR: [-20, -90, -150, -86, -20],
      armAt: ["0%", "22%", "40%", "68%", "100%"],
      thighL: [-12, 16], thighR: [12, -16],
      faceOp: [1, 0.2, 1],
      faceAt: ["0%", "50%", "100%"],
      rig: ["translateX(-70px)", "translateX(70px)"],
      rigDur: "4.2s"
    },
    "lake-swim": {
      water: "lake", dur: "1.9s", kickDur: "0.48s", flags: ["full", "mark", "splash"],
      armEase: "linear",
      doll: ["rotate(82deg) scale(0.72)"],
      armL: [148, 84, 22, 88, 148],
      armR: [-22, -88, -148, -84, -22],
      armAt: ["0%", "22%", "40%", "68%", "100%"],
      thighL: [-10, 14], thighR: [10, -14],
      faceOp: [1, 0.2, 1],
      faceAt: ["0%", "50%", "100%"],
      rig: ["translateX(-60px)", "translateX(48px)"],
      rigDur: "4.6s"
    },
    "ocean-trip": {
      water: "ocean", dur: "4.6s", flags: ["shore", "shallow", "wave"],
      thighL: [0, -26, -8, 0],
      thighR: [-24, 0, -20, -8],
      thighAt: ["0%", "32%", "62%", "100%"],
      rig: ["translateX(-68px)", "translateX(6px)", "translateX(6px)", "translateX(-68px)"],
      rigAt: ["0%", "34%", "62%", "100%"]
    },
    rip: {
      water: "ocean", dur: "1.8s", kickDur: "0.46s", flags: ["full", "splash", "arrows"],
      armEase: "linear",
      doll: ["rotate(86deg) scale(0.72)"],
      armL: [148, 82, 18, 86, 148],
      armR: [-18, -86, -148, -80, -18],
      armAt: ["0%", "22%", "40%", "68%", "100%"],
      thighL: [-12, 14], thighR: [12, -14],
      faceOp: [1, 0.25, 1],
      faceAt: ["0%", "50%", "100%"],
      rig: ["translate(8px, 4px)", "translate(64px, -6px)"],
      rigDur: "3.8s"
    },
    "help-float": {
      water: "ocean", dur: "4.4s", flags: ["full"], hold: 0,
      doll: ["rotate(-6deg) scale(0.82)", "rotate(4deg) scale(0.8)"],
      armL: [-28, -46], armR: [28, 46],
      thighL: [68, 78], thighR: [-68, -78],
      calfL: [-42, -54], calfR: [42, 54]
    },
    huddle: {
      water: "ocean", dur: "3.4s", flags: ["friends"], place: "place-low",
      armL: [58, 76], armR: [-58, -76],
      rig: ["translateY(3px)", "translateY(-6px)"]
    },
    "reach-rescue": {
      water: "lake", dur: "2.8s", flags: ["shoreRight", "stick", "ring", "shallow"],
      place: "place-right place-high",
      doll: ["rotate(0deg)", "rotate(-8deg)"],
      armL: [12, 118]
    },
    paddle: {
      water: "ocean", dur: "1.85s", flags: ["face", "splash"], board: "prone",
      armEase: "linear",
      doll: ["rotate(80deg) scale(0.74)"],
      armL: [148, 78, 16, 86, 148],
      armR: [-16, -86, -148, -74, -16],
      armAt: ["0%", "24%", "44%", "70%", "100%"],
      rig: ["translateX(-16px)", "translateX(20px)"]
    },
    "duck-dive": {
      water: "ocean", dur: "3.2s", flags: ["face", "wave"], board: "prone", hold: 1,
      doll: ["rotate(76deg) scale(0.74)", "rotate(102deg) scale(0.74)", "rotate(78deg) scale(0.74)", "rotate(76deg) scale(0.74)"],
      dollAt: ["0%", "36%", "68%", "100%"],
      armL: [146, 36, 140, 146],
      armR: [-146, -24, -140, -146],
      armAt: ["0%", "36%", "68%", "100%"],
      rig: ["translate(-8px, 0px)", "translate(18px, 36px)", "translate(48px, -4px)", "translate(-8px, 0px)"],
      rigAt: ["0%", "36%", "68%", "100%"],
      boardMove: ["translateY(0px)", "translateY(10px)", "translateY(0px)", "translateY(0px)"],
      boardAt: ["0%", "36%", "68%", "100%"]
    },
    "turtle-roll": {
      water: "ocean", dur: "3.4s", flags: ["face"], board: "prone", ease: "linear",
      doll: ["rotate(78deg) scale(0.74)"],
      armL: [16, -42, 16],
      armR: [-16, 42, -16],
      armAt: ["0%", "50%", "100%"],
      rig: ["rotate(0deg)", "rotate(180deg)", "rotate(360deg)"],
      rigAt: ["0%", "50%", "100%"]
    },
    "pop-up": {
      water: "ocean", dur: "3.4s", board: "prone", hold: 2, ease: "linear",
      doll: [
        "rotate(80deg) scale(0.76)",
        "rotate(36deg) scale(0.82)",
        "rotate(0deg) scale(0.88)",
        "rotate(0deg) scale(0.88)",
        "rotate(80deg) scale(0.76)"
      ],
      dollAt: ["0%", "28%", "48%", "74%", "100%"],
      armL: [130, 48, 8, 8, 130],
      armR: [-130, -48, -8, -8, -130],
      armAt: ["0%", "28%", "48%", "74%", "100%"],
      thighL: [0, 22, 16, 16, 0],
      thighR: [0, -22, -16, -16, 0],
      calfL: [0, 18, 12, 12, 0],
      calfR: [0, -18, -12, -12, 0],
      thighAt: ["0%", "28%", "48%", "74%", "100%"],
      calfAt: ["0%", "28%", "48%", "74%", "100%"],
      boardMove: ["translateY(0px)", "translateY(36px)", "translateY(152px)", "translateY(152px)", "translateY(0px)"],
      boardAt: ["0%", "28%", "48%", "74%", "100%"]
    },
    takeoff: {
      water: "ocean", dur: "3.6s", flags: ["wave"], board: "prone", hold: 3, ease: "linear",
      doll: [
        "rotate(80deg) scale(0.76)",
        "rotate(80deg) scale(0.76)",
        "rotate(32deg) scale(0.82)",
        "rotate(0deg) scale(0.88)",
        "rotate(80deg) scale(0.76)"
      ],
      dollAt: ["0%", "24%", "46%", "64%", "100%"],
      armL: [140, 24, 36, 6, 140],
      armR: [-24, -140, -36, -6, -24],
      armAt: ["0%", "24%", "46%", "64%", "100%"],
      thighL: [0, 0, 18, 14, 0],
      thighR: [0, 0, -18, -14, 0],
      thighAt: ["0%", "24%", "46%", "64%", "100%"],
      rig: ["translateY(4px)", "translateY(-6px)", "translateY(-10px)", "translateY(-4px)", "translateY(4px)"],
      rigAt: ["0%", "24%", "46%", "64%", "100%"],
      boardMove: ["translateY(0px)", "translateY(0px)", "translateY(48px)", "translateY(152px)", "translateY(0px)"],
      boardAt: ["0%", "24%", "46%", "64%", "100%"]
    },
    trim: {
      water: "ocean", dur: "2.8s", board: "sit",
      doll: ["rotate(0deg)", "rotate(1deg)"],
      thighL: [78], thighR: [-78],
      calfL: [-18], calfR: [18],
      rig: ["translateY(0px)", "translateY(-5px)"]
    },
    "bottom-turn": {
      water: "ocean", dur: "2.8s", board: "sit",
      doll: ["rotate(-4deg)", "rotate(8deg)"],
      thighL: [74], thighR: [-74],
      calfL: [-16], calfR: [16],
      armL: [18, 72],
      rig: ["rotate(-14deg)", "rotate(16deg)"]
    },
    whitewater: {
      water: "ocean", dur: "1.5s", flags: ["face", "foam"], board: "prone",
      doll: ["rotate(76deg) scale(0.74)", "rotate(82deg) scale(0.74)"],
      armL: [14, 32], armR: [-14, -32],
      rig: ["translateX(-22px)", "translateX(36px)"]
    },
    wipeout: {
      water: "ocean", dur: "3.2s", flags: ["foam"], board: "prone", hold: 2, ease: "linear",
      doll: ["rotate(68deg) scale(0.8)", "rotate(150deg) scale(0.78)", "rotate(12deg) scale(0.86)", "rotate(68deg) scale(0.8)"],
      dollAt: ["0%", "34%", "62%", "100%"],
      armL: [146, 158, 12, 146],
      armR: [-146, -158, -8, -146],
      armAt: ["0%", "34%", "62%", "100%"],
      rig: ["translate(-6px, 0px)", "translate(10px, 8px)", "translate(16px, 4px)", "translate(-6px, 0px)"],
      rigAt: ["0%", "34%", "62%", "100%"]
    },
    "catch-wave": {
      water: "ocean", dur: "1.7s", flags: ["face", "wave", "shoreRight", "splash"], board: "prone",
      armEase: "linear",
      doll: ["rotate(80deg) scale(0.74)"],
      armL: [146, 70, 18, 84, 146],
      armR: [-18, -84, -146, -70, -18],
      armAt: ["0%", "24%", "44%", "70%", "100%"],
      rig: ["translateX(-72px)", "translateX(64px)"],
      rigDur: "3.6s"
    },
    "tummy-balance": {
      water: "ocean", dur: "4s", flags: ["face"], board: "prone",
      doll: ["rotate(82deg) scale(0.74)", "rotate(85deg) scale(0.74)"],
      armL: [36, 48], armR: [-36, -48]
    },
    "knees-balance": {
      water: "ocean", dur: "2.6s", board: "knee",
      armL: [68, 96], armR: [-68, -96],
      thighL: [12], thighR: [-12],
      calfL: [72], calfR: [-72],
      rig: ["rotate(-3deg)", "rotate(4deg)"]
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
    var flags = scene.flags || [];
    el.classList.add("doll-stage", "water-" + (scene.water || "pool"));
    el.setAttribute("data-move", move);
    el.setAttribute("role", "img");
    el.setAttribute("aria-label", label || "Amita");
    flags.forEach(function (flag) { el.classList.add("show-" + flag); });

    add(el, "sea");
    var ripples = add(el, "ripples");
    ripples.appendChild(document.createElement("i"));
    ripples.appendChild(document.createElement("i"));
    ripples.appendChild(document.createElement("i"));
    if (flags.indexOf("deck") >= 0) add(el, "deck");
    if (flags.indexOf("shore") >= 0) add(el, "shore");
    if (flags.indexOf("shoreRight") >= 0) add(el, "shore-right");
    if (flags.indexOf("wave") >= 0) add(el, "wave");
    if (flags.indexOf("foam") >= 0) {
      var foam = add(el, "foam");
      foam.appendChild(document.createElement("i"));
      foam.appendChild(document.createElement("i"));
      foam.appendChild(document.createElement("i"));
    }
    if (flags.indexOf("arrows") >= 0) {
      var arrows = add(el, "arrows");
      arrows.appendChild(document.createElement("i"));
      arrows.appendChild(document.createElement("i"));
      arrows.appendChild(document.createElement("i"));
    }
    if (flags.indexOf("friends") >= 0) {
      var friends = add(el, "friends");
      friends.appendChild(document.createElement("i"));
      friends.appendChild(document.createElement("i"));
    }
    if (flags.indexOf("stick") >= 0) add(el, "stick");
    if (flags.indexOf("ring") >= 0) add(el, "ring");
    if (flags.indexOf("mark") >= 0) add(el, "mark");

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
    if (flags.indexOf("bubbles") >= 0) {
      bubbles = add(doll, "bubbles");
      bubbles.appendChild(document.createElement("i"));
      bubbles.appendChild(document.createElement("i"));
      bubbles.appendChild(document.createElement("i"));
    }
    if (flags.indexOf("splash") >= 0) {
      var splash = add(doll, "splash");
      splash.appendChild(document.createElement("i"));
      splash.appendChild(document.createElement("i"));
      splash.appendChild(document.createElement("i"));
    }

    var css = "";
    function timing(values, at, extra) {
      extra = extra || {};
      if (extra.ease) return extra.ease;
      if (scene.ease) return scene.ease;
      return (at || values.length > 2) ? "linear" : "ease-in-out";
    }
    function bind(node, key, values, wrap, at, extra) {
      if (!node || !values || !values.length) return;
      extra = extra || {};
      var shown = values[Math.min(hold, values.length - 1)];
      node.style.transform = wrap(shown).replace("transform:", "");
      if (values.length < 2) return;
      var name = id + "-" + key;
      css += "@keyframes " + name + "{" + frames(values, wrap, at) + "}";
      var time = extra.dur || dur;
      node.style.animation = name + " " + time + " " + timing(values, at, extra) + " infinite";
    }
    function fade(node, key, values, at) {
      if (!node || !values || !values.length) return;
      node.style.opacity = String(values[Math.min(hold, values.length - 1)]);
      if (values.length < 2) return;
      var name = id + "-" + key;
      css += "@keyframes " + name + "{" + frames(values, function (n) { return "opacity:" + n; }, at) + "}";
      node.style.animation = name + " " + dur + " " + timing(values, at, {}) + " infinite";
    }

    var kick = { dur: scene.kickDur, ease: scene.kickEase };
    var arms = { dur: scene.armDur, ease: scene.armEase };
    bind(rig, "rig", scene.rig, function (v) { return "transform:" + v; }, scene.rigAt, { dur: scene.rigDur, ease: scene.rigEase });
    bind(doll, "doll", scene.doll, function (v) { return "transform:" + v; }, scene.dollAt, { dur: scene.dollDur, ease: scene.dollEase });
    bind(board, "board", scene.boardMove, function (v) { return "transform:" + v; }, scene.boardAt);
    bind(armL, "al", scene.armL, turn, scene.armAt, arms);
    bind(armR, "ar", scene.armR, turn, scene.armAt, arms);
    bind(limbL, "tl", scene.thighL, turn, scene.thighAt, kick);
    bind(limbR, "tr", scene.thighR, turn, scene.thighAt, kick);
    bind(calfL, "cl", scene.calfL, turn, scene.calfAt, kick);
    bind(calfR, "cr", scene.calfR, turn, scene.calfAt, kick);
    fade(face, "face", scene.faceOp, scene.faceAt);
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
