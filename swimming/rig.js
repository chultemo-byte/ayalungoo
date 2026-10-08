(function (root) {
  var SVG = "http://www.w3.org/2000/svg";
  var SKIN = "#e1854a";
  var SKIN_FAR = "#c56a30";
  var SUIT = "#c81016";
  var SUIT_FAR = "#9a0c12";
  var HAIR = "#1a120e";
  var HAIR_SOFT = "#3a2818";
  var WHITE = "#fff8f4";
  var REDUCE = false;
  try { REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { REDUCE = false; }

  function el(name, attrs, parent) {
    var node = document.createElementNS(SVG, name);
    if (attrs) Object.keys(attrs).forEach(function (key) {
      if (attrs[key] != null) node.setAttribute(key, attrs[key]);
    });
    if (parent) parent.appendChild(node);
    return node;
  }

  function even(n) {
    var parts = [];
    var i;
    for (i = 0; i < n; i++) parts.push(Math.round((i / (n - 1)) * 1000) / 1000);
    parts[0] = 0;
    parts[n - 1] = 1;
    return parts.join(";");
  }

  function splines(n) {
    var parts = [];
    var i;
    for (i = 0; i < n - 1; i++) parts.push("0.42 0 0.58 1");
    return parts.join(";");
  }

  function asTimes(at, n) {
    if (!at) return even(n);
    return at.map(function (token) { return String(parseFloat(token) / 100); }).join(";");
  }

  function closed(values, at) {
    var list = values.slice();
    var times = at ? at.slice() : null;
    if (!times && list.length === 2) list = [list[0], list[1], list[0]];
    else if (!times && list.length > 1 && list[list.length - 1] !== list[0]) list.push(list[0]);
    return { list: list, times: times };
  }

  function rot(parent, angles, dur, at, hold, ease, pivot) {
    if (!parent || !angles || !angles.length) return;
    var pack = closed(angles, at);
    var cx = pivot ? pivot[0] : 0;
    var cy = pivot ? pivot[1] : 0;
    var vals = pack.list.map(function (n) { return n + " " + cx + " " + cy; });
    var shown = Math.min(hold || 0, vals.length - 1);
    parent.setAttribute("transform", "rotate(" + vals[shown] + ")");
    if (REDUCE || pack.list.length < 2 || pack.list.every(function (n) { return n === pack.list[0]; })) return;
    var anim = el("animateTransform", {
      attributeName: "transform",
      type: "rotate",
      values: vals.join(";"),
      keyTimes: asTimes(pack.times, pack.list.length),
      dur: dur || "2s",
      repeatCount: "indefinite",
      calcMode: ease === "smooth" ? "spline" : "linear"
    }, parent);
    if (ease === "smooth") anim.setAttribute("keySplines", splines(pack.list.length));
  }

  function slide(parent, xs, ys, dur, at, hold, ease) {
    var xlist = [].concat(xs);
    var ylist = [].concat(ys);
    while (ylist.length < xlist.length) ylist.push(ylist[ylist.length - 1]);
    while (xlist.length < ylist.length) xlist.push(xlist[xlist.length - 1]);
    var pairs = xlist.map(function (x, i) { return x + " " + ylist[i]; });
    var pack = closed(pairs, at);
    var shown = pack.list[Math.min(hold || 0, pack.list.length - 1)].split(" ");
    parent.setAttribute("transform", "translate(" + shown[0] + " " + shown[1] + ")");
    if (REDUCE || pack.list.length < 2 || pack.list.every(function (n) { return n === pack.list[0]; })) return;
    var anim = el("animateTransform", {
      attributeName: "transform",
      type: "translate",
      values: pack.list.join(";"),
      keyTimes: asTimes(pack.times, pack.list.length),
      dur: dur || "2s",
      repeatCount: "indefinite",
      calcMode: ease === "smooth" ? "spline" : "linear"
    }, parent);
    if (ease === "smooth") anim.setAttribute("keySplines", splines(pack.list.length));
  }

  function fade(parent, values, dur, at, hold) {
    if (!values) return;
    var pack = closed(values.map(String), at);
    var shown = pack.list[Math.min(hold || 0, pack.list.length - 1)];
    parent.setAttribute("opacity", shown);
    if (REDUCE || pack.list.length < 2) return;
    el("animate", {
      attributeName: "opacity",
      values: pack.list.join(";"),
      keyTimes: asTimes(pack.times, pack.list.length),
      dur: dur || "2s",
      repeatCount: "indefinite",
      calcMode: "linear"
    }, parent);
  }

  function limb(parent, len, width, tone) {
    var w = width / 2;
    el("path", {
      d: "M " + (-w) + ",-2 C " + (-w - 1) + "," + (len * 0.35) + " " + (-w + 1) + "," + (len * 0.7) + " " + (-w + 2) + "," + len +
        " L " + (w - 2) + "," + len +
        " C " + (w) + "," + (len * 0.7) + " " + (w + 1) + "," + (len * 0.35) + " " + w + ",-2 Z",
      fill: tone
    }, parent);
  }

  function arm(parent, side, tone) {
    var near = side === "near";
    var upper = el("g", null, parent);
    el("circle", { cx: 0, cy: 0, r: near ? 13 : 11, fill: tone }, upper);
    limb(upper, 58, near ? 22 : 18, tone);
    var elbow = el("g", { transform: "translate(0 56)" }, upper);
    var fore = el("g", null, elbow);
    el("circle", { cx: 0, cy: 0, r: near ? 12 : 10, fill: tone }, fore);
    limb(fore, 50, near ? 16 : 13, tone);
    var hand = el("g", { transform: "translate(0 48)" }, fore);
    el("circle", { cx: 0, cy: 2, r: near ? 9 : 7.5, fill: tone }, hand);
    el("ellipse", { cx: near ? 8 : 6, cy: -2, rx: near ? 6 : 5, ry: 3.6, fill: tone }, hand);
    el("ellipse", { cx: 1, cy: 12, rx: near ? 7 : 5.5, ry: near ? 8 : 6.5, fill: tone }, hand);
    return { upper: upper, fore: fore };
  }

  function leg(parent, side, tone, soleId) {
    var near = side === "near";
    var thigh = el("g", null, parent);
    el("circle", { cx: 0, cy: 0, r: near ? 16 : 13, fill: tone }, thigh);
    limb(thigh, 74, near ? 26 : 21, tone);
    var knee = el("g", { transform: "translate(0 72)" }, thigh);
    var calf = el("g", null, knee);
    el("circle", { cx: 0, cy: 0, r: near ? 13 : 11, fill: tone }, calf);
    limb(calf, 68, near ? 18 : 15, tone);
    var ankle = el("g", { transform: "translate(0 66)" }, calf);
    var foot = el("g", null, ankle);
    el("circle", { cx: 0, cy: 0, r: 8, fill: tone }, foot);
    el("path", {
      id: soleId || null,
      d: "M -6,1 C 8,-10 26,-12 38,-5 C 40,0 36,8 22,11 C 8,13 -4,10 -6,1 Z",
      fill: tone
    }, foot);
    el("path", {
      d: "M 30,-6 C 34,-8 40,-4 38,-1 C 34,0 30,-2 30,-6 Z",
      fill: near ? "#f0a06a" : "#d48455"
    }, foot);
    return { thigh: thigh, calf: calf, foot: foot };
  }

  function drawGirl(parent) {
    var hipFar = el("g", { transform: "translate(-10 6)" }, parent);
    var farLeg = leg(hipFar, "far", SKIN_FAR, null);

    var torso = el("g", null, parent);
    var shoulderFar = el("g", { transform: "translate(-14 -118)" }, torso);
    var farArm = arm(shoulderFar, "far", SKIN_FAR);

    el("path", {
      d: "M -22,18 C -28,-16 -26,-62 -18,-96 C -12,-122 0,-138 12,-140 C 26,-136 34,-112 34,-78 C 36,-40 30,-8 18,16 C 8,28 -8,28 -22,18 Z",
      fill: SUIT
    }, torso);
    el("path", {
      d: "M -16,-20 C -6,-8 8,-4 18,-16",
      fill: "none",
      stroke: WHITE,
      "stroke-width": 2.2,
      "stroke-linecap": "round"
    }, torso);
    el("path", {
      d: "M 6,-78 H 20 M 13,-90 V -66",
      fill: "none",
      stroke: WHITE,
      "stroke-width": 3.4,
      "stroke-linecap": "round"
    }, torso);
    el("path", {
      d: "M 2,-128 C 8,-118 10,-108 8,-100",
      fill: "none",
      stroke: HAIR,
      "stroke-width": 2.6,
      "stroke-linecap": "round"
    }, torso);
    el("ellipse", { cx: 14, cy: -96, rx: 7.5, ry: 6, fill: "#e10612", stroke: HAIR, "stroke-width": 1.3 }, torso);
    el("path", { d: "M 9,-96 H 19", stroke: WHITE, "stroke-width": 1.5, "stroke-linecap": "round" }, torso);
    el("path", {
      d: "M 4,-136 C 2,-150 14,-156 18,-144 L 12,-132 C 8,-138 6,-136 4,-136 Z",
      fill: SKIN
    }, torso);

    var neck = el("g", { transform: "translate(10 -132)" }, torso);
    var head = el("g", null, neck);
    var hair = el("g", null, head);
    [
      [-22, -28, 15], [-14, -50, 16], [2, -62, 17], [20, -64, 16], [36, -50, 14],
      [40, -32, 12], [-26, -10, 12], [-8, -36, 11], [14, -46, 10], [28, -40, 9]
    ].forEach(function (curl) {
      el("circle", { cx: curl[0], cy: curl[1], r: curl[2], fill: HAIR }, hair);
    });
    [
      [-10, -46, 6], [8, -58, 6], [24, -52, 5], [34, -36, 4]
    ].forEach(function (curl) {
      el("circle", { cx: curl[0], cy: curl[1], r: curl[2], fill: HAIR_SOFT }, hair);
    });
    var trail = el("g", null, hair);
    [[-30, -4, 8], [-38, 8, 6], [-24, 10, 5]].forEach(function (curl) {
      el("circle", { cx: curl[0], cy: curl[1], r: curl[2], fill: HAIR }, trail);
    });
    el("circle", { id: "headball", cx: 14, cy: -32, r: 30, fill: SKIN }, head);
    el("ellipse", { cx: -2, cy: -30, rx: 7, ry: 11, fill: "#c56d38" }, head);
    el("path", {
      d: "M 8,-58 C 16,-70 34,-62 36,-48 C 28,-56 16,-56 8,-58 Z",
      fill: "#f3b08a"
    }, head);
    el("ellipse", { cx: 24, cy: -40, rx: 8, ry: 6.2, fill: WHITE }, head);
    el("circle", { cx: 26.5, cy: -40, r: 3.4, fill: "#3a2416" }, head);
    el("circle", { cx: 27.8, cy: -41.2, r: 1.15, fill: WHITE }, head);
    el("path", {
      d: "M 18,-48 Q 26,-50 32,-44",
      fill: "none",
      stroke: "#6b3a28",
      "stroke-width": 1.4,
      "stroke-linecap": "round"
    }, head);
    el("path", {
      id: "nose",
      d: "M 36,-38 C 48,-34 50,-26 40,-22 C 34,-24 34,-32 36,-38 Z",
      fill: "#d97840"
    }, head);
    el("path", {
      id: "mouth",
      d: "M 30,-16 Q 40,-12 34,-8",
      fill: "none",
      stroke: "#8a3d28",
      "stroke-width": 2.4,
      "stroke-linecap": "round"
    }, head);
    el("ellipse", { cx: 26, cy: -12, rx: 5, ry: 2.6, fill: "#e07858", opacity: 0.7 }, head);
    var bubbles = el("g", { id: "bubbles" }, head);
    [[46, -10, 5.2, 0], [56, -6, 3.6, 0.32], [40, -4, 3, 0.55], [52, -14, 2.8, 0.16]].forEach(function (spot) {
      var dot = el("circle", {
        cx: spot[0], cy: spot[1], r: spot[2],
        fill: "rgba(255,255,255,.55)",
        stroke: "rgba(255,255,255,.95)",
        "stroke-width": 1.6
      }, bubbles);
      if (!REDUCE) {
        el("animate", {
          attributeName: "cy",
          values: spot[1] + ";" + (spot[1] - 6) + ";" + (spot[1] - 12),
          dur: "1.35s",
          begin: spot[3] + "s",
          repeatCount: "indefinite"
        }, dot);
        el("animate", {
          attributeName: "opacity",
          values: "0;0.95;0",
          dur: "1.35s",
          begin: spot[3] + "s",
          repeatCount: "indefinite"
        }, dot);
      }
    });

    var shoulderNear = el("g", { transform: "translate(18 -108)" }, torso);
    var nearArm = arm(shoulderNear, "near", SKIN);
    el("ellipse", {
      cx: 18, cy: -108, rx: 18, ry: 13,
      fill: SUIT, stroke: WHITE, "stroke-width": 2
    }, torso);

    var hipNear = el("g", { transform: "translate(8 4)" }, parent);
    var nearLeg = leg(hipNear, "near", SKIN, "sole");
    el("path", {
      d: "M -16,8 C -8,30 6,36 16,30 C 24,18 20,2 10,-4 C 0,-2 -10,0 -16,8 Z",
      fill: SUIT,
      stroke: WHITE,
      "stroke-width": 1.6
    }, parent);

    if (!REDUCE) {
      rot(hair, [-6, 5, -6], "2.4s", null, 0, "smooth");
      rot(trail, [0, 14, 0], "1.8s", null, 0, "smooth");
    }
    return {
      torso: torso,
      head: head,
      bubbles: bubbles,
      nearUpper: nearArm.upper,
      nearFore: nearArm.fore,
      farUpper: farArm.upper,
      farFore: farArm.fore,
      nearThigh: nearLeg.thigh,
      nearCalf: nearLeg.calf,
      nearFoot: nearLeg.foot,
      farThigh: farLeg.thigh,
      farCalf: farLeg.calf,
      farFoot: farLeg.foot
    };
  }

  var VIEW = {
    stand: { x: 230, y: 348, rot: 0, water: 250 },
    prone: { x: 230, y: 292, rot: 90, water: 286 },
    supine: { x: 220, y: 300, rot: 90, water: 292, flip: true },
    surf: { x: 230, y: 300, rot: 0, water: 430 },
    sit: { x: 210, y: 300, rot: 0, water: 430 },
    board: { x: 250, y: 252, rot: 90, water: 286 },
    kneel: { x: 230, y: 300, rot: 0, water: 430 }
  };

  var flutter = { nearT: [-22, 28], farT: [24, -20], nearC: [4, 18], farC: [14, 0], kickDur: "0.44s", nearFoot: [78], farFoot: [78] };
  var dolphin = { nearT: [26, -32], farT: [26, -32], nearC: [14, -12], farC: [14, -12], kickDur: "0.8s", nearFoot: [72], farFoot: [72] };
  var pointed = { nearFoot: [76], farFoot: [76] };
  var flat = { nearFoot: [0], farFoot: [0] };

  function mix() {
    var out = {};
    var i;
    for (i = 0; i < arguments.length; i++) {
      var src = arguments[i];
      Object.keys(src).forEach(function (key) { out[key] = src[key]; });
    }
    return out;
  }

  var freeArms = {
    nearU: [180, 250, 340, 450, 540],
    nearF: [16, 54, 18, 8, 16],
    farU: [340, 450, 540, 610, 700],
    farF: [18, 8, 16, 54, 18],
    armAt: ["0%", "22%", "42%", "65%", "100%"],
    armDur: "1.8s"
  };

  var SCENES = {
    breath: mix(flat, {
      view: "stand", dur: "5.6s", hold: 0, ease: "smooth",
      waterY: 196,
      head: [24, 24, -18, 24],
      y: [360, 360, 318, 360],
      moveAt: ["0%", "60%", "78%", "100%"],
      headAt: ["0%", "60%", "78%", "100%"],
      nearU: [-20, -8], farU: [12, 6],
      nearF: [10, 16], farF: [8, 6],
      bubbles: ["1", "1", "0", "1"],
      bubbleAt: ["0%", "62%", "82%", "100%"]
    }),
    "float-back": mix(flat, {
      view: "supine", dur: "4.6s",
      nearU: [108, 124], farU: [100, 118],
      nearF: [8], farF: [8],
      nearT: [-28, -36], farT: [26, 34],
      nearC: [6], farC: [6],
      nearFoot: [20], farFoot: [20],
      bob: [0, -6, 0]
    }),
    "float-tummy": mix(pointed, {
      view: "prone", dur: "4.4s",
      nearU: [150, 162], farU: [146, 158],
      nearF: [8], farF: [8],
      head: [6],
      bob: [0, 5, 0]
    }),
    glide: mix(pointed, {
      view: "prone", dur: "4.2s", splash: true,
      nearU: [176], farU: [176], nearF: [4], farF: [4],
      head: [4],
      x: [110, 200]
    }),
    flutter: mix(flutter, {
      view: "prone", dur: "3s", splash: true,
      nearU: [170], farU: [168], nearF: [6], farF: [6],
      head: [4]
    }),
    frog: mix(pointed, {
      view: "prone", dur: "2.8s", splash: true, ease: "smooth",
      nearU: [172], farU: [172], nearF: [4], farF: [4],
      head: [4],
      nearT: [0, -8, -34, 0], farT: [0, -8, -34, 0],
      nearC: [0, 24, 78, 0], farC: [0, 24, 78, 0],
      kickAt: ["0%", "28%", "52%", "100%"]
    }),
    dolphin: mix(dolphin, {
      view: "prone", dur: "1.15s", splash: true, ease: "smooth", x: 200,
      nearU: [180], farU: [180], nearF: [6], farF: [6],
      head: [4],
      spin: [86, 98, 86],
      torso: [14, -16, 14]
    }),
    scull: mix(flat, {
      view: "supine", dur: "1.8s", ease: "smooth",
      nearU: [70, 110], farU: [64, 104],
      nearF: [20, 48], farF: [18, 44],
      head: [-6]
    }),
    tread: mix(flat, {
      view: "stand", dur: "1.5s", waterY: 300, splash: true,
      nearU: [-30, -70], farU: [-20, 16],
      nearF: [20, 50], farF: [16, 40],
      nearT: [8, -18], farT: [-16, 10],
      nearC: [10, 36], farC: [28, 8],
      kickDur: "0.7s",
      bob: [0, -8, 0]
    }),
    streamline: mix(pointed, {
      view: "prone", dur: "3.4s",
      nearU: [178], farU: [178], nearF: [2], farF: [2],
      head: [2],
      x: [110, 200]
    }),
    "roll-breathe": mix(flutter, {
      view: "prone", dur: "3.2s", splash: true, hold: 2,
      spin: [90, 86, 90],
      head: [4, -62, 4],
      headAt: ["0%", "48%", "100%"],
      nearU: [200, 450, 540],
      farU: [380, 250, 200],
      nearF: [12, 8, 12],
      farF: [16, 48, 16],
      armAt: ["0%", "48%", "100%"]
    }),
    "soft-body": mix(flat, {
      view: "supine", dur: "5.2s", ease: "smooth",
      nearU: [20, 36], farU: [14, 28],
      nearF: [8, 18], farF: [6, 14],
      nearT: [4, 12], farT: [-4, -10],
      nearC: [4, 10], farC: [4, 8],
      bob: [0, 5, 0]
    }),
    freestyle: mix(flutter, freeArms, {
      view: "prone", dur: "1.8s", splash: true,
      spin: [90, 86, 92, 88, 90],
      head: [4, 4, 4, -76, 4],
      headAt: ["0%", "22%", "42%", "65%", "100%"]
    }),
    backstroke: mix(flutter, {
      view: "supine", dur: "1.8s", splash: true,
      spin: [88, 94, 88],
      head: [-6, -2, -6],
      nearU: [540, 450, 360, 270, 180],
      nearF: [8, 14, 10, 8, 8],
      farU: [360, 270, 180, 90, 0],
      farF: [10, 8, 8, 14, 10],
      armAt: ["0%", "25%", "50%", "75%", "100%"],
      armDur: "1.8s"
    }),
    breaststroke: mix(pointed, {
      view: "prone", dur: "3.2s", splash: true,
      spin: [90, 86, 90],
      head: [4, 4, -70, -18, 4],
      headAt: ["0%", "18%", "44%", "66%", "100%"],
      nearU: [180, 220, 260, 320, 180],
      farU: [180, 220, 260, 320, 180],
      nearF: [8, 28, 48, 62, 8],
      farF: [8, 28, 48, 62, 8],
      armAt: ["0%", "18%", "42%", "60%", "100%"],
      nearT: [0, -6, -42, 8, 0],
      farT: [0, -6, -42, 8, 0],
      nearC: [0, 16, 82, 10, 0],
      farC: [0, 16, 82, 10, 0],
      kickAt: ["0%", "24%", "52%", "74%", "100%"],
      x: [190, 200, 220, 270, 190],
      moveAt: ["0%", "20%", "46%", "72%", "100%"]
    }),
    butterfly: mix(dolphin, {
      view: "prone", dur: "1.7s", splash: true, x: 200,
      spin: [92, 84, 96, 86, 92],
      spinAt: ["0%", "28%", "48%", "70%", "100%"],
      torso: [16, -8, 22, -28, 16],
      torsoAt: ["0%", "28%", "48%", "70%", "100%"],
      head: [2, 4, -8, 2],
      headAt: ["0%", "30%", "68%", "100%"],
      nearU: [180, 250, 360, 450, 540],
      farU: [192, 262, 372, 436, 552],
      nearF: [10, 36, 16, 8, 10],
      farF: [10, 36, 16, 8, 10],
      armAt: ["0%", "28%", "48%", "70%", "100%"],
      armDur: "1.7s",
      kickDur: "0.85s"
    }),
    sidestroke: mix(pointed, {
      view: "prone", dur: "2.4s", splash: true, ease: "smooth", x: 220,
      spin: [62, 74, 62],
      nearU: [20, 150, 20], farU: [150, 40, 150],
      nearF: [10, 16, 10], farF: [12, 30, 12],
      armAt: ["0%", "46%", "100%"],
      nearT: [10, -40, 10], farT: [-8, 28, -8],
      nearC: [8, 24, 8], farC: [8, 16, 8],
      kickAt: ["0%", "46%", "100%"]
    }),
    "elementary-back": mix(flat, {
      view: "supine", dur: "3.6s", splash: true,
      nearU: [10, -80, -170, 10],
      farU: [10, -80, -170, 10],
      nearF: [6, 10, 8, 6],
      farF: [6, 10, 8, 6],
      armAt: ["0%", "28%", "48%", "100%"],
      nearT: [0, 0, -32, 0], farT: [0, 0, -32, 0],
      nearC: [0, 0, 74, 0], farC: [0, 0, 74, 0],
      kickAt: ["0%", "36%", "60%", "100%"],
      nearFoot: [10, 10, 30, 10], farFoot: [10, 10, 30, 10]
    }),
    "survival-back": mix(flat, {
      view: "supine", dur: "6s", ease: "smooth",
      nearU: [12, 12, 36, 12], farU: [10, 10, 32, 10],
      nearF: [4], farF: [4],
      armAt: ["0%", "20%", "44%", "100%"],
      head: [-6],
      bob: [0, 4, 0]
    }),
    "sit-entry": mix(flat, {
      view: "stand", dur: "4s", deck: true, hold: 0,
      y: [210, 300, 430, 210],
      moveAt: ["0%", "24%", "55%", "100%"],
      nearT: [-74], farT: [-70],
      nearC: [18], farC: [16],
      nearU: [-10], farU: [8], nearF: [8], farF: [6],
      waterY: 390
    }),
    "stand-entry": mix(flat, {
      view: "stand", dur: "3.6s", deck: true,
      y: [200, 280, 430, 200],
      moveAt: ["0%", "30%", "62%", "100%"],
      nearT: [0, -36, 0, 0], farT: [0, 0, -16, 0],
      nearC: [0, 22, 0, 0], farC: [0, 0, 12, 0],
      kickAt: ["0%", "30%", "62%", "100%"],
      nearU: [-8], farU: [6], nearF: [6], farF: [6],
      waterY: 390
    }),
    "shallow-dive": mix(pointed, {
      view: "stand", dur: "3.2s", deck: true, hold: 2,
      x: [130, 180, 200, 130],
      y: [200, 280, 360, 200],
      spin: [0, 40, 86, 0],
      moveAt: ["0%", "28%", "58%", "100%"],
      nearU: [170], farU: [170], nearF: [4], farF: [4],
      head: [0, 8, 10, 0],
      waterY: 390
    }),
    "climb-out": mix(flat, {
      view: "stand", dur: "3.4s", deck: true, hold: 1,
      y: [430, 200],
      nearU: [-20, -150], farU: [-16, -146],
      nearF: [10, 8], farF: [8, 6],
      nearT: [6, -10], farT: [-4, 8],
      waterY: 390
    }),
    "river-entry": {
      view: "stand", water: "river", dur: "3.8s", shore: true, ease: "smooth",
      x: [140, 250], y: [300, 372], waterY: 360,
      nearT: [0, -30, 0], farT: [-26, 0, -18],
      nearC: [0, 16, 0], farC: [14, 0, 10],
      nearFoot: [-2], farFoot: [-2],
      nearU: [-12], farU: [8], nearF: [6], farF: [6]
    },
    "river-exit": {
      view: "stand", water: "river", dur: "3.8s", shore: true, ease: "smooth",
      x: [260, 140], y: [372, 300], waterY: 360,
      nearT: [-24, 8, -20], farT: [6, -24, 4],
      nearC: [12, 0, 8], farC: [0, 14, 0],
      nearFoot: [0], farFoot: [0],
      nearU: [-10], farU: [6], nearF: [6], farF: [4]
    },
    "ocean-entry": {
      view: "stand", water: "ocean", dur: "4s", shore: true, wave: true, ease: "smooth",
      x: [130, 260], waterY: 360,
      nearT: [0, -28, 0], farT: [-24, 0, -16],
      nearC: [0, 14, 0], farC: [12, 0, 8],
      nearFoot: [0], farFoot: [0],
      nearU: [-14, -28], farU: [6, 16], nearF: [8], farF: [6]
    },
    "ocean-exit": {
      view: "stand", water: "ocean", dur: "4s", shore: true, wave: true, hold: 1, ease: "smooth",
      x: [280, 130, 280],
      moveAt: ["0%", "55%", "100%"],
      waterY: 360,
      spin: [0, -12, 0],
      nearT: [0, -26, 0], farT: [-20, 0, -14],
      nearC: [0, 12, 0], farC: [10, 0, 8],
      nearFoot: [0], farFoot: [0],
      nearU: [-8], farU: [10], nearF: [6], farF: [4]
    },
    sighting: mix(flutter, freeArms, {
      view: "prone", water: "lake", dur: "3.4s", splash: true, mark: true, hold: 2,
      armDur: "1.7s",
      spin: [88, 64, 50, 88],
      spinAt: ["0%", "34%", "52%", "100%"],
      head: [4, -28, -46, 4],
      headAt: ["0%", "34%", "52%", "100%"],
      x: [120, 210],
      rigDur: "3.4s"
    }),
    "wave-breath": mix(flutter, {
      view: "prone", water: "ocean", dur: "3.4s", wave: true, hold: 1, x: 185,
      spin: [88, 64, 88],
      head: [4, -48, 4],
      headAt: ["0%", "48%", "100%"],
      nearU: [200, 440, 540], farU: [360, 250, 200],
      nearF: [10, 16, 10], farF: [12, 8, 12],
      armAt: ["0%", "48%", "100%"],
      bob: [8, -16, 8]
    }),
    "river-cross": mix(flutter, freeArms, {
      view: "prone", water: "river", dur: "1.8s", splash: true, arrows: true,
      x: [150, 290], rigDur: "4s"
    }),
    "lake-swim": mix(flutter, freeArms, {
      view: "prone", water: "lake", dur: "1.9s", splash: true, mark: true,
      x: [150, 290], rigDur: "4.4s"
    }),
    "ocean-trip": {
      view: "stand", water: "ocean", dur: "4.6s", shore: true, wave: true, shallow: true,
      x: [120, 230, 230, 120],
      moveAt: ["0%", "34%", "62%", "100%"],
      waterY: 400,
      nearT: [0, -24, -8, 0], farT: [-22, 0, -16, -6],
      nearC: [0, 12, 6, 0], farC: [10, 0, 8, 4],
      nearFoot: [0], farFoot: [0],
      nearU: [-10], farU: [8], nearF: [6], farF: [4]
    },
    rip: mix(flutter, freeArms, {
      view: "prone", water: "ocean", dur: "1.8s", splash: true, arrows: true,
      x: [160, 300], rigDur: "3.6s"
    }),
    "help-float": mix(flat, {
      view: "supine", water: "ocean", dur: "4.2s", ease: "smooth", hold: 0,
      nearU: [40, 58], farU: [36, 52],
      nearF: [70, 88], farF: [66, 84],
      nearT: [-70, -82], farT: [-66, -78],
      nearC: [74, 88], farC: [70, 84],
      nearFoot: [20], farFoot: [20],
      head: [-14],
      bob: [0, 6, 0]
    }),
    huddle: mix(flat, {
      view: "stand", water: "ocean", dur: "3.4s", friends: true, waterY: 300,
      nearU: [-40, -58], farU: [24, 40],
      nearF: [16, 28], farF: [12, 22],
      bob: [0, -5, 0]
    }),
    "reach-rescue": mix(flat, {
      view: "stand", water: "lake", dur: "2.8s",
      shoreRight: true, stick: true, ring: true, shallow: true,
      x: 340, waterY: 390,
      nearU: [-16, -130], farU: [8],
      nearF: [6, 12], farF: [6],
      head: [0, -8]
    }),
    paddle: mix(pointed, freeArms, {
      view: "board", water: "ocean", dur: "1.9s", splash: true, board: "prone",
      armDur: "1.9s",
      x: [110, 200]
    }),
    "duck-dive": mix(pointed, {
      view: "board", water: "ocean", dur: "3.2s", wave: true, board: "prone", hold: 1, x: 205,
      spin: [86, 112, 84, 86],
      spinAt: ["0%", "36%", "68%", "100%"],
      y: [286, 340, 260, 286],
      moveAt: ["0%", "36%", "68%", "100%"],
      nearU: [160, 30, 150, 160],
      farU: [160, 24, 150, 160],
      nearF: [8, 16, 8, 8], farF: [8, 14, 8, 8],
      armAt: ["0%", "36%", "68%", "100%"],
      head: [4, 16, 4, 4]
    }),
    "turtle-roll": mix(pointed, {
      view: "board", water: "ocean", dur: "3.4s", board: "prone", ease: "linear",
      spin: [90, 270, 450],
      spinAt: ["0%", "50%", "100%"],
      nearU: [20, -30, 20], farU: [16, 24, 16],
      nearF: [70, 90, 70], farF: [60, 80, 60],
      armAt: ["0%", "50%", "100%"],
      head: [6]
    }),
    "pop-up": mix(flat, {
      view: "surf", water: "ocean", dur: "3.3s", board: "surf", hold: 3, waterY: 430,
      x: [300, 270, 236, 236, 300],
      y: [286, 312, 304, 304, 286],
      spin: [90, 40, -6, -6, 90],
      moveAt: ["0%", "26%", "48%", "74%", "100%"],
      nearU: [180, 20, -108, -108, 180],
      farU: [40, 10, 82, 82, 40],
      nearF: [8, 16, 12, 12, 8],
      farF: [8, 12, 10, 10, 8],
      armAt: ["0%", "26%", "48%", "74%", "100%"],
      nearT: [4, -30, -72, -72, 4],
      farT: [4, 16, 28, 28, 4],
      nearC: [6, 36, 86, 86, 6],
      farC: [6, 8, 18, 18, 6],
      kickAt: ["0%", "26%", "48%", "74%", "100%"],
      nearFoot: [74, 16, 0, 0, 74],
      farFoot: [74, 8, 0, 0, 74],
      head: [4, 0, -4, -4, 4]
    }),
    takeoff: mix(flat, {
      view: "surf", water: "ocean", dur: "3.6s", board: "surf", wave: true, hold: 3,
      x: [280, 300, 255, 250, 280],
      y: [270, 286, 300, 272, 270],
      spin: [90, 88, 36, 0, 90],
      moveAt: ["0%", "22%", "46%", "66%", "100%"],
      nearU: [150, 20, -20, -58, 150],
      farU: [24, 150, 16, 46, 24],
      nearF: [10, 12, 14, 8, 10],
      farF: [8, 10, 12, 8, 8],
      armAt: ["0%", "22%", "46%", "66%", "100%"],
      nearT: [2, 2, -40, -72, 2],
      farT: [2, 2, 18, 28, 2],
      nearC: [4, 4, 42, 86, 4],
      farC: [4, 4, 10, 18, 4],
      kickAt: ["0%", "22%", "46%", "66%", "100%"],
      nearFoot: [72, 72, 10, -4, 72],
      farFoot: [72, 72, 8, 2, 72],
      head: [4, 4, -2, -6, 4]
    }),
    trim: mix(flat, {
      view: "sit", water: "ocean", dur: "2.8s", board: "sit", waterY: 430,
      y: [348, 356, 348],
      nearT: [-86], farT: [-80],
      nearC: [28], farC: [22],
      nearU: [-24], farU: [16],
      nearF: [12], farF: [8],
      nearFoot: [8], farFoot: [6],
      bob: [0, -4, 0]
    }),
    "bottom-turn": mix(flat, {
      view: "surf", water: "ocean", dur: "2.8s", board: "surf",
      y: 262,
      nearT: [-62], farT: [24],
      nearC: [56], farC: [-4],
      nearFoot: [-4], farFoot: [2],
      nearU: [-70, -110], farU: [30, 50],
      nearF: [10], farF: [8],
      head: [-4, 6],
      spin: [-8, 12]
    }),
    whitewater: mix(pointed, {
      view: "board", water: "ocean", dur: "1.5s", board: "prone", foam: true,
      nearU: [20, 36], farU: [16, 30],
      nearF: [16, 28], farF: [14, 24],
      x: [120, 220],
      head: [6]
    }),
    wipeout: mix(flat, {
      view: "surf", water: "ocean", dur: "3.2s", board: "surf", foam: true, hold: 2,
      spin: [70, 160, 8, 70],
      spinAt: ["0%", "34%", "64%", "100%"],
      y: [300, 320, 360, 300],
      moveAt: ["0%", "34%", "64%", "100%"],
      nearU: [150, 168, -20, 150],
      farU: [140, 160, 16, 140],
      nearF: [10, 8, 24, 10],
      farF: [8, 6, 20, 8],
      armAt: ["0%", "34%", "64%", "100%"],
      nearT: [4, 10, -20, 4], farT: [4, -8, 12, 4],
      nearC: [6, 12, 16, 6], farC: [6, 8, 10, 6],
      nearFoot: [40, 20, 0, 40], farFoot: [40, 16, 0, 40]
    }),
    "catch-wave": mix(pointed, freeArms, {
      view: "board", water: "ocean", dur: "1.7s", splash: true, wave: true, shoreRight: true, board: "prone",
      armDur: "1.7s",
      x: [140, 280], rigDur: "3.4s"
    }),
    "tummy-balance": mix(pointed, {
      view: "board", water: "ocean", dur: "4s", board: "prone",
      nearU: [40, 52], farU: [36, 48],
      nearF: [12], farF: [10],
      head: [8],
      bob: [0, 3, 0]
    }),
    "knees-balance": mix(flat, {
      view: "kneel", water: "ocean", dur: "2.6s", board: "kneel", y: 318,
      nearT: [-96], farT: [-90],
      nearC: [96], farC: [90],
      nearFoot: [10], farFoot: [8],
      nearU: [-50, -80], farU: [36, 64],
      nearF: [8], farF: [6],
      spin: [-4, 5]
    })
  };

  function num(value, fallback) {
    if (value == null) return fallback;
    return Array.isArray(value) ? value : [value];
  }

  root.mountRig = function (stage, move, label) {
    var scene = SCENES[move];
    if (!scene) return false;
    var view = VIEW[scene.view] || VIEW.prone;
    var dur = scene.dur || "2.4s";
    var hold = scene.hold || 0;
    var ease = scene.ease || "linear";
    var waterY = scene.waterY != null ? scene.waterY : view.water;
    stage.className = "stage rig-stage water-" + (scene.water || "pool");
    stage.setAttribute("data-dur", dur);
    stage.setAttribute("data-move", move);
    stage.setAttribute("data-view", scene.view);
    stage.setAttribute("role", "img");
    stage.setAttribute("aria-label", label || "Amita");

    var svg = el("svg", {
      viewBox: "0 0 480 560",
      preserveAspectRatio: "xMidYMid meet"
    }, stage);
    el("rect", { class: "rig-sky", x: 0, y: 0, width: 480, height: 560 }, svg);
    el("rect", { class: "rig-water", x: 0, y: waterY, width: 480, height: 560 - waterY }, svg);

    if (scene.deck) {
      el("rect", { x: 0, y: 0, width: 480, height: waterY - 36, fill: "#e6d3b8" }, svg);
      el("rect", { x: 0, y: waterY - 44, width: 480, height: 10, fill: "#c9b08a" }, svg);
    }
    if (scene.shore) {
      el("path", { d: "M 0," + (waterY - 20) + " C 80," + (waterY - 70) + " 140," + waterY + " 220," + (waterY + 10) + " L 0,560 Z", fill: "#e4cf9e" }, svg);
    }
    if (scene.shoreRight) {
      el("path", { d: "M 480," + (waterY - 10) + " C 400," + (waterY - 60) + " 360," + waterY + " 300," + (waterY + 16) + " L 480,560 Z", fill: "#e4cf9e" }, svg);
    }
    if (scene.wave && !REDUCE) {
      var wave = el("path", {
        d: "M -20," + (waterY - 18) + " q 50 22 100 0 t 100 0 t 100 0 t 100 0 t 100 0 t 100 0 t 100 0 t 100 0",
        fill: "none", stroke: "rgba(255,255,255,.7)", "stroke-width": 8, "stroke-linecap": "round"
      }, svg);
      slide(wave, [0, -40], [0, 6], "2.8s", null, 0, "smooth");
    }
    if (scene.mark) {
      el("rect", { x: 430, y: waterY - 110, width: 6, height: 80, fill: "#c9a36a" }, svg);
      el("path", { d: "M 436," + (waterY - 110) + " l 26,12 l -26,12 Z", fill: WHITE }, svg);
    }
    if (scene.arrows) {
      [0, 1, 2].forEach(function (i) {
        var arrow = el("path", {
          d: "M " + (400) + " " + (waterY + 36 + i * 32) + " l 22,-10 l 0,20 Z",
          fill: WHITE
        }, svg);
        if (!REDUCE) slide(arrow, [0, 14], [0, 0], (1.1 + i * 0.15) + "s", null, 0, "smooth");
      });
    }
    if (scene.friends) {
      [[70, waterY - 40], [400, waterY - 34]].forEach(function (spot) {
        el("circle", { cx: spot[0], cy: spot[1], r: 22, fill: "#f4efe4" }, svg);
        el("rect", { x: spot[0] - 16, y: spot[1] + 16, width: 32, height: 28, rx: 10, fill: "#8fbfb6" }, svg);
      });
    }
    if (scene.stick) {
      el("line", { x1: 250, y1: waterY - 24, x2: 90, y2: waterY + 12, stroke: "#c9a36a", "stroke-width": 8, "stroke-linecap": "round" }, svg);
    }
    if (scene.ring) {
      el("circle", { cx: 78, cy: waterY + 20, r: 16, fill: "none", stroke: WHITE, "stroke-width": 5 }, svg);
    }
    if (scene.foam) {
      [[80, 18], [180, 28], [300, 16], [400, 26]].forEach(function (spot) {
        el("ellipse", { cx: spot[0], cy: waterY + spot[1], rx: 16, ry: 8, fill: "rgba(255,255,255,.8)" }, svg);
      });
    }

    var boardY = waterY - 8;
    if (scene.board) {
      var noseX = scene.board === "prone" ? 430 : 390;
      var tailX = scene.board === "prone" ? 40 : 90;
      el("path", {
        id: "board",
        d: "M " + tailX + "," + (boardY + 6) +
          " C " + (tailX + 40) + "," + (boardY - 8) + " " + (noseX - 80) + "," + (boardY - 4) + " " + noseX + "," + (boardY + 2) +
          " C " + (noseX - 30) + "," + (boardY + 16) + " " + (tailX + 50) + "," + (boardY + 18) + " " + tailX + "," + (boardY + 6) + " Z",
        fill: "#f4e4c4",
        stroke: "#e0cfa6",
        "stroke-width": 2
      }, svg);
    }

    var place = el("g", null, svg);
    var spinParent = place;
    if (view.flip || scene.flip) spinParent = el("g", { transform: "scale(1 -1)" }, place);
    var spin = el("g", null, spinParent);
    var bobWrap = el("g", null, spin);
    var scaled = el("g", { id: "girl", transform: "scale(1.16)" }, bobWrap);
    var girl = drawGirl(scaled);
    if (scene.bob) slide(bobWrap, [0], scene.bob, dur, null, 0, "smooth");

    var px = num(scene.x != null ? scene.x : view.x, view.x);
    var py = num(scene.y != null ? scene.y : view.y, view.y);
    slide(place, px, py, scene.rigDur || dur, scene.moveAt, hold, ease === "smooth" ? "smooth" : "linear");
    var spinVals = num(scene.spin != null ? scene.spin : view.rot, view.rot);
    rot(spin, spinVals, dur, scene.spinAt, hold, scene.spin && scene.spin.length > 2 ? "linear" : "smooth");

    var armDur = scene.armDur || dur;
    var kickDur = scene.kickDur || dur;
    if (scene.torso) rot(girl.torso, num(scene.torso, [0]), dur, scene.torsoAt, hold, "smooth", [0, -48]);
    rot(girl.head, num(scene.head, [0]), scene.headDur || dur, scene.headAt, hold, "smooth");
    rot(girl.nearUpper, num(scene.nearU, [0]), armDur, scene.armAt, hold, "linear");
    rot(girl.nearFore, num(scene.nearF, [0]), armDur, scene.armAt, hold, "linear");
    rot(girl.farUpper, num(scene.farU, [0]), armDur, scene.armAt, hold, "linear");
    rot(girl.farFore, num(scene.farF, [0]), armDur, scene.armAt, hold, "linear");
    rot(girl.nearThigh, num(scene.nearT, [0]), kickDur, scene.kickAt, hold, "smooth");
    rot(girl.farThigh, num(scene.farT, [0]), kickDur, scene.kickAt, hold, "smooth");
    rot(girl.nearCalf, num(scene.nearC, [0]), kickDur, scene.kickAt, hold, "smooth");
    rot(girl.farCalf, num(scene.farC, [0]), kickDur, scene.kickAt, hold, "smooth");
    rot(girl.nearFoot, num(scene.nearFoot, [0]), kickDur, scene.kickAt, hold, "linear");
    rot(girl.farFoot, num(scene.farFoot, [0]), kickDur, scene.kickAt, hold, "linear");

    if (!scene.bubbles) girl.bubbles.setAttribute("display", "none");
    else fade(girl.bubbles, scene.bubbles, dur, scene.bubbleAt, hold);

    var tint = scene.water === "ocean" ? "rgba(8,64,102,.30)" : scene.water === "river" ? "rgba(12,70,58,.28)" : scene.water === "lake" ? "rgba(10,70,90,.28)" : "rgba(12,78,130,.26)";
    el("rect", { x: 0, y: waterY, width: 480, height: 560 - waterY, fill: tint }, svg);
    el("rect", { id: "waterline", x: 0, y: waterY - 1, width: 480, height: 3, fill: "rgba(255,255,255,.92)" }, svg);
    var ripples = el("g", null, svg);
    [0, 10, 20].forEach(function (dy, index) {
      el("path", {
        d: "M -40," + (waterY + 6 + dy) + " q 40 7 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0",
        fill: "none",
        stroke: "rgba(255,255,255,.6)",
        "stroke-width": index === 0 ? 2.2 : 1.3
      }, ripples);
    });
    if (!REDUCE) slide(ripples, [0, -80], [0, 0], "5s", null, 0, "linear");

    if (scene.splash) {
      var splash = el("g", { transform: "translate(" + ((px[0] || 400) - 150) + " " + waterY + ")" }, svg);
      [0, 14, 28].forEach(function (dx, i) {
        var drop = el("circle", { cx: dx, cy: 0, r: 4, fill: "rgba(255,255,255,.9)" }, splash);
        if (!REDUCE) {
          el("animate", { attributeName: "cy", values: "4;-18", dur: "0.7s", begin: (i * 0.18) + "s", repeatCount: "indefinite" }, drop);
          el("animate", { attributeName: "opacity", values: "0;0.9;0", dur: "0.7s", begin: (i * 0.18) + "s", repeatCount: "indefinite" }, drop);
        }
      });
    }
    return true;
  };

  root.AMITA_RIGS = SCENES;
})(typeof window === "undefined" ? globalThis : window);
