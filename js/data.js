const LUXE_DEFAULT_DATA = {
  admin: {
    username: "admin",
    password: "admin123"
  },
  users: [
    {
      id: "usr-1",
      name: "María Gómez",
      email: "maria.gomez@email.com",
      password: "user123",
      phone: "+57 310 987 6543",
      address: "Calle 10 #14-25, Florencia, Caquetá"
    }
  ],
  currentUser: null,
  settings: {
    phone: "+57 300 123 4567",
    email: "atelier@luxevault.co",
    address: "Calle de la Alhaja, Centro Histórico, Florencia, Caquetá",
    hoursMonFri: "09:00 - 19:00",
    hoursSatSun: "10:00 - 16:00"
  },
  products: [
    {
      id: "prod-1",
      name: "The Aurum Band",
      category: "rings",
      price: 9800000,
      originalPrice: null,
      featured: true,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuASi_E2EAR_BQQuvZJwc3b153KYwZMh5jnzcjdULh8kq9deC7hSAUSv8TU_jMZK-ubztnwTXlma3CwXA3JwYko_fsCp6JZrUG515z8OlckeSTi9Hz0edT5weR7QjD5YOP6pmfm6sFCti7IHDKy8DKCIT6lWXyDApCT57aLXEojVSEJtLhtr_-8T2jzMAp2kg6x9VZUE1ycmwMmlRXUvB4nPlB4jgbyB_Xkp1AqOPM5Qil-9F8t7DQU5TqiLXazedQeIwPRpQAXMfTSw",
      alt: "Alta Joyería Aurum Band",
      description: "Banda de oro macizo esculpida a mano con precisión de alta joyería fina."
    },
    {
      id: "prod-2",
      name: "Argolla Etérea",
      category: "earrings",
      price: 7200000,
      originalPrice: null,
      featured: false,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7DOszx27nq9egf30rQC8BJUH_9ZXe41rOz-52KKC-8xttoVJUkE5XQN7fXJlGSlvQ7PWih2HBf9EFJNKqEiXfpbeX5xNtaIfeo8NYoUa8EdSK-RJY90jFL2ujNgXByHeBdeB0OUJ_qFOX641tRWAVqN9Pk5jGeeUi6Ge2FuJXNiH0IUAplvINDTNkly-LdvWQMAOLKJttYDOlxF2zUUHzYl5LQW_WlLnrsuktFbgxcHXU6EmXerLo9avPCl7eWXZm_j7VunPwZdbm",
      alt: "Argolla Etérea Escultórica",
      description: "Pendientes de argolla fluida de diseño minimalista que capturan la luz de forma suave."
    },
    {
      id: "prod-4",
      name: "Arco Vértice",
      category: "earrings",
      price: 3800000,
      originalPrice: null,
      featured: false,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAKUIcCxYu6l7sGHzUv2K1WxsW8CvEuDRr1XglQzsdwO7Wu8YYEpbXn8Yr4gN7a1VxBDi8Jcw2EybVi2XIoGqfbu2GJGcJjgLAzxqP_wffVWYyLp7vutCmJ0D9QldJ_hmxl70eeqsMyYYoof_dhQ8THISxucnUXtKuE_zTPLBCNClXTB1toRVEmuzijv2aNYpuIkxVkKJznQJ_PT2WA17I0-M428j9fRFXHhNELeZu5C3IJiNGwfHN4f3vwVDcWGHQYV_M98af9XpdA",
      alt: "Pendientes geométricos",
      description: "Pendientes geométricos de corte arquitectónico pulidos a espejo."
    },
    {
      id: "prod-5",
      name: "Brazalete Forjado",
      category: "bracelets",
      price: 16400000,
      originalPrice: null,
      featured: false,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAUOr5DHvg2JmHW6f3uDeI-s_HIXekyjpZxkIVGEopV3fNJhlVudtARoFhDUkLV-tnwkMPz9T6dXt9RXBwVkozuZkzshedcZDdUiKkYCKAV2T7UFaAddo4QYu35eSguCa6T0zaykMXHDfVWzuyWiTBiNSx5ccLfQXmp8_kPgwtNdCn6u9wzk-tvFn5kCoKI7qzq7h8Ju8r5xW5gmNwB7PTsnQu6g1ATLnmXi05X2QQBp8pHDGgueUmcP44IvlOUsdMh7KLVSb37DoHN",
      alt: "Brazalete de oro cepillado",
      description: "Brazalete de oro cepillado con textura artesanal forjada a mano."
    },
    {
      id: "prod-6",
      name: "Anillo Gala Solitario",
      category: "rings",
      price: 49600000,
      originalPrice: 66000000,
      featured: true,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDe76x9o5khy_axAQQiBA38FiC0KP3TDsWKdfsuebOiAQhLKXhLw0DzrSm8uNCEMxH1LdIIqx56toIabnfj6rXG1yxE34foxcYLgQsVuR9ZOyXAywXe5AObYB0e58ilnqXmHP8k4Iy61M0Ie2pTVti1mlMY7lhT85bG9lJCLTskIBjVmo9DK_3IhhFsDjJZny4DIxMuf-fQCNrZpCpxgk4wOTb7xY_rkQM-j5aBfooSPAcv0WnyGe8iyAeyi6jv7jNZOmaGOY7UB_HW",
      alt: "Anillo con diamante de corte esmeralda",
      description: "Anillo con diamante de corte esmeralda de archivo engastado a mano."
    }
  ],
  promotions: {
    hero: {
      badge: "Temporada Veuve Clicquot",
      title: "La Gala Solitario",
      desc: "Experimente un 25% de refinamiento en todas las piezas de compromiso de firma durante el solsticio.",
      price: 49600000,
      originalPrice: 66000000,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDe76x9o5khy_axAQQiBA38FiC0KP3TDsWKdfsuebOiAQhLKXhLw0DzrSm8uNCEMxH1LdIIqx56toIabnfj6rXG1yxE34foxcYLgQsVuR9ZOyXAywXe5AObYB0e58ilnqXmHP8k4Iy61M0Ie2pTVti1mlMY7lhT85bG9lJCLTskIBjVmo9DK_3IhhFsDjJZny4DIxMuf-fQCNrZpCpxgk4wOTb7xY_rkQM-j5aBfooSPAcv0WnyGe8iyAeyi6jv7jNZOmaGOY7UB_HW"
    },
    items: [
      {
        id: "promo-1",
        collection: "Colección Aureliana",
        title: "Argollas Medianoche",
        price: 3400000,
        originalPrice: 4800000,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCb8TREuFSkEKk1Sxzm-EwN_guS-0VoCk5bJcVvtdBiIKLlDVGjEHJt-T1Vrri96z_RFAnyjQqU77U3ZyLMTGbLw4Wp89HdMnTmCpSGUnFlTcwfuTOvirOa3Zw5j8ZWQwZlU6_wCs-4hokR7ktFrbyOdj1R9uhRN3d8zQGJEfcCwMYBe3A-iX0QU1Rmqh9PgpytkbmD4rZBNPpNnCiI9qIAMBMtXPjT1vB3UBgnU3ceSgHnsrNIjDoB2awX9E_eBWWfkZ55Btcz5-Jr"
      },
      {
        id: "promo-2",
        collection: "Serie Costera",
        title: "Deriva Cerúlea",
        price: 12400000,
        originalPrice: 18000000,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtexHQzP3txmEfYxmo0n8QAy6xwlyL_C3aCrLIIbNybN82qtWGns0Hqxer_orblfTZo0I_7y4v6su9HKdlioUy3For4zTuJXzeczQqau0hPykXWcwYEVbU34gPIZmLCirrO1d7Kxhe-Rsr19PF507iIAHf3tXZilnLIeXihFdZGqjDBY9zqxR4WAvEmq7_13HTx0gA54rz4ysft515eRk_f3PXCVEME4zL6QJLxyOTvsE0EUxdsdJYfnclmdnId_4ndkQwc2N3KeOc"
      }
    ]
  },
  recommendations: [
    {
      id: "rec-1",
      style: "minimalist",
      title: "Brazalete Eos",
      badge: "Nueva Colección",
      price: 9600000,
      featured: true,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLMj89H7L6S4mhgoQ8LZYBtpzPqg7txMBN3mQ6AD9lXHnjbbYmsxWAbnUkIiPm1FKBjOzvvShqknABDf5LBIv-u7YiKiV61OVPGRBjzRMgQF9kny_mZHFOlZukrscoYBRBqxwZzm-LNF_djG6rsmM5yhsJiXX4uE0zHdXudgXo3g0-pYUMnf6mQ9SWOMGlnKIqhJx3StNqmxCXavF-fUYJioAfw_L97X95oG0mhfFNuw0aYcidk0lBuCFyofiyXiO1aGC39y3tLwUA"
    },
    {
      id: "rec-2",
      style: "minimalist",
      title: "Argollas Martilladas",
      price: 3400000,
      featured: false,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlDRD62jewFrcqyhMCDvKLkDoIfYfljeOSDbHAogYtMExkw94PjdlsoDfCPjz-zZhdSNeMvDoe4qt-nEP-aZ2tONHsCHzzUHa1u20pVLwT2Rf6aqeCzegDhEHhNW9qPTztQPHj8QFSNaJnFKPY9OWBmNY68VbFGEMvoc8cykFjl_pha-trVSILx1BSxtf_-bSZKgJcyXnlnWJr06e-BHsa0_vUJuYYlnO04bCt-MXlxS3Lj9hciqJy1Igbgj6dTMwAunNhctNA_u2V"
    },
    {
      id: "rec-4",
      style: "heritage",
      title: "Anillo Herencia Solaris",
      badge: "Colección Archivo",
      price: 20800000,
      featured: true,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuASi_E2EAR_BQQuvZJwc3b153KYwZMh5jnzcjdULh8kq9deC7hSAUSv8TU_jMZK-ubztnwTXlma3CwXA3JwYko_fsCp6JZrUG515z8OlckeSTi9Hz0edT5weR7QjD5YOP6pmfm6sFCti7IHDKy8DKCIT6lWXyDApCT57aLXEojVSEJtLhtr_-8T2jzMAp2kg6x9VZUE1ycmwMmlRXUvB4nPlB4jgbyB_Xkp1AqOPM5Qil-9F8t7DQU5TqiLXazedQeIwPRpQAXMfTSw"
    },
    {
      id: "rec-5",
      style: "artdeco",
      title: "Banda Esmeralda Geométrica",
      badge: "Edición Limitada",
      price: 27200000,
      featured: true,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDe76x9o5khy_axAQQiBA38FiC0KP3TDsWKdfsuebOiAQhLKXhLw0DzrSm8uNCEMxH1LdIIqx56toIabnfj6rXG1yxE34foxcYLgQsVuR9ZOyXAywXe5AObYB0e58ilnqXmHP8k4Iy61M0Ie2pTVti1mlMY7lhT85bG9lJCLTskIBjVmo9DK_3IhhFsDjJZny4DIxMuf-fQCNrZpCpxgk4wOTb7xY_rkQM-j5aBfooSPAcv0WnyGe8iyAeyi6jv7jNZOmaGOY7UB_HW"
    }
  ],
  reviews: [
    {
      id: "rev-1",
      name: "Eleanor V.",
      rating: 5,
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGU6suKB7GIVdCepb_SE-ADffVu28YBr-sWk6WEdSsLv69Apw1DsQVCL9Eder6dXjUtTBvz73GTPVSX3xTePs0nynWd5BRAmhg1-7QMjKpzxMqNOinC0TuprbgRZ-vCBdzSQJGdeOF5FRUQFqmm8jS8Y2ffTeAuHuu0jTzq4IIwmX90fdfSC1B7Pgox2HXJBbIurBvmlL2OVaSQAiizkvlA3Bo5OGz6okkqgqvqF4NxHQ6RlYuifIAlrduB8sxDxDQX4wcuxJcnfTO",
      quote: '"La artesanía es diferente a todo lo que he encontrado en las tiendas tradicionales. Se siente personal, de calidad y atemporal."',
      purchase: "Anillo Solaris",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuASi_E2EAR_BQQuvZJwc3b153KYwZMh5jnzcjdULh8kq9deC7hSAUSv8TU_jMZK-ubztnwTXlma3CwXA3JwYko_fsCp6JZrUG515z8OlckeSTi9Hz0edT5weR7QjD5YOP6pmfm6sFCti7IHDKy8DKCIT6lWXyDApCT57aLXEojVSEJtLhtr_-8T2jzMAp2kg6x9VZUE1ycmwMmlRXUvB4nPlB4jgbyB_Xkp1AqOPM5Qil-9F8t7DQU5TqiLXazedQeIwPRpQAXMfTSw"
    },
    {
      id: "rev-2",
      name: "Julian M.",
      rating: 5,
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAsvch9kCdV5g_PCRBZNR91v8NxL6oaSSBsubmS6wuRYO0Ls7zJuba0ECaQKRGN9s0ZM6EIx36uaVfVPU_y2uEx98LHXa7xPKfbbt9Sb8OGTqKx9kezF1IitAgW1kGIYOeG9EzqZkc5hfK1l3Opx54It181AOT4h5UHZfHcTdVFbdpUS6UwhnlOJREIVy-rxM0N9IZUV5m6LISUXVVQ4eGHJyS863WabsNOppkXGbp_PIfDzlKezQvBdG1BDpCrWdkR8YEwNprwpuow",
      quote: '"Compré el brazalete para mi aniversario. El empaque fue tan impresionante como la pieza misma."',
      purchase: "Brazalete Forjado",
      image: null
    },
    {
      id: "rev-3",
      name: "Martha S.",
      rating: 5,
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTgLRFCfOEjI1rMH1U1cl9zxG51KrZoD_pd8VFC42bL4z6vEJbF0EzHarg0jRJt7HhTtywzid4NCduwC6N67P55dl6YoMXc8Q-0OvmTDwDaYe7gPzdvjB4j48BOkDUWw6Ac9csu5APMVWR3wwiPGfKs2X0_CMpBkXpAZXoZHUfOhR9OPlehHN8cOLisfwL9bB_I0lMA8DHXMkXY5_oFSOAvR_z4glsNJXmp8lp-LGWig0dzsW2Hqnww6a1vN2CYq6g7cpyQJTHuQi5",
      quote: '"El servicio de conserjería me ayudó a elegir las piedras perfectas. Verdaderamente una experiencia de clase mundial."',
      purchase: "Pieza Personalizada",
      image: null
    }
  ],
  complaints: [
    {
      id: "msg-1",
      date: "2026-07-27 14:20",
      name: "Carolina Mendoza",
      subject: "Consulta de producto",
      message: "Deseo solicitar una asesoría privada para un anillo de compromiso personalizado.",
      status: "Pendiente"
    },
    {
      id: "msg-2",
      date: "2026-07-26 10:15",
      name: "Felipe Restrepo",
      subject: "Sugerencia",
      message: "Me encantaría ver opciones de grabado personalizado directamente en la vista previa del carrito.",
      status: "Resuelto"
    }
  ],
  orders: [
    {
      id: "ord-001",
      date: "2026-07-26 18:45",
      name: "Valentina Ruiz",
      email: "valentina.ruiz@email.com",
      phone: "+57 312 456 7890",
      address: "Calle 15 #8-42, Florencia, Caquetá",
      items: [
        { title: "The Aurum Band", price: 9800000, quantity: 1 }
      ],
      total: 9800000,
      status: "Pendiente",
      notificationSent: false
    },
    {
      id: "ord-002",
      date: "2026-07-25 11:20",
      name: "Andrés Mora",
      email: "andres.mora@correo.co",
      phone: "+57 301 987 6543",
      address: "Carrera 5 #12-30, Bogotá",
      items: [
        { title: "Anillo Gala Solitario", price: 49600000, quantity: 1 }
      ],
      total: 49600000,
      status: "Confirmado",
      notificationSent: true
    }
  ]
};

// Format currency in COP helper
function formatCOP(amount) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(amount);
}

// Initialize LUXE_DATA with localStorage support
let LUXE_DATA = JSON.parse(localStorage.getItem('LUXE_VAULT_STATE')) || JSON.parse(JSON.stringify(LUXE_DEFAULT_DATA));
