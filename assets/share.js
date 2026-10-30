(() => {
  "use strict";
  const blobCache = new Map();

  const themeMeta = {
    rebel: {en: "THE WAYWARD CLAW", deep: "#315d5c", accent: "#6d8d8b", soft: "#edf4f2"},
    lady:  {en: "THE PORCELAIN CUP", deep: "#714d5d", accent: "#a9798c", soft: "#f8eef2"},
    salon: {en: "THE VEILED MOON", deep: "#4b4d70", accent: "#777aa0", soft: "#eff0f8"},
    blood: {en: "THE CRIMSON CROWN", deep: "#733f42", accent: "#a76a6d", soft: "#f8eeee"}
  };

  function details(section) {
    const id = section.id;
    const theme = [...section.classList].find(x => x.startsWith("theme-"))?.slice(6) || "rebel";
    const title = section.querySelector(".title")?.textContent.trim() || "リトル・ミューの猫";
    const pills = [...section.querySelectorAll(".pill")].map(x => x.textContent.trim());
    const pageUrl = new URL(`share/${id}.html`, document.baseURI).href;
    const cardUrl = new URL(`assets/${theme}.webp`, document.baseURI).href;
    const caption = `リトル・ミュー診断で「${title}」になりました。\n${pills.slice(1).join(" × ")}\n\n${pageUrl}\n#リトルミュー診断`;
    return {id, theme, title, pills, pageUrl, cardUrl, caption};
  }

  function roundRect(ctx, x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
  }

  function fitText(ctx, text, maxWidth, startSize, minSize, family) {
    let size = startSize;
    while (size > minSize) {
      ctx.font = `700 ${size}px ${family}`;
      if (ctx.measureText(text).width <= maxWidth) return size;
      size -= 2;
    }
    return minSize;
  }

  async function makeCard(section) {
    const info = details(section);
    if (blobCache.has(info.id)) return blobCache.get(info.id);
    await document.fonts?.ready;

    const image = new Image();
    image.decoding = "async";
    image.src = info.cardUrl;
    await image.decode();

    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext("2d");
    const meta = themeMeta[info.theme];
    const serif = '"Yu Mincho", "Hiragino Mincho ProN", "Noto Serif JP", serif';

    ctx.fillStyle = "#fbf5ec";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const scale = Math.max(canvas.width / image.width, 700 / image.height);
    const w = image.width * scale;
    const h = image.height * scale;
    ctx.globalAlpha = 0.92;
    ctx.drawImage(image, (canvas.width - w) / 2, 0, w, h);
    ctx.globalAlpha = 1;
    const gradient = ctx.createLinearGradient(0, 280, 0, 820);
    gradient.addColorStop(0, "rgba(251,245,236,0)");
    gradient.addColorStop(1, "rgba(251,245,236,1)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 250, 1080, 600);

    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255,255,255,.94)";
    ctx.font = "600 29px Georgia, serif";
    ctx.letterSpacing = "6px";
    ctx.fillText("LITTLE MEW DIAGNOSIS", 540, 66);
    ctx.letterSpacing = "0px";

    ctx.save();
    ctx.shadowColor = "rgba(61,45,36,.16)";
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 12;
    roundRect(ctx, 92, 560, 896, 630, 38);
    ctx.fillStyle = "rgba(255,253,249,.96)";
    ctx.fill();
    ctx.restore();
    roundRect(ctx, 92, 560, 896, 630, 38);
    ctx.strokeStyle = meta.accent;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = meta.accent;
    ctx.font = "600 25px Georgia, serif";
    ctx.letterSpacing = "4px";
    ctx.fillText("YOUR LITTLE MEW", 540, 632);
    ctx.letterSpacing = "2px";
    ctx.font = "italic 24px Georgia, serif";
    ctx.fillText(meta.en, 540, 680);
    ctx.letterSpacing = "0px";

    const titleSize = fitText(ctx, info.title, 760, 70, 44, serif);
    ctx.font = `700 ${titleSize}px ${serif}`;
    ctx.fillStyle = meta.deep;
    ctx.fillText(info.title, 540, 800);

    const labels = info.pills.slice(1);
    const boxWidth = 315;
    labels.forEach((label, index) => {
      const x = index === 0 ? 195 : 570;
      roundRect(ctx, x, 865, boxWidth, 64, 32);
      ctx.fillStyle = meta.soft;
      ctx.fill();
      ctx.strokeStyle = meta.accent;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.font = `600 27px ${serif}`;
      ctx.fillStyle = meta.deep;
      ctx.fillText(label, x + boxWidth / 2, 907);
    });

    ctx.strokeStyle = meta.accent;
    ctx.globalAlpha = 0.45;
    ctx.beginPath();
    ctx.moveTo(260, 995);
    ctx.lineTo(820, 995);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.font = `400 28px ${serif}`;
    ctx.fillStyle = "#6f5e54";
    ctx.fillText("あなたの猫を、暮らしのそばに。", 540, 1065);
    ctx.font = "600 24px Georgia, serif";
    ctx.fillStyle = meta.accent;
    ctx.fillText("#LITTLEMEW  #リトルミュー診断", 540, 1123);

    ctx.font = "400 22px Georgia, serif";
    ctx.fillStyle = "#8b7a6d";
    ctx.fillText("LMK3", 540, 1287);

    const blob = await new Promise((resolve, reject) => canvas.toBlob(x => x ? resolve(x) : reject(new Error("画像を作成できませんでした")), "image/png"));
    blobCache.set(info.id, blob);
    return blob;
  }

  async function copyText(text) {
    if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }

  function setStatus(section, text) {
    const status = section.querySelector(".share-status");
    if (status) status.textContent = text;
  }

  async function downloadCard(section) {
    const info = details(section);
    const blob = await makeCard(section);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `little-mew-${info.id.replace("result_", "")}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 2000);
    return info;
  }

  document.addEventListener("click", async event => {
    const button = event.target.closest("[data-share]");
    if (!button) return;
    const section = button.closest(".result-page");
    if (!section) return;
    const info = details(section);
    const method = button.dataset.share;
    button.disabled = true;
    setStatus(section, "準備しています…");
    try {
      if (method === "line") {
        const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(info.pageUrl)}&text=${encodeURIComponent(`リトル・ミュー診断で「${info.title}」になりました。`)}`;
        window.open(lineUrl, "_blank", "noopener,noreferrer");
        setStatus(section, "LINEの共有画面を開きました。");
      } else if (method === "copy") {
        await copyText(info.pageUrl);
        setStatus(section, "結果のリンクをコピーしました。");
      } else if (method === "save") {
        await downloadCard(section);
        setStatus(section, "結果画像を保存しました。");
      } else if (method === "native") {
        const blob = await makeCard(section);
        const file = new File([blob], `little-mew-${info.id.replace("result_", "")}.png`, {type: "image/png"});
        if (navigator.share && (!navigator.canShare || navigator.canShare({files: [file]}))) {
          await navigator.share({title: `リトル・ミュー診断｜${info.title}`, text: info.caption, files: [file]});
          setStatus(section, "共有先を選びました。");
        } else if (navigator.share) {
          await navigator.share({title: `リトル・ミュー診断｜${info.title}`, text: info.caption, url: info.pageUrl});
          setStatus(section, "共有先を選びました。");
        } else {
          await downloadCard(section);
          await copyText(info.caption);
          setStatus(section, "結果画像を保存し、投稿文をコピーしました。");
        }
      }
      window.lmkTrack?.("share", {method, result_id: info.id, result_name: info.title});
    } catch (error) {
      if (error?.name === "AbortError") setStatus(section, "共有をキャンセルしました。");
      else setStatus(section, "うまく共有できませんでした。画像保存をお試しください。");
    } finally {
      button.disabled = false;
    }
  });

  function preloadActiveCard() {
    const id = location.hash.slice(1);
    const section = id.startsWith("result_") ? document.getElementById(id) : null;
    if (section) makeCard(section).catch(() => {});
  }
  window.addEventListener("hashchange", preloadActiveCard);
  preloadActiveCard();
})();
