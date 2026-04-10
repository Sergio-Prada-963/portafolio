import { useEffect } from "react";

export default function Interactive() {
	useEffect(() => {
		/* Create cursor elements if missing */
		let dot = document.getElementById("cursorDot");
		let ring = document.getElementById("cursorRing");
		if (!dot) {
			dot = document.createElement("div");
			dot.id = "cursorDot";
			dot.className = "cursor-dot";
			document.body.appendChild(dot);
		}
		if (!ring) {
			ring = document.createElement("div");
			ring.id = "cursorRing";
			ring.className = "cursor-ring";
			document.body.appendChild(ring);
		}

		/* ── CURSOR ─────────────────────────────────────────────── */
		let mx = 0,
			my = 0,
			rx = 0,
			ry = 0;

		const onMove = (e) => {
			mx = e.clientX;
			my = e.clientY;
		};
		document.addEventListener("mousemove", onMove);

		let rafId;
		const animCursor = () => {
			rx += (mx - rx) * 0.15;
			ry += (my - ry) * 0.15;
			dot.style.left = mx + "px";
			dot.style.top = my + "px";
			ring.style.left = rx + "px";
			ring.style.top = ry + "px";
			rafId = requestAnimationFrame(animCursor);
		};
		animCursor();

		const hoverEls = [];
		document.querySelectorAll("a,button,.project-card,.tech-card,.soft-card,.contact-link").forEach((el) => {
			const onEnter = () => {
				ring.style.width = "54px";
				ring.style.height = "54px";
				ring.style.opacity = "1";
			};
			const onLeave = () => {
				ring.style.width = "36px";
				ring.style.height = "36px";
				ring.style.opacity = ".6";
			};
			el.addEventListener("mouseenter", onEnter);
			el.addEventListener("mouseleave", onLeave);
			hoverEls.push({ el, onEnter, onLeave });
		});

		/* ── SCROLL REVEAL ──────────────────────────────────────── */
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((e) => {
					if (e.isIntersecting) e.target.classList.add("visible");
				});
			},
			{ threshold: 0.1 },
		);
		document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

		/* ── TECH SKILLS DATA ───────────────────────────────────── */
		const techs = [
			{ name: "Python", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", lvl: 90 },
			{ name: "JavaScript", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", lvl: 88 },
			{ name: "Node.js", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", lvl: 85 },
			{ name: "React", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", lvl: 85 },
			{ name: "HTML5", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg", lvl: 95 },
			{ name: "CSS3", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg", lvl: 90 },
			{ name: "Flutter", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg", lvl: 75 },
			{ name: "PostgreSQL", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg", lvl: 80 },
			{ name: "MongoDB", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg", lvl: 78 },
			{ name: "Git", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg", lvl: 88 },
			{ name: "Bootstrap", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg", lvl: 85 },
			{ name: "Tailwind", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg", lvl: 82 },
			{ name: "Express", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg", lvl: 83 },
			{ name: "Vite", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg", lvl: 80 },
			{ name: "Odoo", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", lvl: 70 },
			{ name: "LangChain", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", lvl: 75 },
		];

		const grid = document.getElementById("techGrid");
		if (grid) {
			grid.innerHTML = "";
			techs.forEach((t) => {
				const card = document.createElement("div");
				card.className = "tech-card";
				card.innerHTML = `\n    <img class="tech-img" src="${t.img}" alt="${t.name}" onerror="this.src='https://cdn.jsdelivr.net/gh/devicons/devicon/icons/devicon/devicon-original.svg'">\n    <div class="tech-name">${t.name}</div>\n    <div class="tech-level"><div class="tech-level-fill" style="width:${t.lvl}%"></div></div>`;
				grid.appendChild(card);
			});
		}

		/* ── MINI GAME ──────────────────────────────────────────── */
		const canvas = document.getElementById("gameCanvas");
		let ctx = null;
		if (canvas) {
			ctx = canvas.getContext("2d");
			const resize = () => {
				const dpr = window.devicePixelRatio || 1;
				canvas.width = Math.floor(canvas.clientWidth * dpr);
				canvas.height = Math.floor(canvas.clientHeight * dpr);
			};
			resize();
			window.addEventListener("resize", resize);
		}

		const btnStart = document.getElementById("btnStart");
		const btnReset = document.getElementById("btnReset");
		if (btnStart) btnStart.addEventListener("click", startGame);
		if (btnReset) btnReset.addEventListener("click", resetGame);

		let score = 0,
			best = 0,
			timeLeft = 30,
			gameRunning = false,
			bugs = [],
			animId;

		const EMOJIS = ["🐛", "🪲", "🦗", "🐞", "🪳"];

		function Bug() {
			this.x = Math.random() * (canvas.width - 60) + 30;
			this.y = Math.random() * (canvas.height - 60) + 30;
			this.vx = (Math.random() - 0.5) * 3;
			this.vy = (Math.random() - 0.5) * 3;
			this.r = 24;
			this.emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
			this.born = Date.now();
			this.life = 2500 + Math.random() * 2000;
			this.opacity = 0;
		}

		function drawBug(b) {
			const age = Date.now() - b.born;
			b.opacity = age < 300 ? age / 300 : age > b.life - 300 ? (b.life - age) / 300 : 1;
			ctx.globalAlpha = Math.max(0, b.opacity);
			ctx.font = "36px serif";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText(b.emoji, b.x, b.y);
			ctx.globalAlpha = 1;
		}

		function spawnBug() {
			if (bugs.length < 8 && gameRunning) bugs.push(new Bug());
		}

		function gameLoop() {
			if (!ctx) return;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = "#0d1f38";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.strokeStyle = "rgba(201,168,76,.04)";
			ctx.lineWidth = 1;
			for (let x = 0; x < canvas.width; x += 40) {
				ctx.beginPath();
				ctx.moveTo(x, 0);
				ctx.lineTo(x, canvas.height);
				ctx.stroke();
			}
			for (let y = 0; y < canvas.height; y += 40) {
				ctx.beginPath();
				ctx.moveTo(0, y);
				ctx.lineTo(canvas.width, y);
				ctx.stroke();
			}

			if (!gameRunning && score === 0) {
				ctx.fillStyle = "rgba(201,168,76,.6)";
				ctx.font = "500 18px Outfit, sans-serif";
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.fillText("Presiona ▶ Iniciar para cazar bugs 🐛", canvas.width / 2, canvas.height / 2);
			}

			bugs = bugs.filter((b) => {
				b.x += b.vx;
				b.y += b.vy;
				if (b.x < b.r || b.x > canvas.width - b.r) b.vx *= -1;
				if (b.y < b.r || b.y > canvas.height - b.r) b.vy *= -1;
				drawBug(b);
				return Date.now() - b.born < b.life;
			});

			if (gameRunning) animId = requestAnimationFrame(gameLoop);
		}

		function startGame() {
			if (gameRunning) return;
			resetGame();
			gameRunning = true;
			score = 0;
			timeLeft = 30;
			const scoreEl = document.getElementById("score");
			const timerEl = document.getElementById("timer");
			if (scoreEl) scoreEl.textContent = 0;
			if (timerEl) timerEl.textContent = 30;

			const spawnInterval = setInterval(() => {
				if (gameRunning) spawnBug();
				else clearInterval(spawnInterval);
			}, 600);
			const countdown = setInterval(() => {
				if (!gameRunning) {
					clearInterval(countdown);
					return;
				}
				timeLeft--;
				const timerEl2 = document.getElementById("timer");
				if (timerEl2) timerEl2.textContent = timeLeft;
				if (timeLeft <= 0) {
					gameRunning = false;
					clearInterval(countdown);
					if (score > best) {
						best = score;
						const bestEl = document.getElementById("best");
						if (bestEl) bestEl.textContent = best;
					}
					// end screen
					ctx.clearRect(0, 0, canvas.width, canvas.height);
					ctx.fillStyle = "#0d1f38";
					ctx.fillRect(0, 0, canvas.width, canvas.height);
					ctx.fillStyle = "rgba(201,168,76,1)";
					ctx.font = "bold 32px Cormorant Garamond, serif";
					ctx.textAlign = "center";
					ctx.textBaseline = "middle";
					ctx.fillText(`¡Tiempo! Atrapaste ${score} bugs 🏆`, canvas.width / 2, canvas.height / 2);
				}
			}, 1000);

			gameLoop();
		}

		function resetGame() {
			gameRunning = false;
			bugs = [];
			cancelAnimationFrame(animId);
			score = 0;
			timeLeft = 30;
			const scoreEl = document.getElementById("score");
			const timerEl = document.getElementById("timer");
			if (scoreEl) scoreEl.textContent = 0;
			if (timerEl) timerEl.textContent = 30;
			if (ctx) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.fillStyle = "#0d1f38";
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				ctx.fillStyle = "rgba(201,168,76,.6)";
				ctx.font = "500 18px Outfit, sans-serif";
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.fillText("Presiona ▶ Iniciar para cazar bugs 🐛", canvas.width / 2, canvas.height / 2);
			}
		}

		if (canvas) {
			canvas.addEventListener("click", (e) => {
				if (!gameRunning) return;
				const rect = canvas.getBoundingClientRect();
				const cx = e.clientX - rect.left,
					cy = e.clientY - rect.top;
				const scale = canvas.width / rect.width;
				const mx2 = cx * scale,
					my2 = cy * scale;
				bugs = bugs.filter((b) => {
					const dist = Math.hypot(mx2 - b.x, my2 - b.y);
					if (dist < b.r + 10) {
						score++;
						const scoreEl = document.getElementById("score");
						if (scoreEl) scoreEl.textContent = score;
						ctx.save();
						ctx.globalAlpha = 0.5;
						ctx.fillStyle = "rgba(201,168,76,.3)";
						ctx.beginPath();
						ctx.arc(b.x, b.y, 40, 0, Math.PI * 2);
						ctx.fill();
						ctx.restore();
						return false;
					}
					return true;
				});
			});
		}

		resetGame();

		/* ── FORM ───────────────────────────────────────────────── */
		function handleForm(e) {
			e.preventDefault();
			const btn = e.target.querySelector(".btn-send");
			if (!btn) return;
			btn.textContent = "✓ Mensaje enviado";
			btn.style.background = "linear-gradient(135deg,#4caf50,#2e7d32)";
			setTimeout(() => {
				btn.innerHTML = '<i class="fa-regular fa-paper-plane"></i> Enviar mensaje';
				btn.style.background = "";
				e.target.reset();
			}, 3000);
		}

		const form = document.getElementById("contactForm");
		if (form) form.addEventListener("submit", handleForm);

		/* cleanup */
		return () => {
			document.removeEventListener("mousemove", onMove);
			hoverEls.forEach((h) => {
				h.el.removeEventListener("mouseenter", h.onEnter);
				h.el.removeEventListener("mouseleave", h.onLeave);
			});
			observer.disconnect();
			if (form) form.removeEventListener("submit", handleForm);
			if (btnStart) btnStart.removeEventListener("click", startGame);
			if (btnReset) btnReset.removeEventListener("click", resetGame);
			cancelAnimationFrame(rafId);
			if (canvas) window.removeEventListener("resize", () => {});
		};
	}, []);

	return null;
}
