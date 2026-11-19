import React, { useEffect, useRef, useState } from 'react';
import './styles.css';
import { site, branches, categoryPages, questions } from './site-content.js';

const portal = 'https://ventas.ferreteriaavenida.com.ar/';
const whatsapp = 'https://wa.me/5493743400209';
const maps = site.maps;
const media = name => import.meta.env.BASE_URL + 'media/' + name;
const consult = subject => whatsapp + '?text=' + encodeURIComponent('Hola, quisiera consultar por ' + subject + '.');

const categories = [
  { title: 'Construcción', phrase: 'La base de tu próxima obra.', items: ['Hierros', 'Chapas', 'Materiales'], brands: ['Gerdau', 'Siderar', 'Gherardi'], image: 'construccion', alt: 'Chapas galvanizadas y hierros de construcción, escena ilustrativa', text: 'Hierros, chapas y materiales para avanzar desde los primeros planos hasta la estructura.' },
  { title: 'Terminaciones', phrase: 'Los detalles hacen tu espacio.', items: ['Cerámicas', 'Sanitarios', 'Pinturas'], brands: ['Sinteplast', 'Lourdes', 'Cortines', 'San Pietro'], image: 'terminaciones', alt: 'Ambiente de baño con cerámicas, bacha y grifería, escena ilustrativa', text: 'Texturas, colores y superficies para encontrar el estilo de cada ambiente.' },
  { title: 'Instalaciones', phrase: 'Todo empieza por una buena conexión.', items: ['Agua y conexiones', 'Griferías', 'Electricidad'], brands: [], image: 'instalaciones', alt: 'Conexiones de agua, válvulas, caños y cables, escena ilustrativa', text: 'Explorá materiales para conexiones de agua, griferías e instalaciones eléctricas. Consultá las líneas disponibles.' },
  { title: 'Herramientas', phrase: 'Equipá tu próximo trabajo.', items: ['A batería', 'Manuales', 'Accesorios'], brands: ['Milwaukee', 'Hamilton'], image: 'milwaukee-kit', alt: 'Kit Milwaukee M18 FUEL, fotografía oficial de referencia', text: 'Herramientas eléctricas, manuales y accesorios. Encontrá opciones para la obra, el taller y los proyectos de casa.' },
].map((category, index) => ({ ...category, ...categoryPages[index], title: category.title }));

function Arrow({ diagonal = false }) {
  return <span aria-hidden="true">{diagonal ? '↗' : '→'}</span>;
}

// Capas generadas por scripts/build-entrada.py, en píxeles de entrada-fachada.webp.
const ENTRY = { width: 2400, height: 1164, left: [1286, 622, 1396, 928], right: [1396, 621, 1503, 932], hole: [1286, 621, 1503, 932] };
const PANORAMA = { width: 4800, height: 920 };
// Momentos del recorrido, como fracción del scroll de la sección de entrada.
const JOURNEY = { walk: [0, .3], doors: [.06, .24], through: [.22, .36], pan: [.4, .94] };
// Encuadre inicial en pantallas apaisadas: deja ver el logo FASA junto a la puerta.
const WIDE_FOCUS_X = 1000;
// El salón arranca mirando hacia el pasillo central y no hacia la pared de la entrada.
const PAN_START = .2;
export const SHOWROOM_START = .42;

// Puntos sobre la panorámica (% del ancho y alto). Ubicaciones a validar con el local.
const hotspots = [
  { category: 0, x: 32.5, y: 47, label: 'Al fondo', hint: 'Hierros, chapas y materiales' },
  { category: 2, x: 21.5, y: 70, label: 'Junto a la entrada', hint: 'Tanques, agua y conexiones' },
  { counter: true, x: 52, y: 63, label: 'Mostrador', hint: 'Te atendemos y armamos tu pedido' },
  { category: 3, x: 68.5, y: 40, label: 'Exhibidores', hint: 'Herramientas y accesorios' },
  { category: 1, x: 90, y: 40, label: 'Góndolas', hint: 'Pinturas, cerámicas y sanitarios' },
];

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const phase = (progress, [start, end]) => clamp((progress - start) / (end - start));
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const lerp = (from, to, t) => from + (to - from) * t;

