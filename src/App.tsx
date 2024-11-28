import axios from "axios";
import { useState, useEffect } from "react"
import "./styles.css"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LiaEdit } from "react-icons/lia";
import { MdDelete } from "react-icons/md";

type Aluno = {
  _id: string;
  bimestre: string;
  matricula: string;
  nome: string;
  curso: string;
}

function App() {
  const [formData, setFormData] = useState({
    nome: "",
    matricula: "",
    curso: "",
    bimestre: "",
  });

  const [erroNome, setErroNome] = useState("");
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [idEdicao, setIdEdicao] = useState("");

  //Cadastrar o aluno
  async function salvarAluno(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (formData.nome === "") {
      setErroNome("Campo obrigatório!");
      //alert("Nome é obrigatório");
    } else {
      setErroNome("");

      if (idEdicao) {
        try {
          await axios.put(`https://api-aluno.vercel.app/aluno/${idEdicao}`, {
            nome: formData.nome,
            matricula: formData.matricula,
            curso: formData.curso,
            bimestre: formData.bimestre,
          });
          buscarAlunos();
          toast("Aluno atualizado com sucesso!")
          setIdEdicao("");
        } catch (error) {
          toast("Erro ao atualizar o aluno: " + error);
        }
      } else {
        try {
          await axios.post("https://api-aluno.vercel.app/aluno", {
            nome: formData.nome,
            matricula: formData.matricula,
            curso: formData.curso,
            bimestre: formData.bimestre,
          });
          buscarAlunos();
          toast("Aluno cadastrado com sucesso!")
        } catch (error) {
          toast("Erro ao cadastrar o aluno: " + error);
        }
      }

      setFormData({ nome: "", matricula: "", curso: "", bimestre: "" });
    }
  }

  //Remover aluno
  async function removerAluno(id: string) {
    try {
      await axios.delete(`https://api-aluno.vercel.app/aluno/${id}`);
      buscarAlunos();
      toast("Aluno removido com sucesso.");
    } catch (error) {
      toast("Erro ao remover o aluno.");
    }
  }

  //Atualizar Aluno
  function editarAluno(aluno: Aluno) {
    setFormData({
      nome: aluno.nome,
      matricula: aluno.matricula,
      curso: aluno.curso,
      bimestre: aluno.bimestre,
    });
    setIdEdicao(aluno._id);
  }

  //Comunicação com a API
  async function buscarAlunos() {
    setIsLoading(true);
    const response = await axios.get("https://api-aluno.vercel.app/aluno");
    setAlunos(response.data);
    setIsLoading(false);
  }

  useEffect(() => {
    buscarAlunos();
  }, [])

  return (
    <div className="home">
      <div className="container_form">
        <h1 className="title_home">Diário eletrônico</h1>
        <form className="form" onSubmit={(event) => salvarAluno(event)}>

          <div className="container_input">
            <input placeholder="Name" value={formData.nome} onChange={(event) => setFormData({ ...formData, nome: event.target.value })} />
            <span className="error">{erroNome}</span>
          </div>

          <div className="container_input">
            <input placeholder="Matricula" value={formData.matricula} onChange={(event) => setFormData({ ...formData, matricula: event.target.value })} />
            <span className="error"></span>
          </div>

          <div className="container_input">
            <select value={formData.curso} onChange={(event) => setFormData({ ...formData, curso: event.target.value })}>
              <option selected> Selecione um curso</option>
              <option>Back-end</option>
              <option>Front-end</option>
              <option>Redes</option>
              <option>Banco de Dados</option>
              <option>UX</option>
            </select>
            <span className="error"></span>
          </div>

          <div className="container_input">
            <input placeholder="Bimestre" value={formData.bimestre} onChange={(event) => setFormData({ ...formData, bimestre: event.target.value })} />
            <span className="error"></span>
          </div>

          <button className="btn_save_form">Salvar</button>

        </form>
      </div>

      <div className="container_table">
        <h2>Alunos cadastrados</h2>
        {
          isLoading ? <p>Carregando...</p> :
            <table border={1} className="table_alunos">
              <tr>
                <th className="flex-0">Ordem</th>
                <th className="flex-2">Nome</th>
                <th className="flex-1">Matrícula</th>
                <th className="flex-1">Curso</th>
                <th className="flex-1">Bimestre</th>
                <th className="flex-1">Ações</th>
              </tr>

              {alunos.map((aluno, index) => {
                return (
                  <tr>
                    <td className="flex-0">{index + 1}</td>
                    <td className="flex-2">{aluno.nome}</td>
                    <td className="flex-1">{aluno.matricula}</td>
                    <td className="flex-1">{aluno.curso}</td>
                    <td className="flex-1">{aluno.bimestre}</td>
                    <td className="flex-1">
                      <MdDelete color="#f90000" size={25} onClick={() => removerAluno(aluno._id)} />
                      <LiaEdit color="#0fba3f" size={25} onClick={() => editarAluno(aluno)} />
                    </td>
                  </tr>
                );
              })}

            </table>
        }
      </div>
      <ToastContainer />

    </div>
  )
}

export default App
