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

  function shaded(parent, d, tone, shade) {
    el("path", { d: d, fill: tone }, parent);
    el("path", { d: d, fill: shade, opacity: 0.22, "clip-path": "none" }, parent);
  }

  function arm(parent, side, tone) {
    var near = side === "near";
    var shade = near ? "#b85f32" : "#8d4524";
    var light = near ? "#f0b48a" : "#d48958";
    var upper = el("g", null, parent);
    el("path", {
      d: "M -14,2 C -19,14 -18,32 -15,46 C -13,56 -8,64 -2,64 L 7,62 C 13,52 16,36 15,20 C 14,8 10,2 6,2 C 0,-2 -8,-2 -14,2 Z",
      fill: tone
    }, upper);
    el("path", {
      d: "M -10,10 C -13,24 -12,42 -7,56 L 0,56 C -5,40 -6,22 -4,10 Z",
      fill: shade,
      opacity: 0.5
    }, upper);
    el("path", {
      d: "M 5,12 C 8,24 8,40 5,52 L 8,50 C 10,36 10,20 7,12 Z",
      fill: light,
      opacity: 0.32
    }, upper);
    var elbow = el("g", { transform: "translate(0 56)" }, upper);
    var fore = el("g", null, elbow);
    el("path", {
      d: "M -11,-8 C -13,6 -14,20 -12,32 C -10,40 -4,46 2,46 C 8,44 11,34 11,22 C 12,10 10,-2 6,-10 C 2,-14 -6,-14 -11,-8 Z",
      fill: tone
    }, fore);
    el("path", {
      d: "M -8,-2 C -10,12 -9,26 -5,38 L -1,36 C -5,22 -6,8 -4,-2 Z",
      fill: shade,
      opacity: 0.48
    }, fore);
    el("path", {
      d: "M 4,-4 C 6,10 6,24 3,36 L 6,34 C 8,20 8,6 5,-4 Z",
      fill: light,
      opacity: 0.28
    }, fore);
    var hand = el("g", { transform: "translate(0 46)" }, fore);
    el("path", {
      d: "M -8,-12 C -12,-2 -8,8 -2,12 C 0,20 -6,22 -8,16 C 2,18 6,22 8,16 C 6,20 12,22 14,14 C 12,18 16,16 16,8 C 18,0 12,-8 6,-10 C 10,-16 4,-18 0,-12 C -4,-16 -8,-14 -8,-12 Z",
      fill: tone
    }, hand);
    el("path", {
      d: "M -6,8 C -2,16 4,18 8,14",
      fill: "none",
      stroke: shade,
      "stroke-width": 1.1,
      "stroke-linecap": "round",
      opacity: 0.7
    }, hand);
    el("path", {
      d: "M 2,6 C 6,14 10,14 12,8",
      fill: "none",
      stroke: shade,
      "stroke-width": 1.1,
      "stroke-linecap": "round",
      opacity: 0.7
    }, hand);
    el("path", {
      d: "M 4,-16 C 10,-20 14,-12 9,-8 C 7,-12 5,-14 4,-16 Z",
      fill: light
    }, hand);
    return { upper: upper, fore: fore };
  }

  function leg(parent, side, tone, soleId) {
    var near = side === "near";
    var shade = near ? "#b85f32" : "#8d4524";
    var light = near ? "#f0b48a" : "#d48958";
    var thigh = el("g", null, parent);
    el("path", {
      d: "M -16,4 C -22,20 -20,42 -16,58 C -13,70 -6,78 0,78 L 8,74 C 14,62 16,44 15,26 C 14,12 10,4 6,4 C 0,-2 -8,0 -16,4 Z",
      fill: tone
    }, thigh);
    el("path", {
      d: "M -11,12 C -15,28 -13,48 -8,66 L -1,66 C -6,46 -8,28 -5,12 Z",
      fill: shade,
      opacity: 0.48
    }, thigh);
    var knee = el("g", { transform: "translate(0 72)" }, thigh);
    var calf = el("g", null, knee);
    el("path", {
      d: "M -12,-6 C -14,10 -13,28 -10,42 C -8,52 -2,58 4,56 C 10,50 12,36 11,20 C 10,6 8,-4 4,-8 C -2,-12 -8,-10 -12,-6 Z",
      fill: tone
    }, calf);
    el("path", {
      d: "M -11,-10 C -13,8 -11,24 -7,40 L -3,38 C -7,22 -8,6 -6,-10 Z",
      fill: shade,
      opacity: 0.38
    }, calf);
    var ankle = el("g", { transform: "translate(0 64)" }, calf);
    var foot = el("g", null, ankle);
    el("path", {
      id: soleId || null,
      d: "M -6,-6 C -14,-2 -14,8 -6,12 C 8,16 24,14 36,8 C 46,4 50,-2 44,-8 C 36,-14 22,-16 10,-12 C 2,-14 -2,-12 -6,-6 Z",
      fill: tone
    }, foot);
    el("path", {
      d: "M 4,6 C 16,12 32,8 42,2 C 30,8 16,12 6,8 Z",
      fill: shade,
      opacity: 0.45
    }, foot);
    el("path", {
      d: "M 30,-12 C 38,-18 48,-10 44,-4 C 40,-6 34,-8 30,-12 Z",
      fill: light
    }, foot);
    el("path", {
      d: "M 36,-6 C 40,-12 46,-8 44,-2",
      fill: "none",
      stroke: shade,
      "stroke-width": 1,
      "stroke-linecap": "round",
      opacity: 0.55
    }, foot);
    return { thigh: thigh, calf: calf, foot: foot };
  }

  function paintDefs(svg) {
    if (!svg || svg.querySelector("#skinNear")) return;
    var defs = el("defs", null, svg);
    function grad(id, stops) {
      var node = el("linearGradient", { id: id, x1: "0", y1: "0", x2: "1", y2: "1" }, defs);
      stops.forEach(function (stop) {
        el("stop", { offset: stop[0], "stop-color": stop[1] }, node);
      });
    }
    grad("skinNear", [["0%", "#f0b48a"], ["42%", "#e1854a"], ["100%", "#c4622e"]]);
    grad("skinFar", [["0%", "#d48450"], ["50%", "#c56a30"], ["100%", "#8d4524"]]);
    grad("suitGrad", [["0%", "#ef3a3a"], ["38%", "#d01218"], ["100%", "#8e1014"]]);
    grad("hairGrad", [["0%", "#6a4a34"], ["28%", "#2a1c14"], ["100%", "#120e0c"]]);
    var soft = el("filter", {
      id: "softPaint",
      x: "-20%",
      y: "-20%",
      width: "140%",
      height: "140%"
    }, defs);
    el("feGaussianBlur", { in: "SourceGraphic", stdDeviation: "0.45" }, soft);
  }

  function drawGirl(parent) {
    paintDefs(parent.ownerSVGElement);
    var hipFar = el("g", { transform: "translate(-10 6)" }, parent);
    var farLeg = leg(hipFar, "far", SKIN_FAR, null);

    var torso = el("g", null, parent);
    var shoulderFar = el("g", { transform: "translate(-14 -118)" }, torso);
    var farArm = arm(shoulderFar, "far", SKIN_FAR);

    el("path", {
      d: "M -34,24 C -20,10 -24,-8 -16,-28 C -26,-58 -24,-96 -18,-120 C -10,-140 4,-148 16,-146 C 30,-142 38,-122 40,-104 C 46,-78 34,-48 30,-28 C 26,-8 36,6 22,26 C 8,40 -12,38 -34,24 Z",
      fill: "url(#suitGrad)"
    }, torso);
    el("path", {
      d: "M -22,8 C -26,-20 -24,-60 -16,-96 C -12,-118 -4,-132 2,-136 L -2,-120 C -10,-100 -16,-60 -14,-20 C -12,0 -16,8 -22,8 Z",
      fill: "#8e1014",
      opacity: 0.35
    }, torso);
    el("path", {
      d: "M 8,-40 C 18,-70 22,-100 16,-124 C 24,-110 28,-80 26,-48 C 24,-24 18,-12 10,-8 C 6,-18 6,-28 8,-40 Z",
      fill: "#f07070",
      opacity: 0.28
    }, torso);
    el("path", {
      d: "M 2,-90 H 16 M 9,-102 V -78",
      fill: "none",
      stroke: WHITE,
      "stroke-width": 2.6,
      "stroke-linecap": "round"
    }, torso);
    el("path", {
      d: "M -6,-30 C 2,-18 12,-16 20,-28",
      fill: "none",
      stroke: WHITE,
      "stroke-width": 1.5,
      "stroke-linecap": "round"
    }, torso);
    el("path", {
      d: "M 4,-128 C 8,-118 12,-112 14,-106",
      fill: "none",
      stroke: "#241810",
      "stroke-width": 1.7,
      "stroke-linecap": "round"
    }, torso);
    el("ellipse", { cx: 16, cy: -102, rx: 6.2, ry: 5, fill: "#e10612" }, torso);
    el("path", { d: "M 12,-102 H 20", stroke: WHITE, "stroke-width": 1.2, "stroke-linecap": "round" }, torso);

    var neck = el("g", { transform: "translate(10 -132)" }, torso);
    var head = el("g", null, neck);
    el("path", {
      d: "M -4,6 C -8,16 -2,24 8,22 C 18,18 20,8 16,-2 L 12,-16 C 8,-6 2,-2 -4,6 Z",
      fill: "url(#skinNear)"
    }, head);
    var hair = el("g", null, head);
    el("path", {
      d: "M -8,-16 C -30,-18 -40,-40 -32,-58 C -42,-70 -28,-96 0,-100 C 24,-108 52,-96 58,-74 C 68,-56 58,-36 44,-30 C 36,-18 16,-14 2,-20 C -6,-16 -8,-16 -8,-16 Z",
      fill: "#1a120e"
    }, hair);
    [
      ["M -6,-14 C -22,-10 -32,-26 -28,-40 C -36,-34 -38,-50 -26,-54 C -18,-44 -12,-30 -6,-24 Z", "#120e0c"],
      ["M -18,-28 C -34,-24 -44,-40 -36,-54 C -46,-50 -48,-68 -32,-72 C -22,-60 -16,-44 -12,-36 Z", HAIR],
      ["M -8,-48 C -22,-44 -30,-60 -20,-74 C -28,-70 -26,-88 -10,-90 C 0,-78 -2,-62 -2,-54 Z", "#120e0c"],
      ["M 6,-62 C -6,-58 -8,-76 6,-90 C 2,-98 18,-104 28,-94 C 20,-100 8,-96 8,-86 C 16,-80 16,-68 10,-64 Z", HAIR],
      ["M 22,-70 C 14,-66 16,-84 28,-96 C 24,-106 42,-108 50,-94 C 44,-102 32,-100 30,-88 C 40,-82 36,-70 28,-72 Z", "#241810"],
      ["M 36,-58 C 30,-52 34,-70 46,-78 C 44,-88 58,-86 62,-72 C 56,-80 46,-76 44,-66 C 54,-58 48,-48 40,-52 Z", HAIR],
      ["M 40,-40 C 34,-34 40,-22 50,-24 C 58,-20 62,-32 54,-40 C 62,-36 60,-22 50,-18 C 42,-16 36,-28 40,-40 Z", "#120e0c"],
      ["M -24,-18 C -34,-8 -32,6 -22,8 C -16,4 -18,-6 -22,-10 Z", "#2a1c14"]
    ].forEach(function (curl) {
      el("path", { d: curl[0], fill: curl[1] }, hair);
    });
    el("path", {
      d: "M -10,-60 C 4,-82 28,-88 42,-70",
      fill: "none",
      stroke: "#8a6848",
      "stroke-width": 2.4,
      "stroke-linecap": "round"
    }, hair);
    el("path", {
      d: "M 18,-78 C 30,-92 46,-84 50,-68",
      fill: "none",
      stroke: "#c4a080",
      "stroke-width": 1.7,
      "stroke-linecap": "round"
    }, hair);
    var trail = el("g", null, hair);
    el("path", {
      d: "M -26,-8 C -40,-2 -42,14 -30,18 C -22,16 -24,4 -28,0 C -32,-2 -30,-8 -26,-8 Z",
      fill: HAIR
    }, trail);
    el("path", {
      d: "M -34,10 C -46,16 -44,30 -32,30 C -26,26 -28,16 -32,14 Z",
      fill: "#3a2818"
    }, trail);
    el("path", {
      id: "headball",
      d: "M -6,-18 C -16,-28 -14,-52 0,-66 C 14,-78 34,-70 42,-56 C 46,-46 44,-36 38,-30 C 50,-28 54,-16 44,-8 C 40,-4 36,-12 32,-16 C 34,-8 30,-2 22,-2 C 12,2 2,-4 -4,-14 C -8,-12 -6,-16 -6,-18 Z",
      fill: "url(#skinNear)"
    }, head);
    el("path", {
      d: "M 8,-58 C 18,-70 34,-66 40,-54 C 28,-62 16,-60 8,-58 Z",
      fill: "#f0b48a",
      opacity: 0.55
    }, head);
    el("path", {
      d: "M 4,-20 C 12,-8 24,-4 32,-10 C 22,-2 10,-6 4,-20 Z",
      fill: "#c4622e",
      opacity: 0.28
    }, head);
    el("path", {
      d: "M -8,-24 C -14,-20 -14,-36 -6,-42 C -2,-34 -2,-26 -8,-24 Z",
      fill: "#d97840"
    }, head);
    el("path", {
      d: "M -6,-28 C -2,-34 0,-30 -4,-26",
      fill: "none",
      stroke: "#a85a32",
      "stroke-width": 1,
      "stroke-linecap": "round"
    }, head);
    el("path", {
      d: "M 12,-60 C 22,-70 40,-66 46,-54",
      fill: "none",
      stroke: "#4a3024",
      "stroke-width": 2.1,
      "stroke-linecap": "round"
    }, head);
    el("path", {
      d: "M 16,-54 C 22,-60 38,-58 42,-50 C 36,-46 24,-48 16,-54 Z",
      fill: "#fff6f0"
    }, head);
    el("ellipse", { cx: 31, cy: -51, rx: 4.4, ry: 4.8, fill: "#3a2418" }, head);
    el("circle", { cx: 32.6, cy: -52.6, r: 1.35, fill: "#fff6f0" }, head);
    el("path", {
      d: "M 16,-54 C 24,-58 36,-56 42,-50",
      fill: "none",
      stroke: "#6b3a28",
      "stroke-width": 1.3,
      "stroke-linecap": "round"
    }, head);
    el("path", {
      id: "nose",
      d: "M 36,-30 C 48,-28 52,-18 44,-14 C 38,-16 36,-24 36,-30 Z",
      fill: "#e09058"
    }, head);
    el("path", {
      id: "mouth",
      d: "M 32,-12 C 40,-14 46,-10 40,-6 C 36,-8 32,-8 32,-12 Z",
      fill: "#c45348"
    }, head);
    el("path", {
      d: "M 33,-10 C 39,-11 43,-9 40,-7",
      fill: "none",
      stroke: "#8d3b34",
      "stroke-width": 0.8,
      "stroke-linecap": "round"
    }, head);
    el("ellipse", { cx: 24, cy: -16, rx: 5, ry: 3, fill: "#e07858", opacity: 0.45 }, head);
    var bubbles = el("g", { id: "bubbles" }, head);
    [[48, -8, 5, 0], [58, -4, 3.4, 0.32], [42, -2, 2.8, 0.55], [54, -12, 2.6, 0.16]].forEach(function (spot) {
      var dot = el("circle", {
        cx: spot[0], cy: spot[1], r: spot[2],
        fill: "rgba(255,255,255,.5)",
        stroke: "rgba(255,255,255,.95)",
        "stroke-width": 1.5
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
    el("path", {
      d: "M 6,-124 C 4,-108 8,-96 22,-92 C 34,-90 46,-100 44,-114 C 36,-104 22,-102 14,-108 C 10,-116 8,-122 6,-124 Z",
      fill: "#c81016"
    }, torso);
    el("path", {
      d: "M 14,-98 C 24,-94 36,-98 42,-108",
      fill: "none",
      stroke: WHITE,
      "stroke-width": 1.2,
      "stroke-linecap": "butt"
    }, torso);

    var hipNear = el("g", { transform: "translate(8 4)" }, parent);
    var nearLeg = leg(hipNear, "near", SKIN, "sole");
    el("path", {
      d: "M -34,-2 C -26,30 -2,50 20,42 C 38,32 40,6 26,-10 C 12,-18 -10,-14 -24,-6 C -30,-4 -34,-4 -34,-2 Z",
      fill: "#c81016"
    }, parent);
    el("path", {
      d: "M -8,14 C 0,22 10,20 16,12",
      fill: "none",
      stroke: WHITE,
      "stroke-width": 1.15,
      "stroke-linecap": "butt"
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
      view: "prone", dur: "1.7s", splash: true, x: 186,
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
    var scaled = el("g", { id: "girl", transform: "scale(1.16)", filter: "url(#softPaint)" }, bobWrap);
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
