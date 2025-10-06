import Link from "next/link";

export default function Home() {
  return (
    <div>
    <main>
        <div>
            <div>
                <label htmlFor="progresso">Status:</label>
                <select name="progresso" id="progresso">
                    <option value="all">Todos</option>
                    <option value="0">Novo</option>
                    <option value="1">Em andamento</option>
                    <option value="2">Finalizado</option>
                </select>
            </div>
            <div>
                <label htmlFor="pesquisa">Pesquisa:</label>
                <input type="text" placeholder="Digite o nome do cliente para exibir o orcamento correspondente" id="pesquisa"/>
            </div>
        </div>
        <div className="table-fill">
            <div>
                <p></p>
                <p>Nome</p>
                <p>Data entrada</p>
                <p>Status</p>
                <p>Orçamento</p>
                <p>Data finalizado</p>
            </div>
            <div className="table-hover"></div>
        </div>

        <div className="table-pages"></div>
    </main>

    <div className="overlay hidden">
        <div className="cancelarUpdate">
            <h3>Deseja cancelar a atualização?</h3>
            <hr/>
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
            <hr/>
            <p>Ao clicar em "Sim", todas as alterações serão salvas!</p>
            <div>
                <button id="confirmarNao">Não</button>
                <button id="confirmarSim" type="button">Sim</button>
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
            <hr/>
            <p>Ao clicar em "Sim" o orçamento será excluído permanentemente!</p>
            <div>
                <button id="confirmarExclusaoNao">Não</button>
                <button id="confirmarExclusaoSim" type="button">Sim</button>
            </div>
        </div>
    </div>

    <div className="overlay hidden">
        <div className="excluido">
            <p>Orçamento excluido com sucesso!</p>
            <button>Ok</button>
        </div>
    </div>
    </div>
  );
}
