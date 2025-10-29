export interface Orcamento {
  id: number;
  nome: string;
  email: string;
  celular: string;
  valor: number;
  status: number;
  dataInicio: string;
  dataFim?: string | null;
  descricao: string;
}

export interface GetOrcamentosResponse {
  orcamentos: Orcamento[];
}

/**
 * Busca orçamentos com filtros opcionais.
 * @param options.name Nome para pesquisa (opcional)
 * @param options.status Status para filtro (opcional)
 */
export async function GetOrcamentos(options?: { name?: string; status?: string }): Promise<GetOrcamentosResponse> {
  try {
    let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Orcamento`;

    // Adiciona query params se houver filtros
    const queryParams = new URLSearchParams();
    if (options?.name) queryParams.append("nome", options.name);
    if (options?.status) queryParams.append("status", options.status);

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`Erro ao buscar orçamentos: ${response.statusText}`);
      return { orcamentos: [] };
    }

    const result: GetOrcamentosResponse = await response.json();
    return result;
  } catch (error) {
    console.error("GetOrcamentos error:", error);
    return { orcamentos: [] };
  }
}

export interface UpdateOrcamentoResponse {
  sucesso: boolean;
  mensagem?: string;
  orcamento?: Orcamento;
}

export async function UpdateOrcamento(
  id: number,
  dados: Partial<Orcamento>
): Promise<UpdateOrcamentoResponse> {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Orcamento/${id}`;

    const body = {
      nome: dados.nome,
      celular: dados.celular,
      email: dados.email,
      descricao: dados.descricao,
      status: dados.status ?? 0,
      valor: dados.valor?.toString() ?? "0",
      dataFim: dados.dataFim || null,
    };

    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const erroTexto = await response.text();
      console.error(`Erro ao atualizar orçamento: ${erroTexto}`);
      return {
        sucesso: false,
        mensagem: `Erro ao atualizar orçamento: ${response.statusText}`,
      };
    }

    // 🔹 Tenta ler JSON só se houver corpo
    const text = await response.text();
    const result = text ? JSON.parse(text) : null;

    return {
      sucesso: true,
      orcamento: result || undefined,
    };
  } catch (error) {
    console.error("UpdateOrcamento error:", error);
    return {
      sucesso: false,
      mensagem: "Erro inesperado ao atualizar orçamento.",
    };
  }
}