function scrollIntoJourney(progress) {
  const intro = document.querySelector('.store-intro');
  if (!intro) return;
  const reduced = document.documentElement.dataset.motion === 'reduced';
  const top = reduced ? intro.querySelector('.showroom').getBoundingClientRect().top + window.scrollY - 90 : intro.offsetTop + (intro.offsetHeight - innerHeight) * progress;
  window.scrollTo({ top, behavior: 'instant' });
}

// Movimiento reducido o sin JavaScript: fachada y salón quedan como bloques estáticos.
function resetEntrance(intro) {
  intro.removeAttribute('style');
  intro.querySelectorAll('.entry-scene, .showroom-track').forEach(element => element.removeAttribute('style'));
  intro.querySelectorAll('.hotspot').forEach(spot => spot.classList.add('is-near'));
  intro.querySelector('.showroom').inert = false;
  intro.querySelector('.entry-hint').inert = false;
  document.documentElement.classList.remove('is-walking');
}

function layoutEntrance(intro, progress) {
  const screen = intro.querySelector('.intro-screen');
  const vw = screen.clientWidth;
  const vh = screen.clientHeight;
  const [hl, ht, hr, hb] = ENTRY.hole;
  const fx = (hl + hr) / 2;
  const fy = (ht + hb) / 2;
  const walk = ease(phase(progress, JOURNEY.walk));
  const doors = ease(phase(progress, JOURNEY.doors));
  const through = ease(phase(progress, JOURNEY.through));
  const pan = phase(progress, JOURNEY.pan);

  // La cámara avanza hacia la puerta: escala exponencial y la puerta se centra.
  const baseScale = Math.max(vw / ENTRY.width, vh / ENTRY.height);
  const finalScale = Math.max(baseScale * 1.6, (vh * .78) / (hb - ht));
  const scale = baseScale * Math.pow(finalScale / baseScale, walk);
  const fit = (target, focus, size, viewport, s) => clamp(target - focus * s, viewport - size * s, 0);
  const startFocus = vw > vh ? WIDE_FOCUS_X : fx;
  const startX = fit(vw / 2, startFocus, ENTRY.width, vw, baseScale) + fx * baseScale;
  const startY = fit(vh * .55, fy, ENTRY.height, vh, baseScale) + fy * baseScale;
  const tx = fit(lerp(startX, vw / 2, walk), fx, ENTRY.width, vw, scale);
  const ty = fit(lerp(startY, vh * .5, walk), fy, ENTRY.height, vh, scale);
  const camera = `translate3d(${tx}px,${ty}px,0) scale(${scale})`;
  intro.querySelectorAll('.entry-scene').forEach(scene => { scene.style.transform = camera; });

  // El salón se ve por el hueco de la puerta y ese recorte crece hasta la pantalla.
  const hole = [ty + ht * scale, vw - (tx + hr * scale), vh - (ty + hb * scale), tx + hl * scale];
  const inset = hole.map(value => Math.max(0, value) * (1 - through));
  const style = intro.style;
  intro.dataset.ready = 'true';
  style.setProperty('--showroom-clip', `inset(${inset.map(value => value.toFixed(1) + 'px').join(' ')})`);
  style.setProperty('--showroom-scale', lerp(1.18, 1, through));
  style.setProperty('--door-angle', doors * 84 + 'deg');
  style.setProperty('--door-light', doors * (1 - through));
  style.setProperty('--facade-opacity', 1 - phase(progress, [.27, .35]));
  style.setProperty('--hint-opacity', 1 - phase(progress, [0, .07]));
  style.setProperty('--showroom-ui', phase(progress, [.34, .42]));

  // Recorrido horizontal por la panorámica.
  const track = intro.querySelector('.showroom-track');
  const trackWidth = vh * PANORAMA.width / PANORAMA.height;
  const travel = Math.max(0, trackWidth - vw);
  track.style.width = trackWidth + 'px';
  const offset = travel * lerp(PAN_START, 1, pan);
  track.style.transform = `translate3d(${-offset}px,0,0)`;
  track.querySelectorAll('.hotspot').forEach(spot => {
    const center = trackWidth * Number(spot.dataset.x) / 100 - offset;
    const margin = Math.min(130, vw * .22);
    spot.classList.toggle('is-near', through > .98 && center > margin && center < vw - margin);
  });

  const inside = through > .98;
  intro.querySelector('.showroom').inert = !inside;
  intro.querySelector('.entry-hint').inert = progress > .07;
  const step = progress < JOURNEY.doors[0] ? 0 : progress < JOURNEY.through[1] ? 1 : pan < .5 ? 2 : 3;
  intro.querySelectorAll('.journey-bar li').forEach((item, index) => {
    item.classList.toggle('is-done', index < step);
    if (index === step) item.setAttribute('aria-current', 'step'); else item.removeAttribute('aria-current');
  });
  document.documentElement.classList.toggle('is-walking', progress > .04 && progress < JOURNEY.through[1]);
  document.documentElement.classList.toggle('intro-passed', progress >= 1);
}

