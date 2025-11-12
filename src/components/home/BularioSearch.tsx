import { useState } from 'react';
import { Search, X, FileText, AlertCircle } from 'lucide-react';

interface Medicine {
  numProcesso: string;
  nomeProduto: string;
  expediente: string;
  razaoSocial: string;
  cnpj: string;
  numeroRegistro: string;
  dataVencimentoRegistro: string;
  categoriasRegulatoria: string;
}

interface BularioSearchProps {
  onClose: () => void;
}

export function BularioSearch({ onClose }: BularioSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      setError('Digite o nome do medicamento');
      return;
    }

    setLoading(true);
    setError('');
    setResults([]);
    setSelectedMedicine(null);

    try {
      const response = await fetch(
        `https://consultas.anvisa.gov.br/api/consulta/bulario?count=10&filter[nomeProduto]=${encodeURIComponent(query)}&page=1`
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar medicamentos');
      }

      const data = await response.json();
      setResults(data.content || []);

      if (!data.content || data.content.length === 0) {
        setError('Nenhum medicamento encontrado');
      }
    } catch (err) {
      setError('Erro ao consultar o Bulário da ANVISA. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const getBulaPdf = (medicine: Medicine) => {
    const idBulaPacienteProtegido = medicine.numProcesso || '';
    return `https://consultas.anvisa.gov.br/api/consulta/bulario/arquivo/${idBulaPacienteProtegido}/?Authorization=`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">Bulário ANVISA</h2>
              <p className="text-green-50 text-sm">Consulta de Medicamentos Registrados</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Digite o nome do medicamento..."
                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                Buscar
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </form>

          <div className="max-h-[50vh] overflow-y-auto">
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              </div>
            )}

            {results.length > 0 && !selectedMedicine && (
              <div className="space-y-3">
                {results.map((medicine, index) => (
                  <div
                    key={index}
                    className="bg-slate-50 border border-slate-200 rounded-lg p-4 hover:bg-slate-100 cursor-pointer transition-colors"
                    onClick={() => setSelectedMedicine(medicine)}
                  >
                    <h3 className="font-semibold text-slate-800 mb-2">{medicine.nomeProduto}</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                      <div>
                        <span className="font-medium">Empresa:</span> {medicine.razaoSocial}
                      </div>
                      <div>
                        <span className="font-medium">Registro:</span> {medicine.numeroRegistro}
                      </div>
                      <div>
                        <span className="font-medium">Categoria:</span> {medicine.categoriasRegulatoria}
                      </div>
                      <div>
                        <span className="font-medium">Validade:</span>{' '}
                        {new Date(medicine.dataVencimentoRegistro).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                        Ver Detalhes →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedMedicine && (
              <div className="bg-white">
                <button
                  onClick={() => setSelectedMedicine(null)}
                  className="mb-4 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  ← Voltar aos resultados
                </button>

                <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">{selectedMedicine.nomeProduto}</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-xs text-slate-500 mb-1">Empresa</p>
                      <p className="font-semibold text-slate-800">{selectedMedicine.razaoSocial}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-xs text-slate-500 mb-1">CNPJ</p>
                      <p className="font-semibold text-slate-800">{selectedMedicine.cnpj}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-xs text-slate-500 mb-1">Número de Registro</p>
                      <p className="font-semibold text-slate-800">{selectedMedicine.numeroRegistro}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-xs text-slate-500 mb-1">Validade do Registro</p>
                      <p className="font-semibold text-slate-800">
                        {new Date(selectedMedicine.dataVencimentoRegistro).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-xs text-slate-500 mb-1">Categoria Regulatória</p>
                      <p className="font-semibold text-slate-800">{selectedMedicine.categoriasRegulatoria}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-xs text-slate-500 mb-1">Expediente</p>
                      <p className="font-semibold text-slate-800">{selectedMedicine.expediente}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <a
                      href={getBulaPdf(selectedMedicine)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-center font-medium"
                    >
                      Ver Bula Completa (PDF)
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
