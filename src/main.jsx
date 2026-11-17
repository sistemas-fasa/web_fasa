import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const portal = 'https://ventas.ferreteriaavenida.com.ar/';
const whatsapp = 'https://wa.me/5493743400209';
const maps = 'https://www.google.com/maps/search/?api=1&query=Ferreter%C3%ADa+Avenida%2C+Facundo+Quiroga+298%2C+Puerto+Rico%2C+Misiones';
const media = name => import.meta.env.BASE_URL + 'media/' + name;
const consult = subject => whatsapp + '?text=' + encodeURIComponent('Hola, quisiera consultar por ' + subject + '.');

const categories = [
  { title: 'Construcción', phrase: 'La base de tu próxima obra.', items: ['Hierros', 'Chapas', 'Materiales'], brands: ['Gerdau', 'Siderar', 'Gherardi'], image: 'construccion', alt: 'Chapas galvanizadas y hierros de construcción, escena ilustrativa', text: 'Hierros, chapas y materiales para avanzar desde los primeros planos hasta la estructura.' },
  { title: 'Terminaciones', phrase: 'Los detalles hacen tu espacio.', items: ['Cerámicas', 'Sanitarios', 'Pinturas'], brands: ['Sinteplast', 'Lourdes', 'Cortines', 'San Pietro'], image: 'terminaciones', alt: 'Ambiente de baño con cerámicas, bacha y grifería, escena ilustrativa', text: 'Texturas, colores y superficies para encontrar el estilo de cada ambiente.' },
  { title: 'Instalaciones', phrase: 'Todo empieza por una buena conexión.', items: ['Agua y conexiones', 'Griferías', 'Electricidad'], brands: [], image: 'instalaciones', alt: 'Conexiones de agua, válvulas, caños y cables, escena ilustrativa', text: 'Explorá materiales para conexiones de agua, griferías e instalaciones eléctricas. Consultá las líneas disponibles.' },
  { title: 'Herramientas', phrase: 'Equipá tu próximo trabajo.', items: ['A batería', 'Manuales', 'Accesorios'], brands: ['Milwaukee', 'Hamilton'], image: 'milwaukee-kit', alt: 'Kit Milwaukee M18 FUEL, fotografía oficial de referencia', text: 'Herramientas eléctricas, manuales y accesorios. Encontrá opciones para la obra, el taller y los proyectos de casa.' },
];

function Arrow({ diagonal = false }) {
  return <span aria-hidden="true">{diagonal ? '↗' : '→'}</span>;
}

