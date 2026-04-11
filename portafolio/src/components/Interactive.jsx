import { useEffect } from "react";
import emailjs from "@emailjs/browser";

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
			{ name: "Odoo", img: "https://odoocdn.com/web/image/website/1/favicon?unique=8d8a558", lvl: 70 },
			{ name: "LangChain", img: "https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/69a17e4a429d54e956e2a763_favicon.png", lvl: 75 },
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

		// Initialize EmailJS public key once if provided in env
		const _emailjsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
		if (_emailjsPublicKey) {
			try {
				emailjs.init(_emailjsPublicKey);
				console.log("EmailJS initialized");
			} catch (e) {
				console.warn("EmailJS init failed", e);
			}
		}

		/* Background particle canvas (id="c") - adapted version */
		(function () {
			window.requestAnimationFrame = (function () {
				return (
					window.requestAnimationFrame ||
					window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame ||
					window.oRequestAnimationFrame ||
					window.msRequestAnimationFrame ||
					function (callback) {
						window.setTimeout(callback, 1000 / 60);
					}
				);
			})();

			function Vector(x, y) {
				this.x = x || 0;
				this.y = y || 0;
			}

			Vector.add = function (a, b) {
				return new Vector(a.x + b.x, a.y + b.y);
			};

			Vector.sub = function (a, b) {
				return new Vector(a.x - b.x, a.y - b.y);
			};

			Vector.scale = function (v, s) {
				return v.clone().scale(s);
			};

			Vector.random = function () {
				return new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1);
			};

			Vector.prototype = {
				set: function (x, y) {
					if (typeof x === "object") {
						y = x.y;
						x = x.x;
					}
					this.x = x || 0;
					this.y = y || 0;
					return this;
				},

				add: function (v) {
					this.x += v.x;
					this.y += v.y;
					return this;
				},

				sub: function (v) {
					this.x -= v.x;
					this.y -= v.y;
					return this;
				},

				scale: function (s) {
					this.x *= s;
					this.y *= s;
					return this;
				},

				length: function () {
					return Math.sqrt(this.x * this.x + this.y * this.y);
				},

				lengthSq: function () {
					return this.x * this.x + this.y * this.y;
				},

				normalize: function () {
					var m = Math.sqrt(this.x * this.x + this.y * this.y);
					if (m) {
						this.x /= m;
						this.y /= m;
					}
					return this;
				},

				angle: function () {
					return Math.atan2(this.y, this.x);
				},

				angleTo: function (v) {
					var dx = v.x - this.x,
						dy = v.y - this.y;
					return Math.atan2(dy, dx);
				},

				distanceTo: function (v) {
					var dx = v.x - this.x,
						dy = v.y - this.y;
					return Math.sqrt(dx * dx + dy * dy);
				},

				distanceToSq: function (v) {
					var dx = v.x - this.x,
						dy = v.y - this.y;
					return dx * dx + dy * dy;
				},

				lerp: function (v, t) {
					this.x += (v.x - this.x) * t;
					this.y += (v.y - this.y) * t;
					return this;
				},

				clone: function () {
					return new Vector(this.x, this.y);
				},

				toString: function () {
					return "(x:" + this.x + ", y:" + this.y + ")";
				},
			};

			function GravityPoint(x, y, radius, targets) {
				Vector.call(this, x, y);
				this.radius = radius;
				this.currentRadius = radius * 0.5;

				this._targets = {
					particles: targets.particles || [],
					gravities: targets.gravities || [],
				};

				this._speed = new Vector();
			}

			GravityPoint.RADIUS_LIMIT = 65;
			GravityPoint.interferenceToPoint = true;

			GravityPoint.prototype = (function (o) {
				var s = new Vector(0, 0),
					p;
				for (p in o) s[p] = o[p];
				return s;
			})({
				gravity: 0.05,
				isMouseOver: false,
				dragging: false,
				destroyed: false,
				_easeRadius: 0,
				_dragDistance: null,
				_collapsing: false,

				hitTest: function (p) {
					return this.distanceTo(p) < this.radius;
				},

				startDrag: function (dragStartPoint) {
					this._dragDistance = Vector.sub(dragStartPoint, this);
					this.dragging = true;
				},

				drag: function (dragToPoint) {
					this.x = dragToPoint.x - this._dragDistance.x;
					this.y = dragToPoint.y - this._dragDistance.y;
				},

				endDrag: function () {
					this._dragDistance = null;
					this.dragging = false;
				},

				addSpeed: function (d) {
					this._speed = this._speed.add(d);
				},

				collapse: function (e) {
					this.currentRadius *= 1.75;
					this._collapsing = true;
				},

				render: function (ctx) {
					if (this.destroyed) return;

					var particles = this._targets.particles,
						i,
						len;

					for (i = 0, len = particles.length; i < len; i++) {
						particles[i].addSpeed(Vector.sub(this, particles[i]).normalize().scale(this.gravity));
					}

					this._easeRadius = (this._easeRadius + (this.radius - this.currentRadius) * 0.07) * 0.95;
					this.currentRadius += this._easeRadius;
					if (this.currentRadius < 0) this.currentRadius = 0;

					if (this._collapsing) {
						this.radius *= 0.75;
						if (this.currentRadius < 1) this.destroyed = true;
						this._draw(ctx);
						return;
					}

					var gravities = this._targets.gravities,
						g,
						absorp,
						area = this.radius * this.radius * Math.PI,
						garea;

					for (i = 0, len = gravities.length; i < len; i++) {
						g = gravities[i];

						if (g === this || g.destroyed) continue;

						if ((this.currentRadius >= g.radius || this.dragging) && this.distanceTo(g) < (this.currentRadius + g.radius) * 0.85) {
							g.destroyed = true;
							this.gravity += g.gravity;

							absorp = Vector.sub(g, this).scale((g.radius / this.radius) * 0.5);
							this.addSpeed(absorp);

							garea = g.radius * g.radius * Math.PI;
							this.currentRadius = Math.sqrt((area + garea * 3) / Math.PI);
							this.radius = Math.sqrt((area + garea) / Math.PI);
						}

						g.addSpeed(Vector.sub(this, g).normalize().scale(this.gravity));
					}

					if (GravityPoint.interferenceToPoint && !this.dragging) this.add(this._speed);

					this._speed = new Vector();

					if (this.currentRadius > GravityPoint.RADIUS_LIMIT) this.collapse();

					this._draw(ctx);
				},

				_draw: function (ctx) {
					var grd, r;

					ctx.save();

					grd = ctx.createRadialGradient(this.x, this.y, this.radius, this.x, this.y, this.radius * 5);
					grd.addColorStop(0, "rgba(0, 0, 0, 0.1)");
					grd.addColorStop(1, "rgba(0, 0, 0, 0)");
					ctx.beginPath();
					ctx.arc(this.x, this.y, this.radius * 5, 0, Math.PI * 2, false);
					ctx.fillStyle = grd;
					ctx.fill();

					r = Math.random() * this.currentRadius * 0.7 + this.currentRadius * 0.3;
					grd = ctx.createRadialGradient(this.x, this.y, r, this.x, this.y, this.currentRadius);
					grd.addColorStop(0, "rgba(0, 0, 0, 1)");
					grd.addColorStop(1, Math.random() < 0.2 ? "rgba(255, 196, 0, 0.15)" : "rgba(103, 181, 191, 0.75)");
					ctx.beginPath();
					ctx.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2, false);
					ctx.fillStyle = grd;
					ctx.fill();
					ctx.restore();
				},
			});

			function Particle(x, y, radius) {
				Vector.call(this, x, y);
				this.radius = radius;

				this._latest = new Vector();
				this._speed = new Vector();
			}

			Particle.prototype = (function (o) {
				var s = new Vector(0, 0),
					p;
				for (p in o) s[p] = o[p];
				return s;
			})({
				addSpeed: function (d) {
					this._speed.add(d);
				},

				update: function () {
					if (this._speed.length() > 12) this._speed.normalize().scale(12);

					this._latest.set(this);
					this.add(this._speed);
				},
			});

			const prefersDarkBg = window.matchMedia("(prefers-color-scheme: dark)");
			const bodyBg = document.body;

			let BACKGROUND_COLOR = prefersDarkBg.matches ? "rgba(30, 41, 59)" : "rgb(214, 214, 214)";
			let PARTICLE_RADIUS = 1;
			let G_POINT_RADIUS = 10;
			let G_POINT_RADIUS_LIMITS = 65;

			var bgCanvas,
				bgContext,
				bgBufferCvs,
				bgBufferCtx,
				bgScreenWidth,
				bgScreenHeight,
				bgMouse = new Vector(),
				bgGravities = [],
				bgParticles = [],
				bgGrad,
				bgAnimId;

			const div = document.createElement("div");
			div.style.width = "100px";
			div.style.height = "100px";
			div.style.overflow = "scroll";
			div.style.position = "absolute";
			div.style.top = "-9999px";
			div.style.left = "-9999px";
			document.body.appendChild(div);
			const scrollWidth = div.offsetWidth - div.clientWidth;
			document.body.removeChild(div);

			function resizeBg() {
				bgScreenWidth = bgCanvas.width = window.innerWidth - scrollWidth;
				bgScreenHeight = bgCanvas.height = window.innerHeight;
				bgBufferCvs.width = bgScreenWidth;
				bgBufferCvs.height = bgScreenHeight;
				bgContext = bgCanvas.getContext("2d");
				bgBufferCtx = bgBufferCvs.getContext("2d");
				var cx = bgCanvas.width * 0.5,
					cy = bgCanvas.height * 0.5;

				bgGrad = bgContext.createRadialGradient(cx, cy, 0, cx, cy, Math.sqrt(cx * cx + cy * cy));
				bgGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
				bgGrad.addColorStop(1, "rgba(0, 0, 0, 0.35)");
			}

			function mouseMoveBg(e) {
				bgMouse.set(e.clientX, e.clientY);

				var i,
					g,
					hit = false;
				for (i = bgGravities.length - 1; i >= 0; i--) {
					g = bgGravities[i];
					if ((!hit && g.hitTest(bgMouse)) || g.dragging) g.isMouseOver = hit = true;
					else g.isMouseOver = false;
				}

				bgCanvas.style.cursor = hit ? "pointer" : "default";
			}

			function mouseDownBg(e) {
				for (var i = bgGravities.length - 1; i >= 0; i--) {
					if (bgGravities[i].isMouseOver) {
						bgGravities[i].startDrag(bgMouse);
						return;
					}
				}
				bgGravities.push(
					new GravityPoint(e.clientX, e.clientY, G_POINT_RADIUS, {
						particles: bgParticles,
						gravities: bgGravities,
					}),
				);
			}

			function mouseUpBg() {
				for (var i = 0, len = bgGravities.length; i < len; i++) {
					if (bgGravities[i].dragging) {
						bgGravities[i].endDrag();
						break;
					}
				}
			}

			function doubleClickBg() {
				for (var i = bgGravities.length - 1; i >= 0; i--) {
					if (bgGravities[i].isMouseOver) {
						bgGravities[i].collapse();
						break;
					}
				}
			}

			function addParticleBg(num) {
				var i, p;
				for (i = 0; i < num; i++) {
					p = new Particle(Math.floor(Math.random() * bgScreenWidth - PARTICLE_RADIUS * 2) + 1 + PARTICLE_RADIUS, Math.floor(Math.random() * bgScreenHeight - PARTICLE_RADIUS * 2) + 1 + PARTICLE_RADIUS, PARTICLE_RADIUS);

					p.addSpeed(Vector.random());
					bgParticles.push(p);
				}
			}

			var controlBg = { particleNum: 120 };

			bgCanvas = document.getElementById("c");
			bgBufferCvs = document.createElement("canvas");

			window.addEventListener("resize", resizeBg, false);
			resizeBg(null);

			addParticleBg(controlBg.particleNum);

			bgCanvas.addEventListener("mousemove", mouseMoveBg, false);
			bgCanvas.addEventListener("mousedown", mouseDownBg, false);
			bgCanvas.addEventListener("mouseup", mouseUpBg, false);
			bgCanvas.addEventListener("dblclick", doubleClickBg, false);

			function loopBg() {
				var i, len, g, p;

				bgContext.save();
				bgContext.fillStyle = BACKGROUND_COLOR;
				bgContext.fillRect(0, 0, bgScreenWidth, bgScreenHeight);
				bgContext.restore();

				for (i = 0, len = bgGravities.length; i < len; i++) {
					g = bgGravities[i];
					if (g.dragging) g.drag(bgMouse);
					g.render(bgContext);
					if (g.destroyed) {
						bgGravities.splice(i, 1);
						len--;
						i--;
					}
				}

				bgBufferCtx.save();
				bgBufferCtx.globalCompositeOperation = "destination-out";
				bgBufferCtx.globalAlpha = 0.35;
				bgBufferCtx.fillRect(0, 0, bgScreenWidth, bgScreenHeight);
				bgBufferCtx.restore();

				len = bgParticles.length;
				bgBufferCtx.save();
				bgBufferCtx.fillStyle = bgBufferCtx.strokeStyle = bodyBg.dataset.mode === "dark" ? "#fff" : "#333";
				bgBufferCtx.lineCap = bgBufferCtx.lineJoin = "round";
				bgBufferCtx.lineWidth = PARTICLE_RADIUS * 2;
				bgBufferCtx.beginPath();
				for (i = 0; i < len; i++) {
					p = bgParticles[i];
					p.update();
					bgBufferCtx.moveTo(p.x, p.y);
					bgBufferCtx.lineTo(p._latest.x, p._latest.y);
				}
				bgBufferCtx.stroke();
				bgBufferCtx.beginPath();
				for (i = 0; i < len; i++) {
					p = bgParticles[i];
					bgBufferCtx.moveTo(p.x, p.y);
					bgBufferCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false);
				}
				bgBufferCtx.fill();
				bgBufferCtx.restore();

				bgContext.drawImage(bgBufferCvs, 0, 0);

				bgAnimId = requestAnimationFrame(loopBg);
			}
			loopBg();

			const handleDarkModeChangeBg = () => {
				bodyBg.dataset.mode = prefersDarkBg.matches ? "dark" : "light";
				if (bodyBg.dataset.mode === "light") {
					bodyBg.classList.add("body-light");
					bodyBg.classList.remove("body-dark");
					BACKGROUND_COLOR = "rgb(214, 214, 214)";
				} else {
					bodyBg.classList.remove("body-light");
					bodyBg.classList.add("body-dark");
					BACKGROUND_COLOR = "rgba(30, 41, 59)";
				}
			};

			prefersDarkBg.addEventListener("change", handleDarkModeChangeBg);

			const toggleBtnBg = document.querySelector("#switch");
			bodyBg.dataset.mode = prefersDarkBg.matches ? "dark" : "light";
			bodyBg.classList.add(prefersDarkBg.matches ? "body-dark" : "body-light");

			function toggleDarkModeBg() {
				if (bodyBg.dataset.mode === "light") {
					bodyBg.classList.add("body-dark");
					bodyBg.classList.remove("body-light");
					BACKGROUND_COLOR = "rgba(30, 41, 59)";
					bodyBg.dataset.mode = "dark";
				} else {
					bodyBg.classList.remove("body-dark");
					bodyBg.classList.add("body-light");
					BACKGROUND_COLOR = "rgb(214, 214, 214)";
					bodyBg.dataset.mode = "light";
				}
			}

			toggleBtnBg && toggleBtnBg.addEventListener("click", toggleDarkModeBg);

			// expose cleanup
			const _cleanupBg = function () {
				window.removeEventListener("resize", resizeBg, false);
				if (bgCanvas) {
					bgCanvas.removeEventListener("mousemove", mouseMoveBg, false);
					bgCanvas.removeEventListener("mousedown", mouseDownBg, false);
					bgCanvas.removeEventListener("mouseup", mouseUpBg, false);
					bgCanvas.removeEventListener("dblclick", doubleClickBg, false);
				}
				prefersDarkBg.removeEventListener("change", handleDarkModeChangeBg);
				toggleBtnBg && toggleBtnBg.removeEventListener("click", toggleDarkModeBg);
				if (bgAnimId) cancelAnimationFrame(bgAnimId);
			};

			// attach cleanup handler to window so we can call it from outer cleanup
			if (!window.__bgCanvasCleanups) window.__bgCanvasCleanups = [];
			window.__bgCanvasCleanups.push(_cleanupBg);
		})();

		/* ── FORM ───────────────────────────────────────────────── */
		function handleForm(e) {
			e.preventDefault();
			const btn = e.target.querySelector(".btn-send");
			if (!btn) return;

			const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
			const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

			btn.disabled = true;
			btn.textContent = "Enviando...";

			if (!serviceID || !templateID) {
				// Fallback: show UI but warn
				btn.textContent = "✓ Mensaje enviado";
				btn.style.background = "linear-gradient(135deg,#4caf50,#2e7d32)";
				setTimeout(() => {
					btn.innerHTML = '<i class="fa-regular fa-paper-plane"></i> Enviar mensaje';
					btn.style.background = "";
					btn.disabled = false;
					e.target.reset();
					alert("Formulario procesado localmente. Para enviar correos reales configura EmailJS (VITE_EMAILJS_*).");
				}, 2000);
				return;
			}

			// build template params explicitly and force recipient email
			const formData = new FormData(e.target);
			const now = new Date();
			const time = `${now.getDate().toString().padStart(2, "0")}/${(now.getMonth() + 1).toString().padStart(2, "0")}/${now.getFullYear()}`;
			const templateParams = {
				// required shape requested by the user
				title: formData.get("title") || "Nuevo mensaje",
				name: formData.get("name") || formData.get("nombre") || "Usuario",
				time: time,
				message: formData.get("message") || formData.get("mensaje") || formData.get("message_text") || "",
				email: formData.get("email") || formData.get("correo") || "",
			};
			console.log("*-/-*/-*/-*/-*/  ", templateParams);
			// Use the EmailJS documented promise style
			emailjs.send(serviceID, templateID, templateParams).then(
				(response) => {
					console.log("SUCCESS!", response.status, response.text);
					btn.textContent = "✓ Mensaje enviado";
					btn.style.background = "linear-gradient(135deg,#4caf50,#2e7d32)";
					setTimeout(() => {
						btn.innerHTML = '<i class="fa-regular fa-paper-plane"></i> Enviar mensaje';
						btn.style.background = "";
						btn.disabled = false;
						e.target.reset();
					}, 2000);
				},
				(error) => {
					console.log("FAILED...", error);
					btn.textContent = "Error";
					btn.style.background = "linear-gradient(135deg,#d32f2f,#b71c1c)";
					setTimeout(() => {
						btn.innerHTML = '<i class="fa-regular fa-paper-plane"></i> Enviar mensaje';
						btn.style.background = "";
						btn.disabled = false;
						alert("No se pudo enviar el correo. Revisa la configuración de EmailJS en .env y que la plantilla exista. Mira la consola para detalles.");
					}, 2500);
				},
			);
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