function usePageMotion() {
  useEffect(() => {
    const reveal = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          reveal.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('[data-reveal]').forEach(element => reveal.observe(element));
    let frame;
    const update = () => {
      frame = undefined;
      document.documentElement.style.setProperty('--scroll-progress', window.scrollY / Math.max(document.documentElement.scrollHeight - innerHeight, 1));
      const intro = document.querySelector('.store-intro');
      if (!intro) return;
      if (document.documentElement.dataset.motion === 'reduced') return resetEntrance(intro);
      const progress = clamp(-intro.getBoundingClientRect().top / Math.max(intro.offsetHeight - innerHeight, 1));
      layoutEntrance(intro, progress);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const jumpToRubros = () => {
      if (window.location.hash !== '#rubros') return;
      scrollIntoJourney(SHOWROOM_START);
      update();
    };
    const motionWatch = new MutationObserver(onScroll);
    motionWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-motion'] });
    const hashFrame = requestAnimationFrame(jumpToRubros);
    update();
    window.addEventListener('hashchange', jumpToRubros);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      reveal.disconnect();
      motionWatch.disconnect();
      cancelAnimationFrame(hashFrame);
      window.removeEventListener('hashchange', jumpToRubros);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
}

function ImageReveal({ as: Element = 'div', children, ...props }) {
  const frame = useRef(null);

  useEffect(() => {
    const element = frame.current;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        element.classList.add('image-is-visible');
        observer.disconnect();
      }
    }, { threshold: .08 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <Element ref={frame} data-image-reveal {...props}>{children}</Element>;
}

function CategoryVisual({ category, compact = false }) {
  if (category.title === 'Herramientas') {
    return (
      <div className={'tool-composition' + (compact ? ' compact' : '')}>
        <div className="tool-product">
          <img src={media('milwaukee-kit.webp')} alt="Kit Milwaukee M18 FUEL, imagen oficial de referencia" width="520" height="520" />
          <span>Milwaukee</span>
        </div>
        <div className="tool-product">
          <img src={media('hamilton-set.webp')} alt="Set de pinzas Hamilton JPA002, imagen oficial de referencia" width="1200" height="1200" />
          <span>Hamilton</span>
        </div>
      </div>
    );
  }
  return <img src={media(category.image + '.webp')} alt={category.alt} width="1536" height="1024" className="category-image" />;
}

function CategoryDetail({ selected, onClose }) {
  const dialog = useRef(null);
  const current = categories[selected];

  useEffect(() => {
    dialog.current.showModal();
  }, []);

  return (
    <dialog ref={dialog} className="category-dialog" aria-label={current.title} onCancel={onClose} onClick={event => {
      if (event.target === dialog.current) onClose();
    }}>
      <button type="button" className="dialog-close" onClick={onClose} aria-label="Cerrar detalle del rubro">Cerrar <span aria-hidden="true">×</span></button>
      <div className={'category-stage ' + (selected === 3 ? 'tools-stage' : '')}>
        <CategoryVisual category={current} />
        <div className="category-caption">
          <span className="eyebrow">{current.title}</span>
          <h3>{current.phrase}</h3>
          <p>{current.text}</p>
          <div className="category-items">
            {current.items.map(item => <a key={item} href={consult(item)}>{item}<Arrow diagonal /></a>)}
          </div>
          <a className="text-link" href={consult(current.title)}>Consultar por {current.title.toLowerCase()} <Arrow diagonal /></a>
          <a className="category-page-link" href={'/rubros/' + current.slug + '/'}>Ver información del rubro <Arrow diagonal /></a>
        </div>
        <span className="image-note">{selected === 3 ? 'Imágenes oficiales de referencia · Consultá modelos disponibles' : 'Ambientación ilustrativa'}</span>
      </div>
      {current.brands.length > 0 && <div className="category-brands"><span>Marcas del rubro</span>{current.brands.map(brand => <strong key={brand}>{brand}</strong>)}</div>}
    </dialog>
  );
}

function App() {
  const [selected, setSelected] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef(null);
  const [motionEnabled, setMotionEnabled] = useState(true);

  useEffect(() => {
    setMotionEnabled(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.motion = motionEnabled ? 'full' : 'reduced';
    return () => delete document.documentElement.dataset.motion;
  }, [motionEnabled]);
  usePageMotion();

  useEffect(() => {
    if (!menuOpen) return;
    const onEscape = event => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [menuOpen]);

  function chooseCategory(index) {
    setSelected(index);
    setMenuOpen(false);

  }

  function enterStore(smooth) {
    if (!smooth || document.documentElement.dataset.motion === 'reduced') return scrollIntoJourney(SHOWROOM_START);
    const intro = document.querySelector('.store-intro');
    window.scrollTo({ top: intro.offsetTop + (intro.offsetHeight - innerHeight) * SHOWROOM_START, behavior: 'smooth' });
  }

  return (
    <>
      <a href="#contenido" className="skip-link">Saltar al contenido</a>
      <header className="site-header">
        <div className="shell header-inner">
          <a href="#inicio" className="brand"><img src={media('logo.png')} alt="Ferretería Avenida S.A." width="851" height="212" /></a>
          <nav aria-label="Principal" className="main-nav">
            <button ref={menuButton} type="button" aria-expanded={menuOpen} aria-controls="rubros-menu" onClick={() => setMenuOpen(!menuOpen)}>Rubros <span aria-hidden="true">{menuOpen ? '−' : '+'}</span></button>
            <a href="#empresa" onClick={() => setMenuOpen(false)}>Nosotros</a>
            <a href="#campanas" onClick={() => setMenuOpen(false)}>Inspiración</a>
            <a href="#sucursales" onClick={() => setMenuOpen(false)}>Sucursales</a>
          </nav>
          <div className="portal-access"><a className="portal-link" href={portal}>Portal de Ventas <Arrow diagonal /></a><small>Necesitás una cuenta · Solicitá acceso ahí</small></div>
        </div>
        {menuOpen && <div className="mega-menu" id="rubros-menu">
          <div className="shell mega-grid">
            {categories.map((category, index) => (
              <button type="button" key={category.title} onClick={() => chooseCategory(index)}>
                <div className="mega-image"><CategoryVisual category={category} compact /></div>
                <strong>{category.title}<Arrow diagonal /></strong>
                <small>{category.items.join(' · ')}</small>
              </button>
            ))}
          </div>
        </div>}
      </header>
      <main id="contenido">
        <section id="inicio" className="store-intro" aria-label="Recorrido de entrada a Ferretería Avenida">
          <h1 className="visually-hidden">Ferretería y materiales de construcción en Puerto Rico, Misiones — Ferretería Avenida</h1>
          <div className="intro-screen">
            <div className="entry-scene" style={{ width: ENTRY.width, height: ENTRY.height }}>
              <img className="entry-facade" src={media('entrada-fachada.webp')} width={ENTRY.width} height={ENTRY.height} alt="Fachada de Ferretería Avenida en Puerto Rico, Misiones, con la puerta de entrada" fetchPriority="high" />
            </div>
            <div className="showroom" id="rubros" aria-label="Salón de ventas">
              <div className="showroom-view"><div className="showroom-track">
                <img src={media('showroom-panoramica.webp')} width={PANORAMA.width} height={PANORAMA.height} alt="Vista panorámica del salón de ventas de Ferretería Avenida" loading="lazy" />
                {hotspots.map(spot => {
                  const category = categories[spot.category];
                  const content = <>
                    <span className="hotspot-pin" aria-hidden="true" />
                    <span className="hotspot-card">
                      <small>{spot.label}</small>
                      <strong>{spot.counter ? 'Atención' : category.title}<Arrow diagonal /></strong>
                      <span>{spot.hint}</span>
                    </span>
                  </>;
                  const position = { left: spot.x + '%', top: spot.y + '%' };
                  return spot.counter
                    ? <a key="mostrador" className="hotspot hotspot-counter" data-x={spot.x} style={position} href="#empresa">{content}</a>
                    : <button key={category.title} type="button" className="hotspot" data-x={spot.x} style={position} onClick={() => chooseCategory(spot.category)} aria-label={'Ver ' + category.title + ': ' + spot.hint}>{content}</button>;
                })}
              </div></div>
              <div className="showroom-dock">
                <p><span className="eyebrow">Ya estás adentro</span><strong>Recorré el salón o elegí un rubro</strong></p>
                <div className="dock-rubros">
                  {categories.map((category, index) => (
                    <button type="button" key={category.title} onClick={() => chooseCategory(index)}>
                      <img src={media(category.image + '.webp')} alt="" width="96" height="64" loading="lazy" />
                      <span>{category.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="entry-scene entry-doors" style={{ width: ENTRY.width, height: ENTRY.height }} aria-hidden="true">
              <div className="door-light" style={{ left: ENTRY.hole[0], top: ENTRY.hole[1], width: ENTRY.hole[2] - ENTRY.hole[0], height: ENTRY.hole[3] - ENTRY.hole[1] }} />
              {[['izq', ENTRY.left], ['der', ENTRY.right]].map(([side, box]) => (
                <img key={side} className={'door-leaf door-' + side} src={media('entrada-puerta-' + side + '.webp')} alt="" width={box[2] - box[0]} height={box[3] - box[1]} style={{ left: box[0], top: box[1], width: box[2] - box[0], height: box[3] - box[1] }} />
              ))}
            </div>
            <div className="entry-copy">
              <p className="eyebrow">Puerto Rico · Capioví · Misiones</p>
              <p className="entry-title">Pasá, <em>estás en Avenida.</em></p>
            </div>
            <button type="button" className="entry-hint" onClick={() => enterStore(true)}>
              <span className="entry-mouse" aria-hidden="true"><span /></span>
              <span>Deslizá para entrar</span>
            </button>
            <ol className="journey-bar" aria-label="Recorrido">
              {['Fachada', 'Puerta', 'Salón', 'Rubros'].map(step => <li key={step}>{step}</li>)}
            </ol>
            <button type="button" className="skip-intro" onClick={() => enterStore(false)}>Saltar recorrido <Arrow /></button>
          </div>
        </section>

        <section className="story" id="empresa">
          <ImageReveal className="story-photo"><img src={media('mostrador.webp')} width="1100" height="825" alt="Atención en el mostrador de Avenida" loading="lazy" /><span>En el mostrador, como siempre.</span></ImageReveal>
          <div className="story-copy" data-reveal>
            <span className="eyebrow">Estamos cerca</span>
            <h2>Una consulta.<br />Un proyecto.<br /><em>Pasá por Avenida.</em></h2>
            <p>Somos Ferretería Avenida S.A., una ferretería y comercio de materiales de construcción con casa central en Facundo Quiroga 298, Puerto Rico, y sucursal en Capioví, Misiones. Traé tu lista de materiales, tus medidas o esa idea que querés empezar.</p>
            <p>{site.delivery}</p>
            <a className="text-link" href="#sucursales">Conocé nuestros locales <Arrow diagonal /></a>
          </div>
        </section>
        <section className="campaign section" id="campanas">
          <div className="shell section-heading" data-reveal><div><span className="eyebrow">Ideas para renovar</span><h2>Imaginá<br /><em>lo que viene.</em></h2></div><p>Empezá por un ambiente.<br />Elegí cada detalle.</p></div>
          <div className="shell campaign-grid">
            <ImageReveal as="a" href={consult('cerámicas y sanitarios para renovar mi baño')} className="campaign-card">
              <img src={media('terminaciones.webp')} alt="Baño con revestimientos y sanitarios, ambientación ilustrativa" width="1536" height="1024" loading="lazy" />
              <div><span className="eyebrow">Cerámicas · Sanitarios</span><h3>Renová tu baño.</h3><span className="card-action">Consultar opciones <Arrow diagonal /></span></div>
              <small>Ambientación ilustrativa</small>
            </ImageReveal>
            <ImageReveal as="a" href={consult('herramientas Milwaukee y Hamilton')} className="campaign-card tool-card">
              <CategoryVisual category={categories[3]} />
              <div><span className="eyebrow">Milwaukee · Hamilton</span><h3>Manos a la obra.</h3><span className="card-action">Consultar herramientas <Arrow diagonal /></span></div>
              <small>Imágenes oficiales de referencia</small>
            </ImageReveal>
          </div>
        </section>
        <section className="sales" data-reveal>
          <div className="shell sales-inner">
            <div><span className="eyebrow">Comprá con tu cuenta</span><h2>Tu Avenida.<br />También online.</h2><p>Accedé al Portal de Ventas con tu cuenta.<br />Si todavía no tenés acceso, solicitá el alta desde el portal.</p></div>
            <a className="round-link" href={portal}><span>Portal<br />de Ventas</span><Arrow diagonal /></a>
          </div>
        </section>
        <Branches />
        <BusinessQuestions />
      </main>
      <footer className="site-footer" id="contacto">
        <div className="shell footer-heading" data-reveal><h2>Hablemos de<br /><em>tu próximo proyecto.</em></h2><a className="text-link" href={whatsapp}>Escribir por WhatsApp <Arrow diagonal /></a></div>
        <div className="shell footer-inner">
          <a href="#inicio" className="brand"><img src={media('logo.png')} alt="Ferretería Avenida S.A." width="851" height="212" /></a>
          <address><a href={maps}>Facundo Quiroga 298<br />Puerto Rico, Misiones <Arrow diagonal /></a></address>
          <BusinessHours />
          <div className="footer-links"><a href={site.instagram}>Instagram @avenida.fasa</a><a href={whatsapp}>WhatsApp 3743-400209</a><a href="tel:+543743420344">(03743) 420344</a><a href="mailto:ventas@ferreteriaavenida.com.ar">ventas@ferreteriaavenida.com.ar</a></div>
        </div>
        <div className="shell motion-control">
          <button type="button" aria-pressed={motionEnabled} onClick={() => setMotionEnabled(!motionEnabled)}>
            Animaciones {motionEnabled ? 'activadas · Desactivar' : 'desactivadas · Activar'}
          </button>
        </div>
      </footer>
      {selected !== null && <CategoryDetail selected={selected} onClose={() => setSelected(null)} />}
      {menuOpen && <button className="menu-backdrop" type="button" aria-label="Cerrar menú de rubros" onClick={() => setMenuOpen(false)} />}
    </>
  );
}


function Branches() {
  return (
    <section className="shell section branches" id="sucursales" aria-labelledby="branches-title">
      <span className="eyebrow">Puerto Rico y Capioví</span>
      <h2 id="branches-title">Encontranos cerca.</h2>
      <div className="branches-grid">
        {branches.map(branch => (
          <article key={branch.id}>
            <h3>{branch.name}</h3>
            <address>{branch.address}<br />{branch.city}, Misiones</address>
            <a href={'tel:' + branch.telephone}>{branch.phoneLabel}</a>
            <BusinessHours />
            <a className="text-link" href={branch.maps}>Cómo llegar <Arrow diagonal /></a>
            {branch.id === 'sucursal-capiovi' && <a className="branch-directions" href={'tel:' + branch.telephone}>Llamá al local para pedir una referencia de llegada</a>}
          </article>
        ))}
      </div>
    </section>
  );
}

function BusinessHours() {
  return (
    <div className="business-hours">
      <strong>Horarios de atención</strong>
      <p>Lunes a viernes<br />7:15 a 12:00 y 15:00 a 19:00</p>
      <p>Sábados de 7:15 a 12:00</p>
    </div>
  );
}

function BusinessQuestions() {
  return (
    <section className="shell section business-questions" aria-labelledby="questions-title">
      <span className="eyebrow">Consultas frecuentes</span>
      <h2 id="questions-title">Antes de venir.</h2>
      {questions.map(item => (
        <details key={item.question}>
          <summary>{item.question}</summary>
          <p>{item.answer}</p>
        </details>
      ))}
      <p className="rubros-links">Conocé nuestros rubros. {categoryPages.map((category, index) => (
        <React.Fragment key={category.slug}>{index > 0 && ' · '}<a href={'/rubros/' + category.slug + '/'}>{category.name}</a></React.Fragment>
      ))}</p>
    </section>
  );
}

function CategoryPage({ category }) {
  return (
    <div className="category-page">
      <header className="category-page-header">
        <div className="shell header-inner">
          <a href="/" className="brand"><img src={media('logo.png')} alt="Ferretería Avenida S.A." width="851" height="212" /></a>
          <a href="/#rubros" className="text-link">Volver al inicio</a>
          <div className="portal-access"><a className="portal-link" href={portal}>Portal de Ventas <Arrow diagonal /></a><small>Necesitás una cuenta · Solicitá acceso ahí</small></div>
        </div>
      </header>
      <main id="contenido">
        <div className="shell breadcrumb"><a href="/">Inicio</a><span aria-hidden="true"> / </span><span>{category.name}</span></div>
        <section className="shell category-page-intro">
          <div>
            <span className="eyebrow">Ferretería Avenida · Puerto Rico y Capioví, Misiones</span>
            <h1>{category.heading}</h1>
            <p>{category.introduction}</p>
            <p>{site.delivery}</p>
            <a className="portal-link" href={consult(category.name)}>Consultar por WhatsApp <Arrow diagonal /></a>
          </div>
          <figure>
            <CategoryVisual category={category} />
            <figcaption>{category.name === 'Herramientas' ? 'Fotografías oficiales de referencia. Consultá modelos disponibles.' : 'Ambientación ilustrativa del rubro.'}</figcaption>
          </figure>
        </section>
        <section className="shell category-guidance">
          <h2>¿Qué datos conviene traer?</h2>
          <p>{category.guidance}</p>
          <p>Consultá precios, medidas, presentaciones y disponibilidad con nuestro equipo antes de definir tu compra.</p>
        </section>
        <Branches />
        <BusinessQuestions />
      </main>
      <footer className="category-page-footer">
        <div className="shell footer-inner">
          <a href="/" className="brand"><img src={media('logo.png')} alt="Ferretería Avenida S.A." width="851" height="212" /></a>
          <address><a href={maps}>{site.address}<br />{site.city}, {site.region}, Argentina <Arrow diagonal /></a></address>
          <BusinessHours />
          <div className="footer-links"><a href={site.instagram}>Instagram @avenida.fasa</a><a href={whatsapp}>WhatsApp 3743-400209</a><a href="tel:+543743420344">(03743) 420344</a><a href={'mailto:' + site.email}>{site.email}</a></div>
        </div>
      </footer>
    </div>
  );
}

export default function Site({ path = '/' }) {
  const category = categories.find(item => path === '/rubros/' + item.slug + '/');
  return <>{category ? <CategoryPage category={category} /> : <App />}<a className="whatsapp-float" href={consult('precios o un presupuesto')} aria-label="Consultar precios o pedir presupuesto por WhatsApp">WhatsApp <Arrow diagonal /></a></>;
}

