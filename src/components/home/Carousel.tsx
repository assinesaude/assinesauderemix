import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface CarouselItem {
  id: string;
  media_type: string;
  media_url: string;
  caption: string | null;
  order_position: number;
}

export function Carousel() {
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    fetchCarouselItems();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || items.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, items.length]);

  const fetchCarouselItems = async () => {
    try {
      const { data, error } = await supabase
        .from('carousel_items')
        .select('*')
        .eq('is_active', true)
        .order('order_position');

      if (error) {
        console.error('Error fetching carousel items:', error);
        return;
      }

      if (data) {
        setItems(data);
      }
    } catch (error) {
      console.error('Failed to fetch carousel items:', error);
    }
  };

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  if (items.length === 0) {
    return (
      <div className="relative w-full h-[600px] bg-gradient-to-br from-slate-50 via-brand-purple-50 to-brand-green-50 flex items-center justify-center">
        <div className="text-center max-w-3xl px-6">
          <h2 className="text-5xl font-serif text-slate-800 mb-6 leading-tight">Bem-vindo ao AssineSaúde</h2>
          <p className="text-xl text-slate-600 leading-relaxed">Conectando profissionais de saúde com pacientes através de uma plataforma inteligente e segura</p>
        </div>
      </div>
    );
  }

  const currentItem = items[currentIndex];

  return (
    <div className="relative w-full h-[600px] overflow-hidden group">
      <div className="absolute inset-0">
        {currentItem.media_type === 'video' ? (
          <video
            src={currentItem.media_url}
            autoPlay
            muted
            loop
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={currentItem.media_url}
            alt={currentItem.caption || 'Carousel image'}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
      </div>

      {currentItem.caption && (
        <div className="absolute bottom-0 left-0 right-0 p-16">
          <p className="text-white text-3xl font-light text-center max-w-5xl mx-auto leading-relaxed">
            {currentItem.caption}
          </p>
        </div>
      )}

      <button
        onClick={goToPrevious}
        className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white p-4 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
      >
        <ChevronLeft className="w-6 h-6 text-brand-purple-700" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white p-4 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
      >
        <ChevronRight className="w-6 h-6 text-brand-purple-700" />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white w-12'
                : 'bg-white/60 hover:bg-white/80 w-2'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
