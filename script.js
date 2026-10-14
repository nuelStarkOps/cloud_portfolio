/* ============ PERFORMANCE GUARDS ============ */
const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = matchMedia('(max-width: 768px)').matches;
const DPR = Math.min(window.devicePixelRatio || 1, 1.6); // cap pixel ratio

/* ============ PRELOADER ============ */
(function () {
  let p = 0;
  const pct = document.getElementById('pct'), fill = document.getElementById('barFill');
  const iv = setInterval(() => {
    p = Math.min(100, p + Math.random() * 22);
    pct.textContent = Math.floor(p) + '%';
    fill.style.width = p + '%';
    if (p >= 100) { clearInterval(iv); setTimeout(() => document.getElementById('preloader').classList.add('done'), 250); }
  }, 140);
})();

/* ============ CUSTOM CURSOR ============ */
(function () {
  if (matchMedia('(hover:none)').matches) return;
  const c = document.getElementById('cursor');
  let x = 0, y = 0, tx = 0, ty = 0;
  addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
  (function loop() { x += (tx - x) * .22; y += (ty - y) * .22; c.style.left = x + 'px'; c.style.top = y + 'px'; requestAnimationFrame(loop); })();
  document.querySelectorAll('a,.btn,.card,.chip,.stat-click').forEach(el => {
    el.addEventListener('mouseenter', () => c.classList.add('big'));
    el.addEventListener('mouseleave', () => c.classList.remove('big'));
  });
})();

/* ============ TYPING EFFECT ============ */
(function () {
  const roles = ['Designing scalable, resilient cloud infrastructure on AWS.', 'Automating deployment with IaC, Kubernetes, and CI/CD pipelines.', 'Turning complex systems into simple reliable architectures.', 'Your Next Great Hire'];
  const el = document.getElementById('typed');
  let r = 0, i = 0, del = false;
  (function tick() {
    const word = roles[r];
    el.textContent = word.slice(0, i);
    let t = del ? 45 : 90;
    if (!del && i === word.length) { t = 1700; del = true; }
    else if (del && i === 0) { del = false; r = (r + 1) % roles.length; t = 250; }
    i += del ? -1 : 1;
    setTimeout(tick, t);
  })();
})();

/* ============ THREE.JS SCENE ============ */
(function () {
  const canvas = document.getElementById('webgl');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(DPR);
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x030604, 0.028);
  const cam = new THREE.PerspectiveCamera(60, 1, .1, 200);
  cam.position.set(0, 0, 22);

  // Particle starfield — count adapts to device
  const COUNT = isMobile ? 900 : 2200;
  const pos = new Float32Array(COUNT * 3), cols = new Float32Array(COUNT * 3);
  const palette = [new THREE.Color(0x00e676), new THREE.Color(0x00bfa5), new THREE.Color(0xa3e635), new THREE.Color(0xffffff)];
  for (let i = 0; i < COUNT; i++) {
    pos[i * 3] = (Math.random() - .5) * 110;
    pos[i * 3 + 1] = (Math.random() - .5) * 70;
    pos[i * 3 + 2] = (Math.random() - .5) * 90;
    const c = palette[Math.random() * 4 | 0];
    cols[i * 3] = c.r; cols[i * 3 + 1] = c.g; cols[i * 3 + 2] = c.b;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
  const pts = new THREE.Points(geo, new THREE.PointsMaterial({ size: .14, vertexColors: true, transparent: true, opacity: .85, depthWrite: false }));
  scene.add(pts);

  // Hero wireframe torus knot
  const knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(6.2, 1.7, isMobile ? 90 : 160, 18),
    new THREE.MeshBasicMaterial({ color: 0x00e676, wireframe: true, transparent: true, opacity: .16 })
  );
  knot.position.set(isMobile ? 0 : 11, 0, -4);
  scene.add(knot);
  const knot2 = new THREE.Mesh(
    new THREE.IcosahedronGeometry(3, 1),
    new THREE.MeshBasicMaterial({ color: 0xa3e635, wireframe: true, transparent: true, opacity: .12 })
  );
  knot2.position.set(isMobile ? 0 : -14, -6, -8);
  scene.add(knot2);

  // Mouse parallax
  let mx = 0, my = 0;
  addEventListener('mousemove', e => { mx = (e.clientX / innerWidth - .5) * 2; my = (e.clientY / innerHeight - .5) * 2; }, { passive: true });

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (canvas.width !== w * DPR || canvas.height !== h * DPR) {
      renderer.setSize(w, h, false);
      cam.aspect = w / h; cam.updateProjectionMatrix();
    }
  }

  let visible = true;
  new IntersectionObserver(e => visible = e[0].isIntersecting, { threshold: 0 }).observe(canvas);
  document.addEventListener('visibilitychange', () => { if (document.hidden) visible = false; else resize(); });

  const clock = new THREE.Clock();
  (function animate() {
    requestAnimationFrame(animate);
    if (!visible || document.hidden) return;
    resize();
    const t = clock.getElapsedTime();
    if (!prefersReduced) {
      pts.rotation.y = t * .02;
      knot.rotation.x = t * .15; knot.rotation.y = t * .22;
      knot2.rotation.x = -t * .1; knot2.rotation.z = t * .14;
      cam.position.x += (mx * 2.4 - cam.position.x) * .04;
      cam.position.y += (-my * 1.6 - cam.position.y) * .04;
      cam.lookAt(0, 0, 0);
    }
    renderer.render(scene, cam);
  })();
})();

