document.addEventListener('DOMContentLoaded', function () {
    initializeAOS();
    initializeNavbar();
    initializeSmoothScroll();
    initializeThemeToggle();
    initializeQuotationCalculator();
    initializeLazyLoadVideo();
    initializeInfoAlerts();
    initializeScrollToTop();
    initializeProjectCarousel();

    // Agregar animación hover para agrandar el card
    const cards = document.querySelectorAll('.hover-card');
    cards.forEach(card => {
        card.addEventListener('mouseover', function () {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s';
        });
        card.addEventListener('mouseout', function () {
            this.style.transform = 'scale(1)';
        });
    });

    // Manejar clics en los íconos de información
    const infoBtns = document.querySelectorAll('.info-btn');
    infoBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const type = this.getAttribute('data-type');
            let title, text, examples;
            switch (type) {
                case 'regularizacion':
                    title = '¿Qué es la Regularización de Viviendas?';
                    text = 'La regularización de viviendas es un proceso para legalizar construcciones que no cumplen con las normativas vigentes.';
                    examples = 'Ejemplo: Regularización de una casa antigua para venderla.';
                    break;
                case 'subdivision':
                    title = '¿Qué es la Subdivisión de Terrenos y Loteos?';
                    text = 'La subdivisión de terrenos y loteos implica dividir una propiedad en lotes más pequeños para desarrollo o venta.';
                    examples = 'Ejemplo: Dividir un terreno grande en lotes para construir casas.';
                    break;
                case 'informes':
                    title = '¿Qué son los Informes Previos y Factibilidades?';
                    text = 'Los informes previos y factibilidades evalúan la viabilidad de un proyecto antes de su ejecución.';
                    examples = 'Ejemplo: Estudio de factibilidad para construir un edificio en un terreno específico.';
                    break;
                // Agrega más casos aquí
            }
            showAlert(title, text, examples);
        });
    });

    // Agregar evento de clic al botón en la modal de la calculadora de costos
    const requestMeetingBtn = document.querySelector('#request-meeting-btn');
    if (requestMeetingBtn) {
        requestMeetingBtn.addEventListener('click', function () {
            const clientName = prompt("Por favor, ingresa tu nombre:");
            if (clientName) {
                const selectedServices = [];
                let totalCost = 0;
                let totalTime = 0;

                document.querySelectorAll('.form-check-input').forEach(checkbox => {
                    const field = checkbox.id.replace('accept-', '');
                    if (checkbox.checked) {
                        const description = descriptions[field];
                        selectedServices.push(`${description.title}: $${description.cost} - ${description.time} días`);
                        totalCost += description.cost;
                        totalTime += description.time;
                    }
                });

                const message = `Hola, soy ${clientName}. Necesito los siguientes servicios:\n${selectedServices.join('\n')}\nTotal: $${totalCost}\nTiempo Estimado: ${totalTime} días\nPor favor, recuerda exportar el presupuesto. ¿Cuándo tienes disponibilidad para una reunión?`;
                const whatsappURL = `https://wa.me/+56957284268?text=${encodeURIComponent(message)}`;
                window.open(whatsappURL, '_blank');
            }
        });
    }

    // Agregar eventos de clic a los botones de exportación
    document.querySelector('#export-pdf-btn').addEventListener('click', () => {
        exportToPDF();
        showExportSuccessAlert('PDF');
    });
    document.querySelector('#export-excel-btn').addEventListener('click', () => {
        exportToExcel();
        showExportSuccessAlert('Excel');
    });

    // Agregar evento de clic al botón de cerrar en el modal
    const closeModalBtn = document.querySelector('#closeModalBtn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function () {
            const modal = document.querySelector('#quotationModal');
            modal.classList.remove('show');
            modal.style.display = 'none';
        });
    }
});

function showAlert(title, text, examples) {
    const alertContainer = document.getElementById('alert-container');
    const alert = document.createElement('div');
    alert.className = 'alert alert-info';
    alert.innerHTML = `
        <strong>${title}</strong><br>
        ${text}<br>
        <strong>Ejemplo:</strong> ${examples}
    `;
    alertContainer.appendChild(alert);

    setTimeout(() => {
        alert.classList.add('fade-out');
        setTimeout(() => {
            alert.remove();
        }, 3000);
    }, 5000);
}

function initializeAOS() {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
        easing: 'ease-in-out'
    });
}

