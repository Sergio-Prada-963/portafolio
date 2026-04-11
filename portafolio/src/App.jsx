import Interactive from "./components/Interactive";
import userLogo from "./assets/user_logo_black.png";
import userLogo_white from "./assets/user_logo_v2.png";

function App() {
	return (
		<>
			<canvas id="c" style={{ position: "fixed", top: 0, left: 0, zIndex: 1 }}></canvas>
			<div class="cursor-dot" id="cursorDot"></div>
			<div class="cursor-ring" id="cursorRing"></div>

			{/*  NAV*/}
			<nav>
				<a class="nav-logo" href="#hero">
					S
				</a>
				<ul class="nav-links">
					<li>
						<a href="#about">Sobre mí</a>
					</li>
					<li>
						<a href="#misionvision">Misión</a>
					</li>
					<li>
						<a href="#proyectos">Proyectos</a>
					</li>
					<li>
						<a href="#habilidades">Skills</a>
					</li>
					<li>
						<a href="#juego">Juego</a>
					</li>
					<li>
						<a href="#contacto">Contacto</a>
					</li>
				</ul>
			</nav>

			{/*  HERO*/}
			<section id="hero">
				{/* <div class="hero-bg"></div>
				<div class="hero-grid"></div>
				<div class="orb orb-1"></div>
				<div class="orb orb-2"></div>
				<div class="orb orb-3"></div> */}
				{/* <canvas id='c'></canvas> */}

				<div class="hero-content">
					<div class="hero-avatar-wrap">
						<img src={userLogo} alt="user logo" className="hero-avatar-placeholder" />
					</div>
					<p class="hero-tag">// Full Stack Developer & AI Engineer</p>
					<h1 class="hero-name">
						<span class="name-gold">Sergio</span> Rodriguez
					</h1>
					<p class="hero-sub">
						Desarrollador &nbsp;·&nbsp; <span>Software Architecture</span> &nbsp;·&nbsp; AI Solutions
					</p>
					<a href="#contacto" class="btn-contact">
						<i class="fa-regular fa-paper-plane"></i>
						<span>Contactar</span>
					</a>
				</div>

				<div class="scroll-hint">scroll</div>
			</section>

			{/*  ABOUT*/}
			<section id="about">
				<div class="container">
					<div class="about-grid reveal">
						<div class="about-img-wrap">
							{/* <div class="about-img-frame">S</div> */}
							<img src={userLogo_white} alt="user logo" class="about-img-frame" />
						</div>
						<div class="about-text">
							<span class="section-label">// 01 — Sobre mí</span>
							<h2 class="section-title">
								El dev detrás <em>del código</em>
							</h2>
							<div class="gold-line"></div>
							<p>
								Soy <strong>Sergio Alejandro Rodríguez Prada</strong>, desarrollador Full Stack apasionado por la arquitectura de software y la evolución tecnológica.
							</p>
							<p>
								Me especializo en construir soluciones integrales de extremo a extremo, desde interfaces con <strong>React</strong> y <strong>Flutter</strong> hasta backends robustos con <strong>Python</strong>, <strong>Node.js</strong> y <strong>Express</strong>, bases de datos y modelos de IA integrados con <strong>LangChain & LLMs</strong>.
							</p>
							<p>
								Trabajo con una mentalidad de <strong>mejora constante</strong>, siempre buscando los mejores patrones de diseño y las tecnologías más relevantes para cada proyecto.
							</p>
							<div class="about-stats">
								<div class="stat-card">
									<div class="stat-num">16+</div>
									<div class="stat-lbl">Tecnologías dominadas</div>
								</div>
								<div class="stat-card">
									<div class="stat-num">360°</div>
									<div class="stat-lbl">Visión Full Stack</div>
								</div>
								<div class="stat-card">
									<div class="stat-num">AI</div>
									<div class="stat-lbl">Integración LLMs</div>
								</div>
								<div class="stat-card">
									<div class="stat-num">∞</div>
									<div class="stat-lbl">Mentalidad de crecimiento</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/*  MISSION & VISION*/}
			<section id="misionvision">
				<div class="container">
					<span class="section-label reveal">// 02 — Propósito</span>
					<h2 class="section-title reveal">
						Misión <em>&</em> Visión
					</h2>
					<div class="mv-grid reveal">
						<div class="mv-card">
							<div class="mv-icon">
								<i class="fa-solid fa-rocket"></i>
							</div>
							<h3>Misión</h3>
							<p>Aportar soluciones integrales en proyectos de alta complejidad, integrándome de forma ágil en equipos diversos con una mentalidad de mejora continua, generando valor real desde el diseño hasta el despliegue.</p>
							<div class="mv-watermark">M</div>
						</div>
						<div class="mv-card">
							<div class="mv-icon">
								<i class="fa-solid fa-eye"></i>
							</div>
							<h3>Visión</h3>
							<p>Convertirme en un referente en arquitectura de software y soluciones de IA, liderando el diseño de sistemas escalables y robustos que impulsen la evolución tecnológica de los proyectos en los que participe.</p>
							<div class="mv-watermark">V</div>
						</div>
					</div>
				</div>
			</section>

			{/*  PROJECTS*/}
			<section id="proyectos">
				<div class="container">
					<span class="section-label reveal">// 03 — Portafolio</span>
					<h2 class="section-title reveal">
						Mis <em>Proyectos</em>
					</h2>
					<div class="projects-grid reveal">
						{/*  Card 0*/}
						<div class="project-card">
							<div class="project-thumb">🧠</div>
							<div class="project-body">
								<div class="project-tags">
									<span class="tag">LangChain</span>
									<span class="tag">Python</span>
									<span class="tag">LLMs</span>
									<span class="tag">Vue</span>
									<span class="tag">Odoo</span>
								</div>
								<h3>AI Assistant Platform</h3>
								<p>Plataforma de asistentes inteligentes con integración LangChain, memoria contextual conectada por api a odoo.</p>
								<a href="https://github.com/Sergio-Prada-963/myrx_ai" target="blank" class="project-link">
									<i class="fa-solid fa-arrow-right"></i> Ver proyecto
								</a>
							</div>
						</div>
						{/*  Card 1*/}
						<div class="project-card">
							<div class="project-thumb">🤖</div>
							<div class="project-body">
								<div class="project-tags">
									<span class="tag">Flask</span>
									<span class="tag">Python</span>
									<span class="tag">Flask</span>
								</div>
								<h3>Web para agendar citas</h3>
								<p>Plataforma para agendar citas medicas.</p>
								<a href="https://github.com/Sergio-Prada-963/EPS-citas" target="blank" class="project-link">
									<i class="fa-solid fa-arrow-right"></i> Ver proyecto
								</a>
							</div>
						</div>
						{/*  Card 2*/}
						<div class="project-card">
							<div class="project-thumb">🛍️</div>
							<div class="project-body">
								<div class="project-tags">
									<span class="tag">Python</span>
									<span class="tag">Turso DB</span>
									<span class="tag">Flask</span>
								</div>
								<h3>Web para teatros</h3>
								<p>Implementación y personalización de módulos Odoo para gestión empresarial, ventas e inventario.</p>
								<a href="https://github.com/Sergio-Prada-963/Cine-y-teatro-NOIR" target="blank" class="project-link">
									<i class="fa-solid fa-arrow-right"></i> Ver proyecto
								</a>
							</div>
						</div>
						{/*  Card 3*/}
						<div class="project-card">
							<div class="project-thumb">📱</div>
							<div class="project-body">
								<div class="project-tags">
									<span class="tag">Node.js</span>
									<span class="tag">Sql</span>
								</div>
								<h3>Web parqueadero</h3>
								<p>Aplicación web con backend en Express, base de datos SQL y autenticación JWT.</p>
								<a href="https://github.com/Sergio-Prada-963/parqueadero" target="blank" class="project-link">
									<i class="fa-solid fa-arrow-right"></i> Ver proyecto
								</a>
							</div>
						</div>
						{/*  Card 4*/}
						<div class="project-card">
							<div class="project-thumb">⚡</div>
							<div class="project-body">
								<div class="project-tags">
									<span class="tag">Node Js</span>
									<span class="tag">Turso Db</span>
								</div>
								<h3>Dashboard Analytics</h3>
								<p>Panel de análisis en tiempo real con visualizaciones dinámicas y arquitectura de componentes avanzada.</p>
								<a href="https://github.com/Sergio-Prada-963/constructora_malambo" target="blank" class="project-link">
									<i class="fa-solid fa-arrow-right"></i> Ver proyecto
								</a>
							</div>
						</div>
						{/*  Card 5*/}
						<div class="project-card">
							<div class="project-thumb">🔗</div>
							<div class="project-body">
								<div class="project-tags">
									<span class="tag">Node.js</span>
									<span class="tag">Express</span>
									<span class="tag">PostgreSQL</span>
								</div>
								<h3>REST API Escalable</h3>
								<p>API RESTful con Node js y React, caching y documentación Swagger.</p>
								<a href="https://github.com/Sergio-Prada-963/premionovel" target="blank" class="project-link">
									<i class="fa-solid fa-arrow-right"></i> Ver proyecto
								</a>
							</div>
						</div>
						{/*  Card 6*/}
						<div class="project-card">
							<div class="project-thumb">🎨</div>
							<div class="project-body">
								<div class="project-tags">
									<span class="tag">React</span>
									<span class="tag">Bootstrap</span>
									<span class="tag">JS</span>
								</div>
								<h3>Web animada.</h3>
								<p>Sitio web animado para tu ser querido.</p>
								<a href="https://github.com/Sergio-Prada-963/do_you_love_me_code" target="blank" class="project-link">
									<i class="fa-solid fa-arrow-right"></i> Ver proyecto
								</a>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/*  TECH SKILLS*/}
			<section id="habilidades">
				<div class="container">
					<span class="section-label reveal">// 04 — Tecnologías</span>
					<h2 class="section-title reveal">
						Mis <em>Herramientas</em>
					</h2>
					<div class="tech-grid reveal" id="techGrid"></div>
				</div>
			</section>

			{/*  SOFT SKILLS*/}
			<section id="softskills">
				<div class="container">
					<span class="section-label reveal">// 05 — Habilidades Blandas</span>
					<h2 class="section-title reveal">
						Más allá <em>del código</em>
					</h2>
					<div class="soft-grid reveal">
						<div class="soft-card">
							<div class="soft-icon">
								<i class="fa-solid fa-lightbulb"></i>
							</div>
							<h3>Resolución de Problemas</h3>
							<p>Capacidad analítica para descomponer problemas complejos y diseñar soluciones elegantes y eficientes.</p>
						</div>
						<div class="soft-card">
							<div class="soft-icon">
								<i class="fa-solid fa-users"></i>
							</div>
							<h3>Trabajo en Equipo</h3>
							<p>Me integro rápidamente en equipos multidisciplinarios, aportando valor desde el primer día con comunicación asertiva.</p>
						</div>
						<div class="soft-card">
							<div class="soft-icon">
								<i class="fa-solid fa-arrow-trend-up"></i>
							</div>
							<h3>Mejora Continua</h3>
							<p>Mentalidad growth-oriented: siempre aprendiendo nuevas tecnologías, patrones y mejores prácticas del sector.</p>
						</div>
						<div class="soft-card">
							<div class="soft-icon">
								<i class="fa-solid fa-comments"></i>
							</div>
							<h3>Comunicación Efectiva</h3>
							<p>Habilidad para traducir conceptos técnicos complejos a lenguaje accesible para clientes y stakeholders.</p>
						</div>
						<div class="soft-card">
							<div class="soft-icon">
								<i class="fa-solid fa-clock"></i>
							</div>
							<h3>Gestión del Tiempo</h3>
							<p>Priorización eficiente de tareas bajo presión, cumpliendo plazos con calidad sin sacrificar el detalle.</p>
						</div>
						<div class="soft-card">
							<div class="soft-icon">
								<i class="fa-solid fa-brain"></i>
							</div>
							<h3>Adaptabilidad</h3>
							<p>Flexibilidad para integrarme en diversos entornos tecnológicos y metodologías de trabajo ágil.</p>
						</div>
					</div>
				</div>
			</section>

			{/*  MINI GAME*/}
			<section id="juego">
				<div class="container">
					<span class="section-label reveal">// 06 — Zona Interactiva</span>
					<h2 class="section-title reveal">
						Catch the <em>Bug</em> 🐛
					</h2>
					<div class="game-wrap reveal">
						<div class="game-info">
							<div>
								Puntos: <span id="score">0</span>
							</div>
							<div>
								Tiempo: <span id="timer">30</span>s
							</div>
							<div>
								Mejor: <span id="best">0</span>
							</div>
						</div>
						<canvas id="gameCanvas" width="700" height="360"></canvas>
						<div class="game-controls">
							<button class="btn-game" id="btnStart" type="button">
								▶ Iniciar
							</button>
							<button class="btn-game" id="btnReset" type="button">
								↺ Reset
							</button>
						</div>
						<p class="game-hint">Haz clic en los bugs antes de que escapen · Cada bug vale 1 punto</p>
					</div>
				</div>
			</section>

			{/*  CONTACT*/}
			<section id="contacto">
				<div class="container">
					<span class="section-label reveal">// 07 — Contacto</span>
					<h2 class="section-title reveal">
						Trabajemos <em>juntos</em>
					</h2>
					<div class="contact-grid reveal">
						<div class="contact-info">
							<p>¿Tienes un proyecto en mente o quieres colaborar? Estoy disponible para nuevas oportunidades. ¡Hablemos!</p>
							<div class="contact-links">
								<a href="mailto:alejanprada140705@gmail.com" class="contact-link">
									<div class="contact-link-icon">
										<i class="fa-solid fa-envelope"></i>
									</div>
									<div class="contact-link-text">
										<strong>Email</strong>
										<span>alejanprada140705@gmail.com</span>
									</div>
								</a>
								<a href="https://www.linkedin.com/in/dev-sergio-prada" target="_blank" class="contact-link">
									<div class="contact-link-icon">
										<i class="fa-brands fa-linkedin"></i>
									</div>
									<div class="contact-link-text">
										<strong>LinkedIn</strong>
										<span>Sergio Rodriguez Prada</span>
									</div>
								</a>
								<a href="https://github.com/Sergio-Prada-963" target="_blank" class="contact-link">
									<div class="contact-link-icon">
										<i class="fa-brands fa-github"></i>
									</div>
									<div class="contact-link-text">
										<strong>GitHub</strong>
										<span>Sergio-Prada-963</span>
									</div>
								</a>
								<a href="https://canva.link/gvmz58ho64ly4k4" target="_blank" rel="noopener noreferrer" class="contact-link">
									<div class="contact-link-icon">
										<i class="fa-solid fa-file-lines"></i>
									</div>
									<div class="contact-link-text">
										<strong>Mi CV</strong>
										<span>Ver CV</span>
									</div>
								</a>
							</div>
						</div>
						<form id="contactForm" class="contact-form">
							<div class="form-group">
								<label>Nombre</label>
								<input name="name" type="text" placeholder="Tu nombre completo" required />
							</div>
							<div class="form-group">
								<label>Email</label>
								<input name="email" type="email" placeholder="tu@email.com" required />
							</div>
							<div class="form-group">
								<label>Mensaje</label>
								<textarea name="message" placeholder="Cuéntame sobre tu proyecto..." required></textarea>
							</div>
							<button type="submit" class="btn-send">
								<i class="fa-regular fa-paper-plane"></i> Enviar mensaje
							</button>
						</form>
					</div>
				</div>
			</section>

			{/*  FOOTER*/}
			<Interactive />
			<footer>
				<div class="footer-left">
					<div class="footer-logo">S</div>
					<span>
						<strong>Sergio Rodriguez</strong> · Full Stack Developer
					</span>
				</div>
				<div class="footer-copy">© 2025 · Hecho con ❤️ en Barranquilla</div>
				<div class="footer-socials">
					<a href="https://github.com/Sergio-Prada-963" target="_blank" class="footer-social">
						<i class="fa-brands fa-github"></i>
					</a>
					<a href="https://www.linkedin.com/in/dev-sergio-prada" target="_blank" class="footer-social">
						<i class="fa-brands fa-linkedin"></i>
					</a>
					<a href="mailto:alejanprada140705@gmail.com" class="footer-social">
						<i class="fa-solid fa-envelope"></i>
					</a>
				</div>
			</footer>
		</>
	);
}

export default App;
