'use client';

import React, { useEffect, useState, ChangeEvent } from 'react';
import { GetOrcamentos, Orcamento } from '../components/ApiOrcamentos';
import ShowOrcamentos from '../components/TableOrcamentos';
import Pagination from "../components/Paginacao";
import { useProtectPage } from '../components/VerificaLogin'

export default function Home() {
  useProtectPage()
  
  const [orcamentosOriginais, setOrcamentosOriginais] = useState<Orcamento[]>([]);
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [filtroStatus, setFiltroStatus] = useState<string>('all');
  const [pesquisaNome, setPesquisaNome] = useState<string>('');
  const [paginaAtual, setPaginaAtual] = useState(0);
  const itensPorPagina = 10; // número de orçamentos por página

  // Carrega os orçamentos ao iniciar
  useEffect(() => {
    const fetchData = async () => {
      const result = await GetOrcamentos();
      if (result?.orcamentos) {
        setOrcamentosOriginais(result.orcamentos);
        setOrcamentos(result.orcamentos);
      }
    };
    fetchData();
  }, []);

  // Filtro de status
  const handleFiltroChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    setFiltroStatus(status);
    setPaginaAtual(0);
  
    if (status === "all") {
      setOrcamentos(orcamentosOriginais);
    } else {
      setOrcamentos(
        orcamentosOriginais.filter((o) => o.status.toString() === status)
      );
    }
  };
  
  // Pesquisa por nome
  const handlePesquisaChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nomeDigitado = e.target.value;
    setPesquisaNome(nomeDigitado); // mantém o texto como o usuário digitou
    setPaginaAtual(0);
  
    const nomeMinusculo = nomeDigitado.toLowerCase();
  
    const filtrados = orcamentosOriginais.filter((o) => {
      const matchNome = o.nome.toLowerCase().includes(nomeMinusculo);
      const matchStatus =
        filtroStatus === "all" || o.status.toString() === filtroStatus;
      return matchNome && matchStatus;
    });
  
    setOrcamentos(filtrados);
  };
  
  const inicio = paginaAtual * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const orcamentosPaginados = orcamentos.slice(inicio, fim);
  const totalPaginas = Math.ceil(orcamentos.length / itensPorPagina);

  return (
    <div>
      <main>
        {/* FILTROS - agora ficam acima da tabela */}
        <div className="flex justify-between items-center mb-4 p-2 bg-gray-50 rounded-md">
          <div>
            <label htmlFor="progresso" className="font-semibold mr-2">
              Status:
            </label>
            <select
              name="progresso"
              id="progresso"
              value={filtroStatus}
              onChange={handleFiltroChange}
              className="border rounded-md p-1"
            >
              <option value="all">Todos</option>
              <option value="0">Novo</option>
              <option value="1">Em andamento</option>
              <option value="2">Finalizado</option>
            </select>
          </div>

          <div>
            <label htmlFor="pesquisa" className="font-semibold mr-2">
              Pesquisa:
            </label>
            <input
              type="text"
              placeholder="Digite o nome do cliente"
              id="pesquisa"
              value={pesquisaNome}
              onChange={handlePesquisaChange}
              className="border rounded-md p-1 w-80"
            />
          </div>
        </div>

        {/* TABELA */}

        <ShowOrcamentos orcamentos={orcamentosPaginados} />

        {totalPaginas > 1 && (
          <div className="flex justify-center my-6">
            <Pagination
              totalPaginas={totalPaginas}
              paginaAtual={paginaAtual}
              onChange={(p) => setPaginaAtual(p)}
            />
          </div>
        )}


        <div className="table-pages"></div>
      </main>

      {/* --- OVERLAYS MANTIDOS --- */}
      {/* (sem alterações no conteúdo abaixo) */}

      <div className="overlay hidden">
        <div className="cancelarUpdate">
          <h3>Deseja cancelar a atualização?</h3>
          <hr />
          <p>Ao clicar em "Sim", todas as alterações realizadas serão descartadas!</p>
          <div>
            <button id="cancelarNao">Não</button>
            <button id="cancelarSim">Sim</button>
          </div>
        </div>
      </div>

      <div className="overlay hidden">
        <div className="confirmarUpdate">
          <h3>Deseja confirmar a atualização?</h3>
          <hr />
          <p>Ao clicar em "Sim", todas as alterações serão salvas!</p>
          <div>
            <button id="confirmarNao">Não</button>
            <button id="confirmarSim" type="button">
              Sim
            </button>
          </div>
        </div>
      </div>

      <div className="overlay hidden">
        <div className="confirmacaoNecessaria">
          <p>Você precisa cancelar ou atualizar o orçamento atual!</p>
          <button>Ok</button>
        </div>
      </div>

      <div className="overlay hidden">
        <div className="carregamento-container">
          <div className="carregamento" id="carregamento">
            <div className="carregamento_dot"></div>
            <div className="carregamento_dot"></div>
            <div className="carregamento_dot"></div>
            <div className="carregamento_dot"></div>
            <div className="carregamento_dot"></div>
          </div>
        </div>
      </div>

      <div className="overlay hidden">
        <div className="atualizado">
          <p>Orçamento atualizado com sucesso!</p>
          <button>Ok</button>
        </div>
      </div>

      <div className="overlay hidden">
        <div className="confirmarDelete">
          <h3>Deseja confirmar a exclusão?</h3>
          <hr />
          <p>Ao clicar em "Sim" o orçamento será excluído permanentemente!</p>
          <div>
            <button id="confirmarExclusaoNao">Não</button>
            <button id="confirmarExclusaoSim" type="button">
              Sim
            </button>
          </div>
        </div>
      </div>

      <div className="overlay hidden">
        <div className="excluido">
          <p>Orçamento excluído com sucesso!</p>
          <button>Ok</button>
        </div>
      </div>
    </div>
  );
}