function usePageMotion() {
  useEffect(() => {
    const reveal = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else if (entry.boundingClientRect.top >= window.innerHeight) {
          entry.target.classList.remove('is-visible');
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('[data-reveal]').forEach(element => reveal.observe(element));
    let frame;
    const update = () => {
      frame = undefined;
      const intro = document.querySelector('.store-intro');
      const progress = Math.max(0, Math.min(-intro.getBoundingClientRect().top / Math.max(intro.offsetHeight - innerHeight, 1), 1));
      const reduced = document.documentElement.dataset.motion === 'reduced';
      const zoom = Math.max(0, Math.min(progress / .56, 1));
      const interior = Math.max(0, Math.min((progress - .34) / .24, 1));
      const options = Math.max(0, Math.min((progress - .7) / .24, 1));
      intro.style.setProperty('--entry-hint-opacity', Math.max(0, 1 - progress / .14));
      intro.style.setProperty('--door-zoom', reduced ? 1 : 1 + zoom * zoom * 3.2);
      intro.style.setProperty('--inside-opacity', interior);
      intro.style.setProperty('--inside-scale', reduced ? 1 : 1.12 - interior * .12);
      intro.style.setProperty('--options-opacity', options);
      intro.style.setProperty('--options-travel', (1 - options) * 100 + 'px');
      intro.querySelector('.intro-options').inert = options < .3;
      document.documentElement.style.setProperty('--header-shift', (1 - options) * -110 + '%');
      document.documentElement.classList.toggle('intro-passed', progress > .68);
      document.documentElement.style.setProperty('--scroll-progress', window.scrollY / Math.max(document.documentElement.scrollHeight - innerHeight, 1));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      reveal.disconnect();
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
    let pending;
    const update = () => {
      pending = undefined;
      const rect = element.getBoundingClientRect();
      const distance = Math.min(rect.height * .6, innerHeight * .48);
      const progress = Math.max(0, Math.min((innerHeight * .94 - rect.top) / Math.max(distance, 1), 1));
      element.style.setProperty('--reveal-progress', progress);
      element.style.setProperty('--reveal-crop', (1 - progress) * 40 + '%');
      element.style.setProperty('--reveal-scale', 1 + (1 - progress) * .15);
      element.style.setProperty('--reveal-travel', (1 - progress) * 35 + 'px');
      element.classList.toggle('image-is-visible', progress > 0);
    };
    const onScroll = () => {
      if (!pending) pending = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(pending);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
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

  function enterStore() {
    const intro = document.querySelector('.store-intro');
    const destination = intro.offsetTop + (intro.offsetHeight - innerHeight) * .65;
    window.scrollTo({ top: destination, behavior: motionEnabled ? 'smooth' : 'instant' });
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
            <a href="#contacto" onClick={() => setMenuOpen(false)}>Contacto</a>
          </nav>
          <a className="portal-link" href={portal}>Portal de Ventas <Arrow diagonal /></a>
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
        <section id="inicio" className="store-intro" aria-label="Entrada a Ferretería Avenida">
          <h1 className="visually-hidden">Ferretería Avenida, Puerto Rico, Misiones</h1>
          <div className="intro-screen">
            <img className="intro-facade" src={media('fachada.webp')} width="1760" height="990" alt="Fachada de Ferretería Avenida y puerta de entrada" fetchPriority="high" />
            <img className="intro-interior" src={media('salon.webp')} width="1100" height="825" alt="Salón de ventas de Ferretería Avenida" />
            <button type="button" className="entry-hint" onClick={enterStore}>
              <span className="entry-mouse" aria-hidden="true"><span /></span>
              <span>Deslizá para entrar</span>
              <span aria-hidden="true">↓</span>
            </button>
            <div className="intro-options" id="rubros">
              <div className="shell">
                <p className="eyebrow">Bienvenido a Ferretería Avenida</p>
                <h2>¿Qué vas a construir?</h2>
                <div className="intro-rubros">
                  {categories.map((category, index) => (
                    <button type="button" key={category.title} onClick={() => chooseCategory(index)}>
                      <img src={media(category.image + '.webp')} alt="" width="600" height="400" />
                      <span>{category.title}<Arrow diagonal /></span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="story" id="empresa">
          <ImageReveal className="story-photo"><img src={media('mostrador.webp')} width="1100" height="825" alt="Atención en el mostrador de Avenida" loading="lazy" /><span>En el mostrador, como siempre.</span></ImageReveal>
          <div className="story-copy" data-reveal>
            <span className="eyebrow">Estamos cerca</span>
            <h2>Una consulta.<br />Un proyecto.<br /><em>Pasá por Avenida.</em></h2>
            <p>Nos encontrás en Facundo Quiroga 298, Puerto Rico. Traé tu lista de materiales, tus medidas o esa idea que querés empezar.</p>
            <a className="text-link" href={maps}>Vení a conocernos <Arrow diagonal /></a>
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
      </main>
      <footer className="site-footer" id="contacto">
        <div className="shell footer-heading" data-reveal><h2>Hablemos de<br /><em>tu próximo proyecto.</em></h2><a className="text-link" href={whatsapp}>Escribir por WhatsApp <Arrow diagonal /></a></div>
        <div className="shell footer-inner">
          <a href="#inicio" className="brand"><img src={media('logo.png')} alt="Ferretería Avenida S.A." width="851" height="212" /></a>
          <address><a href={maps}>Facundo Quiroga 298<br />Puerto Rico, Misiones <Arrow diagonal /></a></address>
          <div className="footer-links"><a href={whatsapp}>WhatsApp 3743-400209</a><a href="tel:+543743420344">(03743) 420344</a><a href="mailto:ventas@ferreteriaavenida.com.ar">ventas@ferreteriaavenida.com.ar</a></div>
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

createRoot(document.getElementById('root')).render(<App />);