/* ============ SCROLL REVEALS + COUNTERS + SKILL BARS ============ */
(function () {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      el.classList.add('in');
      // counters
      el.querySelectorAll('[data-count]').forEach(b => {
        const end = +b.dataset.count, t0 = performance.now();
        (function step(now) {
          const k = Math.min(1, (now - t0) / 1200);
          b.textContent = Math.floor(end * (1 - Math.pow(1 - k, 3)));
          if (k < 1) requestAnimationFrame(step); else b.textContent = end + '+';
        })(t0);
      });
      // skill bars
      el.querySelectorAll('.fill').forEach(f => f.style.width = f.dataset.w + '%');
      el.querySelectorAll('[data-w]').forEach(l => {
        if (l.classList.contains('fill')) return;
        const end = +l.dataset.w, t0 = performance.now();
        (function step(now) {
          const k = Math.min(1, (now - t0) / 1100);
          l.textContent = Math.floor(end * (1 - Math.pow(1 - k, 3))) + '%';
          if (k < 1) requestAnimationFrame(step);
        })(t0);
      });
      io.unobserve(el);
    });
  }, { threshold: .2 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

/* ============ 3D TILT CARDS + SPOTLIGHT ============ */
(function () {
  if (matchMedia('(hover:none)').matches || prefersReduced) return;
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', px * 100 + '%');
      card.style.setProperty('--my', py * 100 + '%');
      card.style.transform = `rotateY(${(px - .5) * 10}deg) rotateX(${(.5 - py) * 10}deg) translateZ(6px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();

/* ============ MAGNETIC BUTTONS ============ */
(function () {
  if (matchMedia('(hover:none)').matches) return;
  document.querySelectorAll('.btn').forEach(b => {
    b.addEventListener('mousemove', e => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px, ${(e.clientY - r.top - r.height / 2) * .35}px)`;
    });
    b.addEventListener('mouseleave', () => { b.style.transform = ''; });
  });
})();

