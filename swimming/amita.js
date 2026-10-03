(function (root) {
  function bob(x, y, lift) {
    var up = lift == null ? 8 : lift;
    return [
      "translate(" + x + "px, " + y + "px) rotate(0deg) scale(1.15)",
      "translate(" + x + "px, " + (y - up) + "px) rotate(0deg) scale(1.15)"
    ];
  }

  function swim(x1, x2, y, rot) {
    return [
      "translate(" + x1 + "px, " + y + "px) rotate(" + rot + "deg) scale(1.15)",
      "translate(" + x2 + "px, " + (y - 4) + "px) rotate(" + rot + "deg) scale(1.15)"
    ];
  }

  function pose(partial) {
    var base = {
      water: "pool",
      face: "up",
      props: [],
      bodyDur: "3.6s",
      armDur: "1.6s",
      legDur: "1.2s",
      body: bob(200, 128),
      armL: ["rotate(205deg)", "rotate(228deg)"],
      armR: ["rotate(-25deg)", "rotate(-48deg)"],
      legL: ["rotate(-8deg)", "rotate(12deg)"],
      legR: ["rotate(8deg)", "rotate(-12deg)"],
      kneeL: "rotate(0deg)",
      kneeR: "rotate(0deg)"
    };
    Object.keys(partial).forEach(function (key) {
      base[key] = partial[key];
    });
    return base;
  }

  var R = function (a, b) {
    return ["rotate(" + a + "deg)", "rotate(" + b + "deg)"];
  };

  root.AMITA_POSES = {
    breath: pose({
      props: ["bubbles"],
      body: bob(200, 132, 6),
      armL: R(210, 230),
      armR: R(-30, -50),
      legL: R(-6, 8),
      legR: R(6, -8),
      legDur: "1.8s"
    }),
    "float-back": pose({
      face: "up",
      bodyDur: "4.4s",
      body: [
        "translate(210px, 158px) rotate(-90deg) scale(1.15)",
        "translate(210px, 150px) rotate(-90deg) scale(1.15)"
      ],
      armL: R(188, 205),
      armR: R(-8, -25),
      legL: R(-18, -8),
      legR: R(18, 8),
      legDur: "3.2s",
      armDur: "3.4s"
    }),
    "float-tummy": pose({
      face: "down",
      props: ["bubbles"],
      bodyDur: "4.2s",
      body: [
        "translate(200px, 162px) rotate(90deg) scale(1.15)",
        "translate(200px, 154px) rotate(90deg) scale(1.15)"
      ],
      armL: R(-70, -90),
      armR: R(-110, -90),
      legL: R(-8, 6),
      legR: R(8, -6),
      legDur: "2.8s"
    }),
    glide: pose({
      face: "down",
      bodyDur: "3.2s",
      body: swim(130, 270, 160, 90),
      armL: "rotate(-78deg)",
      armR: "rotate(-102deg)",
      legL: "rotate(0deg)",
      legR: "rotate(0deg)"
    }),
    flutter: pose({
      face: "down",
      body: swim(150, 250, 162, 90),
      armL: "rotate(-80deg)",
      armR: "rotate(-100deg)",
      legL: R(-24, 24),
      legR: R(24, -24),
      legDur: "0.38s"
    }),
    frog: pose({
      face: "down",
      bodyDur: "2.2s",
      legDur: "2.2s",
      armDur: "2.2s",
      body: [
        "translate(160px, 164px) rotate(90deg) scale(1.15)",
        "translate(230px, 158px) rotate(90deg) scale(1.15)",
        "translate(250px, 158px) rotate(90deg) scale(1.15)",
        "translate(160px, 164px) rotate(90deg) scale(1.15)"
      ],
      armL: ["rotate(170deg)", "rotate(-80deg)", "rotate(-80deg)", "rotate(170deg)"],
      armR: ["rotate(10deg)", "rotate(-100deg)", "rotate(-100deg)", "rotate(10deg)"],
      legL: ["rotate(-34deg)", "rotate(-6deg)", "rotate(-6deg)", "rotate(-34deg)"],
      legR: ["rotate(34deg)", "rotate(6deg)", "rotate(6deg)", "rotate(34deg)"],
      kneeL: ["rotate(-62deg)", "rotate(0deg)", "rotate(0deg)", "rotate(-62deg)"],
      kneeR: ["rotate(62deg)", "rotate(0deg)", "rotate(0deg)", "rotate(62deg)"]
    }),
    dolphin: pose({
      face: "down",
      bodyDur: "1.5s",
      legDur: "1.5s",
      armDur: "1.5s",
      body: [
        "translate(150px, 154px) rotate(78deg) scale(1.15)",
        "translate(210px, 172px) rotate(102deg) scale(1.15)",
        "translate(270px, 150px) rotate(76deg) scale(1.15)",
        "translate(150px, 154px) rotate(78deg) scale(1.15)"
      ],
      armL: R(-100, -60),
      armR: R(-80, -120),
      legL: ["rotate(18deg)", "rotate(-30deg)", "rotate(16deg)", "rotate(18deg)"],
      legR: ["rotate(18deg)", "rotate(-30deg)", "rotate(16deg)", "rotate(18deg)"]
    }),
    scull: pose({
      face: "up",
      body: [
        "translate(205px, 156px) rotate(-90deg) scale(1.15)",
        "translate(205px, 150px) rotate(-90deg) scale(1.15)"
      ],
      armL: R(120, 155),
      armR: R(60, 25),
      armDur: "1.1s",
      legL: R(-6, 6),
      legR: R(6, -6),
      legDur: "2.4s"
    }),
    tread: pose({
      body: bob(200, 126, 5),
      armL: R(140, 175),
      armR: R(40, 5),
      armDur: "0.9s",
      legL: R(-18, 16),
      legR: R(18, -16),
      legDur: "0.42s"
    }),
    streamline: pose({
      face: "down",
      body: swim(120, 280, 158, 90),
      bodyDur: "2.8s",
      armL: "rotate(-74deg)",
      armR: "rotate(-106deg)",
      legL: "rotate(2deg)",
      legR: "rotate(-2deg)"
    }),
    "roll-breathe": pose({
      face: "down",
      bodyDur: "3s",
      armDur: "3s",
      body: [
        "translate(200px, 164px) rotate(92deg) scale(1.15)",
        "translate(200px, 150px) rotate(28deg) scale(1.15)",
        "translate(200px, 164px) rotate(92deg) scale(1.15)"
      ],
      armL: ["rotate(-80deg)", "rotate(20deg)", "rotate(-80deg)"],
      armR: ["rotate(-100deg)", "rotate(70deg)", "rotate(-100deg)"],
      legL: R(-10, 10),
      legR: R(10, -10),
      legDur: "0.5s"
    }),
    "soft-body": pose({
      bodyDur: "4.8s",
      armDur: "4.8s",
      legDur: "4.8s",
      body: [
        "translate(206px, 160px) rotate(-86deg) scale(1.12)",
        "translate(206px, 150px) rotate(-94deg) scale(1.18)"
      ],
      armL: R(170, 210),
      armR: R(10, -30),
      legL: R(-28, -8),
      legR: R(28, 8)
    }),
    freestyle: pose({
      face: "down",
      body: swim(145, 255, 160, 90),
      armDur: "1.25s",
      armL: R(-100, 80),
      armR: R(80, -100),
      legL: R(-20, 20),
      legR: R(20, -20),
      legDur: "0.36s"
    }),
    backstroke: pose({
      face: "up",
      body: swim(250, 145, 156, -90),
      armDur: "1.35s",
      armL: R(-90, 90),
      armR: R(90, -90),
      legL: R(-18, 18),
      legR: R(18, -18),
      legDur: "0.4s"
    }),
    breaststroke: pose({
      face: "down",
      bodyDur: "2.6s",
      armDur: "2.6s",
      legDur: "2.6s",
      body: [
        "translate(145px, 164px) rotate(90deg) scale(1.15)",
        "translate(210px, 158px) rotate(90deg) scale(1.15)",
        "translate(248px, 158px) rotate(90deg) scale(1.15)",
        "translate(145px, 164px) rotate(90deg) scale(1.15)"
      ],
      armL: ["rotate(160deg)", "rotate(-70deg)", "rotate(-90deg)", "rotate(160deg)"],
      armR: ["rotate(20deg)", "rotate(-110deg)", "rotate(-90deg)", "rotate(20deg)"],
      legL: ["rotate(-38deg)", "rotate(-4deg)", "rotate(-4deg)", "rotate(-38deg)"],
      legR: ["rotate(38deg)", "rotate(4deg)", "rotate(4deg)", "rotate(38deg)"],
      kneeL: ["rotate(-58deg)", "rotate(4deg)", "rotate(4deg)", "rotate(-58deg)"],
      kneeR: ["rotate(58deg)", "rotate(-4deg)", "rotate(-4deg)", "rotate(58deg)"]
    }),
    butterfly: pose({
      face: "down",
      bodyDur: "1.45s",
      armDur: "1.45s",
      legDur: "0.72s",
      body: [
        "translate(140px, 150px) rotate(74deg) scale(1.15)",
        "translate(200px, 174px) rotate(104deg) scale(1.15)",
        "translate(270px, 148px) rotate(72deg) scale(1.15)",
        "translate(140px, 150px) rotate(74deg) scale(1.15)"
      ],
      armL: ["rotate(-110deg)", "rotate(40deg)", "rotate(-90deg)", "rotate(-110deg)"],
      armR: ["rotate(-70deg)", "rotate(140deg)", "rotate(-90deg)", "rotate(-70deg)"],
      legL: R(20, -28),
      legR: R(20, -28)
    }),
    sidestroke: pose({
      face: "up",
      body: [
        "translate(160px, 158px) rotate(68deg) scale(1.15)",
        "translate(230px, 152px) rotate(68deg) scale(1.15)"
      ],
      armL: R(-40, 30),
      armR: R(100, 40),
      armDur: "1.8s",
      legL: R(-36, 12),
      legR: R(24, -18),
      legDur: "1.8s"
    }),
    "elementary-back": pose({
      face: "up",
      bodyDur: "2.8s",
      armDur: "2.8s",
      legDur: "2.8s",
      body: [
        "translate(230px, 156px) rotate(-90deg) scale(1.15)",
        "translate(180px, 152px) rotate(-90deg) scale(1.15)",
        "translate(160px, 152px) rotate(-90deg) scale(1.15)",
        "translate(230px, 156px) rotate(-90deg) scale(1.15)"
      ],
      armL: ["rotate(190deg)", "rotate(-80deg)", "rotate(-80deg)", "rotate(190deg)"],
      armR: ["rotate(-10deg)", "rotate(-100deg)", "rotate(-100deg)", "rotate(-10deg)"],
      legL: ["rotate(-32deg)", "rotate(-4deg)", "rotate(-4deg)", "rotate(-32deg)"],
      legR: ["rotate(32deg)", "rotate(4deg)", "rotate(4deg)", "rotate(32deg)"],
      kneeL: ["rotate(-50deg)", "rotate(0deg)", "rotate(0deg)", "rotate(-50deg)"],
      kneeR: ["rotate(50deg)", "rotate(0deg)", "rotate(0deg)", "rotate(50deg)"]
    }),
    "survival-back": pose({
      face: "up",
      bodyDur: "4.2s",
      armDur: "4.2s",
      legDur: "4.2s",
      body: [
        "translate(214px, 158px) rotate(-90deg) scale(1.15)",
        "translate(196px, 152px) rotate(-90deg) scale(1.15)"
      ],
      armL: R(150, 185),
      armR: R(30, -8),
      legL: R(-12, 4),
      legR: R(12, -4)
    }),
    "sit-entry": pose({
      props: ["wall"],
      bodyDur: "3.4s",
      body: [
        "translate(78px, 96px) rotate(8deg) scale(1.05)",
        "translate(130px, 140px) rotate(16deg) scale(1.05)",
        "translate(176px, 156px) rotate(0deg) scale(1.05)",
        "translate(78px, 96px) rotate(8deg) scale(1.05)"
      ],
      armL: R(160, 200),
      armR: R(20, -10),
      legL: R(8, 20),
      legR: R(-8, -4)
    }),
    "stand-entry": pose({
      props: ["wall"],
      bodyDur: "3.2s",
      body: [
        "translate(58px, 78px) rotate(0deg) scale(1.02)",
        "translate(110px, 120px) rotate(10deg) scale(1.02)",
        "translate(176px, 156px) rotate(0deg) scale(1.02)",
        "translate(58px, 78px) rotate(0deg) scale(1.02)"
      ],
      armL: R(180, 150),
      armR: R(0, 30),
      legL: ["rotate(0deg)", "rotate(18deg)", "rotate(0deg)", "rotate(0deg)"],
      legR: ["rotate(0deg)", "rotate(-8deg)", "rotate(0deg)", "rotate(0deg)"]
    }),
    "shallow-dive": pose({
      face: "down",
      props: ["wall"],
      bodyDur: "2.6s",
      body: [
        "translate(100px, 108px) rotate(18deg) scale(1.08)",
        "translate(180px, 156px) rotate(72deg) scale(1.08)",
        "translate(270px, 176px) rotate(96deg) scale(1.08)",
        "translate(100px, 108px) rotate(18deg) scale(1.08)"
      ],
      armL: "rotate(-68deg)",
      armR: "rotate(-112deg)",
      legL: "rotate(4deg)",
      legR: "rotate(-4deg)"
    }),
    "climb-out": pose({
      props: ["wall"],
      bodyDur: "3.3s",
      body: [
        "translate(186px, 158px) rotate(0deg) scale(1.05)",
        "translate(120px, 124px) rotate(-12deg) scale(1.05)",
        "translate(74px, 96px) rotate(0deg) scale(1.05)",
        "translate(186px, 158px) rotate(0deg) scale(1.05)"
      ],
      armL: R(155, 200),
      armR: R(25, -16),
      legL: ["rotate(10deg)", "rotate(-20deg)", "rotate(8deg)", "rotate(10deg)"],
      kneeL: ["rotate(0deg)", "rotate(-70deg)", "rotate(0deg)", "rotate(0deg)"]
    }),
    "river-entry": pose({
      water: "river",
      props: ["shore", "downstream"],
      bodyDur: "3.6s",
      body: [
        "translate(78px, 146px) rotate(0deg) scale(1.05)",
        "translate(140px, 158px) rotate(0deg) scale(1.05)",
        "translate(190px, 164px) rotate(0deg) scale(1.05)",
        "translate(78px, 146px) rotate(0deg) scale(1.05)"
      ],
      armL: R(190, 200),
      armR: R(-10, -20)
    }),
    "river-exit": pose({
      water: "river",
      props: ["shore", "downstream"],
      bodyDur: "3.6s",
      body: [
        "translate(200px, 164px) rotate(0deg) scale(1.05)",
        "translate(140px, 156px) rotate(0deg) scale(1.05)",
        "translate(72px, 142px) rotate(0deg) scale(1.05)",
        "translate(200px, 164px) rotate(0deg) scale(1.05)"
      ],
      armL: R(200, 180),
      armR: R(-20, 0)
    }),
    "ocean-entry": pose({
      water: "ocean",
      props: ["shore"],
      bodyDur: "3.8s",
      body: [
        "translate(70px, 148px) rotate(0deg) scale(1.05)",
        "translate(150px, 160px) rotate(-8deg) scale(1.05)",
        "translate(210px, 166px) rotate(0deg) scale(1.05)",
        "translate(70px, 148px) rotate(0deg) scale(1.05)"
      ],
      armL: R(170, 190),
      armR: R(10, -10)
    }),
    "ocean-exit": pose({
      water: "ocean",
      props: ["shore", "foam"],
      bodyDur: "3.8s",
      body: [
        "translate(220px, 166px) rotate(0deg) scale(1.05)",
        "translate(150px, 156px) rotate(8deg) scale(1.05)",
        "translate(68px, 144px) rotate(0deg) scale(1.05)",
        "translate(220px, 166px) rotate(0deg) scale(1.05)"
      ],
      armL: R(160, 190),
      armR: R(20, -15)
    }),
    sighting: pose({
      face: "down",
      bodyDur: "3s",
      body: [
        "translate(170px, 166px) rotate(92deg) scale(1.12)",
        "translate(210px, 142px) rotate(48deg) scale(1.12)",
        "translate(240px, 164px) rotate(92deg) scale(1.12)"
      ],
      armL: R(-80, 10),
      armR: R(-100, 40),
      armDur: "3s",
      legL: R(-16, 16),
      legR: R(16, -16),
      legDur: "0.4s"
    }),
    "wave-breath": pose({
      water: "ocean",
      face: "down",
      props: ["foam"],
      bodyDur: "3.2s",
      body: [
        "translate(190px, 170px) rotate(96deg) scale(1.12)",
        "translate(200px, 142px) rotate(40deg) scale(1.12)",
        "translate(210px, 168px) rotate(96deg) scale(1.12)"
      ],
      armL: R(-70, 20),
      armR: R(-110, 50),
      armDur: "3.2s",
      legL: R(-12, 12),
      legR: R(12, -12)
    }),
    "river-cross": pose({
      water: "river",
      face: "down",
      props: ["downstream"],
      body: swim(120, 270, 150, 90),
      armL: R(-90, 70),
      armR: R(70, -90),
      armDur: "1.2s",
      legL: R(-18, 18),
      legR: R(18, -18),
      legDur: "0.4s"
    }),
    "lake-swim": pose({
      water: "lake",
      face: "down",
      body: swim(130, 260, 160, 88),
      bodyDur: "4s",
      armL: R(-95, 75),
      armR: R(75, -95),
      armDur: "1.4s",
      legL: R(-16, 16),
      legR: R(16, -16),
      legDur: "0.46s"
    }),
    "ocean-trip": pose({
      water: "ocean",
      props: ["shore", "foam"],
      bodyDur: "4.2s",
      body: [
        "translate(72px, 146px) rotate(0deg) scale(1.05)",
        "translate(200px, 166px) rotate(0deg) scale(1.05)",
        "translate(72px, 146px) rotate(0deg) scale(1.05)"
      ],
      armL: R(180, 200),
      armR: R(0, -20)
    }),
    rip: pose({
      water: "ocean",
      props: ["shore", "rip"],
      face: "up",
      bodyDur: "3.4s",
      body: [
        "translate(168px, 186px) rotate(-90deg) scale(1.08)",
        "translate(168px, 132px) rotate(-90deg) scale(1.08)"
      ],
      armL: R(-80, 40),
      armR: R(40, -80),
      armDur: "1.3s",
      legL: R(-16, 16),
      legR: R(16, -16),
      legDur: "0.45s"
    }),
    "help-float": pose({
      bodyDur: "4s",
      body: bob(200, 140, 4),
      armL: "rotate(78deg)",
      armR: "rotate(102deg)",
      legL: "rotate(-28deg)",
      legR: "rotate(28deg)",
      kneeL: "rotate(-74deg)",
      kneeR: "rotate(74deg)"
    }),
    huddle: pose({
      props: ["friends"],
      body: bob(200, 136, 4),
      armL: "rotate(168deg)",
      armR: "rotate(12deg)",
      legL: R(-8, 6),
      legR: R(8, -6),
      legDur: "2.2s"
    }),
    "reach-rescue": pose({
      props: ["shore", "stick", "ring"],
      body: "translate(108px, 136px) rotate(-16deg) scale(1.05)",
      armL: "rotate(130deg)",
      armR: "rotate(-18deg)",
      legL: "rotate(6deg)",
      legR: "rotate(14deg)",
      kneeL: "rotate(8deg)",
      kneeR: "rotate(-20deg)"
    }),
    paddle: pose({
      water: "ocean",
      face: "down",
      props: ["board-lie"],
      body: swim(140, 250, 162, 90),
      armL: R(-30, 85),
      armR: R(85, -30),
      armDur: "1.15s",
      legL: "rotate(2deg)",
      legR: "rotate(-2deg)"
    }),
    "duck-dive": pose({
      water: "ocean",
      face: "down",
      props: ["board-lie", "foam"],
      bodyDur: "2.8s",
      body: [
        "translate(150px, 148px) rotate(78deg) scale(1.1)",
        "translate(200px, 196px) rotate(118deg) scale(1.1)",
        "translate(270px, 150px) rotate(80deg) scale(1.1)",
        "translate(150px, 148px) rotate(78deg) scale(1.1)"
      ],
      armL: "rotate(-60deg)",
      armR: "rotate(-120deg)",
      legL: R(8, -12),
      legR: R(8, -12)
    }),
    "turtle-roll": pose({
      water: "ocean",
      face: "down",
      props: ["board-lie"],
      body: "translate(200px, 158px) rotate(90deg) scale(1.1)",
      inner: [
        "translate(0px, 0px) rotate(0deg)",
        "translate(0px, 22px) rotate(180deg)",
        "translate(0px, 22px) rotate(180deg)",
        "translate(0px, 0px) rotate(0deg)"
      ],
      innerDur: "3.2s",
      armL: "rotate(55deg)",
      armR: "rotate(125deg)",
      legL: "rotate(8deg)",
      legR: "rotate(-8deg)"
    }),
    "pop-up": pose({
      water: "ocean",
      face: "down",
      props: ["board-lie", "board-stand"],
      bodyDur: "2.8s",
      body: [
        "translate(200px, 168px) rotate(88deg) scale(1.08)",
        "translate(200px, 146px) rotate(36deg) scale(1.08)",
        "translate(200px, 112px) rotate(0deg) scale(1.08)",
        "translate(200px, 168px) rotate(88deg) scale(1.08)"
      ],
      fade: {
        ".board-lie": ["1", "0.35", "0", "1"],
        ".board-stand": ["0", "0.45", "1", "0"]
      },
      armL: ["rotate(-40deg)", "rotate(70deg)", "rotate(200deg)", "rotate(-40deg)"],
      armR: ["rotate(-140deg)", "rotate(110deg)", "rotate(-20deg)", "rotate(-140deg)"],
      armDur: "2.8s",
      legL: ["rotate(0deg)", "rotate(-20deg)", "rotate(-8deg)", "rotate(0deg)"],
      legR: ["rotate(0deg)", "rotate(20deg)", "rotate(8deg)", "rotate(0deg)"],
      kneeL: ["rotate(0deg)", "rotate(-50deg)", "rotate(-16deg)", "rotate(0deg)"],
      kneeR: ["rotate(0deg)", "rotate(50deg)", "rotate(16deg)", "rotate(0deg)"],
      legDur: "2.8s"
    }),
    takeoff: pose({
      water: "ocean",
      face: "down",
      props: ["board-lie", "board-stand", "foam"],
      bodyDur: "3s",
      body: [
        "translate(120px, 168px) rotate(90deg) scale(1.08)",
        "translate(190px, 150px) rotate(40deg) scale(1.08)",
        "translate(250px, 114px) rotate(0deg) scale(1.08)",
        "translate(120px, 168px) rotate(90deg) scale(1.08)"
      ],
      fade: {
        ".board-lie": ["1", "0.4", "0", "1"],
        ".board-stand": ["0", "0.5", "1", "0"]
      },
      armL: ["rotate(-50deg)", "rotate(60deg)", "rotate(205deg)", "rotate(-50deg)"],
      armR: ["rotate(-130deg)", "rotate(120deg)", "rotate(-25deg)", "rotate(-130deg)"],
      armDur: "3s",
      kneeL: ["rotate(0deg)", "rotate(-40deg)", "rotate(-10deg)", "rotate(0deg)"],
      kneeR: ["rotate(0deg)", "rotate(40deg)", "rotate(10deg)", "rotate(0deg)"],
      legDur: "3s"
    }),
    trim: pose({
      water: "ocean",
      props: ["board-stand"],
      body: bob(200, 116, 4),
      armL: R(200, 214),
      armR: R(-20, -34),
      legL: "rotate(4deg)",
      legR: "rotate(-4deg)"
    }),
    "bottom-turn": pose({
      water: "ocean",
      props: ["board-stand"],
      bodyDur: "2.6s",
      body: [
        "translate(160px, 124px) rotate(16deg) scale(1.08)",
        "translate(240px, 116px) rotate(-18deg) scale(1.08)"
      ],
      armL: R(190, 210),
      armR: R(-10, -30),
      legL: "rotate(6deg)",
      legR: "rotate(-6deg)"
    }),
    whitewater: pose({
      water: "ocean",
      face: "down",
      props: ["board-lie", "foam"],
      body: swim(140, 260, 158, 72),
      armL: "rotate(40deg)",
      armR: "rotate(140deg)",
      legL: "rotate(4deg)",
      legR: "rotate(-4deg)"
    }),
    wipeout: pose({
      water: "ocean",
      props: ["board-lie", "foam"],
      bodyDur: "2.6s",
      body: [
        "translate(180px, 156px) rotate(80deg) scale(1.08)",
        "translate(230px, 142px) rotate(150deg) scale(1.08)",
        "translate(250px, 178px) rotate(210deg) scale(1.08)",
        "translate(180px, 156px) rotate(80deg) scale(1.08)"
      ],
      armL: "rotate(-55deg)",
      armR: "rotate(-125deg)",
      legL: R(10, -20),
      legR: R(-10, 16)
    }),
    "catch-wave": pose({
      water: "ocean",
      face: "down",
      props: ["board-lie", "foam"],
      bodyDur: "2.4s",
      body: [
        "translate(120px, 164px) rotate(92deg) scale(1.1)",
        "translate(180px, 158px) rotate(86deg) scale(1.1)",
        "translate(250px, 152px) rotate(82deg) scale(1.1)",
        "translate(120px, 164px) rotate(92deg) scale(1.1)"
      ],
      armL: ["rotate(-20deg)", "rotate(-70deg)", "rotate(-80deg)", "rotate(-20deg)"],
      armR: ["rotate(-160deg)", "rotate(-110deg)", "rotate(-100deg)", "rotate(-160deg)"],
      armDur: "2.4s",
      legL: "rotate(2deg)",
      legR: "rotate(-2deg)"
    }),
    "tummy-balance": pose({
      face: "down",
      props: ["board-lie"],
      bodyDur: "3.4s",
      body: [
        "translate(200px, 164px) rotate(84deg) scale(1.12)",
        "translate(200px, 158px) rotate(96deg) scale(1.12)"
      ],
      armL: "rotate(-55deg)",
      armR: "rotate(-125deg)",
      legL: "rotate(3deg)",
      legR: "rotate(-3deg)"
    }),
    "knees-balance": pose({
      props: ["board-stand"],
      body: bob(200, 124, 5),
      armL: R(205, 188),
      armR: R(-25, -8),
      armDur: "2.4s",
      legL: "rotate(-12deg)",
      legR: "rotate(12deg)",
      kneeL: "rotate(-78deg)",
      kneeR: "rotate(78deg)"
    }),
    hello: pose({
      props: ["peace"],
      bodyDur: "4.4s",
      armDur: "2.8s",
      legDur: "4.4s",
      body: [
        "translate(200px, 128px) rotate(0deg) scale(1.2)",
        "translate(200px, 122px) rotate(0deg) scale(1.2)"
      ],
      armL: ["rotate(86deg)", "rotate(100deg)"],
      armR: ["rotate(-52deg)", "rotate(-36deg)"],
      legL: ["rotate(-6deg)", "rotate(6deg)"],
      legR: ["rotate(6deg)", "rotate(-6deg)"]
    })
  };

  var SVG = '' +
    '<svg class="scene" viewBox="0 0 400 250">' +
    '<title>Amita</title>' +
    '<rect class="sky" width="400" height="250"></rect>' +
    '<rect class="water-fill" y="124" width="400" height="126"></rect>' +
    '<g class="waves">' +
    '<path class="wave-line" d="M-40 126 Q 20 112 80 126 T 200 126 T 320 126 T 440 126"></path>' +
    '<path class="wave-line wave-b" d="M-40 146 Q 30 136 100 148 T 220 146 T 340 150 T 460 146"></path>' +
    '</g>' +
    '<g class="shore"><path d="M0 138 C 36 128 70 154 118 140 L 128 250 L 0 250 Z"></path></g>' +
    '<g class="wall"><rect x="0" y="104" width="96" height="20"></rect><rect class="wall-deep" x="0" y="124" width="96" height="126"></rect></g>' +
    '<g class="downstream">' +
    '<path d="M250 132 v52"></path><path d="M250 184 l-6 -10 h12 z"></path>' +
    '<path d="M292 140 v44"></path><path d="M292 184 l-6 -10 h12 z"></path>' +
    '<path d="M334 136 v40"></path><path d="M334 176 l-6 -10 h12 z"></path>' +
    '</g>' +
    '<g class="rip">' +
    '<path d="M236 150 h78"></path><path d="M314 150 l-12 -6 v12 z"></path>' +
    '<path d="M246 176 h70"></path><path d="M316 176 l-12 -6 v12 z"></path>' +
    '<text x="248" y="142">pull</text>' +
    '</g>' +
    '<g class="foam"><circle cx="300" cy="150" r="7"></circle><circle cx="324" cy="166" r="5"></circle><circle cx="286" cy="172" r="4"></circle><circle cx="340" cy="154" r="3.5"></circle></g>' +
    '<g class="stick"><line x1="132" y1="146" x2="300" y2="176"></line></g>' +
    '<g class="ring"><circle cx="314" cy="180" r="14"></circle><circle cx="314" cy="180" r="6"></circle></g>' +
    '<g class="friends">' +
    '<g transform="translate(112,138)"><circle cy="-26" r="9"></circle><rect x="-7" y="-16" width="14" height="32" rx="6"></rect></g>' +
    '<g transform="translate(288,138)"><circle cy="-26" r="9"></circle><rect x="-7" y="-16" width="14" height="32" rx="6"></rect></g>' +
    '</g>' +
    '<g class="girl-pos">' +
    '<g class="board-lie"><ellipse cx="0" cy="8" rx="15" ry="78"></ellipse><ellipse class="board-core" cx="0" cy="8" rx="8" ry="62"></ellipse></g>' +
    '<g class="board-stand"><ellipse cx="0" cy="48" rx="74" ry="13"></ellipse><ellipse class="board-core" cx="0" cy="48" rx="58" ry="7"></ellipse></g>' +
    '<g class="bubbles"><circle class="b1" cx="8" cy="-28" r="3.2"></circle><circle class="b2" cx="14" cy="-18" r="2.2"></circle><circle class="b3" cx="2" cy="-12" r="2.6"></circle></g>' +
    '<g class="girl">' +
    '<g class="hair-back">' +
    '<path class="curl" d="M0 -80 C-20 -80 -34 -66 -33 -50 C-32 -36 -26 -24 -16 -18 C-8 -14 8 -14 16 -18 C26 -24 32 -36 33 -50 C34 -66 20 -80 0 -80 Z"></path>' +
    '<circle class="curl" cx="0" cy="-78" r="6.6"></circle>' +
    '<circle class="curl" cx="-12" cy="-74" r="6.4"></circle>' +
    '<circle class="curl" cx="12" cy="-75" r="6.5"></circle>' +
    '<circle class="curl" cx="-22" cy="-64" r="6.4"></circle>' +
    '<circle class="curl" cx="22" cy="-65" r="6.3"></circle>' +
    '<circle class="curl" cx="-28" cy="-52" r="6.2"></circle>' +
    '<circle class="curl" cx="28" cy="-52" r="6.2"></circle>' +
    '<circle class="curl" cx="-30" cy="-40" r="5.8"></circle>' +
    '<circle class="curl" cx="30" cy="-40" r="5.8"></circle>' +
    '<circle class="curl" cx="-24" cy="-28" r="5.6"></circle>' +
    '<circle class="curl" cx="24" cy="-28" r="5.6"></circle>' +
    '<circle class="curl" cx="-14" cy="-22" r="5.2"></circle>' +
    '<circle class="curl" cx="14" cy="-22" r="5.2"></circle>' +
    '<circle class="curl-lite" cx="-6" cy="-68" r="4"></circle>' +
    '<circle class="curl-lite" cx="8" cy="-62" r="3.6"></circle>' +
    '<circle class="curl-lite" cx="-18" cy="-46" r="3.4"></circle>' +
    '</g>' +
    '<path class="neck" d="M-4.6 -34 L4.6 -34 L3.8 -18 L-3.8 -18 Z"></path>' +
    '<circle class="skin" cx="0" cy="-48" r="16.5"></circle>' +
    '<g class="curl-front">' +
    '<circle class="curl" cx="-11" cy="-60" r="5.2"></circle>' +
    '<circle class="curl" cx="1" cy="-63" r="4.8"></circle>' +
    '<circle class="curl" cx="12" cy="-60" r="5"></circle>' +
    '<circle class="curl" cx="-17" cy="-52" r="4.4"></circle>' +
    '<circle class="curl" cx="17" cy="-52" r="4.4"></circle>' +
    '</g>' +
    '<g class="face">' +
    '<path class="brow" d="M-10.2 -55.2 Q-6.4 -57 -2.8 -55.2"></path>' +
    '<path class="brow" d="M2.8 -55.2 Q6.4 -57 10.2 -55.2"></path>' +
    '<ellipse class="eye-soft" cx="-6.2" cy="-47.2" rx="4.9" ry="5.5"></ellipse>' +
    '<ellipse class="eye-soft" cx="6.2" cy="-47.2" rx="4.9" ry="5.5"></ellipse>' +
    '<circle class="iris" cx="-6" cy="-46.8" r="3.45"></circle>' +
    '<circle class="iris" cx="6.4" cy="-46.8" r="3.45"></circle>' +
    '<circle class="eye" cx="-5.8" cy="-46.5" r="1.7"></circle>' +
    '<circle class="eye" cx="6.6" cy="-46.5" r="1.7"></circle>' +
    '<circle class="eye-shine" cx="-7.2" cy="-48.2" r="1.15"></circle>' +
    '<circle class="eye-shine" cx="5.2" cy="-48.2" r="1.15"></circle>' +
    '<ellipse class="blush" cx="-11.6" cy="-40.2" rx="2.8" ry="1.6"></ellipse>' +
    '<ellipse class="blush" cx="11.6" cy="-40.2" rx="2.8" ry="1.6"></ellipse>' +
    '<path class="nose" d="M-0.7 -41.4 Q0.2 -40.2 1 -41.2"></path>' +
    '<path class="smile" d="M-3.3 -36.6 Q0 -34.8 3.3 -36.6"></path>' +
    '</g>' +
    '<g class="hair-cap">' +
    '<circle cx="0" cy="-48" r="17"></circle>' +
    '<circle cx="-8" cy="-60" r="6"></circle>' +
    '<circle cx="9" cy="-61" r="6"></circle>' +
    '<circle cx="0" cy="-66" r="5.4"></circle>' +
    '<circle cx="-16" cy="-48" r="5.5"></circle>' +
    '<circle cx="16" cy="-48" r="5.5"></circle>' +
    '</g>' +
    '<path class="suit" d="M-13.5 -20 C-15.5 -6 -13 10 -9 20 Q-5 27 0 28 Q5 27 9 20 C13 10 15.5 -6 13.5 -20 Q7 -12.6 0 -11.8 Q-7 -12.6 -13.5 -20 Z"></path>' +
    '<path class="suit-neck" d="M-7.4 -18.4 Q0 -13 7.4 -18.4"></path>' +
    '<g class="front">' +
    '<rect class="cross" x="1.2" y="-13.4" width="9.6" height="3.1" rx="0.6"></rect>' +
    '<rect class="cross" x="4.45" y="-16.6" width="3.1" height="9.6" rx="0.6"></rect>' +
    '<path class="lanyard" d="M-5.2 -17 Q-2 -6 0 2"></path>' +
    '<path class="lanyard" d="M5.6 -16.4 Q2.2 -6 0 2"></path>' +
    '<g transform="translate(0,2.2)">' +
    '<rect class="whistle-top" x="-1.8" y="-2.1" width="3.6" height="2.4" rx="0.7"></rect>' +
    '<rect class="whistle-body" x="-3" y="0" width="6" height="7.6" rx="1.6"></rect>' +
    '<rect class="whistle-slot" x="-1.6" y="1.6" width="3.2" height="1.35" rx="0.35"></rect>' +
    '</g>' +
    '</g>' +
    '<g transform="translate(-13,-16)"><g class="limb arm-l">' +
    '<path class="sleeve" d="M-9 -6.2 C2 -7 11 -5.6 14 -4.2 C15.4 -3.2 15.4 3.2 14 4.2 C11 5.6 2 7 -9 6.2 Z"></path>' +
    '<ellipse class="cuff" cx="13.4" cy="0" rx="1.55" ry="5"></ellipse>' +
    '<path class="limb-shape" d="M11 -4.3 C17 -4.8 23 -3.6 28 -2.6 C30.6 -1.8 30.6 1.8 28 2.6 C23 3.6 17 4.8 11 4.3 Z"></path>' +
    '<g class="hand-plain" transform="translate(27,0)"><circle class="skin" r="5.4"></circle></g>' +
    '</g></g>' +
    '<g transform="translate(13,-16)"><g class="limb arm-r">' +
    '<path class="sleeve" d="M-9 -6.2 C2 -7 11 -5.6 14 -4.2 C15.4 -3.2 15.4 3.2 14 4.2 C11 5.6 2 7 -9 6.2 Z"></path>' +
    '<ellipse class="cuff" cx="13.4" cy="0" rx="1.55" ry="5"></ellipse>' +
    '<path class="limb-shape" d="M11 -4.3 C17 -4.8 23 -3.6 28 -2.6 C30.6 -1.8 30.6 1.8 28 2.6 C23 3.6 17 4.8 11 4.3 Z"></path>' +
    '<g class="hand-plain" transform="translate(27,0)"><circle class="skin" r="5.4"></circle></g>' +
    '<g class="hand-peace" transform="translate(27,0)">' +
    '<circle class="skin" r="5.6"></circle>' +
    '<ellipse class="skin" cx="0.4" cy="5.6" rx="2.1" ry="2.8" transform="rotate(32 0.4 5.6)"></ellipse>' +
    '<g transform="rotate(-32)"><rect class="skin" x="3.6" y="-1.55" width="14.2" height="3.1" rx="1.55"></rect></g>' +
    '<g transform="rotate(28)"><rect class="skin" x="3.6" y="-1.55" width="14.8" height="3.1" rx="1.55"></rect></g>' +
    '</g>' +
    '</g></g>' +
    '<g transform="translate(-6,16)"><g class="limb leg-l">' +
    '<path class="limb-shape" d="M-5 -6 C-5.8 6 -5.2 13 -4.2 17 L4.2 17 C5.2 13 5.8 6 5 -6 Z"></path>' +
    '<path class="shorts" d="M-5.5 -8 C-6.3 0 -5.6 4.6 -4.8 6 L4.8 6 C5.6 4.6 6.3 0 5.5 -8 Z"></path>' +
    '<path class="hem" d="M-5 5.4 L5 5.4"></path>' +
    '<g transform="translate(0,16)"><g class="knee knee-l">' +
    '<path class="limb-shape" d="M-4.2 -2 C-4.7 6 -4.3 12 -3.4 16 L3.4 16 C4.3 12 4.7 6 4.2 -2 Z"></path>' +
    '<ellipse class="foot" cx="1.1" cy="17.6" rx="6.2" ry="3.1"></ellipse>' +
    '</g></g></g></g>' +
    '<g transform="translate(6,16)"><g class="limb leg-r">' +
    '<path class="limb-shape" d="M-5 -6 C-5.8 6 -5.2 13 -4.2 17 L4.2 17 C5.2 13 5.8 6 5 -6 Z"></path>' +
    '<path class="shorts" d="M-5.5 -8 C-6.3 0 -5.6 4.6 -4.8 6 L4.8 6 C5.6 4.6 6.3 0 5.5 -8 Z"></path>' +
    '<path class="hem" d="M-5 5.4 L5 5.4"></path>' +
    '<g transform="translate(0,16)"><g class="knee knee-r">' +
    '<path class="limb-shape" d="M-4.2 -2 C-4.7 6 -4.3 12 -3.4 16 L3.4 16 C4.3 12 4.7 6 4.2 -2 Z"></path>' +
    '<ellipse class="foot" cx="-1.1" cy="17.6" rx="6.2" ry="3.1"></ellipse>' +
    '</g></g></g></g>' +
    '</g></g>' +
    '<text class="tag" x="16" y="28">Amita</text>' +
    '<text class="where-label" x="384" y="28" text-anchor="end"></text>' +
    '</svg>';

  function stops(values) {
    if (values.length === 2) return [["0%, 100%", values[0]], ["50%", values[1]]];
    if (values.length === 3) return [["0%", values[0]], ["50%", values[1]], ["100%", values[2]]];
    return [["0%", values[0]], ["30%", values[1]], ["62%", values[2]], ["100%", values[3]]];
  }

  function frameBlock(name, values, prop) {
    if (typeof values === "string") return { css: "", base: values, name: "" };
    var lines = stops(values).map(function (pair) {
      return pair[0] + "{" + prop + ":" + pair[1] + "}";
    }).join("");
    return { css: "@keyframes " + name + "{" + lines + "}", base: values[0], name: name };
  }

  function rule(selector, frame, dur) {
    if (!frame.name) return selector + "{transform:" + frame.base + "}";
    return frame.css + selector + "{transform:" + frame.base + ";animation:" + frame.name + " " + dur + " ease-in-out infinite}";
  }

  function fadeRule(selector, name, values, dur) {
    var frame = frameBlock(name, values, "opacity");
    return frame.css + selector + "{opacity:" + frame.base + ";animation:" + frame.name + " " + dur + " ease-in-out infinite}";
  }

  var WATER_NAME = { pool: "Pool", river: "River", lake: "Lake", ocean: "Ocean" };

  function angleOf(value) {
    var match = String(value).match(/rotate\((-?[0-9.]+)deg\)/);
    return match ? match[1] : "0";
  }

  function stillMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function spin(node, values, dur) {
    if (!node || values == null) return;
    if (typeof values === "string" || stillMotion()) {
      var frozen = typeof values === "string" ? values : values[0];
      node.setAttribute("transform", "rotate(" + angleOf(frozen) + ")");
      return;
    }
    var angles = values.map(angleOf);
    var list = angles.map(function (angle) { return angle + " 0 0"; });
    var times = "0;1";
    if (angles.length === 2) {
      list = [angles[0] + " 0 0", angles[1] + " 0 0", angles[0] + " 0 0"];
      times = "0;0.5;1";
    } else if (angles.length === 3) {
      times = "0;0.5;1";
    } else {
      times = "0;0.3;0.62;1";
    }
    var anim = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
    anim.setAttribute("attributeName", "transform");
    anim.setAttribute("type", "rotate");
    anim.setAttribute("dur", dur || "1.6s");
    anim.setAttribute("repeatCount", "indefinite");
    anim.setAttribute("values", list.join(";"));
    anim.setAttribute("keyTimes", times);
    node.appendChild(anim);
  }

  function toSvgTransform(value) {
    return String(value).replace(/px/g, "").replace(/deg/g, "").replace(/,/g, " ");
  }

  function applyMotion(node, values, dur) {
    if (!node || !values) return;
    if (typeof values === "string" || stillMotion()) {
      node.setAttribute("transform", toSvgTransform(typeof values === "string" ? values : values[0]));
      return;
    }
    var anim = document.createElementNS("http://www.w3.org/2000/svg", "animate");
    anim.setAttribute("attributeName", "transform");
    anim.setAttribute("dur", dur || "3s");
    anim.setAttribute("repeatCount", "indefinite");
    var frames = values.slice();
    if (frames.length === 2) frames.push(frames[0]);
    anim.setAttribute("values", frames.map(toSvgTransform).join(";"));
    anim.setAttribute("keyTimes", frames.length === 3 ? "0;0.5;1" : "0;0.3;0.62;1");
    node.appendChild(anim);
  }

  root.mountAmita = function (el, move, label) {
    el.textContent = "";
    var img = document.createElement("img");
    img.className = "amita-picture";
    img.src = "/swimming/amita.png";
    img.alt = label || "Amita";
    el.appendChild(img);
  };
})(typeof window === "undefined" ? globalThis : window);