function initializeNavbar() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        updateActiveNavLink();
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show');
            }
        });
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            const headerOffset = 70;
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });
}

function initializeThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const sunIcon = themeToggle.querySelector('.bi-sun-fill');
    const moonIcon = themeToggle.querySelector('.bi-moon-fill');

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');

            const isDarkTheme = document.body.classList.contains('dark-theme');
            localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');

            sunIcon.style.display = isDarkTheme ? 'none' : 'inline';
            moonIcon.style.display = isDarkTheme ? 'inline' : 'none';
        });
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'inline';
    }
}

function initializeQuotationCalculator() {
    const descriptions = {
        regularizacion: {
            title: "Regularización de Viviendas",
            desc: "Servicio de regularización de viviendas según la Ley del Mono.",
            cost: 400000,
            time: 30
        },
        subdivision: {
            title: "Subdivisión de Terrenos y Loteos",
            desc: "Servicio de subdivisión de terrenos y loteos.",
            cost: 3000000,
            time: 90
        },
        informes: {
            title: "Informes Previos y Factibilidades",
            desc: "Elaboración de informes previos y estudios de factibilidad.",
            cost: 150000,
            time: 14
        },
        patentes: {
            title: "Regularización de Patentes Comerciales",
            desc: "Servicio de regularización de patentes comerciales.",
            cost: 300000,
            time: 21
        },
        modelado: {
            title: "Diseño y Modelado 3D",
            desc: "Servicio de diseño y modelado 3D.",
            cost: 100000,
            time: 14
        },
        permisos: {
            title: "Tramitación de Permisos de Edificación",
            desc: "Servicio de tramitación de permisos de edificación.",
            cost: 500000,
            time: 90
        },
        planos: {
            title: "Planos Express para Construcciones Simples",
            desc: "Servicio de planos express para construcciones simples.",
            cost: 200000,
            time: 14
        },
        instalaciones: {
            title: "Regularización de Instalaciones Sanitarias y Agua Potable",
            desc: "Servicio de regularización de instalaciones sanitarias y agua potable.",
            cost: 300000,
            time: 28
        },
        ito: {
            title: "Inspección Técnica de Obras (ITO)",
            desc: "Servicio de inspección técnica de obras.",
            cost: 500000,
            time: 30
        },
        tiny: {
            title: "Construcción de Tiny Houses",
            desc: "Servicio de construcción de tiny houses.",
            cost: 1000000,
            time: 60
        },
        espacios: {
            title: "Diseño y Consultoría para Espacios Pequeños",
            desc: "Servicio de diseño y consultoría para espacios pequeños.",
            cost: 300000,
            time: 30
        },
        sostenible: {
            title: "Consultoría en Construcción Sostenible",
            desc: "Servicio de consultoría en construcción sostenible.",
            cost: 500000,
            time: 90
        },
        reformas: {
            title: "Reformas Rápidas o Ampliaciones Pequeñas",
            desc: "Servicio de reformas rápidas o ampliaciones pequeñas.",
            cost: 500000,
            time: 30
        }
    };

    const formData = {
        regularizacion: 0,
        subdivision: 0,
        informes: 0,
        patentes: 0,
        modelado: 0,
        permisos: 0,
        planos: 0,
        instalaciones: 0,
        ito: 0,
        tiny: 0,
        espacios: 0,
        sostenible: 0,
        reformas: 0
    };

    const totalCost = document.querySelector('#total-cost');
    const totalTime = document.querySelector('#total-time');

    function calculateTotal() {
        let cost = 0;
        let time = 0;

        Object.entries(formData).forEach(([key, value]) => {
            if (descriptions[key]) {
                cost += value * descriptions[key].cost;
                time += value * descriptions[key].time;
            }
        });

        totalCost.textContent = cost;
        totalTime.textContent = time;

        // Show recommendation based on total
        if (cost > 5000000) {
            Swal.fire({
                title: '¡Proyecto Complejo!',
                text: 'Tu proyecto parece bastante complejo. ¿Te gustaría programar una reunión para discutir los detalles?',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Programar Reunión',
                cancelButtonText: 'Seguir Cotizando'
            });
        }
    }

    function updateField(field, value) {
        formData[field] = parseInt(value) || 0;
        calculateTotal();
    }

    function showInfo(type) {
        Swal.fire({
            title: descriptions[type].title,
            html: `
              <p>${descriptions[type].desc}</p>
              <p class="mt-3"><strong>Ejemplo:</strong><br>${descriptions[type].examples}</p>
            `,
            icon: 'info',
            confirmButtonText: 'Entendido'
        });
    }

    document.querySelectorAll('.modal input[type="number"]').forEach(input => {
        input.addEventListener('input', (e) => {
            updateField(e.target.id, e.target.value);
        });
    });

    document.querySelectorAll('.info-btn').forEach(button => {
        button.addEventListener('click', () => {
            const type = button.dataset.type;
            showInfo(type);
        });
    });

    // Manejar checkboxes para aceptar servicios
    document.querySelectorAll('.form-check-input').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const field = e.target.id.replace('accept-', '');
            if (e.target.checked) {
                formData[field] = 1;
            } else {
                formData[field] = 0;
            }
            calculateTotal();
        });
    });
}