/* ============ ARCHITECTURE DIAGRAMS + MODAL ============ */
const ARCH_DIAGRAMS = {
  "sockshop-eks": {
    title: "// SOCK SHOP ON EKS — ARCHITECTURE",
    svg: `<svg viewBox="0 0 900 400" xmlns="http://www.w3.org/2000/svg" role="img"><defs><marker id="a1" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="none" stroke="#00e676" stroke-width="1.4"/></marker><marker id="a1p" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="none" stroke="#a3e635" stroke-width="1.4"/></marker></defs><rect class="zone" x="450" y="70" width="410" height="300" rx="14"/><text class="sm" x="470" y="92">EKS CLUSTER (sock-shop)</text><rect x="480" y="108" width="112" height="34" rx="7" fill="rgba(0,240,255,.04)" stroke="rgba(0,240,255,.45)" stroke-width="1"/><text class="sm" x="536" y="129" text-anchor="middle" fill="#c9c9dd">front-end</text><rect x="604" y="108" width="112" height="34" rx="7" fill="rgba(0,240,255,.04)" stroke="rgba(0,240,255,.45)" stroke-width="1"/><text class="sm" x="660" y="129" text-anchor="middle" fill="#c9c9dd">carts</text><rect x="728" y="108" width="112" height="34" rx="7" fill="rgba(0,240,255,.04)" stroke="rgba(0,240,255,.45)" stroke-width="1"/><text class="sm" x="784" y="129" text-anchor="middle" fill="#c9c9dd">carts-db</text><rect x="480" y="154" width="112" height="34" rx="7" fill="rgba(0,240,255,.04)" stroke="rgba(0,240,255,.45)" stroke-width="1"/><text class="sm" x="536" y="175" text-anchor="middle" fill="#c9c9dd">catalogue</text><rect x="604" y="154" width="112" height="34" rx="7" fill="rgba(0,240,255,.04)" stroke="rgba(0,240,255,.45)" stroke-width="1"/><text class="sm" x="660" y="175" text-anchor="middle" fill="#c9c9dd">catalogue-db</text><rect x="728" y="154" width="112" height="34" rx="7" fill="rgba(0,240,255,.04)" stroke="rgba(0,240,255,.45)" stroke-width="1"/><text class="sm" x="784" y="175" text-anchor="middle" fill="#c9c9dd">orders</text><rect x="480" y="200" width="112" height="34" rx="7" fill="rgba(0,240,255,.04)" stroke="rgba(0,240,255,.45)" stroke-width="1"/><text class="sm" x="536" y="221" text-anchor="middle" fill="#c9c9dd">orders-db</text><rect x="604" y="200" width="112" height="34" rx="7" fill="rgba(0,240,255,.04)" stroke="rgba(0,240,255,.45)" stroke-width="1"/><text class="sm" x="660" y="221" text-anchor="middle" fill="#c9c9dd">payment</text><rect x="728" y="200" width="112" height="34" rx="7" fill="rgba(0,240,255,.04)" stroke="rgba(0,240,255,.45)" stroke-width="1"/><text class="sm" x="784" y="221" text-anchor="middle" fill="#c9c9dd">shipping</text><rect x="480" y="246" width="112" height="34" rx="7" fill="rgba(0,240,255,.04)" stroke="rgba(0,240,255,.45)" stroke-width="1"/><text class="sm" x="536" y="267" text-anchor="middle" fill="#c9c9dd">user</text><rect x="604" y="246" width="112" height="34" rx="7" fill="rgba(0,240,255,.04)" stroke="rgba(0,240,255,.45)" stroke-width="1"/><text class="sm" x="660" y="267" text-anchor="middle" fill="#c9c9dd">user-db</text><rect x="728" y="246" width="112" height="34" rx="7" fill="rgba(0,240,255,.04)" stroke="rgba(0,240,255,.45)" stroke-width="1"/><text class="sm" x="784" y="267" text-anchor="middle" fill="#c9c9dd">rabbitmq</text><rect x="480" y="292" width="112" height="34" rx="7" fill="rgba(0,240,255,.04)" stroke="rgba(0,240,255,.45)" stroke-width="1"/><text class="sm" x="536" y="313" text-anchor="middle" fill="#c9c9dd">queue-master</text><rect class="bx2" x="40" y="50" width="170" height="64" rx="9"/><text class="tx" x="125.0" y="79.0" text-anchor="middle" font-weight="bold">GitHub Actions</text><text class="sm" x="125.0" y="94.0" text-anchor="middle">terraform.yml · k8s.yml</text><rect class="bx" x="40" y="170" width="170" height="64" rx="9"/><text class="tx" x="125.0" y="199.0" text-anchor="middle" font-weight="bold">Route53 DNS</text><text class="sm" x="125.0" y="214.0" text-anchor="middle">Hosted Zone</text><rect class="bx" x="40" y="290" width="170" height="64" rx="9"/><text class="tx" x="125.0" y="319.0" text-anchor="middle" font-weight="bold">NGINX Ingress</text><text class="sm" x="125.0" y="334.0" text-anchor="middle">AWS Load Balancer</text><rect class="bx3" x="260" y="50" width="160" height="96" rx="9"/><text class="tx" x="340.0" y="79.0" text-anchor="middle" font-weight="bold">Observability</text><text class="sm" x="340.0" y="94.0" text-anchor="middle">Prometheus</text><text class="sm" x="340.0" y="109.0" text-anchor="middle">Grafana</text><text class="sm" x="340.0" y="124.0" text-anchor="middle">Alertmanager</text><rect class="bx3" x="260" y="290" width="160" height="64" rx="9"/><text class="tx" x="340.0" y="319.0" text-anchor="middle" font-weight="bold">Terraform</text><text class="sm" x="340.0" y="334.0" text-anchor="middle">S3 Remote State</text><path class="ln2" d="M210 82 C330 82 330 110 450 130" marker-end="url(#a1p)"/><path class="ln" d="M210 202 L330 322" marker-end="url(#a1)"/><path class="ln" d="M210 200 L450 160" marker-end="url(#a1)"/><path class="ln" d="M210 322 L450 250" marker-end="url(#a1)"/><path class="ln" d="M420 98 C440 110 445 115 455 122" marker-end="url(#a1)"/><path class="ln dsh" d="M420 322 L450 330" marker-end="url(#a1)"/></svg>`
  },
  "microservices-demo": {
    title: "// MICROSERVICES DEMO — FAULT ISOLATION",
    svg: `<svg viewBox="0 0 900 400" xmlns="http://www.w3.org/2000/svg" role="img"><defs><marker id="a2" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="none" stroke="#00e676" stroke-width="1.4"/></marker><marker id="a2p" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="none" stroke="#a3e635" stroke-width="1.4"/></marker></defs><rect class="bx" x="40" y="170" width="150" height="70" rx="9"/><text class="tx" x="115.0" y="202.0" text-anchor="middle" font-weight="bold">User</text><text class="sm" x="115.0" y="217.0" text-anchor="middle">Browser</text><rect class="zone" x="250" y="60" width="590" height="300" rx="14"/><text class="sm" x="270" y="84">DOCKER COMPOSE — shared Docker network</text><rect class="bx" x="290" y="170" width="170" height="80" rx="9"/><text class="tx" x="375.0" y="207.0" text-anchor="middle" font-weight="bold">Frontend</text><text class="sm" x="375.0" y="222.0" text-anchor="middle">React :3000</text><rect class="bx2" x="560" y="110" width="180" height="80" rx="9"/><text class="tx" x="650.0" y="147.0" text-anchor="middle" font-weight="bold">Auth Service</text><text class="sm" x="650.0" y="162.0" text-anchor="middle">Node.js / Express :4000</text><rect class="bx2" x="560" y="250" width="180" height="80" rx="9"/><text class="tx" x="650.0" y="287.0" text-anchor="middle" font-weight="bold">Backend Service</text><text class="sm" x="650.0" y="302.0" text-anchor="middle">FastAPI :8000</text><path class="ln" d="M190 205 L290 205" marker-end="url(#a2)"/><path class="ln" d="M460 195 L560 145" marker-end="url(#a2)"/><path class="ln" d="M460 225 L560 285" marker-end="url(#a2)"/><text class="sm" x="560" y="370">Fault isolation: stopping one container leaves the others running ✓</text></svg>`
  },
  "bastion-auth": {
    title: "// BASTION-HOSTED AUTH — SYSTEM DESIGN",
    svg: `<svg viewBox="0 0 900 400" xmlns="http://www.w3.org/2000/svg" role="img"><defs><marker id="a3" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="none" stroke="#00e676" stroke-width="1.4"/></marker><marker id="a3p" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="none" stroke="#a3e635" stroke-width="1.4"/></marker></defs><rect class="bx" x="30" y="60" width="140" height="64" rx="9"/><text class="tx" x="100.0" y="89.0" text-anchor="middle" font-weight="bold">Users</text><text class="sm" x="100.0" y="104.0" text-anchor="middle">Login / Signup</text><rect class="bx" x="220" y="50" width="150" height="78" rx="9"/><text class="tx" x="295.0" y="86.0" text-anchor="middle" font-weight="bold">CloudFront</text><text class="sm" x="295.0" y="101.0" text-anchor="middle">Global CDN</text><rect class="bx3" x="220" y="150" width="150" height="56" rx="9"/><text class="tx" x="295.0" y="175.0" text-anchor="middle" font-weight="bold">S3</text><text class="sm" x="295.0" y="190.0" text-anchor="middle">Static Site</text><rect class="bx" x="430" y="60" width="140" height="64" rx="9"/><text class="tx" x="500.0" y="89.0" text-anchor="middle" font-weight="bold">API Gateway</text><text class="sm" x="500.0" y="104.0" text-anchor="middle">HTTP API + CORS</text><rect class="bx2" x="430" y="230" width="150" height="90" rx="9"/><text class="tx" x="505.0" y="264.0" text-anchor="middle" font-weight="bold">Lambda (VPC)</text><text class="sm" x="505.0" y="279.0" text-anchor="middle">login · signup</text><text class="sm" x="505.0" y="294.0" text-anchor="middle">bcrypt + JWT</text><rect class="zone" x="640" y="40" width="240" height="330" rx="14"/><text class="sm" x="658" y="62">VPC — us-east-1</text><rect class="zone" x="655" y="80" width="210" height="110" rx="10"/><text class="sm" x="668" y="100">Public Subnet</text><rect class="bx" x="672" y="112" width="176" height="58" rx="9"/><text class="tx" x="760.0" y="138.0" text-anchor="middle" font-weight="bold">Bastion EC2</text><text class="sm" x="760.0" y="153.0" text-anchor="middle">SSH jump host</text><rect class="zone" x="655" y="205" width="210" height="150" rx="10"/><text class="sm" x="668" y="225">Private Subnet</text><rect class="bx2" x="672" y="240" width="176" height="58" rx="9"/><text class="tx" x="760.0" y="266.0" text-anchor="middle" font-weight="bold">DB EC2</text><text class="sm" x="760.0" y="281.0" text-anchor="middle">MariaDB :3306</text><text class="sm" x="672" y="322">auth_db · users table</text><path class="ln" d="M170 92 L220 89" marker-end="url(#a3)"/><path class="ln" d="M295 128 L295 150" marker-end="url(#a3)"/><path class="ln" d="M370 89 L430 89" marker-end="url(#a3)"/><path class="ln" d="M500 124 L505 230" marker-end="url(#a3)"/><path class="ln" d="M580 275 L672 269" marker-end="url(#a3)"/><path class="ln2" d="M100 124 C100 330 400 340 672 141" marker-end="url(#a3p)"/><text class="sm" x="30" y="360">SSH tunnel (port 22) — DB reachable only through the bastion host</text></svg>`
  },
  "java-cicd": {
    title: "// JAVA CI/CD — DEPLOYMENT PIPELINE",
    svg: `<svg viewBox="0 0 900 380" xmlns="http://www.w3.org/2000/svg" role="img"><defs><marker id="a4" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="none" stroke="#00e676" stroke-width="1.4"/></marker><marker id="a4p" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="none" stroke="#a3e635" stroke-width="1.4"/></marker></defs><rect class="bx" x="25" y="150" width="125" height="76" rx="9"/><text class="tx" x="87.5" y="185.0" text-anchor="middle" font-weight="bold">GitHub</text><text class="sm" x="87.5" y="200.0" text-anchor="middle">master push</text><rect class="bx2" x="185" y="150" width="125" height="76" rx="9"/><text class="tx" x="247.5" y="185.0" text-anchor="middle" font-weight="bold">CodePipeline</text><text class="sm" x="247.5" y="200.0" text-anchor="middle">orchestrates</text><rect class="bx" x="345" y="150" width="125" height="76" rx="9"/><text class="tx" x="407.5" y="185.0" text-anchor="middle" font-weight="bold">CodeBuild</text><text class="sm" x="407.5" y="200.0" text-anchor="middle">mvn package</text><rect class="bx3" x="505" y="150" width="110" height="76" rx="9"/><text class="tx" x="560.0" y="185.0" text-anchor="middle" font-weight="bold">S3</text><text class="sm" x="560.0" y="200.0" text-anchor="middle">.zip artifact</text><rect class="bx2" x="650" y="150" width="125" height="76" rx="9"/><text class="tx" x="712.5" y="185.0" text-anchor="middle" font-weight="bold">CodeDeploy</text><text class="sm" x="712.5" y="200.0" text-anchor="middle">to EC2</text><rect class="bx" x="810" y="150" width="80" height="76" rx="9"/><text class="tx" x="850.0" y="185.0" text-anchor="middle" font-weight="bold">EC2</text><text class="sm" x="850.0" y="200.0" text-anchor="middle">Tomcat</text><path class="ln" d="M150 188 L185 188" marker-end="url(#a4)"/><path class="ln" d="M310 188 L345 188" marker-end="url(#a4)"/><path class="ln" d="M470 188 L505 188" marker-end="url(#a4)"/><path class="ln" d="M615 188 L650 188" marker-end="url(#a4)"/><path class="ln" d="M775 188 L810 188" marker-end="url(#a4)"/><rect class="bx3" x="345" y="270" width="150" height="64" rx="9"/><text class="tx" x="420.0" y="299.0" text-anchor="middle" font-weight="bold">CodeArtifact</text><text class="sm" x="420.0" y="314.0" text-anchor="middle">Maven deps</text><rect class="bx3" x="525" y="270" width="150" height="64" rx="9"/><text class="tx" x="600.0" y="299.0" text-anchor="middle" font-weight="bold">CloudFormation</text><text class="sm" x="600.0" y="314.0" text-anchor="middle">VPC + EC2 infra</text><rect class="bx3" x="705" y="270" width="150" height="64" rx="9"/><text class="tx" x="780.0" y="299.0" text-anchor="middle" font-weight="bold">CloudWatch</text><text class="sm" x="780.0" y="314.0" text-anchor="middle">logs · metrics</text><path class="ln" d="M410 270 L410 226" marker-end="url(#a4)"/><text class="sm" x="25" y="70">Build spec: mvn clean → install → package · Deploy spec: appspec.yml + scripts/</text><text class="sm" x="25" y="92">Failure? CodeDeploy auto-rolls back to last known-good revision ✓</text></svg>`
  },
  "laravel-lamp": {
    title: "// LARAVEL ON LAMP — ANSIBLE AUTOMATION",
    svg: `<svg viewBox="0 0 900 390" xmlns="http://www.w3.org/2000/svg" role="img"><defs><marker id="a5" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="none" stroke="#00e676" stroke-width="1.4"/></marker><marker id="a5p" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="none" stroke="#a3e635" stroke-width="1.4"/></marker></defs><rect class="bx" x="40" y="160" width="160" height="80" rx="9"/><text class="tx" x="120.0" y="189.0" text-anchor="middle" font-weight="bold">Control Node</text><text class="sm" x="120.0" y="204.0" text-anchor="middle">runs playbook</text><text class="sm" x="120.0" y="219.0" text-anchor="middle">(your machine)</text><rect class="bx2" x="270" y="160" width="170" height="80" rx="9"/><text class="tx" x="355.0" y="189.0" text-anchor="middle" font-weight="bold">Ansible</text><text class="sm" x="355.0" y="204.0" text-anchor="middle">execute_script.yml</text><text class="sm" x="355.0" y="219.0" text-anchor="middle">-i nodes</text><rect class="zone" x="500" y="50" width="360" height="310" rx="14"/><text class="sm" x="520" y="74">Slave Node — Ubuntu (Vagrant)</text><rect class="bx" x="525" y="95" width="150" height="70" rx="9"/><text class="tx" x="600.0" y="119.0" text-anchor="middle" font-weight="bold">Apache</text><text class="sm" x="600.0" y="134.0" text-anchor="middle">serves Laravel</text><text class="sm" x="600.0" y="149.0" text-anchor="middle">public/</text><rect class="bx" x="695" y="95" width="150" height="70" rx="9"/><text class="tx" x="770.0" y="127.0" text-anchor="middle" font-weight="bold">PHP</text><text class="sm" x="770.0" y="142.0" text-anchor="middle">Laravel runtime</text><rect class="bx2" x="525" y="185" width="150" height="70" rx="9"/><text class="tx" x="600.0" y="217.0" text-anchor="middle" font-weight="bold">MySQL</text><text class="sm" x="600.0" y="232.0" text-anchor="middle">app database</text><rect class="bx3" x="695" y="185" width="150" height="70" rx="9"/><text class="tx" x="770.0" y="217.0" text-anchor="middle" font-weight="bold">cron</text><text class="sm" x="770.0" y="232.0" text-anchor="middle">uptime logging</text><rect class="bx" x="525" y="275" width="320" height="56" rx="9"/><text class="tx" x="685.0" y="300.0" text-anchor="middle" font-weight="bold">Laravel App</text><text class="sm" x="685.0" y="315.0" text-anchor="middle">deployed via deploy_laravel.sh</text><path class="ln" d="M200 200 L270 200" marker-end="url(#a5)"/><path class="ln" d="M440 200 L525 130" marker-end="url(#a5)"/><path class="ln" d="M440 200 L695 130" marker-end="url(#a5)"/><path class="ln2" d="M440 220 L600 275" marker-end="url(#a5p)"/><text class="sm" x="40" y="330">SSH from Master → Slave · idempotent, re-runnable playbook</text></svg>`
  },
  "gcp-static": {
    title: "// STATIC SITE ON GCP — GLOBAL EDGE DELIVERY",
    svg: `<svg viewBox="0 0 900 360" xmlns="http://www.w3.org/2000/svg" role="img"><defs><marker id="a6" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="none" stroke="#00e676" stroke-width="1.4"/></marker><marker id="a6p" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="none" stroke="#a3e635" stroke-width="1.4"/></marker></defs><rect class="bx" x="40" y="165" width="140" height="70" rx="9"/><text class="tx" x="110.0" y="197.0" text-anchor="middle" font-weight="bold">Users</text><text class="sm" x="110.0" y="212.0" text-anchor="middle">worldwide</text><rect class="bx3" x="240" y="150" width="160" height="100" rx="9"/><text class="tx" x="320.0" y="189.0" text-anchor="middle" font-weight="bold">Cloud DNS</text><text class="sm" x="320.0" y="204.0" text-anchor="middle">A record</text><text class="sm" x="320.0" y="219.0" text-anchor="middle">resolves domain</text><rect class="bx2" x="460" y="140" width="190" height="120" rx="9"/><text class="tx" x="555.0" y="181.0" text-anchor="middle" font-weight="bold">Global HTTPS</text><text class="sm" x="555.0" y="196.0" text-anchor="middle">Load Balancer</text><text class="sm" x="555.0" y="211.0" text-anchor="middle">managed SSL cert</text><text class="sm" x="555.0" y="226.0" text-anchor="middle">+ Cloud CDN</text><rect class="bx" x="700" y="150" width="160" height="100" rx="9"/><text class="tx" x="780.0" y="189.0" text-anchor="middle" font-weight="bold">Cloud Storage</text><text class="sm" x="780.0" y="204.0" text-anchor="middle">bucket</text><text class="sm" x="780.0" y="219.0" text-anchor="middle">website files</text><path class="ln" d="M180 200 L240 200" marker-end="url(#a6)"/><path class="ln" d="M400 200 L460 200" marker-end="url(#a6)"/><path class="ln" d="M650 200 L700 200" marker-end="url(#a6)"/><text class="sm" x="460" y="300">Cache hit → served from nearest edge PoP ⚡ · miss → fetched from bucket, then cached</text><text class="sm" x="460" y="322">Terraform: provider.tf · main.tf · lb.tf · ssl.tf · variables.tf</text></svg>`
  }
};

