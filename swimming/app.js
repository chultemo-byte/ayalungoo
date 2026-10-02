(function () {
  var KEY = "ayalungoo-swimming";
  var LESSONS = window.AMITA_LESSONS || [];
  var GROUPS = [
    { id: "basics", title: "Water basics", blurb: "First you learn to be calm in the water." },
    { id: "strokes", title: "Strokes", blurb: "A stroke is a way to swim. Here are seven ways." },
    { id: "entry", title: "In and out", blurb: "You learn how to get in, and how to get out." },
    { id: "open", title: "Open water", blurb: "Open water means a lake, a river, or the ocean. It is not a pool." },
    { id: "surf", title: "Surf", blurb: "You learn the board in small waves, with a grown-up." }
  ];
  var WHERE = { pool: "Pool", river: "River", lake: "Lake", ocean: "Ocean" };
  var OPEN_LINE = "Always with a grown-up. Never swim alone.";

  function load() {
    try {
      var data = JSON.parse(localStorage.getItem(KEY) || "{}");
      if (!data || typeof data !== "object") return { done: {}, answers: {} };
      data.done = data.done || {};
      data.answers = data.answers || {};
      return data;
    } catch (err) {
      return { done: {}, answers: {} };
    }
  }

  function save(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
      return true;
    } catch (err) {
      return false;
    }
  }

  function doneCount(data) {
    return LESSONS.filter(function (lesson) { return data.done[lesson.id]; }).length;
  }

  function byId(id) {
    for (var i = 0; i < LESSONS.length; i += 1) {
      if (LESSONS[i].id === id) return LESSONS[i];
    }
    return null;
  }

  function whereText(lesson) {
    return lesson.where.map(function (place) { return WHERE[place] || place; }).join(" · ");
  }

  function safetyLines(lesson) {
    var lines = [];
    if (lesson.where.some(function (place) { return place !== "pool"; })) lines.push(OPEN_LINE);
    if (lesson.safetyMore) lines.push(lesson.safetyMore);
    return lines;
  }

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  function paintBar(node, count) {
    if (!node) return;
    node.style.width = Math.round((count / LESSONS.length) * 100) + "%";
  }

  function renderSchool() {
    var root = document.getElementById("school");
    root.textContent = "";
    var data = load();
    var count = doneCount(data);
    var last = byId(data.last) || LESSONS[0];

    var teacher = el("div", "teacher");
    var frame = el("div", "stage teacher-frame");
    frame.id = "school-amita";
    teacher.appendChild(frame);
    var teacherCopy = el("div", "teacher-copy");
    teacherCopy.appendChild(el("p", "eyebrow", "Ayalungoo"));
    teacherCopy.appendChild(el("h1", null, "Amita Swimming"));
    teacher.appendChild(teacherCopy);
    root.appendChild(teacher);
    if (window.mountAmita) window.mountAmita(frame, "hello", "Amita says hello", { portrait: true });
    root.appendChild(el("p", "purpose", "A free school where you learn to float, then dance with water."));
    root.appendChild(el("p", "note", "Amita is a drawing of a calm, kind, brave teacher. She shows each move. You try it with a grown-up."));
    root.appendChild(el("p", "note", "There are 48 lessons. You can open any one. A good start is the first one."));
    root.appendChild(el("p", "note", count + " of 48. Saved on this phone. You do not need to sign in."));

    var bar = el("div", "bar");
    var fill = el("span");
    fill.id = "bar-fill";
    bar.appendChild(fill);
    root.appendChild(bar);
    paintBar(fill, count);

    var go = el("a", "go", data.last ? "Pick up where you stopped: " + last.title : "Start: " + LESSONS[0].title);
    go.href = "/swimming/lesson.html?id=" + encodeURIComponent(last.id);
    root.appendChild(go);

    var jumps = el("nav", "jumps");
    GROUPS.forEach(function (group) {
      var link = el("a", null, group.title);
      link.href = "#" + group.id;
      jumps.appendChild(link);
    });
    root.appendChild(jumps);

    GROUPS.forEach(function (group) {
      var section = el("section");
      section.id = group.id;
      section.appendChild(el("h2", null, group.title));
      section.appendChild(el("p", "note", group.blurb));
      LESSONS.filter(function (lesson) { return lesson.group === group.id; }).forEach(function (lesson) {
        var card = el("a", "card" + (data.last === lesson.id ? " here" : ""));
        card.href = "/swimming/lesson.html?id=" + encodeURIComponent(lesson.id);
        card.appendChild(el("strong", null, lesson.title));
        card.appendChild(el("span", "meta", whereText(lesson)));
        if (data.done[lesson.id]) card.appendChild(el("span", "mark", "Yes"));
        else if (data.last === lesson.id) card.appendChild(el("span", "mark", "You were here"));
        section.appendChild(card);
      });
      root.appendChild(section);
    });

    var foot = el("footer");
    foot.appendChild(document.createTextNode("Ayalungoo is free. Amita Swimming is free. A grown-up stays with you in the water. "));
    var home = el("a", null, "Back to the door");
    home.href = "/";
    foot.appendChild(home);
    root.appendChild(foot);
  }

  function renderLesson() {
    var root = document.getElementById("lesson");
    root.textContent = "";
    var params = new URLSearchParams(window.location.search);
    var lesson = byId(params.get("id"));
    if (!lesson) {
      root.appendChild(el("p", null, "That lesson is not here."));
      var back = el("a", "go", "All lessons");
      back.href = "/swimming/";
      root.appendChild(back);
      return;
    }

    var index = LESSONS.indexOf(lesson);
    var data = load();
    data.last = lesson.id;
    data.lastTitle = lesson.title;
    var savedOpen = save(data);

    document.title = lesson.title + " — Amita Swimming";

    var home = el("a", "back", "← All lessons");
    home.href = "/swimming/";
    root.appendChild(home);

    var group = GROUPS.filter(function (item) { return item.id === lesson.group; })[0];
    root.appendChild(el("p", "eyebrow", (group ? group.title : "") + " · " + (index + 1) + " of 48"));
    root.appendChild(el("h1", null, lesson.title));

    var chips = el("div", "jumps");
    lesson.where.forEach(function (place) {
      chips.appendChild(el("span", "chip", WHERE[place] || place));
    });
    root.appendChild(chips);

    root.appendChild(el("p", "purpose", lesson.why));

    var stage = el("div", "stage");
    stage.id = "stage";
    root.appendChild(stage);
    try {
      if (window.mountAmita) window.mountAmita(stage, lesson.id, lesson.shows);
    } catch (err) {
      stage.appendChild(el("p", null, "Amita will show this move when the drawing can load."));
    }
    root.appendChild(el("p", "shows", lesson.shows));
    root.appendChild(el("p", "note", "Amita is a drawing, not a photo."));

    var fact = el("section", "box");
    fact.appendChild(el("h2", null, "A body fact"));
    fact.appendChild(el("p", null, lesson.fact));
    root.appendChild(fact);

    var breath = el("section", "box breath");
    breath.appendChild(el("h2", null, "A calm breath"));
    breath.appendChild(el("p", null, lesson.breath));
    root.appendChild(breath);

    var steps = el("section", "box");
    steps.appendChild(el("h2", null, "Try this with a grown-up"));
    var list = el("ol", "steps");
    lesson.steps.forEach(function (step) {
      list.appendChild(el("li", null, step));
    });
    steps.appendChild(list);
    root.appendChild(steps);

    var lines = safetyLines(lesson);
    if (lines.length) {
      var safety = el("section", "box safety");
      safety.appendChild(el("h2", null, "Stay safe"));
      lines.forEach(function (line) {
        safety.appendChild(el("p", null, line));
      });
      root.appendChild(safety);
    }

    var check = el("section", "box");
    check.appendChild(el("h2", null, "A little check"));
    check.appendChild(el("p", null, lesson.check));
    check.appendChild(el("p", "note", "Tap Yes if you can do it. Tap Not yet if you are still learning."));
    var choices = el("div", "choices");
    var yes = el("button", null, "Yes");
    var no = el("button", null, "Not yet");
    yes.type = "button";
    no.type = "button";
    var saved = el("p", "saved", savedOpen ? "" : "This phone could not save. You can still do the lesson.");
    function paintAnswer() {
      var current = load();
      yes.classList.toggle("on", current.answers[lesson.id] === "yes");
      no.classList.toggle("on", current.answers[lesson.id] === "no");
    }
    function choose(answer) {
      var current = load();
      current.answers[lesson.id] = answer;
      current.done[lesson.id] = answer === "yes";
      current.last = lesson.id;
      current.lastTitle = lesson.title;
      var ok = save(current);
      paintAnswer();
      saved.textContent = ok
        ? (answer === "yes" ? "Saved on this phone." : "Saved on this phone. You can try again when you are ready.")
        : "This phone could not save. You can still do the lesson.";
    }
    yes.addEventListener("click", function () { choose("yes"); });
    no.addEventListener("click", function () { choose("no"); });
    choices.appendChild(yes);
    choices.appendChild(no);
    check.appendChild(choices);
    check.appendChild(saved);
    root.appendChild(check);
    paintAnswer();

    var nav = el("div", "nav-row");
    if (index < LESSONS.length - 1) {
      var next = el("a", "go", "Next: " + LESSONS[index + 1].title);
      next.href = "/swimming/lesson.html?id=" + encodeURIComponent(LESSONS[index + 1].id);
      nav.appendChild(next);
    } else {
      var end = el("a", "go", "Back to all lessons");
      end.href = "/swimming/";
      nav.appendChild(end);
    }
    if (index > 0) {
      var prev = el("a", null, "Previous: " + LESSONS[index - 1].title);
      prev.href = "/swimming/lesson.html?id=" + encodeURIComponent(LESSONS[index - 1].id);
      nav.appendChild(prev);
    }
    root.appendChild(nav);
  }

  var page = document.body.getAttribute("data-page");
  if (page === "school") renderSchool();
  if (page === "lesson") renderLesson();

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("/sw.js").catch(function () {});
    });
  }
})();