function initializeLazyLoadVideo() {
    const lazyVideos = document.querySelectorAll('.hero-video.lazy, iframe[data-src]');

    const videoObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                video.src = video.dataset.src;
                video.classList.remove('lazy');
                observer.unobserve(video);
            }
        });
    });

    lazyVideos.forEach(video => videoObserver.observe(video));
}

function initializeInfoAlerts() {
    const descriptions = {
        regularizacion: {
            title: "Regularización de Viviendas",
            desc: "Servicio de regularización de viviendas según la Ley del Mono.",
            cost: 400000,
            time: 30
        },
        subdivision: {
            title: "Subdivisión de Terrenos y Loteos",
            desc: "Servicio de subdivisión de terrenos y loteos.",
            cost: 3000000,
            time: 90
        },
        informes: {
            title: "Informes Previos y Factibilidades",
            desc: "Elaboración de informes previos y estudios de factibilidad.",
            cost: 150000,
            time: 14
        },
        patentes: {
            title: "Regularización de Patentes Comerciales",
            desc: "Servicio de regularización de patentes comerciales.",
            cost: 300000,
            time: 21
        },
        modelado: {
            title: "Diseño y Modelado 3D",
            desc: "Servicio de diseño y modelado 3D.",
            cost: 100000,
            time: 14
        },
        permisos: {
            title: "Tramitación de Permisos de Edificación",
            desc: "Servicio de tramitación de permisos de edificación.",
            cost: 500000,
            time: 90
        },
        planos: {
            title: "Planos Express para Construcciones Simples",
            desc: "Servicio de planos express para construcciones simples.",
            cost: 200000,
            time: 14
        },
        instalaciones: {
            title: "Regularización de Instalaciones Sanitarias y Agua Potable",
            desc: "Servicio de regularización de instalaciones sanitarias y agua potable.",
            cost: 300000,
            time: 28
        },
        ito: {
            title: "Inspección Técnica de Obras (ITO)",
            desc: "Servicio de inspección técnica de obras.",
            cost: 500000,
            time: 30
        },
        tiny: {
            title: "Construcción de Tiny Houses",
            desc: "Servicio de construcción de tiny houses.",
            cost: 1000000,
            time: 60
        },
        espacios: {
            title: "Diseño y Consultoría para Espacios Pequeños",
            desc: "Servicio de diseño y consultoría para espacios pequeños.",
            cost: 300000,
            time: 30
        },
        sostenible: {
            title: "Consultoría en Construcción Sostenible",
            desc: "Servicio de consultoría en construcción sostenible.",
            cost: 500000,
            time: 90
        },
        reformas: {
            title: "Reformas Rápidas o Ampliaciones Pequeñas",
            desc: "Servicio de reformas rápidas o ampliaciones pequeñas.",
            cost: 500000,
            time: 30
        }
    };

    document.querySelectorAll('.info-btn').forEach(button => {
        button.addEventListener('click', () => {
            const type = button.dataset.type;
            Swal.fire({
                title: descriptions[type].title,
                html: `
                  <p>${descriptions[type].desc}</p>
                  <p class="mt-3"><strong>Ejemplo:</strong><br>${descriptions[type].examples}</p>
                `,
                icon: 'info',
                confirmButtonText: 'Entendido'
            });
        });
    });
}

