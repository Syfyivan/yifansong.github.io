(function () {
  "use strict";

  var PROJECTS = [
    {
      tone: "blue",
      label: "课程沉淀",
      title: "计网与代理",
      subtitle: "Network Proxy Course",
      desc: "把 DNS、代理模式、规则引擎、策略组和排障路径拆成一组可复习的系统课程。",
      url: "/courses/network-proxy/",
      displayUrl: "syfyivan.github.io/courses/network-proxy",
    },
    {
      tone: "rust",
      label: "用量看板",
      title: "Token 用量",
      subtitle: "Codex Usage Board",
      desc: "汇总本地 Codex 会话消耗，观察模型使用、项目节奏和长期趋势。",
      url: "#token-usage",
      displayUrl: "syfyivan.github.io/#token-usage",
    },
    {
      tone: "blue",
      label: "桥接器控制面 · 内网",
      title: "Bridge Viewer",
      subtitle: "Task Session Viewer",
      desc: "飞书机器人任务进度的可视化入口，用 Goofy Preview 分享给内网同事查看。",
      url: "https://bridge-task-viewer-syf.gf-preview.bytedance.net",
      displayUrl: "bridge-task-viewer-syf.gf-preview.bytedance.net",
      external: true,
      access: "需内网",
    },
    {
      tone: "green",
      label: "独立游戏站",
      title: "游戏入口",
      subtitle: "Garden Games",
      desc: "麻将、协作画室和小型互动实验都收在这里，保留公开访问入口。",
      url: "/mahjong/",
      displayUrl: "syfyivan.github.io/mahjong",
    },
    {
      tone: "violet",
      label: "视觉实验",
      title: "浏览器画册",
      subtitle: "Visual Browser",
      desc: "把 AI 视觉浏览器的执行过程整理成可翻阅、可复盘的独立展示页。",
      url: "/flipbook/",
      displayUrl: "syfyivan.github.io/flipbook",
    },
  ];

  function isHomePage() {
    var path = window.location.pathname || "/";
    return path === "/" || path === "/index.html";
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function projectCard(project) {
    var linkAttrs = project.external ? ' target="_blank" rel="noopener"' : "";
    return (
      '<article class="home-project-card home-project-card--' + escapeHtml(project.tone) + '">' +
        '<div class="home-project-card__top">' +
          '<span class="home-project-card__label">' + escapeHtml(project.label) + "</span>" +
          '<span class="home-project-card__pill">' + (project.access || '公开访问') + '</span>' +
        "</div>" +
        '<div class="home-project-card__body">' +
          '<h3>' + escapeHtml(project.title) + "</h3>" +
          '<p class="home-project-card__subtitle">' + escapeHtml(project.subtitle) + "</p>" +
          '<p class="home-project-card__desc">' + escapeHtml(project.desc) + "</p>" +
        "</div>" +
        '<div class="home-project-card__bottom">' +
          '<span class="home-project-card__url">' + escapeHtml(project.displayUrl) + "</span>" +
          '<a class="home-project-card__button" href="' + escapeHtml(project.url) + '"' + linkAttrs + ' aria-label="打开 ' + escapeHtml(project.title) + '">' +
            '<span>打开网站</span><span aria-hidden="true">↗</span>' +
          "</a>" +
        "</div>" +
      "</article>"
    );
  }

  function renderProjects() {
    var html = "";
    for (var i = 0; i < PROJECTS.length; i += 1) {
      html += projectCard(PROJECTS[i]);
    }
    return html;
  }

  function run() {
    if (!isHomePage()) return;
    var boardCol = document.querySelector("#board .col-12.col-md-10.m-auto");
    if (!boardCol || boardCol.querySelector(".home-showcase")) return;

    var firstCard = boardCol.querySelector(".index-card");
    if (!firstCard) return;

    boardCol.classList.add("home-layout");

    var showcase = document.createElement("section");
    showcase.className = "home-showcase";
    showcase.setAttribute("aria-labelledby", "home-projects-title");
    showcase.innerHTML =
      '<div class="home-showcase__heading">' +
        '<div>' +
          '<p class="home-kicker">STANDALONE PROJECTS</p>' +
          '<h2 id="home-projects-title">项目与课程</h2>' +
        "</div>" +
        '<p class="home-showcase__intro">项目、课程与实践记录</p>' +
      "</div>" +
      '<a class="home-workshop-banner" href="/projects/">' +
        '<div class="home-workshop-banner__text">' +
          '<p class="home-kicker">PROJECT WORKSHOP</p>' +
          '<h3>项目工坊：每个项目一张工单，配一篇拆解教程</h3>' +
          '<p class="home-workshop-banner__desc">EPUB 阅读器、实时德扑、飞书 × Codex、自动化管线……自研项目和源码学习笔记，拆给你看怎么做。</p>' +
        "</div>" +
        '<span class="home-workshop-banner__cta"><span>进入工坊</span><span aria-hidden="true">→</span></span>' +
      "</a>" +
      '<div class="home-showcase__projects">' + renderProjects() + "</div>";

    var writingHead = document.createElement("section");
    writingHead.className = "home-writing-head";
    writingHead.id = "latest-writing";
    writingHead.setAttribute("aria-labelledby", "home-writing-title");
    writingHead.innerHTML =
      '<p class="home-kicker">LATEST WRITING</p>' +
      '<h2 id="home-writing-title">最新文章</h2>' +
      '<a class="home-all-posts" href="/archives/">全部文章 <span aria-hidden="true">↗</span></a>';

    boardCol.insertBefore(showcase, firstCard);
    boardCol.insertBefore(writingHead, firstCard);

    buildVillage();
  }

  // The public course is available to every visitor; the old private dev URL was not.
  var AI_TOWN_URL = "/courses/ai-town/";

  var TOWN = [
    { key: "school", name: "课程", desc: "把文章串成可连续学习的课程", href: "/courses/", row: "back" },
    { key: "workshop", name: "项目工坊", desc: "每个项目一张工单，配拆解教程", href: "/projects/", row: "back" },
    { key: "wizard", name: "AI 视觉", desc: "AI 视觉浏览器的魔法画册", href: "/flipbook/", row: "back" },
    { key: "aitown", name: "AI 小镇", desc: "阅读 AI 小镇的实现课程", href: AI_TOWN_URL, row: "front", bus: true },
    { key: "about", name: "关于我", desc: "村长一凡住在这里", href: "/about/", row: "front" },
    { key: "news", name: "晨读", desc: "每天早上的技术晨报", href: "/morning-read/", row: "front" },
    { key: "painters", name: "画室", desc: "协作像素画室", href: "/painters-guild/", row: "front" },
    { key: "archive", name: "归档", desc: "全部文章按时间归档", href: "/archives/", row: "front" },
    { key: "mahjong", name: "麻将", desc: "在线麻将小游戏", href: "/mahjong/", row: "front" },
  ];

  function isExternal(href) {
    return /^https?:\/\//.test(href);
  }

  function townLot(lot) {
    var tgt = isExternal(lot.href) ? '" target="_blank" rel="noopener"' : '"';
    return (
      '<a class="town-lot town-lot--' + lot.key + ' town-lot--' + lot.row + '" href="' + lot.href + tgt + ' aria-label="' + escapeHtml(lot.name) + '：' + escapeHtml(lot.desc) + '">' +
        '<span class="town-lot__house"></span>' +
        '<span class="town-lot__sign">' + escapeHtml(lot.name) + "</span>" +
      "</a>"
    );
  }

  function buildVillage() {
    var banner = document.querySelector(".banner");
    if (!banner || banner.querySelector(".village")) return;

    var lots = "";
    for (var i = 0; i < TOWN.length; i += 1) lots += townLot(TOWN[i]);

    var village = document.createElement("div");
    village.className = "village";
    village.innerHTML =
      '<div class="village__ground" aria-hidden="true"></div>' +
      '<nav class="town" aria-label="小镇导航">' + lots + "</nav>";
    banner.appendChild(village);

    var bannerText = banner.querySelector(".banner-text");
    if (bannerText && !bannerText.querySelector(".home-start")) {
      var start = document.createElement("div");
      start.className = "home-start";
      start.innerHTML =
        '<a class="home-start__btn" href="#latest-writing">读最新文章 <span aria-hidden="true">↓</span></a>' +
        '<a class="home-start__btn home-start__btn--quiet" href="/courses/">浏览课程 <span aria-hidden="true">↗</span></a>';
      bannerText.appendChild(start);
    }

    startPetals(banner);

  }

  function startPetals(banner) {
    var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    var canvas = document.createElement("canvas");
    canvas.className = "village__petals";
    canvas.setAttribute('aria-hidden', 'true');
    banner.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    if (!ctx) { canvas.remove(); return; }
    var petals = [];
    var COUNT = banner.clientWidth < 600 ? 4 : 8;
    var raf = 0;
    var visible = true;
    var lastFrame = 0;

    function isDark() {
      return document.documentElement.getAttribute("data-user-color-scheme") === "dark";
    }

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = banner.clientWidth * dpr;
      canvas.height = banner.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawn(randomY) {
      return {
        x: Math.random() * banner.clientWidth,
        y: randomY ? Math.random() * banner.clientHeight : -12,
        size: 4 + Math.random() * 5,
        fall: 0.35 + Math.random() * 0.65,
        drift: 0.4 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
        spin: Math.random() * Math.PI * 2,
        spinSpeed: 0.01 + Math.random() * 0.025,
      };
    }

    for (var i = 0; i < COUNT; i += 1) petals.push(spawn(true));

    function allowed() { return visible && !document.hidden && !motionQuery.matches && document.documentElement.dataset.motion !== 'paused'; }
    function resume() {
      cancelAnimationFrame(raf);
      raf = 0;
      lastFrame = 0;
      if (allowed()) raf = requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, banner.clientWidth, banner.clientHeight);
    }
    function tick(now) {
      raf = 0;
      if (!allowed()) return;
      var dt = lastFrame ? Math.min((now - lastFrame) / 16.667, 2) : 1;
      lastFrame = now;
      var w = banner.clientWidth;
      var h = banner.clientHeight;
      ctx.clearRect(0, 0, w, h);
      var dark = isDark();
      for (var i = 0; i < petals.length; i += 1) {
        var p = petals[i];
        p.phase += 0.012 * dt;
        p.spin += p.spinSpeed * dt;
        p.y += p.fall * dt;
        p.x += Math.sin(p.phase) * p.drift * dt;
        if (p.y > h + 14 || p.x < -20 || p.x > w + 20) petals[i] = p = spawn(false);
        ctx.save();
        ctx.translate(p.x, p.y);
        if (dark) {
          ctx.fillStyle = "rgba(240, 246, 255, 0.85)";
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.45, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.rotate(p.spin);
          ctx.fillStyle = "rgba(255, 170, 192, 0.82)";
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.62, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      raf = requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener("resize", function () { resize(); resume(); });
    document.addEventListener('visibilitychange', resume);
    document.addEventListener('blog:motion', resume);
    motionQuery.addEventListener('change', resume);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      banner.classList.toggle('scene-offscreen', !visible);
      resume();
    }).observe(banner);
    resume();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