(function () {
  const archModal = document.getElementById('archModal'),
    archTitle = document.getElementById('archTitle'),
    archBody = document.getElementById('archBody');
  if (!archModal) return;
  let lastFocus = null;

  function openArch(slug) {
    const d = ARCH_DIAGRAMS[slug];
    if (!d) return;
    lastFocus = document.activeElement;
    archTitle.textContent = d.title;
    archBody.innerHTML = d.svg;
    archModal.classList.add('open');
    document.body.classList.add('modal-open');
    archModal.querySelector('.m-close').focus();
  }
  function closeArch() {
    archModal.classList.remove('open');
    document.body.classList.remove('modal-open');
    if (lastFocus) lastFocus.focus();
  }
  document.addEventListener('click', e => {
    const btn = e.target.closest('.arch-btn');
    if (btn) { e.preventDefault(); openArch(btn.dataset.arch); }
  });
  archModal.querySelector('.backdrop').addEventListener('click', closeArch);
  archModal.querySelector('.m-close').addEventListener('click', closeArch);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && archModal.classList.contains('open')) closeArch();
  });
})();

/* ============ RESPONSIVE NAV + SAME-TAB ANCHOR SCROLL ============ */
(function () {
  const toggle = document.querySelector('.nav-toggle'),
    links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  function closeMenu() {
    links.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  addEventListener('resize', () => { if (innerWidth > 640) closeMenu(); });

  // Internal #links: always same tab, smooth scroll with nav offset.
  // Also strips any stray target attribute so nothing opens a new tab.
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const hash = a.getAttribute('href');
    if (hash.length < 2) return;               // let other handlers (e.g. arch-btn) deal with "#"
    const target = document.querySelector(hash);
    if (!target) return;
    e.preventDefault();
    a.removeAttribute('target');
    closeMenu();
    const y = target.getBoundingClientRect().top + window.scrollY - 64;
    window.scrollTo({ top: y, behavior: prefersReduced ? 'auto' : 'smooth' });
    history.replaceState(null, '', hash);
  });
})();

/* ============ CERTS MODAL (AWS badge cards) ============ */
(function () {
  const modal = document.getElementById('certsModal');
  if (!modal) return;
  let lastFocus = null;

  function open() {
    lastFocus = document.activeElement;
    modal.classList.add('open');
    document.body.classList.add('modal-open');
    modal.querySelector('.m-close').focus();
  }
  function close() {
    modal.classList.remove('open');
    document.body.classList.remove('modal-open');
    if (lastFocus) lastFocus.focus();
  }
  document.querySelectorAll('[data-modal="certsModal"]').forEach(card => {
    card.addEventListener('click', open);
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
  });
  modal.querySelector('.backdrop').addEventListener('click', close);
  modal.querySelector('.m-close').addEventListener('click', close);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) close();
  });
})();