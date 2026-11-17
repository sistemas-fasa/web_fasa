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
      const hero = document.querySelector('.hero');
      const progress = Math.min(window.scrollY / Math.max(hero.offsetHeight, 1), 1);
      hero.style.setProperty('--travel', document.documentElement.dataset.motion === 'reduced' ? '0px' : progress * 95 + 'px');
      document.documentElement.style.setProperty('--scroll-progress', window.scrollY / Math.max(document.documentElement.scrollHeight - innerHeight, 1));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      reveal.disconnect();
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
}

function ImageReveal({ as: Element = 'div', children, ...props }) {
  const frame = useRef(null);

  useEffect(() => {
    const element = frame.current;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          element.classList.add('image-is-visible');
        } else if (entry.boundingClientRect.top >= window.innerHeight) {
          element.classList.remove('image-is-visible');
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

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

function Categories({ selected, setSelected }) {
  const current = categories[selected];
  return (
    <section className="categories section" id="rubros">
      <div className="shell section-heading" data-reveal>
        <div><span className="eyebrow">De la estructura al último detalle</span><h2>Tu proyecto.<br /><em>Cada etapa.</em></h2></div>
        <p>Materiales, terminaciones y herramientas.<br />Elegí por dónde empezar.</p>
      </div>
      <div className="shell">
        <div className="category-tabs" aria-label="Rubros disponibles">
          {categories.map((category, index) => (
            <button type="button" key={category.title} aria-pressed={selected === index} aria-controls="category-detail" onClick={() => setSelected(index)}>
              {category.title}<Arrow diagonal />
            </button>
          ))}
        </div>
        <ImageReveal className={'category-stage ' + (selected === 3 ? 'tools-stage' : '')} id="category-detail" aria-live="polite" key={current.title}>
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
        </ImageReveal>
        {current.brands.length > 0 && <div className="category-brands"><span>Marcas del rubro</span>{current.brands.map(brand => <strong key={brand}>{brand}</strong>)}</div>}
      </div>
    </section>
  );
}

function App() {
  const [selected, setSelected] = useState(0);
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
    document.getElementById('rubros').scrollIntoView({ behavior: motionEnabled ? 'smooth' : 'instant' });
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
        <section id="inicio" className="hero">
          <div className="hero-photo"><img src={media('fachada.webp')} width="1760" height="990" alt="Fachada y entrada de Ferretería Avenida en Puerto Rico" fetchPriority="high" /></div>
          <div className="hero-shade" />
          <div className="shell hero-copy">
            <p className="eyebrow hero-eyebrow">Ferretería Avenida · Puerto Rico, Misiones</p>
            <h1><span>Tu obra.</span><span>Tu casa.</span><span className="hero-last">Tu Avenida.</span></h1>
            <div className="hero-bottom">
              <p>Materiales, herramientas y terminaciones <br />para construir lo que tenés en mente.</p>
              <a className="round-link" href="#rubros"><span>Explorar<br />rubros</span><Arrow diagonal /></a>
            </div>
          </div>
          <a className="scroll-cue" href="#rubros">Deslizá para descubrir <span aria-hidden="true">↓</span></a>
        </section>
        <div className="category-ribbon" aria-label="Accesos a rubros">
          {categories.map((category, index) => <button type="button" key={category.title} onClick={() => chooseCategory(index)}>{category.title}<Arrow diagonal /></button>)}
        </div>
        <Categories selected={selected} setSelected={setSelected} />
        <section className="story" id="empresa">
          <ImageReveal className="story-photo"><img src={media('mostrador.webp')} width="1100" height="825" alt="Atención en el mostrador de Avenida" loading="lazy" /><span>En el mostrador, como siempre.</span></ImageReveal>
          <div className="story-copy" data-reveal>
            <span className="eyebrow">Estamos cerca</span>
            <h2>Una consulta.<br />Un proyecto.<br /><em>Pasá por Avenida.</em></h2>
            <p>Nos encontrás en Facundo Quiroga 298, Puerto Rico. Traé tu lista de materiales, tus medidas o esa idea que querés empezar.</p>
            <a className="text-link" href={maps}>Vení a conocernos <Arrow diagonal /></a>
          </div>
        </section>
        <ImageReveal className="panorama"><img src={media('panoramica.webp')} width="1920" height="368" alt="Vista panorámica del salón de Avenida" loading="lazy" /></ImageReveal>
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
      {menuOpen && <button className="menu-backdrop" type="button" aria-label="Cerrar menú de rubros" onClick={() => setMenuOpen(false)} />}
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
