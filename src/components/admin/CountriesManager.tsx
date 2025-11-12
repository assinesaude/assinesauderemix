import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Globe, Plus, Edit2, Trash2, Save, X } from 'lucide-react';

interface Country {
  id: string;
  name: string;
  code: string;
  language_code: string;
  domain: string | null;
  created_at: string;
}

interface Props {
  onCountriesChange?: () => void;
}

export function CountriesManager({ onCountriesChange }: Props) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isAddingCountry, setIsAddingCountry] = useState(false);
  const [editingCountryId, setEditingCountryId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    language_code: 'pt',
    domain: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .order('name');

      if (error) throw error;
      setCountries(data || []);
    } catch (error) {
      console.error('Error fetching countries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingCountryId) {
        const { error } = await supabase
          .from('countries')
          .update({
            name: formData.name,
            code: formData.code.toUpperCase(),
            language_code: formData.language_code,
            domain: formData.domain || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingCountryId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('countries')
          .insert([{
            name: formData.name,
            code: formData.code.toUpperCase(),
            language_code: formData.language_code,
            domain: formData.domain || null
          }]);

        if (error) throw error;
      }

      resetForm();
      fetchCountries();
      if (onCountriesChange) onCountriesChange();
    } catch (error: any) {
      console.error('Error saving country:', error);
      if (error.code === '23505') {
        alert('Já existe um país com este código ou nome');
      } else {
        alert('Erro ao salvar país');
      }
    }
  };

  const handleEdit = (country: Country) => {
    setFormData({
      name: country.name,
      code: country.code,
      language_code: country.language_code,
      domain: country.domain || ''
    });
    setEditingCountryId(country.id);
    setIsAddingCountry(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este país? Todos os contratos associados serão excluídos.')) return;

    try {
      const { error } = await supabase
        .from('countries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchCountries();
      if (onCountriesChange) onCountriesChange();
    } catch (error) {
      console.error('Error deleting country:', error);
      alert('Erro ao excluir país');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      language_code: 'pt',
      domain: ''
    });
    setIsAddingCountry(false);
    setEditingCountryId(null);
  };

  const getLanguageName = (code: string) => {
    const languages: { [key: string]: string } = {
      pt: 'Português',
      it: 'Italiano',
      es: 'Español',
      en: 'English'
    };
    return languages[code] || code;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Globe className="w-6 h-6 text-brand-green-600" />
          <h2 className="text-xl font-semibold text-slate-900">Gerenciar Países</h2>
        </div>
        {!isAddingCountry && (
          <button
            onClick={() => setIsAddingCountry(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-green-600 text-white rounded-lg hover:bg-brand-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Adicionar País
          </button>
        )}
      </div>

      {isAddingCountry && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-slate-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nome do País
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-green-500 focus:border-transparent"
                placeholder="Ex: Brasil"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Código ISO (2 letras)
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-green-500 focus:border-transparent"
                placeholder="Ex: BR"
                maxLength={2}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Idioma
              </label>
              <select
                value={formData.language_code}
                onChange={(e) => setFormData({ ...formData, language_code: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-green-500 focus:border-transparent"
                required
              >
                <option value="pt">Português</option>
                <option value="it">Italiano</option>
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Domínio do Site
              </label>
              <input
                type="text"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-green-500 focus:border-transparent"
                placeholder="Ex: medlyou.com"
              />
              <p className="text-xs text-slate-500 mt-1">
                Domínio sem http:// ou www
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-brand-green-600 text-white rounded-lg hover:bg-brand-green-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              {editingCountryId ? 'Atualizar' : 'Salvar'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-8 text-slate-500">Carregando...</div>
      ) : countries.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          Nenhum país cadastrado
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">País</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Código</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Idioma</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Domínio</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {countries.map((country) => (
                <tr key={country.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-sm text-slate-900">{country.name}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">
                    <span className="px-2 py-1 bg-slate-100 rounded font-mono">
                      {country.code}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600">
                    {getLanguageName(country.language_code)}
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600">
                    {country.domain ? (
                      <a
                        href={`https://${country.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-green-600 hover:underline"
                      >
                        {country.domain}
                      </a>
                    ) : (
                      <span className="text-slate-400 italic">Não definido</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleEdit(country)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(country.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