function initializeScrollToTop() {
    const scrollToTopBtn = document.querySelector('.scroll-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function initializeProjectCarousel() {
    const projectCarousel = document.querySelector('#projectCarousel');
    const carousel = new bootstrap.Carousel(projectCarousel, {
        interval: 3000,
        wrap: true
    });
}

function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const totalCost = document.getElementById('total-cost').textContent;
    const totalTime = document.getElementById('total-time').textContent;

    const formData = {
        regularizacion: document.querySelector('#regularizacion').value,
        subdivision: document.querySelector('#subdivision').value,
        informes: document.querySelector('#informes').value,
        patentes: document.querySelector('#patentes').value,
        modelado: document.querySelector('#modelado').value,
        permisos: document.querySelector('#permisos').value,
        planos: document.querySelector('#planos').value,
        instalaciones: document.querySelector('#instalaciones').value,
        ito: document.querySelector('#ito').value,
        tiny: document.querySelector('#tiny').value,
        espacios: document.querySelector('#espacios').value,
        sostenible: document.querySelector('#sostenible').value,
        reformas: document.querySelector('#reformas').value
    };

    const descriptions = {
        regularizacion: {
            title: "Regularización de Viviendas",
            desc: "Servicio de regularización de viviendas según la Ley del Mono.",
            cost: 400000,
            time: 30
        },
        subdivision: {
            title: "Subdivisión de Terrenos y Loteos",
            desc: "Servicio de subdivisión de terrenos y loteos.",
            cost: 3000000,
            time: 90
        },
        informes: {
            title: "Informes Previos y Factibilidades",
            desc: "Elaboración de informes previos y estudios de factibilidad.",
            cost: 150000,
            time: 14
        },
        patentes: {
            title: "Regularización de Patentes Comerciales",
            desc: "Servicio de regularización de patentes comerciales.",
            cost: 300000,
            time: 21
        },
        modelado: {
            title: "Diseño y Modelado 3D",
            desc: "Servicio de diseño y modelado 3D.",
            cost: 100000,
            time: 14
        },
        permisos: {
            title: "Tramitación de Permisos de Edificación",
            desc: "Servicio de tramitación de permisos de edificación.",
            cost: 500000,
            time: 90
        },
        planos: {
            title: "Planos Express para Construcciones Simples",
            desc: "Servicio de planos express para construcciones simples.",
            cost: 200000,
            time: 14
        },
        instalaciones: {
            title: "Regularización de Instalaciones Sanitarias y Agua Potable",
            desc: "Servicio de regularización de instalaciones sanitarias y agua potable.",
            cost: 300000,
            time: 28
        },
        ito: {
            title: "Inspección Técnica de Obras (ITO)",
            desc: "Servicio de inspección técnica de obras.",
            cost: 500000,
            time: 30
        },
        tiny: {
            title: "Construcción de Tiny Houses",
            desc: "Servicio de construcción de tiny houses.",
            cost: 1000000,
            time: 60
        },
        espacios: {
            title: "Diseño y Consultoría para Espacios Pequeños",
            desc: "Servicio de diseño y consultoría para espacios pequeños.",
            cost: 300000,
            time: 30
        },
        sostenible: {
            title: "Consultoría en Construcción Sostenible",
            desc: "Servicio de consultoría en construcción sostenible.",
            cost: 500000,
            time: 90
        },
        reformas: {
            title: "Reformas Rápidas o Ampliaciones Pequeñas",
            desc: "Servicio de reformas rápidas o ampliaciones pequeñas.",
            cost: 500000,
            time: 30
        }
    };

    let yOffset = 10;

    doc.text('Cotización del Proyecto', 10, yOffset);
    yOffset += 10;

    Object.entries(formData).forEach(([key, value]) => {
        if (value > 0) {
            doc.text(`${descriptions[key].title}: ${value}`, 10, yOffset);
            yOffset += 10;
            doc.text(`Descripción: ${descriptions[key].desc}`, 10, yOffset);
            yOffset += 10;
            doc.text(`Costo: $${descriptions[key].cost * value}`, 10, yOffset);
            yOffset += 10;
            doc.text(`Tiempo: ${descriptions[key].time * value} días`, 10, yOffset);
            yOffset += 20;
        }
    });

    doc.text(`Costo Total: $${totalCost}`, 10, yOffset);
    yOffset += 10;
    doc.text(`Tiempo Estimado: ${totalTime} días`, 10, yOffset);

    doc.save('cotizacion.pdf');
}

