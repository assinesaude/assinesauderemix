import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const services = [
  { image: '/Quiroprata.png', title: 'Quiroprata' },
  { image: '/psicologia.png', title: 'Psicologia' },
  { image: '/fonoaudiologa.png', title: 'Fonoaudiologia' },
  { image: '/Fisioterapeuta.png', title: 'Fisioterapia' },
  { image: '/Enfermeiro.png', title: 'Enfermagem' },
  { image: '/Dentista.png', title: 'Odontologia' },
  { image: '/Biomédico.png', title: 'Biomedicina' },
  { image: '/farmacia.png', title: 'Farmácia' },
  { image: '/Médico.png', title: 'Medicina' },
  { image: '/Nutricionista.png', title: 'Nutrição' },
  { image: '/Psicólogo.png', title: 'Psicologia Clínica' },
];

export function ServicesCarousel() {
  const [offset, setOffset] = useState(0);

  const itemsPerView = 6;
  const totalItems = services.length;

  const goToNext = () => {
    setOffset((prev) => prev + 1);
  };

  const goToPrevious = () => {
    setOffset((prev) => prev - 1);
  };

  const getVisibleServices = () => {
    const items = [];
    for (let i = 0; i < itemsPerView; i++) {
      const index = ((offset + i) % totalItems + totalItems) % totalItems;
      items.push({ ...services[index], key: `${services[index].title}-${offset + i}` });
    }
    return items;
  };

  const visibleServices = getVisibleServices();

  return (
    <section className="py-16 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative">
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white hover:bg-slate-50 text-slate-800 rounded-full p-3 shadow-lg border border-slate-200 transition-all hover:scale-110"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white hover:bg-slate-50 text-slate-800 rounded-full p-3 shadow-lg border border-slate-200 transition-all hover:scale-110"
            aria-label="Próximo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="overflow-hidden">
            <div className="flex gap-8 justify-center transition-all duration-500">
              {visibleServices.map((service) => (
                <div
                  key={service.key}
                  className="flex flex-col items-center group cursor-pointer flex-shrink-0"
                  style={{ width: '140px' }}
                >
                  <div className="w-16 h-16 mb-4 relative overflow-hidden rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center group-hover:shadow-xl transition-all duration-300">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <p className="text-center text-sm font-medium text-slate-700 group-hover:text-brand-purple-600 transition-colors">
                    {service.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
