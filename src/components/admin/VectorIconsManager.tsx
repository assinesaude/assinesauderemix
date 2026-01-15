import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Upload, Trash2, Plus, Save, X } from 'lucide-react';

interface VectorIcon {
  id: string;
  image_url: string;
  caption: string;
  specialty: string;
  order_position: number;
  is_active: boolean;
  created_at: string;
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

export function VectorIconsManager({ selectedCountry: _selectedCountry }: Props) {
  const [icons, setIcons] = useState<VectorIcon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newIcon, setNewIcon] = useState({
    image_url: '',
    caption: '',
    specialty: '',
    order_position: 0
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchIcons();
  }, []);

  const fetchIcons = async () => {
    try {
      const { data, error } = await supabase
        .from('vector_icons')
        .select('*')
        .order('order_position', { ascending: true });

      if (error) throw error;
      setIcons(data || []);
    } catch (error) {
      console.error('Error fetching icons:', error);
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
      const filePath = `vector-icons/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);

      setNewIcon({ ...newIcon, image_url: publicUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Erro ao fazer upload da imagem');
    } finally {
      setUploading(false);
    }
  };

  const handleAddIcon = async () => {
    if (!newIcon.image_url || !newIcon.caption) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      const { error } = await supabase
        .from('vector_icons')
        .insert([{
          image_url: newIcon.image_url,
          caption: newIcon.caption,
          specialty: newIcon.specialty || null,
          order_position: newIcon.order_position,
          is_active: true
        }]);

      if (error) throw error;

      setNewIcon({ image_url: '', caption: '', specialty: '', order_position: 0 });
      setShowAddForm(false);
      fetchIcons();
    } catch (error) {
      console.error('Error adding icon:', error);
      alert('Erro ao adicionar ícone');
    }
  };

  const handleDeleteIcon = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este ícone?')) return;

    try {
      const { error } = await supabase
        .from('vector_icons')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchIcons();
    } catch (error) {
      console.error('Error deleting icon:', error);
      alert('Erro ao excluir ícone');
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('vector_icons')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      fetchIcons();
    } catch (error) {
      console.error('Error updating icon:', error);
      alert('Erro ao atualizar ícone');
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
        <h2 className="text-2xl font-bold text-slate-800">Gestão de Ícones de Profissionais</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-brand-purple-600 text-white px-4 py-2 rounded-lg hover:bg-brand-purple-700 transition-colors"
        >
          {showAddForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showAddForm ? 'Cancelar' : 'Adicionar Ícone'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Novo Ícone</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Imagem do Ícone *
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg cursor-pointer transition-colors">
                  <Upload className="w-5 h-5" />
                  {uploading ? 'Enviando...' : 'Escolher Imagem'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                {newIcon.image_url && (
                  <img src={newIcon.image_url} alt="Preview" className="w-8 h-8 object-contain" />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nome da Profissão *
              </label>
              <input
                type="text"
                value={newIcon.caption}
                onChange={(e) => setNewIcon({ ...newIcon, caption: e.target.value })}
                placeholder="Ex: Médico"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-purple-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Especialidade
              </label>
              <input
                type="text"
                value={newIcon.specialty}
                onChange={(e) => setNewIcon({ ...newIcon, specialty: e.target.value })}
                placeholder="Ex: Cardiologia, Pediatria"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-purple-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Ordem de Exibição
              </label>
              <input
                type="number"
                value={newIcon.order_position}
                onChange={(e) => setNewIcon({ ...newIcon, order_position: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-purple-600 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleAddIcon}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="w-5 h-5" />
              Salvar Ícone
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {icons.map((icon) => (
          <div
            key={icon.id}
            className={`bg-white rounded-xl shadow-lg p-6 border ${
              icon.is_active ? 'border-green-200' : 'border-slate-200'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <img src={icon.image_url} alt={icon.caption} className="w-10 h-10 object-contain" />
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleActive(icon.id, icon.is_active)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    icon.is_active
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {icon.is_active ? 'Ativo' : 'Inativo'}
                </button>
                <button
                  onClick={() => handleDeleteIcon(icon.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-slate-800 mb-2">{icon.caption}</h3>
            {icon.specialty && (
              <p className="text-sm text-slate-600 mb-2">
                <span className="font-medium">Especialidade:</span> {icon.specialty}
              </p>
            )}
            <p className="text-sm text-slate-500">
              <span className="font-medium">Ordem:</span> {icon.order_position}
            </p>
          </div>
        ))}
      </div>

      {icons.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-xl">
          <p className="text-slate-600">Nenhum ícone cadastrado ainda.</p>
        </div>
      )}
    </div>
  );
}