function exportToExcel() {
    const totalCost = document.getElementById('total-cost').textContent;
    const totalTime = document.getElementById('total-time').textContent;

    const formData = {
        regularizacion: document.querySelector('#regularizacion').value,
        subdivision: document.querySelector('#subdivision').value,
        informes: document.querySelector('#informes').value,
        patentes: document.querySelector('#patentes').value,
        modelado: document.querySelector('#modelado').value,
        permisos: document.querySelector('#permisos').value,
        planos: document.querySelector('#planos').value,
        instalaciones: document.querySelector('#instalaciones').value,
        ito: document.querySelector('#ito').value,
        tiny: document.querySelector('#tiny').value,
        espacios: document.querySelector('#espacios').value,
        sostenible: document.querySelector('#sostenible').value,
        reformas: document.querySelector('#reformas').value
    };

    const descriptions = {
        regularizacion: {
            title: "Regularización de Viviendas",
            desc: "Servicio de regularización de viviendas según la Ley del Mono.",
            cost: 400000,
            time: 30
        },
        subdivision: {
            title: "Subdivisión de Terrenos y Loteos",
            desc: "Servicio de subdivisión de terrenos y loteos.",
            cost: 3000000,
            time: 90
        },
        informes: {
            title: "Informes Previos y Factibilidades",
            desc: "Elaboración de informes previos y estudios de factibilidad.",
            cost: 150000,
            time: 14
        },
        patentes: {
            title: "Regularización de Patentes Comerciales",
            desc: "Servicio de regularización de patentes comerciales.",
            cost: 300000,
            time: 21
        },
        modelado: {
            title: "Diseño y Modelado 3D",
            desc: "Servicio de diseño y modelado 3D.",
            cost: 100000,
            time: 14
        },
        permisos: {
            title: "Tramitación de Permisos de Edificación",
            desc: "Servicio de tramitación de permisos de edificación.",
            cost: 500000,
            time: 90
        },
        planos: {
            title: "Planos Express para Construcciones Simples",
            desc: "Servicio de planos express para construcciones simples.",
            cost: 200000,
            time: 14
        },
        instalaciones: {
            title: "Regularización de Instalaciones Sanitarias y Agua Potable",
            desc: "Servicio de regularización de instalaciones sanitarias y agua potable.",
            cost: 300000,
            time: 28
        },
        ito: {
            title: "Inspección Técnica de Obras (ITO)",
            desc: "Servicio de inspección técnica de obras.",
            cost: 500000,
            time: 30
        },
        tiny: {
            title: "Construcción de Tiny Houses",
            desc: "Servicio de construcción de tiny houses.",
            cost: 1000000,
            time: 60
        },
        espacios: {
            title: "Diseño y Consultoría para Espacios Pequeños",
            desc: "Servicio de diseño y consultoría para espacios pequeños.",
            cost: 300000,
            time: 30
        },
        sostenible: {
            title: "Consultoría en Construcción Sostenible",
            desc: "Servicio de consultoría en construcción sostenible.",
            cost: 500000,
            time: 90
        },
        reformas: {
            title: "Reformas Rápidas o Ampliaciones Pequeñas",
            desc: "Servicio de reformas rápidas o ampliaciones pequeñas.",
            cost: 500000,
            time: 30
        }
    };

    const data = [
        ['Cotización del Proyecto', '', '', ''],
        ['Servicio', 'Cantidad', 'Costo', 'Tiempo'],
    ];

    Object.entries(formData).forEach(([key, value]) => {
        if (value > 0) {
            data.push([
                descriptions[key].title,
                value,
                `$${descriptions[key].cost * value}`,
                `${descriptions[key].time * value} días`
            ]);
            data.push([descriptions[key].desc, '', '', '']);
        }
    });

    data.push(['', '', '', '']);
    data.push(['Costo Total', '', `$${totalCost}`, '']);
    data.push(['Tiempo Estimado', '', `${totalTime} días`, '']);

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Cotización');

    XLSX.writeFile(wb, 'cotizacion.xlsx');
}

function showExportSuccessAlert(format) {
    Swal.fire({
        title: '¡Éxito!',
        text: `El archivo ha sido exportado correctamente en formato ${format}.`,
        icon: 'success',
        confirmButtonText: 'Entendido'
    });
}
