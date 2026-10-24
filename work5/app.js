(function () {
    "use strict";

    const root = document.documentElement;

    /* 首帧禁用侧栏宽度过渡，避免平板端初始折叠时闪动 */
    root.classList.add("no-sidebar-transition");

    /* ============ 1. 静态图标 ============ */
    const ICONS = {
        eye: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12s-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="2.6"/></svg>`,
        bag: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 8h12l1 12H5L6 8Z"/><path d="M9 10V7a3 3 0 0 1 6 0v3"/></svg>`,
        banknote: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="3" y="6" width="18" height="12" rx="2.5"/><circle cx="12" cy="12" r="2.6"/><path d="M6.5 9.5h.01M17.5 14.5h.01"/></svg>`,
        users: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="9" cy="8" r="3.2"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><path d="M16 5.2a3 3 0 0 1 0 5.6"/><path d="M18.2 14.3a5.2 5.2 0 0 1 2.3 4.2"/></svg>`,
        percent: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M19 5 5 19"/><circle cx="7.5" cy="7.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/></svg>`,
        receipt: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 3h14v18l-2.3-1.6L14.4 21l-2.4-1.6L9.6 21l-2.3-1.6L5 21V3Z"/><path d="M9 8h6M9 12h6M9 16h3"/></svg>`
    };

    const ARROW_SVG = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 19V5M6 11l6-6 6 6"/></svg>`;

    /* ============ 2. 数据源（6 张卡片均由该数组渲染） ============ */
    const RANGE_META = {
        today: { label: "今日", trendSub: "今日每 3 小时访问量", tableHead: "时段" },
        week: { label: "本周", trendSub: "本周每日访问量", tableHead: "日期" },
        month: { label: "本月", trendSub: "本月每日访问量", tableHead: "日期" }
    };

    const METRICS = [
        {
            id: "visits",
            label: "访问量",
            icon: "eye",
            format: "number",
            values: { today: 128460, week: 846210, month: 3453200 },
            delta: { today: 12.4, week: 8.1, month: 15.6 },
            spark: [62, 58, 71, 66, 80, 74, 88, 83, 96, 91]
        },
        {
            id: "orders",
            label: "订单数",
            icon: "bag",
            format: "number",
            values: { today: 3842, week: 24190, month: 96340 },
            delta: { today: 6.8, week: 4.2, month: 9.7 },
            spark: [38, 42, 40, 48, 45, 52, 49, 57, 54, 61]
        },
        {
            id: "revenue",
            label: "成交额",
            icon: "banknote",
            format: "currency",
            values: { today: 286430, week: 1842000, month: 7264300 },
            delta: { today: 9.3, week: 5.5, month: 11.8 },
            spark: [44, 48, 46, 54, 51, 58, 63, 60, 69, 72]
        },
        {
            id: "newUsers",
            label: "新增用户",
            icon: "users",
            format: "number",
            values: { today: 1286, week: 8430, month: 32180 },
            delta: { today: 15.2, week: 11.4, month: 18.3 },
            spark: [30, 36, 33, 41, 38, 46, 43, 51, 56, 54]
        },
        {
            id: "conversion",
            label: "转化率",
            icon: "percent",
            format: "percent",
            values: { today: 3.8, week: 3.6, month: 3.4 },
            delta: { today: 0.4, week: -0.2, month: 0.3 },
            spark: [40, 42, 41, 45, 44, 48, 47, 50, 49, 52]
        },
        {
            id: "aov",
            label: "客单价",
            icon: "receipt",
            format: "currency1",
            values: { today: 74.5, week: 76.2, month: 75.4 },
            delta: { today: 2.1, week: 1.4, month: 3.0 },
            spark: [60, 58, 62, 59, 63, 61, 65, 62, 66, 64]
        }
    ];

    const TREND = {
        today: {
            labels: ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"],
            values: [6200, 4100, 3800, 7100, 16800, 28400, 32900, 29160]
        },
        week: {
            labels: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
            values: [108420, 116840, 124630, 131290, 112460, 98620, 153950]
        },
        month: {
            labels: Array.from({ length: 30 }, (_, i) => `${i + 1}日`),
            values: [96000, 102400, 108900, 113600, 121300, 98700, 94500, 109800, 115200, 120400, 126800, 104500, 99100, 112300, 118700, 124900, 131200, 107800, 102600, 116400, 121900, 128300, 134600, 110200, 105300, 119800, 125400, 131800, 138100, 112700]
        }
    };

    const CHANNELS = [
        { label: "直接访问", pct: 42 },
        { label: "搜索引擎", pct: 28 },
        { label: "社交媒体", pct: 18 },
        { label: "外部链接", pct: 8 },
        { label: "其他", pct: 4 }
    ];

    /* ============ 3. 状态与工具 ============ */
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const state = {
        range: "week",
        geo: null,
        crosshair: null,
        hoverDot: null,
        els: new Map()
    };

    const numberFormat = new Intl.NumberFormat("zh-CN");

    function fmtNumber(value) {
        return numberFormat.format(Math.round(value));
    }

    function formatMetric(metric, value) {
        switch (metric.format) {
            case "currency":
                return "¥" + fmtNumber(value);
            case "currency1":
                return "¥" + value.toFixed(1);
            case "percent":
                return value.toFixed(1) + "%";
            default:
                return fmtNumber(value);
        }
    }

    function escapeXML(value) {
        return String(value).replace(/[&<>"']/g, ch => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[ch]));
    }

    function niceStep(raw) {
        if (!Number.isFinite(raw) || raw <= 0) return 1;
        const pow = Math.pow(10, Math.floor(Math.log10(raw)));
        const n = raw / pow;
        const s = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 4 ? 4 : n <= 5 ? 5 : 10;
        return s * pow;
    }

    function tickLabel(value) {
        if (value >= 10000) {
            const n = value / 10000;
            return (Number.isInteger(n) ? n : n.toFixed(1)) + "万";
        }
        if (value >= 1000) {
            const n = value / 1000;
            return (Number.isInteger(n) ? n : n.toFixed(1)) + "k";
        }
        return String(Math.round(value));
    }

    function animateNumber(el, to, format) {
        cancelAnimationFrame(el._raf);
        const from = typeof el._current === "number" ? el._current : to;
        const duration = 420;

        if (reduceMotion || from === to) {
            el._current = to;
            el.textContent = format(to);
            return;
        }

        el._current = to;
        const start = performance.now();

        function frame(now) {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            const current = from + (to - from) * eased;
            el._current = t < 1 ? current : to;
            el.textContent = format(el._current);
            if (t < 1) {
                el._raf = requestAnimationFrame(frame);
            }
        }

        el._raf = requestAnimationFrame(frame);
    }

    function updateDelta(el, metric) {
        const delta = metric.delta[state.range];
        const isUp = delta >= 0;

        el.className = "delta " + (isUp ? "delta-up" : "delta-down");
        el.replaceChildren();

        const arrow = document.createElement("span");
        arrow.innerHTML = ARROW_SVG;
        arrow.setAttribute("aria-hidden", "true");

        const sr = document.createElement("span");
        sr.className = "sr-only";
        sr.textContent = isUp ? "上升 " : "下降 ";

        const num = document.createElement("span");
        num.className = "delta-num";
        num.textContent = `${delta > 0 ? "+" : ""}${delta.toFixed(1)}%`;

        el.append(arrow, sr, num);
    }

    function setUpdatedTime() {
        const now = new Date();
        const time = now.toLocaleTimeString("zh-CN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        });
        const el = document.getElementById("updated-at");
        el.textContent = time;
        el.dateTime = now.toISOString();
    }

    /* ============ 4. KPI 卡片 ============ */
    function sparkSVG(values) {
        const w = 100;
        const h = 32;
        const pad = 3;
        const min = Math.min(...values);
        const max = Math.max(...values);
        const span = max - min || 1;

        const points = values.map((v, i) => {
            const x = pad + i * (w - pad * 2) / (values.length - 1);
            const y = pad + (1 - (v - min) / span) * (h - pad * 2);
            return [x, y];
        });

        const line = points.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join(" ");
        const area = `${line} L ${w - pad} ${h} L ${pad} ${h} Z`;

        return `<svg viewBox="0 0 ${w} ${h}" width="100" height="32" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <path d="${area}" fill="currentColor" fill-opacity="0.10"/>
            <path d="${line}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
        </svg>`;
    }

    function buildCards() {
        const host = document.getElementById("kpi-grid");
        host.replaceChildren();

        METRICS.forEach(metric => {
            const card = document.createElement("article");
            card.className = "kpi-card";
            card.dataset.metric = metric.id;

            const head = document.createElement("div");
            head.className = "kpi-head";

            const icon = document.createElement("span");
            icon.className = "kpi-icon";
            icon.setAttribute("aria-hidden", "true");
            icon.innerHTML = ICONS[metric.icon];

            const label = document.createElement("span");
            label.className = "kpi-label";
            label.textContent = metric.label;

            const delta = document.createElement("span");
            delta.className = "delta";

            head.append(icon, label, delta);

            const value = document.createElement("p");
            value.className = "kpi-value";
            value.textContent = formatMetric(metric, metric.values[state.range]);
            value._current = metric.values[state.range];

            const spark = document.createElement("div");
            spark.className = "kpi-spark";
            spark.setAttribute("aria-hidden", "true");
            spark.innerHTML = sparkSVG(metric.spark);

            card.append(head, value, spark);
            host.append(card);

            updateDelta(delta, metric);
            state.els.set(metric.id, { value, delta, spark });
        });
    }

    function updateCards() {
        METRICS.forEach(metric => {
            const els = state.els.get(metric.id);
            if (!els) return;
            animateNumber(els.value, metric.values[state.range], v => formatMetric(metric, v));
            updateDelta(els.delta, metric);
            els.spark.innerHTML = sparkSVG(metric.spark);
        });
    }

    /* ============ 5. 渠道条形图 ============ */
    function buildChannels() {
        const host = document.getElementById("channel-bars");
        host.replaceChildren();

        CHANNELS.forEach(channel => {
            const item = document.createElement("li");
            item.className = "bar-item";
            item.tabIndex = 0;

            const meta = document.createElement("div");
            meta.className = "bar-meta";

            const label = document.createElement("span");
            label.className = "bar-label";
            label.textContent = channel.label;

            const stats = document.createElement("span");
            stats.className = "bar-stats";

            const pct = document.createElement("span");
            pct.className = "bar-pct";
            pct.textContent = channel.pct + "%";

            const count = document.createElement("span");
            count.className = "bar-count";

            stats.append(pct, count);
            meta.append(label, stats);

            const track = document.createElement("div");
            track.className = "bar-track";

            const fill = document.createElement("span");
            fill.className = "bar-fill";
            fill.style.width = channel.pct + "%";

            track.append(fill);
            item.append(meta, track);
            host.append(item);
        });
    }

    function updateChannels() {
        const total = METRICS.find(m => m.id === "visits").values[state.range];
        const host = document.getElementById("channel-bars");
        const items = host.querySelectorAll(".bar-item");

        CHANNELS.forEach((channel, i) => {
            const item = items[i];
            if (!item) return;
            const count = Math.round(total * channel.pct / 100);
            item.querySelector(".bar-count").textContent = fmtNumber(count);
            item.dataset.tip = `${channel.label}：${fmtNumber(count)} 次访问（${channel.pct}%）`;
        });

        document.getElementById("channel-total").textContent = fmtNumber(total);
    }

    /* ============ 6. 访问趋势折线图 ============ */
    function renderTrendTable() {
        const table = document.getElementById("trend-table");
        const data = TREND[state.range];
        const meta = RANGE_META[state.range];

        table.replaceChildren();

        const caption = document.createElement("caption");
        caption.className = "sr-only";
        caption.textContent = `${meta.label}访问量数据表`;
        table.append(caption);

        const thead = document.createElement("thead");
        const headRow = document.createElement("tr");
        [meta.tableHead, "访问量"].forEach(text => {
            const th = document.createElement("th");
            th.scope = "col";
            th.textContent = text;
            headRow.append(th);
        });
        thead.append(headRow);

        const tbody = document.createElement("tbody");
        data.labels.forEach((label, i) => {
            const row = document.createElement("tr");
            const th = document.createElement("th");
            th.scope = "row";
            th.textContent = label;
            const td = document.createElement("td");
            td.textContent = fmtNumber(data.values[i]);
            row.append(th, td);
            tbody.append(row);
        });

        table.append(thead, tbody);
    }

    function renderTrend() {
        const host = document.getElementById("trend-chart");
        const canvas = document.getElementById("trend-canvas");
        if (!host || !canvas) return;

        const width = Math.round(host.clientWidth);
        const height = Math.round(host.clientHeight);
        if (width < 40 || height < 40) return;

        const meta = RANGE_META[state.range];
        const data = TREND[state.range];
        const values = data.values;
        const labels = data.labels;
        const n = values.length;

        const pad = {
            top: 18,
            right: 16,
            bottom: 28,
            left: width < 380 ? 38 : 48
        };
        const innerW = width - pad.left - pad.right;
        const innerH = height - pad.top - pad.bottom;

        const maxValue = Math.max(...values);
        const step = niceStep(maxValue / 4);
        const topValue = step * 4;

        const xAt = i => pad.left + (n > 1 ? i * innerW / (n - 1) : innerW / 2);
        const yAt = v => pad.top + innerH - (v / topValue) * innerH;

        let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" aria-hidden="true" focusable="false">`;
        svg += `<defs><linearGradient id="trendArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="area-stop-top"/><stop offset="1" class="area-stop-bottom"/></linearGradient></defs>`;

        for (let i = 0; i <= 4; i++) {
            const value = step * i;
            const y = yAt(value);
            svg += `<line class="chart-grid" x1="${pad.left}" y1="${y.toFixed(2)}" x2="${width - pad.right}" y2="${y.toFixed(2)}"/>`;
            svg += `<text class="chart-tick chart-tick--y" x="${pad.left - 10}" y="${y.toFixed(2)}" dy="0.32em">${escapeXML(tickLabel(value))}</text>`;
        }

        const axisY = yAt(0).toFixed(2);
        svg += `<line class="chart-axis" x1="${pad.left}" y1="${axisY}" x2="${width - pad.right}" y2="${axisY}"/>`;

        const maxLabels = Math.max(2, Math.floor(innerW / (width < 480 ? 52 : 64)));
        const labelEvery = Math.max(1, Math.ceil(n / maxLabels));
        let lastLabelX = -Infinity;

        labels.forEach((label, i) => {
            if (i % labelEvery !== 0 && i !== n - 1) return;
            const x = xAt(i);
            if (x - lastLabelX < 36) return;
            lastLabelX = x;
            svg += `<text class="chart-tick chart-tick--x" x="${x.toFixed(2)}" y="${height - 8}">${escapeXML(label)}</text>`;
        });

        const line = values.map((v, i) => `${i ? "L" : "M"}${xAt(i).toFixed(2)} ${yAt(v).toFixed(2)}`).join(" ");
        const baseline = yAt(0).toFixed(2);
        const area = `${line} L ${xAt(n - 1).toFixed(2)} ${baseline} L ${xAt(0).toFixed(2)} ${baseline} Z`;

        svg += `<path class="trend-area" d="${area}"/>`;
        svg += `<path class="trend-line" d="${line}"/>`;

        const endX = xAt(n - 1);
        const endY = yAt(values[n - 1]);
        svg += `<circle class="trend-end-dot" cx="${endX.toFixed(2)}" cy="${endY.toFixed(2)}" r="4"/>`;
        svg += `<text class="trend-end-label" x="${(endX - 9).toFixed(2)}" y="${Math.max(endY - 12, 16).toFixed(2)}" text-anchor="end">${fmtNumber(values[n - 1])}</text>`;

        svg += `<line class="trend-crosshair" x1="0" y1="${pad.top}" x2="0" y2="${height - pad.bottom}"/>`;
        svg += `<circle class="trend-hover-dot" cx="0" cy="0" r="5"/>`;
        svg += `<rect class="chart-hit" x="0" y="0" width="${width}" height="${height}"/>`;
        svg += `</svg>`;

        canvas.innerHTML = svg;

        state.geo = {
            width,
            height,
            pad,
            n,
            values,
            labels,
            xStep: n > 1 ? innerW / (n - 1) : 0,
            xAt,
            yAt
        };
        state.crosshair = canvas.querySelector(".trend-crosshair");
        state.hoverDot = canvas.querySelector(".trend-hover-dot");

        host.setAttribute(
            "aria-label",
            `${meta.label}访问量趋势图，共 ${n} 个数据点，最高 ${fmtNumber(maxValue)}，最低 ${fmtNumber(Math.min(...values))}`
        );

        renderTrendTable();
        hideTrendHover();
    }

    function showTrendHover(index) {
        const geo = state.geo;
        if (!geo || !state.crosshair || !state.hoverDot) return;

        const x = geo.xAt(index);
        const y = geo.yAt(geo.values[index]);
        const tip = document.getElementById("trend-tooltip");

        state.crosshair.setAttribute("x1", x);
        state.crosshair.setAttribute("x2", x);
        state.crosshair.classList.add("is-visible");

        state.hoverDot.setAttribute("cx", x);
        state.hoverDot.setAttribute("cy", y);
        state.hoverDot.classList.add("is-visible");

        tip.querySelector("strong").textContent = fmtNumber(geo.values[index]);
        tip.querySelector("span").textContent = `${geo.labels[index]} · 访问量`;
        tip.classList.add("is-visible");

        const below = y < 74;
        const tipWidth = tip.offsetWidth || 120;
        const left = Math.min(Math.max(x, tipWidth / 2 + 4), geo.width - tipWidth / 2 - 4);

        tip.classList.toggle("is-below", below);
        tip.style.left = left + "px";
        tip.style.top = (below ? y + 14 : y - 8) + "px";
    }

    function hideTrendHover() {
        const tip = document.getElementById("trend-tooltip");
        if (state.crosshair) state.crosshair.classList.remove("is-visible");
        if (state.hoverDot) state.hoverDot.classList.remove("is-visible");
        if (tip) tip.classList.remove("is-visible");
    }

    function onTrendPointerMove(event) {
        const geo = state.geo;
        if (!geo) return;

        const host = document.getElementById("trend-chart");
        const rect = host.getBoundingClientRect();
        const px = event.clientX - rect.left;

        if (px < geo.pad.left - 8 || px > geo.width - geo.pad.right + 8) {
            hideTrendHover();
            return;
        }

        const index = Math.max(0, Math.min(geo.n - 1, Math.round((px - geo.pad.left) / (geo.xStep || 1))));
        showTrendHover(index);
    }

    /* ============ 7. 范围切换 ============ */
    function updateRangeUI() {
        document.querySelectorAll(".segmented [data-range]").forEach(button => {
            button.setAttribute("aria-pressed", String(button.dataset.range === state.range));
        });

        document.getElementById("range-label").textContent = RANGE_META[state.range].label;
        document.getElementById("trend-sub").textContent = RANGE_META[state.range].trendSub;
    }

    function setRange(range) {
        if (!RANGE_META[range] || range === state.range) return;
        state.range = range;
        updateRangeUI();
        updateCards();
        updateChannels();
        renderTrend();
        setUpdatedTime();
    }

    /* ============ 8. 侧栏：手机抽屉 / 平板图标栏 / 桌面可折叠 ============ */
    function initSidebar() {
        const sidebar = document.getElementById("sidebar");
        const toggle = document.getElementById("sidebar-toggle");
        const openButton = document.getElementById("sidebar-open");
        const backdrop = document.getElementById("sidebar-backdrop");
        const mobileMedia = window.matchMedia("(max-width: 767.98px)");
        const desktopMedia = window.matchMedia("(min-width: 1200px)");
        let lastFocused = null;

        const isMobile = () => mobileMedia.matches;
        const isDrawerOpen = () => sidebar.classList.contains("is-open");

        function syncSidebarUI() {
            const mobile = isMobile();
            const open = isDrawerOpen();
            const collapsed = sidebar.classList.contains("is-collapsed");

            openButton.setAttribute("aria-expanded", String(mobile && open));

            if (mobile) {
                toggle.setAttribute("aria-expanded", String(open));
                toggle.setAttribute("aria-label", "关闭侧栏");
                toggle.title = "关闭侧栏";
            } else {
                toggle.setAttribute("aria-expanded", String(!collapsed));
                const label = collapsed ? "展开侧栏" : "收起侧栏";
                toggle.setAttribute("aria-label", label);
                toggle.title = label;
            }
        }

        function openDrawer() {
            if (!isMobile() || isDrawerOpen()) return;

            lastFocused = document.activeElement;
            sidebar.classList.add("is-open");
            backdrop.classList.add("is-visible");
            document.body.classList.add("drawer-open");
            syncSidebarUI();

            requestAnimationFrame(() => {
                try {
                    toggle.focus({ preventScroll: true });
                } catch (e) {
                    toggle.focus();
                }
            });
        }

        function closeDrawer(options) {
            if (!isDrawerOpen()) return;

            const restoreFocus = !options || options.restoreFocus !== false;
            sidebar.classList.remove("is-open");
            backdrop.classList.remove("is-visible");
            document.body.classList.remove("drawer-open");
            syncSidebarUI();

            if (restoreFocus) {
                /* 编程式 click() 不会自动聚焦按钮，回退到左上角打开按钮 */
                const target = lastFocused && lastFocused !== document.body && lastFocused.isConnected
                    ? lastFocused
                    : openButton;
                try {
                    target.focus({ preventScroll: true });
                } catch (e) {
                    target.focus();
                }
            }
        }

        function resetForBreakpoint() {
            sidebar.classList.remove("is-open");
            backdrop.classList.remove("is-visible");
            document.body.classList.remove("drawer-open");

            if (isMobile()) {
                sidebar.classList.remove("is-collapsed");
            } else {
                sidebar.classList.toggle("is-collapsed", !desktopMedia.matches);
            }

            syncSidebarUI();
        }

        toggle.addEventListener("click", () => {
            if (isMobile()) {
                closeDrawer();
                return;
            }
            sidebar.classList.toggle("is-collapsed");
            syncSidebarUI();
        });

        openButton.addEventListener("click", openDrawer);

        backdrop.addEventListener("click", () => closeDrawer());

        document.addEventListener("keydown", event => {
            if (event.key === "Escape" && isMobile() && isDrawerOpen()) {
                closeDrawer();
            }
        });

        document.querySelectorAll(".nav-link").forEach(link => {
            link.addEventListener("click", () => {
                if (isMobile() && isDrawerOpen()) {
                    closeDrawer({ restoreFocus: false });
                }
            });
        });

        /* 手机抽屉打开时，把键盘焦点限制在侧栏内 */
        sidebar.addEventListener("keydown", event => {
            if (event.key !== "Tab" || !isMobile() || !isDrawerOpen()) return;

            const focusables = Array.from(
                sidebar.querySelectorAll("a[href], button:not([disabled])")
            );
            if (!focusables.length) return;

            const first = focusables[0];
            const last = focusables[focusables.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        });

        if (typeof mobileMedia.addEventListener === "function") {
            mobileMedia.addEventListener("change", resetForBreakpoint);
            desktopMedia.addEventListener("change", resetForBreakpoint);
        }

        resetForBreakpoint();
    }

    /* ============ 9. 主题 ============ */
    const themeMedia = window.matchMedia("(prefers-color-scheme: dark)");

    function getSavedTheme() {
        try {
            const saved = localStorage.getItem("dashboard-theme");
            return saved === "dark" || saved === "light" ? saved : null;
        } catch (e) {
            return null;
        }
    }

    function effectiveTheme() {
        const saved = getSavedTheme();
        if (saved) return saved;

        const explicit = root.dataset.theme;
        if (explicit === "dark" || explicit === "light") return explicit;

        return themeMedia.matches ? "dark" : "light";
    }

    function syncThemeUI() {
        const button = document.getElementById("theme-toggle");
        const isDark = effectiveTheme() === "dark";
        const label = isDark ? "切换到浅色模式" : "切换到深色模式";

        button.setAttribute("aria-pressed", String(isDark));
        button.setAttribute("aria-label", label);
        button.title = label;
    }

    function initTheme() {
        const button = document.getElementById("theme-toggle");
        const saved = getSavedTheme();

        if (saved) {
            root.dataset.theme = saved;
        }

        syncThemeUI();

        button.addEventListener("click", () => {
            const next = effectiveTheme() === "dark" ? "light" : "dark";
            root.dataset.theme = next;
            try {
                localStorage.setItem("dashboard-theme", next);
            } catch (e) {
                /* localStorage 不可用时仅当前会话生效 */
            }
            syncThemeUI();
        });

        const onSystemThemeChange = () => {
            if (!getSavedTheme()) {
                syncThemeUI();
            }
        };

        if (typeof themeMedia.addEventListener === "function") {
            themeMedia.addEventListener("change", onSystemThemeChange);
        }
    }

    /* ============ 10. 初始化 ============ */
    function init() {
        initSidebar();
        buildCards();
        buildChannels();
        updateRangeUI();
        updateChannels();
        renderTrend();
        setUpdatedTime();
        initTheme();

        document.querySelectorAll(".segmented [data-range]").forEach(button => {
            button.addEventListener("click", () => setRange(button.dataset.range));
        });

        const trendHost = document.getElementById("trend-chart");
        trendHost.addEventListener("pointermove", onTrendPointerMove);
        trendHost.addEventListener("pointerleave", hideTrendHover);

        let resizeRAF = 0;
        const observer = new ResizeObserver(() => {
            cancelAnimationFrame(resizeRAF);
            resizeRAF = requestAnimationFrame(renderTrend);
        });
        observer.observe(trendHost);

        /* 布局状态应用完毕后再启用侧栏过渡 */
        requestAnimationFrame(() => {
            requestAnimationFrame(() => root.classList.remove("no-sidebar-transition"));
        });
    }

    init();
})();
