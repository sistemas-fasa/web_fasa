export const site = {
  origin: 'https://ferreteriaavenida.com.ar',
  name: 'Ferretería Avenida',
  legalName: 'Ferretería Avenida S.A.',
  title: 'Ferretería Avenida | Puerto Rico y Capioví, Misiones',
  description: 'Ferretería y materiales de construcción, con locales en Puerto Rico y Capioví y entregas a distintos puntos de Misiones. Consultá nuestros rubros.',
  delivery: 'Realizamos entregas a distintos puntos de Misiones. Consultanos por la cobertura, los plazos y las condiciones de entrega para tu localidad.',
  address: 'Facundo Quiroga 298',
  city: 'Puerto Rico',
  region: 'Misiones',
  telephone: '+543743420344',
  whatsapp: 'https://wa.me/5493743400209',
  email: 'ventas@ferreteriaavenida.com.ar',
  portal: 'https://ventas.ferreteriaavenida.com.ar/',
  maps: 'https://maps.app.goo.gl/WGwjqiw6ojnehB89A',
  instagram: 'https://www.instagram.com/avenida.fasa/',
};

export const branches = [
  {
    id: 'negocio',
    name: 'Casa central · Puerto Rico',
    city: site.city,
    address: site.address,
    telephone: site.telephone,
    phoneLabel: '(03743) 420344',
    maps: site.maps,
  },
  {
    id: 'sucursal-capiovi',
    name: 'Sucursal Capioví',
    city: 'Capioví',
    address: 'Av. Los Próceres',
    telephone: '+543743476743',
    phoneLabel: '(03743) 47-6743',
    maps: 'https://maps.app.goo.gl/gkpBxn3uHG7arnFp8',
  },
];

export const openingHoursSpecification = [
  { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '07:15', closes: '12:00' },
  { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '15:00', closes: '19:00' },
  { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '07:15', closes: '12:00' },
];

export const categoryPages = [
  {
    slug: 'construccion',
    name: 'Construcción',
    title: 'Hierros, chapas y materiales en Misiones | Ferretería Avenida',
    description: 'Hierros, chapas y materiales de construcción en Ferretería Avenida. Locales en Puerto Rico y Capioví y entregas a distintos puntos de Misiones. Consultá por tu localidad.',
    heading: 'Hierros, chapas y materiales de construcción en Misiones',
    introduction: 'En Ferretería Avenida podés consultar por hierros, chapas y materiales para tu obra. Desde nuestro local en Puerto Rico, Misiones, te acompañamos en cada etapa. Acercate con tu lista o escribinos para revisar las medidas y presentaciones que necesitás.',
    guidance: 'Para consultar por hierros o chapas, indicá el tipo de material, las medidas y la cantidad. Si tenés una lista preparada para la obra, podés enviarla por WhatsApp.',
    image: 'construccion',
  },
  {
    slug: 'terminaciones',
    name: 'Terminaciones',
    title: 'Cerámicas, sanitarios y pinturas en Misiones | Avenida',
    description: 'Cerámicas, sanitarios y pinturas para renovar tus ambientes. Ferretería Avenida, con locales en Puerto Rico y Capioví y entregas a distintos puntos de Misiones.',
    heading: 'Cerámicas, sanitarios y pinturas en Misiones',
    introduction: 'Consultá por cerámicas, sanitarios y pinturas en Ferretería Avenida, Puerto Rico, Misiones. Podés acercarte al local para ver opciones para tu baño, cocina y otros ambientes de la casa.',
    guidance: 'Compartí las medidas del ambiente y el uso de la superficie. Para pinturas, indicá si la aplicación es interior o exterior y sobre qué material vas a pintar. Para sanitarios, incluí las medidas y conexiones disponibles.',
    image: 'terminaciones',
  },
  {
    slug: 'instalaciones',
    name: 'Instalaciones',
    title: 'Materiales para instalaciones en Misiones | Avenida',
    description: 'Consultá materiales para instalaciones, conexiones y griferías en Ferretería Avenida. Locales en Puerto Rico y Capioví y entregas a distintos puntos de Misiones.',
    heading: 'Materiales para instalaciones en Misiones',
    introduction: 'En Ferretería Avenida podés consultar por materiales eléctricos y las líneas disponibles para conexiones de agua y griferías. Estamos en Facundo Quiroga 298, Puerto Rico, Misiones.',
    guidance: 'Para identificar una conexión, enviá una foto junto con sus medidas y el material. En una consulta por materiales eléctricos, incluí el listado definido por el profesional a cargo de la instalación.',
    image: 'instalaciones',
  },
  {
    slug: 'herramientas',
    name: 'Herramientas',
    title: 'Herramientas Milwaukee y Hamilton en Misiones | Avenida',
    description: 'Herramientas Milwaukee y Hamilton, manuales y eléctricas en Ferretería Avenida. Estamos en Puerto Rico y Capioví y entregamos a distintos puntos de Misiones.',
    heading: 'Herramientas Milwaukee y Hamilton en Misiones',
    introduction: 'Consultá por herramientas Milwaukee y Hamilton en Ferretería Avenida. Encontrá opciones manuales, eléctricas y accesorios para la obra, el taller y los trabajos de casa. Nuestro local está en Puerto Rico, Misiones.',
    guidance: 'Contanos qué trabajo necesitás realizar y, si ya tenés una herramienta, indicá la marca y el modelo. Para accesorios y equipos a batería, consultá la compatibilidad antes de elegir.',
    image: 'milwaukee-kit',
  },
];

export const questions = [
  {
    question: '¿Realizan entregas fuera de Puerto Rico?',
    answer: site.delivery,
  },
  {
    question: '¿Cuál es el horario de atención?',
    answer: 'En Puerto Rico y Capioví atendemos de lunes a viernes de 7:15 a 12:00 y de 15:00 a 19:00. Los sábados de 7:15 a 12:00. Para feriados, consultá el horario con el local.',
  },
  {
    question: '¿Dónde queda Ferretería Avenida?',
    answer: 'Ferretería Avenida S.A. tiene su casa central en Facundo Quiroga 298, Puerto Rico, y una sucursal en Av. Los Próceres, Capioví. Ambos locales están en Misiones, Argentina.',
  },
  {
    question: '¿Qué productos puedo consultar?',
    answer: 'Podés consultar por hierros, chapas, materiales de construcción, cerámicas, sanitarios, pinturas, electricidad y herramientas. Las marcas de herramientas incluyen Milwaukee y Hamilton. Consultá modelos, precios y disponibilidad con el equipo.',
  },
  {
    question: '¿Cómo hago una consulta o pido un presupuesto?',
    answer: 'Escribinos por WhatsApp al 3743-400209 o acercate al local con la lista de materiales, las medidas y las cantidades. También podés llamar al (03743) 420344 o escribir a ventas@ferreteriaavenida.com.ar.',
  },
  {
    question: '¿Cómo ingreso al Portal de Ventas?',
    answer: 'El Portal de Ventas está en ventas.ferreteriaavenida.com.ar. Ingresá con tu cuenta. Si todavía no tenés acceso, desde la pantalla de ingreso podés solicitar el alta.',
  },
];
