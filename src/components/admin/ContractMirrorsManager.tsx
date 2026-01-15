import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Plus, Edit2, Trash2, Save, X } from 'lucide-react';

interface Country {
  id: string;
  name: string;
  code: string;
  language_code: string;
  domain: string | null;
}

interface ContractMirror {
  id: string;
  country_id: string;
  contract_type: 'professional' | 'patient';
  contract_content: string;
  version: string;
  effective_date: string;
  created_at: string;
  countries?: Country;
}

interface Props {
  selectedCountry: Country | null;
}

export function ContractMirrorsManager({ selectedCountry }: Props) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [contracts, setContracts] = useState<ContractMirror[]>([]);
  const [isAddingContract, setIsAddingContract] = useState(false);
  const [editingContractId, setEditingContractId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    country_id: '',
    contract_type: 'professional' as 'professional' | 'patient',
    contract_content: '',
    version: '1.0',
    effective_date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      fetchContracts();
      setFormData(prev => ({ ...prev, country_id: selectedCountry.id }));
    }
  }, [selectedCountry]);

  const fetchCountries = async () => {
    try {
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .order('name');

      if (error) throw error;
      setCountries(data || []);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const fetchContracts = async () => {
    if (!selectedCountry) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contract_mirrors')
        .select(`
          *,
          countries (
            id,
            name,
            code,
            language_code,
            domain
          )
        `)
        .eq('country_id', selectedCountry.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContracts(data || []);
    } catch (error) {
      console.error('Error fetching contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingContractId) {
        const { error } = await supabase
          .from('contract_mirrors')
          .update({
            country_id: formData.country_id,
            contract_type: formData.contract_type,
            contract_content: formData.contract_content,
            version: formData.version,
            effective_date: formData.effective_date,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingContractId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('contract_mirrors')
          .insert([formData]);

        if (error) throw error;
      }

      resetForm();
      fetchContracts();
    } catch (error) {
      console.error('Error saving contract:', error);
      alert('Erro ao salvar contrato');
    }
  };

  const handleEdit = (contract: ContractMirror) => {
    setFormData({
      country_id: contract.country_id,
      contract_type: contract.contract_type,
      contract_content: contract.contract_content,
      version: contract.version,
      effective_date: contract.effective_date.split('T')[0]
    });
    setEditingContractId(contract.id);
    setIsAddingContract(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este contrato?')) return;

    try {
      const { error } = await supabase
        .from('contract_mirrors')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchContracts();
    } catch (error) {
      console.error('Error deleting contract:', error);
      alert('Erro ao excluir contrato');
    }
  };

  const resetForm = () => {
    setFormData({
      country_id: '',
      contract_type: 'professional',
      contract_content: '',
      version: '1.0',
      effective_date: new Date().toISOString().split('T')[0]
    });
    setIsAddingContract(false);
    setEditingContractId(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-brand-green-600" />
          <h2 className="text-xl font-semibold text-slate-900">Espelhos de Contratos</h2>
        </div>
        {!isAddingContract && (
          <button
            onClick={() => setIsAddingContract(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-green-600 text-white rounded-lg hover:bg-brand-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Adicionar Contrato
          </button>
        )}
      </div>

      {isAddingContract && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-slate-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                País
              </label>
              <select
                value={formData.country_id}
                onChange={(e) => setFormData({ ...formData, country_id: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-green-500 focus:border-transparent"
                required
              >
                <option value="">Selecione um país</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name} ({country.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tipo de Contrato
              </label>
              <select
                value={formData.contract_type}
                onChange={(e) => setFormData({ ...formData, contract_type: e.target.value as 'professional' | 'patient' })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-green-500 focus:border-transparent"
                required
              >
                <option value="professional">Profissional</option>
                <option value="patient">Paciente</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Versão
              </label>
              <input
                type="text"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Data Efetiva
              </label>
              <input
                type="date"
                value={formData.effective_date}
                onChange={(e) => setFormData({ ...formData, effective_date: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-green-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Conteúdo do Contrato
            </label>
            <textarea
              value={formData.contract_content}
              onChange={(e) => setFormData({ ...formData, contract_content: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-green-500 focus:border-transparent"
              rows={10}
              placeholder="Digite o conteúdo do contrato..."
              required
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-brand-green-600 text-white rounded-lg hover:bg-brand-green-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              {editingContractId ? 'Atualizar' : 'Salvar'}
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
      ) : contracts.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          Nenhum contrato cadastrado
        </div>
      ) : (
        <div className="space-y-4">
          {contracts.map((contract) => (
            <div
              key={contract.id}
              className="p-4 border border-slate-200 rounded-lg hover:border-brand-green-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {contract.countries?.name} - {contract.contract_type === 'professional' ? 'Profissional' : 'Paciente'}
                  </h3>
                  <p className="text-sm text-slate-500">
                    Versão {contract.version} | Efetivo desde {new Date(contract.effective_date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(contract)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(contract.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-sm text-slate-700 bg-slate-50 p-3 rounded max-h-32 overflow-y-auto">
                {contract.contract_content.substring(0, 200)}...
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
