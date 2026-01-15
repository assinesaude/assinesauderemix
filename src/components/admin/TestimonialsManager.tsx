import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Upload, Trash2, Plus, Save, X, Eye, EyeOff } from 'lucide-react';

interface Testimonial {
  id: string;
  user_id: string;
  user_type: string;
  content: string;
  photo_url: string | null;
  city: string | null;
  language_code: string;
  is_published: boolean;
  created_at: string;
  profiles?: {
    full_name: string;
  };
}

interface Country {
  id: string;
  name: string;
  code: string;
  language_code: string;
  domain: string | null;
}

interface Props {
  selectedCountry: Country | null;
}

export function TestimonialsManager({ selectedCountry }: Props) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    full_name: '',
    user_type: 'professional',
    content: '',
    photo_url: '',
    city: ''
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (selectedCountry) {
      fetchTestimonials();
    }
  }, [selectedCountry]);

  const fetchTestimonials = async () => {
    if (!selectedCountry) return;

    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .eq('language_code', selectedCountry.language_code)
        .order('created_at', { ascending: false});

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `testimonials/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);

      setNewTestimonial({ ...newTestimonial, photo_url: publicUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Erro ao fazer upload da imagem');
    } finally {
      setUploading(false);
    }
  };

  const handleAddTestimonial = async () => {
    if (!newTestimonial.full_name || !newTestimonial.content) {
      alert('Por favor, preencha o nome e o depoimento');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('full_name', newTestimonial.full_name)
        .maybeSingle();

      let userId = user.id;

      if (!profile) {
        const { data: newProfile, error: createProfileError } = await supabase
          .from('profiles')
          .insert([{
            id: user.id,
            full_name: newTestimonial.full_name,
            user_type: newTestimonial.user_type as 'admin' | 'professional' | 'patient'
          }])
          .select()
          .single();

        if (createProfileError) throw createProfileError;
        userId = newProfile.id;
      } else {
        userId = profile.id;
      }

      const { error } = await supabase
        .from('testimonials')
        .insert([{
          user_id: userId,
          user_type: newTestimonial.user_type,
          content: newTestimonial.content,
          photo_url: newTestimonial.photo_url || null,
          city: newTestimonial.city || null,
          is_published: true
        }]);

      if (error) throw error;

      setNewTestimonial({
        full_name: '',
        user_type: 'professional',
        content: '',
        photo_url: '',
        city: ''
      });
      setShowAddForm(false);
      fetchTestimonials();
    } catch (error) {
      console.error('Error adding testimonial:', error);
      alert('Erro ao adicionar depoimento');
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este depoimento?')) return;

    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert('Erro ao excluir depoimento');
    }
  };

  const handleTogglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ is_published: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      fetchTestimonials();
    } catch (error) {
      console.error('Error updating testimonial:', error);
      alert('Erro ao atualizar depoimento');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Gestão de Depoimentos</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-brand-purple-600 text-white px-4 py-2 rounded-lg hover:bg-brand-purple-700 transition-colors"
        >
          {showAddForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showAddForm ? 'Cancelar' : 'Adicionar Depoimento'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Novo Depoimento</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                value={newTestimonial.full_name}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, full_name: e.target.value })}
                placeholder="Ex: Dr. João Silva"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-purple-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tipo de Usuário *
              </label>
              <select
                value={newTestimonial.user_type}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, user_type: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-purple-600 focus:border-transparent"
              >
                <option value="professional">Profissional</option>
                <option value="patient">Paciente</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Depoimento *
              </label>
              <textarea
                value={newTestimonial.content}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, content: e.target.value })}
                placeholder="Escreva o depoimento aqui..."
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-purple-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Cidade
              </label>
              <input
                type="text"
                value={newTestimonial.city}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, city: e.target.value })}
                placeholder="Ex: São Paulo, Brasil"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-purple-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Foto (URL ou Upload)
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg cursor-pointer transition-colors">
                  <Upload className="w-5 h-5" />
                  {uploading ? 'Enviando...' : 'Upload Foto'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                {newTestimonial.photo_url && (
                  <img src={newTestimonial.photo_url} alt="Preview" className="w-16 h-16 rounded-full object-cover" />
                )}
              </div>
              <input
                type="text"
                value={newTestimonial.photo_url}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, photo_url: e.target.value })}
                placeholder="Ou cole a URL da foto aqui"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-purple-600 focus:border-transparent mt-2"
              />
            </div>

            <button
              onClick={handleAddTestimonial}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="w-5 h-5" />
              Salvar Depoimento
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className={`bg-white rounded-xl shadow-lg p-6 border ${
              testimonial.is_published ? 'border-green-200' : 'border-slate-200'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                {testimonial.photo_url && (
                  <img
                    src={testimonial.photo_url}
                    alt={testimonial.profiles?.full_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <h3 className="font-semibold text-slate-800">
                    {testimonial.profiles?.full_name || 'Usuário'}
                  </h3>
                  <p className="text-sm text-slate-500">{testimonial.city}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleTogglePublished(testimonial.id, testimonial.is_published)}
                  className={`p-2 rounded-lg transition-colors ${
                    testimonial.is_published
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                  title={testimonial.is_published ? 'Publicado' : 'Não publicado'}
                >
                  {testimonial.is_published ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => handleDeleteTestimonial(testimonial.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <p className="text-slate-700 mb-3 line-clamp-4">{testimonial.content}</p>

            <div className="flex items-center gap-2 text-sm">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                testimonial.user_type === 'professional'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-green-100 text-green-700'
              }`}>
                {testimonial.user_type === 'professional' ? 'Profissional' : 'Paciente'}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">
                {new Date(testimonial.created_at).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {testimonials.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-xl">
          <p className="text-slate-600">Nenhum depoimento cadastrado ainda.</p>
        </div>
      )}
    </div>
  );
}
