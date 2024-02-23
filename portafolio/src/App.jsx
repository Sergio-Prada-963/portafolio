import React, { useEffect } from "react"
import "./index.scss"
import { Welcome } from "./components/welcome"
import { Navbar } from "./components/navbar"

function App() {
  useEffect(() => {
    window.requestAnimationFrame = (function () {
      return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
          window.setTimeout(callback, 1000 / 60)
        }
      )
    })()

    /**
     * Vector
     */
    function Vector(x, y) {
      this.x = x || 0
      this.y = y || 0
    }

    Vector.add = function (a, b) {
      return new Vector(a.x + b.x, a.y + b.y)
    }

    Vector.sub = function (a, b) {
      return new Vector(a.x - b.x, a.y - b.y)
    }

    Vector.scale = function (v, s) {
      return v.clone().scale(s)
    }

    Vector.random = function () {
      return new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1)
    }

    Vector.prototype = {
      set: function (x, y) {
        if (typeof x === "object") {
          y = x.y
          x = x.x
        }
        this.x = x || 0
        this.y = y || 0
        return this
      },

      add: function (v) {
        this.x += v.x
        this.y += v.y
        return this
      },

      sub: function (v) {
        this.x -= v.x
        this.y -= v.y
        return this
      },

      scale: function (s) {
        this.x *= s
        this.y *= s
        return this
      },

      length: function () {
        return Math.sqrt(this.x * this.x + this.y * this.y)
      },

      lengthSq: function () {
        return this.x * this.x + this.y * this.y
      },

      normalize: function () {
        var m = Math.sqrt(this.x * this.x + this.y * this.y)
        if (m) {
          this.x /= m
          this.y /= m
        }
        return this
      },

      angle: function () {
        return Math.atan2(this.y, this.x)
      },

      angleTo: function (v) {
        var dx = v.x - this.x,
          dy = v.y - this.y
        return Math.atan2(dy, dx)
      },

      distanceTo: function (v) {
        var dx = v.x - this.x,
          dy = v.y - this.y
        return Math.sqrt(dx * dx + dy * dy)
      },

      distanceToSq: function (v) {
        var dx = v.x - this.x,
          dy = v.y - this.y
        return dx * dx + dy * dy
      },

      lerp: function (v, t) {
        this.x += (v.x - this.x) * t
        this.y += (v.y - this.y) * t
        return this
      },

      clone: function () {
        return new Vector(this.x, this.y)
      },

      toString: function () {
        return "(x:" + this.x + ", y:" + this.y + ")"
      },
    }

    /**
     * GravityPoint
     */
    function GravityPoint(x, y, radius, targets) {
      Vector.call(this, x, y)
      this.radius = radius
      this.currentRadius = radius * 0.5

      this._targets = {
        particles: targets.particles || [],
        gravities: targets.gravities || [],
      }

      this._speed = new Vector()
    }

    GravityPoint.RADIUS_LIMIT = 65
    GravityPoint.interferenceToPoint = true

    GravityPoint.prototype = (function (o) {
      var s = new Vector(0, 0),
        p
      for (p in o) s[p] = o[p]
      return s
    })({
      gravity: 0.05,
      isMouseOver: false,
      dragging: false,
      destroyed: false,
      _easeRadius: 0,
      _dragDistance: null,
      _collapsing: false,

      hitTest: function (p) {
        return this.distanceTo(p) < this.radius
      },

      startDrag: function (dragStartPoint) {
        this._dragDistance = Vector.sub(dragStartPoint, this)
        this.dragging = true
      },

      drag: function (dragToPoint) {
        this.x = dragToPoint.x - this._dragDistance.x
        this.y = dragToPoint.y - this._dragDistance.y
      },

      endDrag: function () {
        this._dragDistance = null
        this.dragging = false
      },

      addSpeed: function (d) {
        this._speed = this._speed.add(d)
      },

      collapse: function (e) {
        this.currentRadius *= 1.75
        this._collapsing = true
      },

      render: function (ctx) {
        if (this.destroyed) return

        var particles = this._targets.particles,
          i,
          len

        for (i = 0, len = particles.length; i < len; i++) {
          particles[i].addSpeed(Vector.sub(this, particles[i]).normalize().scale(this.gravity))
        }

        this._easeRadius = (this._easeRadius + (this.radius - this.currentRadius) * 0.07) * 0.95
        this.currentRadius += this._easeRadius
        if (this.currentRadius < 0) this.currentRadius = 0

        if (this._collapsing) {
          this.radius *= 0.75
          if (this.currentRadius < 1) this.destroyed = true
          this._draw(ctx)
          return
        }

        var gravities = this._targets.gravities,
          g,
          absorp,
          area = this.radius * this.radius * Math.PI,
          garea

        for (i = 0, len = gravities.length; i < len; i++) {
          g = gravities[i]

          if (g === this || g.destroyed) continue

          if (
            (this.currentRadius >= g.radius || this.dragging) &&
            this.distanceTo(g) < (this.currentRadius + g.radius) * 0.85
          ) {
            g.destroyed = true
            this.gravity += g.gravity

            absorp = Vector.sub(g, this).scale((g.radius / this.radius) * 0.5)
            this.addSpeed(absorp)

            garea = g.radius * g.radius * Math.PI
            this.currentRadius = Math.sqrt((area + garea * 3) / Math.PI)
            this.radius = Math.sqrt((area + garea) / Math.PI)
          }

          g.addSpeed(Vector.sub(this, g).normalize().scale(this.gravity))
        }

        if (GravityPoint.interferenceToPoint && !this.dragging) this.add(this._speed)

        this._speed = new Vector()

        if (this.currentRadius > GravityPoint.RADIUS_LIMIT) this.collapse()

        this._draw(ctx)
      },

      _draw: function (ctx) {
        var grd, r

        ctx.save()

        grd = ctx.createRadialGradient(this.x, this.y, this.radius, this.x, this.y, this.radius * 5)
        grd.addColorStop(0, "rgba(0, 0, 0, 0.1)")
        grd.addColorStop(1, "rgba(0, 0, 0, 0)")
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius * 5, 0, Math.PI * 2, false)
        ctx.fillStyle = grd
        ctx.fill()

        r = Math.random() * this.currentRadius * 0.7 + this.currentRadius * 0.3
        grd = ctx.createRadialGradient(this.x, this.y, r, this.x, this.y, this.currentRadius)
        grd.addColorStop(0, "rgba(0, 0, 0, 1)")
        grd.addColorStop(1, Math.random() < 0.2 ? "rgba(255, 196, 0, 0.15)" : "rgba(103, 181, 191, 0.75)")
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2, false)
        ctx.fillStyle = grd
        ctx.fill()
        ctx.restore()
      },
    })

    /**
     * Particle
     */
    function Particle(x, y, radius) {
      Vector.call(this, x, y)
      this.radius = radius

      this._latest = new Vector()
      this._speed = new Vector()
    }

    Particle.prototype = (function (o) {
      var s = new Vector(0, 0),
        p
      for (p in o) s[p] = o[p]
      return s
    })({
      addSpeed: function (d) {
        this._speed.add(d)
      },

      update: function () {
        if (this._speed.length() > 12) this._speed.normalize().scale(12)

        this._latest.set(this)
        this.add(this._speed)
      },

      // render: function(ctx) {
      //     if (this._speed.length() > 12) this._speed.normalize().scale(12);

      //     this._latest.set(this);
      //     this.add(this._speed);

      //     ctx.save();
      //     ctx.fillStyle = ctx.strokeStyle = '#fff';
      //     ctx.lineCap = ctx.lineJoin = 'round';
      //     ctx.lineWidth = this.radius * 2;
      //     ctx.beginPath();
      //     ctx.moveTo(this.x, this.y);
      //     ctx.lineTo(this._latest.x, this._latest.y);
      //     ctx.stroke();
      //     ctx.beginPath();
      //     ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      //     ctx.fill();
      //     ctx.restore();
      // }
    })

    // Initialize

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)")
    const body = document.body

    // Configs

    let BACKGROUND_COLOR = prefersDark.matches ? "rgba(30, 41, 59)" : "rgb(214, 214, 214)"
    let PARTICLE_RADIUS = 1
    let G_POINT_RADIUS = 10
    let G_POINT_RADIUS_LIMITS = 65

    // Vars

    var canvas,
      context,
      bufferCvs,
      bufferCtx,
      screenWidth,
      screenHeight,
      mouse = new Vector(),
      gravities = [],
      particles = [],
      grad,
      gui,
      control

    //Calcular la medida del scroll vertical
    const div = document.createElement("div")
    div.style.width = "100px"
    div.style.height = "100px"
    div.style.overflow = "scroll"
    div.style.position = "absolute"
    div.style.top = "-9999px"
    div.style.left = "-9999px"
    document.body.appendChild(div)
    const scrollWidth = div.offsetWidth - div.clientWidth
    document.body.removeChild(div)

    // Event Listeners

    function resize(e) {
      screenWidth = canvas.width = window.innerWidth - scrollWidth
      screenHeight = canvas.height = window.innerHeight
      bufferCvs.width = screenWidth
      bufferCvs.height = screenHeight
      context = canvas.getContext("2d")
      bufferCtx = bufferCvs.getContext("2d")
      var cx = canvas.width * 0.5,
        cy = canvas.height * 0.5

      grad = context.createRadialGradient(cx, cy, 0, cx, cy, Math.sqrt(cx * cx + cy * cy))
      grad.addColorStop(0, "rgba(0, 0, 0, 0)")
      grad.addColorStop(1, "rgba(0, 0, 0, 0.35)")
    }

    function mouseMove(e) {
      mouse.set(e.clientX, e.clientY)

      var i,
        g,
        hit = false
      for (i = gravities.length - 1; i >= 0; i--) {
        g = gravities[i]
        if ((!hit && g.hitTest(mouse)) || g.dragging) g.isMouseOver = hit = true
        else g.isMouseOver = false
      }

      canvas.style.cursor = hit ? "pointer" : "default"
    }

    function mouseDown(e) {
      for (var i = gravities.length - 1; i >= 0; i--) {
        if (gravities[i].isMouseOver) {
          gravities[i].startDrag(mouse)
          return
        }
      }
      gravities.push(
        new GravityPoint(e.clientX, e.clientY, G_POINT_RADIUS, {
          particles: particles,
          gravities: gravities,
        })
      )
    }

    function mouseUp(e) {
      for (var i = 0, len = gravities.length; i < len; i++) {
        if (gravities[i].dragging) {
          gravities[i].endDrag()
          break
        }
      }
    }

    function doubleClick(e) {
      for (var i = gravities.length - 1; i >= 0; i--) {
        if (gravities[i].isMouseOver) {
          gravities[i].collapse()
          break
        }
      }
    }

    // Functions

    function addParticle(num) {
      var i, p
      for (i = 0; i < num; i++) {
        p = new Particle(
          Math.floor(Math.random() * screenWidth - PARTICLE_RADIUS * 2) + 1 + PARTICLE_RADIUS,
          Math.floor(Math.random() * screenHeight - PARTICLE_RADIUS * 2) + 1 + PARTICLE_RADIUS,
          PARTICLE_RADIUS
        )

        p.addSpeed(Vector.random())
        particles.push(p)
      }
    }

    // function removeParticle(num) {
    //   if (particles.length < num) num = particles.length;
    //   for (var i = 0; i < num; i++) {
    //     particles.pop();
    //   }
    // }

    // GUI Control

    control = {
      particleNum: 200,
    }

    // Init

    canvas = document.getElementById("c")
    bufferCvs = document.createElement("canvas")

    window.addEventListener("resize", resize, false)
    resize(null)

    addParticle(control.particleNum)

    canvas.addEventListener("mousemove", mouseMove, false)
    canvas.addEventListener("mousedown", mouseDown, false)
    canvas.addEventListener("mouseup", mouseUp, false)
    canvas.addEventListener("dblclick", doubleClick, false)

    // GUI

    // gui = new dat.GUI();
    // gui.add(control, 'particleNum', 0, 500).step(1).name('Particle Num').onChange(function () {
    //   var n = (control.particleNum | 0) - particles.length;
    //   if (n > 0)
    //   addParticle(n);else
    //   if (n < 0)
    //   removeParticle(-n);
    // });
    // gui.add(GravityPoint, 'interferenceToPoint').name('Interference Between Point');
    // gui.close();

    // Start Update

    function loop() {
      var i, len, g, p

      context.save()
      context.fillStyle = BACKGROUND_COLOR
      context.fillRect(0, 0, screenWidth, screenHeight)
      //context.fillStyle = grad;
      context.fillRect(0, 0, screenWidth, screenHeight)
      context.restore()

      for (i = 0, len = gravities.length; i < len; i++) {
        g = gravities[i]
        if (g.dragging) g.drag(mouse)
        g.render(context)
        if (g.destroyed) {
          gravities.splice(i, 1)
          len--
          i--
        }
      }

      bufferCtx.save()
      bufferCtx.globalCompositeOperation = "destination-out"
      bufferCtx.globalAlpha = 0.35
      bufferCtx.fillRect(0, 0, screenWidth, screenHeight)
      bufferCtx.restore()

      // パーティクルをバッファに描画
      // for (i = 0, len = particles.length; i < len; i++) {
      //     particles[i].render(bufferCtx);
      // }
      len = particles.length
      bufferCtx.save()
      bufferCtx.fillStyle = bufferCtx.strokeStyle = body.dataset.mode === "dark" ? "#fff" : "#333"
      bufferCtx.lineCap = bufferCtx.lineJoin = "round"
      bufferCtx.lineWidth = PARTICLE_RADIUS * 2
      bufferCtx.beginPath()
      for (i = 0; i < len; i++) {
        p = particles[i]
        p.update()
        bufferCtx.moveTo(p.x, p.y)
        bufferCtx.lineTo(p._latest.x, p._latest.y)
      }
      bufferCtx.stroke()
      bufferCtx.beginPath()
      for (i = 0; i < len; i++) {
        p = particles[i]
        bufferCtx.moveTo(p.x, p.y)
        bufferCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false)
      }
      bufferCtx.fill()
      bufferCtx.restore()

      // バッファをキャンバスに描画
      context.drawImage(bufferCvs, 0, 0)

      requestAnimationFrame(loop)
    }
    loop()

    //dark Mode
    const handleDarkModeChange = () => {
      body.dataset.mode = prefersDark.matches ? "dark" : "light"
      if (body.dataset.mode === "light") {
        body.classList.add("body-light")
        body.classList.remove("body-dark")
        BACKGROUND_COLOR = "rgb(214, 214, 214)"
      } else {
        body.classList.remove("body-light")
        body.classList.add("body-dark")
        BACKGROUND_COLOR = "rgba(30, 41, 59)"
      }
    }

    prefersDark.addEventListener("change", handleDarkModeChange)

    const toggleButton = document.querySelector("#switch")
    body.dataset.mode = prefersDark.matches ? "dark" : "light"
    body.classList.add(prefersDark.matches ? "body-dark" : "body-light")

    function toggleDarkMode() {
      if (body.dataset.mode === "light") {
        body.classList.add("body-dark")
        body.classList.remove("body-light")
        BACKGROUND_COLOR = "rgba(30, 41, 59)"
        body.dataset.mode = "dark"
      } else {
        body.classList.remove("body-dark")
        body.classList.add("body-light")
        BACKGROUND_COLOR = "rgb(214, 214, 214)"
        body.dataset.mode = "light"
      }
    }

    toggleButton.addEventListener("click", toggleDarkMode)

    return () => {
      toggleButton.removeEventListener("click", toggleDarkMode)
      prefersDark.removeEventListener("change", handleDarkModeChange)
    }
  }, [])

  return (
    <div>
      <Welcome />
      <Navbar />
      <div className=' dark:bg-rojo'>
        <h1 className="text-center">En mantenimiento</h1>
      </div>
      <div>
        el footer ?
        <ul className='example-2'>
          <li className='icon-content'>
            <a data-social='spotify' aria-label='Spotify' href='https://www.spotify.com/'>
              <div className='filled'></div>
              <svg viewBox='0 0 100 100' version='1.1'>
                <path
                  fill='currentColor'
                  d='M50,4C24.7,4,4,24.7,4,50s20.6,46,46,46s46-20.6,46-46S75.4,4,50,4z M71.6,71.5c0,0,0,0.1-0.1,0.1c-0.8,1.2-2,1.8-3.2,1.8  c-0.7,0-1.4-0.2-2-0.6c-10.2-6.3-23.3-7.7-38.8-4.1c-2.1,0.6-4-0.9-4.5-2.7c-0.6-2.3,0.9-4.1,2.7-4.6c17.7-4,32.6-2.3,44.4,5  c0.9,0.4,1.5,1,1.8,1.9C72.2,69.3,72.1,70.5,71.6,71.5z M76.9,59.3L76.9,59.3c-0.8,1.1-1.9,1.9-3.2,2.1c-0.2,0-0.5,0.1-0.7,0.1  c-0.8,0-1.6-0.3-2.3-0.7c-12-7.3-30.1-9.4-43.9-5c-2.5,0.6-5-0.7-5.6-3c-0.6-2.5,0.7-4.9,3-5.5c16.5-5,37.2-2.5,51.4,6.2  c0.8,0.4,1.5,1.3,1.8,2.5C77.9,57,77.6,58.3,76.9,59.3z M83.2,45.6c-1,1.4-2.7,2.1-4.4,2.1c-0.9,0-1.9-0.2-2.7-0.7c0,0,0,0,0,0  c-13.9-8.3-37.8-9.3-51.4-5.1c-2.7,0.8-5.5-0.7-6.4-3.3c-0.8-2.7,0.7-5.6,3.3-6.4c16.2-4.8,43-3.8,59.8,6.2  C83.8,39.6,84.7,42.9,83.2,45.6C83.3,45.5,83.3,45.5,83.2,45.6z'
                ></path>
              </svg>
            </a>
            <div className='tooltip'>Spotify</div>
          </li>
          <li className='icon-content'>
            <a data-social='pinterest' aria-label='Pinterest' href='https://www.pinterest.com/'>
              <div className='filled'></div>
              <svg viewBox='0 0 100 100' version='1.1'>
                <path
                  fill='currentColor'
                  d='M83,17.8C74.5,8.9,63.4,4.3,50,4.1C37.7,4.2,26.8,8.6,17.9,17.3C8.9,26,4.3,37,4.1,50c0,0,0,0,0,0c0,9.1,2.5,17.4,7.4,24.9  c4.9,7.4,11.6,13.2,20.1,17.1c0.3,0.1,0.7,0.1,1-0.1c0.3-0.2,0.5-0.5,0.5-0.8l0-4.9c0.1-2.1,0.7-5.3,1.7-9.5c1-4,1.7-6.7,1.9-7.6  c0.7-3,1.7-7.2,3-12.6c0.1-0.2,0-0.5-0.1-0.7c-0.4-0.8-1-2.6-1.5-6.6c0.1-2.7,0.8-5.2,2.1-7.3c1.2-2,3.1-3.1,5.7-3.5  c2,0.1,4.7,0.8,5.1,5.9c-0.1,1.8-0.8,4.5-1.9,8.1c-1.2,3.8-1.9,6.3-2.1,7.6c-0.7,2.5-0.2,4.8,1.5,6.8c1.6,1.9,3.8,2.9,6.5,3.1  c4.3-0.1,8.1-2.6,11.2-7.5c1.7-3,2.9-6.3,3.5-9.7c0.7-3.4,0.7-7.1,0-10.8c-0.7-3.8-2.2-7.1-4.5-9.8c0,0-0.1-0.1-0.1-0.1  c-4.3-3.7-9.5-5.3-15.6-5c-6,0.4-11.3,2.6-15.9,6.6c-2.9,3.2-4.8,7.1-5.7,11.6c-0.9,4.6,0,9.1,2.6,13.3c0.3,0.5,0.5,0.8,0.6,1  c0,0.3,0,1-0.5,2.8c-0.5,1.8-0.9,2.2-0.9,2.2c0,0-0.1,0-0.1,0.1c0,0-0.2,0-0.4-0.1c-2.2-1-3.9-2.4-5.2-4.2c-1.3-1.9-2.1-4-2.5-6.3  c-0.3-2.5-0.4-5-0.3-7.5c0.2-2.5,0.7-5.1,1.4-7.7c3-6.9,8.5-11.9,16.3-14.8c7.8-2.9,16-3.2,24.3-0.8c6.5,2.8,11,7.4,13.6,13.7  c2.5,6.4,2.8,13.4,0.8,20.8c-2.2,7.1-6.4,12.4-12.1,15.7c-5.6,2.8-10.8,3-15.7,0.7c-1.8-1.1-3.1-2.3-3.9-3.5c-0.2-0.3-0.6-0.5-1-0.5  c-0.4,0.1-0.7,0.3-0.8,0.7c-0.7,2.7-1.3,4.7-1.6,6.2c-1.4,5.4-2.6,9.2-3.4,11c-0.8,1.6-1.6,3.1-2.4,4.3c-0.2,0.3-0.2,0.6-0.1,0.9  s0.3,0.5,0.6,0.6c4.3,1.3,8.7,2,13,2c12.4-0.1,23.2-4.6,32.1-13.4C91.1,73.9,95.8,62.9,96,50C95.9,37.5,91.5,26.7,83,17.8z'
                ></path>
              </svg>
            </a>
            <div className='tooltip'>Pinterest</div>
          </li>
          <li className='icon-content'>
            <a data-social='dribbble' aria-label='Dribbble' href='https://dribbble.com/'>
              <div className='filled'></div>
              <svg viewBox='0 0 100 100' version='1.1'>
                <path
                  fill='currentColor'
                  d='M83.5,18.5C74.9,9.3,62.8,4,50.2,4c-6.1,0-12,1.1-17.6,3.4C15.2,14.5,4,31.3,4,50c0,13.9,6.2,26.9,17,35.7  C29.2,92.3,39.4,96,50,96c6.6,0,13.2-1.5,19.2-4.2c12.5-5.7,21.7-16.6,25.2-29.8C95.5,57.9,96,53.8,96,50  C96,38.3,91.6,27.1,83.5,18.5z M75,22.3c-0.7,0.9-1.4,1.8-2.1,2.6c-1.4,1.6-2.8,3-4.4,4.3c-0.3,0.3-0.6,0.6-1,0.8  c-1,0.9-2.1,1.7-3.2,2.5l-0.3,0.2c-1.1,0.7-2.2,1.5-3.5,2.2c-0.4,0.3-0.9,0.5-1.4,0.8c-0.8,0.5-1.7,0.9-2.7,1.4  c-0.6,0.3-1.2,0.5-1.8,0.8L54.3,38c-0.1,0-0.2,0.1-0.3,0.1c0,0,0,0,0,0c-1.3-2.6-2.4-4.9-3.5-7l-0.3-0.5c-1.1-2-2.2-4-3.3-6  l-0.7-1.3c-1.1-1.9-2.2-3.7-3.2-5.4l-0.7-1.1c-0.7-1.2-1.4-2.3-2.2-3.5c3.2-0.8,6.5-1.3,9.8-1.3c9.4,0,18.4,3.5,25.4,9.8  C75.3,21.9,75.2,22.1,75,22.3z M46.4,40.6c-1.4,0.4-2.9,0.8-4.4,1.1c-0.3,0-0.7,0.1-0.9,0.2c-6,1-12.5,1.4-19.4,1.1  c-0.3,0-0.6,0-0.9,0c-0.3,0-0.5,0-0.7,0c-2.5-0.2-4.9-0.4-7.2-0.7c2.3-11.2,9.6-20.9,19.8-26.1c2.1,3.3,4.2,6.7,6.3,10.3l0.4,0.7  c0.9,1.6,1.9,3.4,3.2,5.8l0.6,1.2C44.4,36.6,45.4,38.6,46.4,40.6z M24.4,51.1c2.2,0.1,4.2,0,6.2-0.1l0.7,0c0.4,0,0.9,0,1.3,0  c2.8-0.2,5.5-0.5,8.5-1c0.5-0.1,1-0.2,1.6-0.3l0.5-0.1c2.2-0.4,4.2-0.9,6.1-1.4c0.1,0,0.3-0.1,0.4-0.1l0.5,1.1  c1.2,2.8,2.3,5.5,3.3,8.1c0,0,0,0,0,0c-0.2,0.1-0.5,0.2-0.7,0.2c-2,0.6-4,1.4-5.9,2.2c-0.6,0.3-1.3,0.5-1.9,0.8  c-1.4,0.6-2.7,1.3-4.1,2.1l-0.3,0.2c-0.2,0.1-0.5,0.2-0.6,0.4c-1.5,0.9-3.1,1.9-4.7,3c-0.2,0.1-0.4,0.3-0.6,0.4  c-0.2,0.1-0.4,0.3-0.6,0.5c-1,0.7-2,1.5-3,2.3c-0.4,0.3-0.7,0.6-1.1,0.9l-0.3,0.3c-0.7,0.6-1.5,1.3-2.2,1.9l-0.2,0.2  c-0.4,0.4-0.7,0.7-1.1,1.1l-0.2,0.2c-0.6,0.6-1.3,1.3-2,2l-0.4,0.4c-0.2,0.2-0.4,0.4-0.5,0.6C16.1,69.9,12,60.2,12,50.3  c0,0,0.1,0,0.1,0c0.4,0,0.7,0,1.1,0.1c3.5,0.4,6.9,0.6,10.3,0.7C23.8,51,24.1,51.1,24.4,51.1z M29.5,81.9c0.2-0.2,0.3-0.4,0.5-0.5  c1-1.1,2-2.1,3-3c1.9-1.8,3.8-3.3,5.7-4.8c0.2-0.1,0.4-0.3,0.6-0.4c0.2-0.2,0.5-0.4,0.8-0.6c1.1-0.8,2.2-1.5,3.4-2.2  c0.1-0.1,0.2-0.1,0.3-0.2c0.1-0.1,0.2-0.1,0.3-0.2c1.4-0.8,2.9-1.6,4.5-2.3c0.3-0.1,0.6-0.2,0.8-0.4l0.6-0.3  c1.1-0.5,2.2-0.9,3.5-1.4c0.5-0.2,1.1-0.4,1.7-0.6l0.2-0.1c0.4-0.1,0.7-0.2,1.1-0.3c0,0,0,0,0,0c1.1,3.2,2.3,6.4,3.3,9.8l0.1,0.4  c1.1,3.6,2,7.3,2.9,10.8C51.7,89.8,39.3,88.3,29.5,81.9C29.4,81.9,29.4,81.9,29.5,81.9z M65.6,62.9c0.7-0.1,1.3-0.2,2-0.2  c2-0.2,4-0.2,5.9-0.2c0.2,0,0.4,0,0.6,0l0.2,0c2.2,0.1,4.6,0.3,6.9,0.6c0.4,0.1,0.9,0.1,1.3,0.2l0.6,0.1c0.7,0.1,1.5,0.3,2.2,0.4  c-3,7.6-8.3,14-15.2,18.3c-0.8-3.1-1.7-6.2-2.6-9.2l-0.1-0.4c-0.9-3-1.9-6.1-3.1-9.5C64.8,63.1,65.2,63,65.6,62.9z M81.6,55.2  C80,55,78.4,54.9,77,54.8l-0.9-0.1c-0.9-0.1-1.9-0.1-2.8-0.2c-0.2,0-0.3,0-0.5,0c-0.2,0-0.4,0-0.6,0c-2,0-3.9,0.1-5.9,0.3  c-0.2,0-0.3,0-0.5,0.1c-0.1,0-0.2,0-0.3,0c-1.3,0.1-2.6,0.3-3.9,0.5c-0.1-0.1-0.1-0.3-0.2-0.4c-0.1-0.2-0.2-0.5-0.3-0.7  c-1.1-2.9-2.3-5.7-3.2-7.8l-0.3-0.6c-0.1-0.1-0.1-0.3-0.2-0.4c0,0,0,0,0.1,0c0.2-0.1,0.5-0.2,0.7-0.3c0.6-0.2,1.2-0.5,1.8-0.8  c1.2-0.5,2.4-1.2,3.6-1.8c0.1-0.1,0.3-0.2,0.5-0.2c0.2-0.1,0.5-0.2,0.7-0.4c1.5-0.9,2.9-1.8,4.2-2.7l0.3-0.2  c0.2-0.1,0.4-0.3,0.6-0.4c0.9-0.6,1.9-1.4,2.8-2.2c1.5-1.2,2.9-2.5,4.3-4c0.8-0.8,1.5-1.6,2.2-2.4l0.4-0.5c0.5-0.5,0.9-1.1,1.3-1.6  C85.5,34.3,88,42.1,88,50c0,2-0.2,4.1-0.5,6.1c-0.3,0-0.6-0.1-0.8-0.1c-0.4-0.1-0.7-0.1-1.1-0.2l-1.1-0.2  C83.5,55.5,82.5,55.3,81.6,55.2z'
                ></path>
              </svg>
            </a>
            <div className='tooltip'>Dribbble</div>
          </li>
          <li className='icon-content'>
            <a data-social='telegram' aria-label='Telegram' href='https://telegram.org/'>
              <div className='filled'></div>
              <svg viewBox='0 0 100 100' version='1.1'>
                <path
                  fill='currentColor'
                  d='M95,9.9c-1.3-1.1-3.4-1.2-7-0.1c0,0,0,0,0,0c-2.5,0.8-24.7,9.2-44.3,17.3c-17.6,7.3-31.9,13.7-33.6,14.5  c-1.9,0.6-6,2.4-6.2,5.2c-0.1,1.8,1.4,3.4,4.3,4.7c3.1,1.6,16.8,6.2,19.7,7.1c1,3.4,6.9,23.3,7.2,24.5c0.4,1.8,1.6,2.8,2.2,3.2  c0.1,0.1,0.3,0.3,0.5,0.4c0.3,0.2,0.7,0.3,1.2,0.3c0.7,0,1.5-0.3,2.2-0.8c3.7-3,10.1-9.7,11.9-11.6c7.9,6.2,16.5,13.1,17.3,13.9  c0,0,0.1,0.1,0.1,0.1c1.9,1.6,3.9,2.5,5.7,2.5c0.6,0,1.2-0.1,1.8-0.3c2.1-0.7,3.6-2.7,4.1-5.4c0-0.1,0.1-0.5,0.3-1.2  c3.4-14.8,6.1-27.8,8.3-38.7c2.1-10.7,3.8-21.2,4.8-26.8c0.2-1.4,0.4-2.5,0.5-3.2C96.3,13.5,96.5,11.2,95,9.9z M30,58.3l47.7-31.6  c0.1-0.1,0.3-0.2,0.4-0.3c0,0,0,0,0,0c0.1,0,0.1-0.1,0.2-0.1c0.1,0,0.1,0,0.2-0.1c-0.1,0.1-0.2,0.4-0.4,0.6L66,38.1  c-8.4,7.7-19.4,17.8-26.7,24.4c0,0,0,0,0,0.1c0,0-0.1,0.1-0.1,0.1c0,0,0,0.1-0.1,0.1c0,0.1,0,0.1-0.1,0.2c0,0,0,0.1,0,0.1  c0,0,0,0,0,0.1c-0.5,5.6-1.4,15.2-1.8,19.5c0,0,0,0,0-0.1C36.8,81.4,31.2,62.3,30,58.3z'
                ></path>
              </svg>
            </a>
            <div className='tooltip'>Telegram</div>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default App
