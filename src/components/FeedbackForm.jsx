import { Formik, Form, Field, ErrorMessage } from 'formik';
import feedbackSchemas from "../schemas/feedbackSchemas.jsx";
import '../css/FeedbackForm.css';

export default function FeedbackForm() {

    const initialValues = {
        nome: "",
        email: "",
        tipo: "",
        nota: "",
        conteudo: "",
        tipoProblema: "",
        pagina: "",
        mensagem: "",
    };

    const handleSubmit = (values) => {
        console.log("Feedback enviado:", values);

        alert("Obrigado pelo seu feedback!");

        // Supabase
    };  

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={feedbackSchemas}
            onSubmit={handleSubmit}
        >
        {({ values, validateForm }) => (
            <Form
                className="feedback-form"
                onSubmit={async (event) => {
                    event.preventDefault();

                    const errors = await validateForm();

                    if (Object.keys(errors).length > 0) {
                        alert("Por favor, preencha todos os campos obrigatórios corretamente.");
                        return;
                    }

                    handleSubmit(values);
                }}
            >

                    <div className="form-group">
                        <label htmlFor="nome">
                            Nome
                        </label>

                        <Field
                            type="text"
                            id="nome"
                            name="nome"
                            placeholder="Digite seu nome"
                        />

                        <ErrorMessage
                            name="nome"
                            component="div"
                            className="form-error"
                        />
                    </div>


                    <div className="form-group">
                        <label htmlFor="email">
                            E-mail
                        </label>

                        <Field
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Digite seu e-mail"
                        />

                        <ErrorMessage
                            name="email"
                            component="div"
                            className="form-error"
                        />
                    </div>


                    <div className="form-group">

                        <label>
                            O que você deseja fazer?
                        </label>

                        <label className="radio-option">
                            <Field
                                type="radio"
                                name="tipo"
                                value="avaliacao"
                            />

                            Avaliar o Historiando
                        </label>

                        <label className="radio-option">
                            <Field
                                type="radio"
                                name="tipo"
                                value="problema"
                            />

                            Relatar um problema
                        </label>

                        <ErrorMessage
                            name="tipo"
                            component="div"
                            className="form-error"
                        />

                    </div>


                    {values.tipo === "avaliacao" && (
                    <>
                            <div className="form-group">
                                <label htmlFor="nota">Nota</label>

                                <Field
                                    as="select"
                                    id="nota"
                                    name="nota"
                                >
                                    <option value="">
                                        Selecione uma nota
                                    </option>
                                    <option value="1">1 ⭐</option>
                                    <option value="2">2 ⭐</option>
                                    <option value="3">3 ⭐</option>
                                    <option value="4">4 ⭐</option>
                                    <option value="5">5 ⭐</option>
                                </Field>

                                <ErrorMessage
                                    name="nota"
                                    component="div"
                                    className="form-error"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="conteudo">
                                    Qual conteúdo você mais gostou?
                                </label>

                                <Field
                                    as="select"
                                    id="conteudo"
                                    name="conteudo"
                                >
                                    <option value="">
                                        Selecione um conteúdo
                                    </option>
                                    <option value="chegada-portugueses">
                                        A chegada dos portugueses
                                    </option>
                                    <option value="decolonialidade">
                                        Decolonialidade
                                    </option>
                                    <option value="pre-colonial">
                                        Brasil pré-colonial
                                    </option>
                                    <option value="mapas">
                                        Mapas
                                    </option>
                                    <option value="questoes">
                                        Questões de vestibular
                                    </option>
                                    <option value="outro">
                                        Outro
                                    </option>
                                </Field>
                            </div>

                            <div className="form-group">
                                <label htmlFor="mensagem">
                                    Comentário ou sugestão
                                </label>

                                <Field
                                    as="textarea"
                                    id="mensagem"
                                    name="mensagem"
                                    rows="5"
                                    placeholder="Conte o que você achou..."
                                />

                                <ErrorMessage
                                    name="mensagem"
                                    component="div"
                                    className="form-error"
                                />
                            </div>
                    </>
                    )}


                    {values.tipo === "problema" && (

                        <>

                            <div className="form-group">

                                <label htmlFor="tipoProblema">
                                    Tipo de problema
                                </label>

                                <Field
                                    as="select"
                                    id="tipoProblema"
                                    name="tipoProblema"
                                >
                                    <option value="">
                                        Selecione uma opção
                                    </option>

                                    <option value="conteudo">
                                        Erro no conteúdo
                                    </option>

                                    <option value="questao">
                                        Erro em uma questão
                                    </option>

                                    <option value="visual">
                                        Erro visual
                                    </option>

                                    <option value="navegacao">
                                        Problema de navegação
                                    </option>

                                    <option value="outro">
                                        Outro
                                    </option>
                                </Field>

                                <ErrorMessage
                                    name="tipoProblema"
                                    component="div"
                                    className="form-error"
                                />

                            </div>


                            <div className="form-group">

                                <label htmlFor="pagina">
                                    Página onde encontrou o problema
                                </label>

                                <Field
                                    type="text"
                                    id="pagina"
                                    name="pagina"
                                    placeholder="Ex.: Questões"
                                />

                                <div className="form-group">
                                    
                                <label htmlFor="mensagem">
                                    Descreva o problema
                                </label>

                                <Field
                                    as="textarea"
                                    id="mensagem"
                                    name="mensagem"
                                    rows="5"
                                    placeholder="Explique o que aconteceu..."
                                />

                                <ErrorMessage
                                    name="mensagem"
                                    component="div"
                                    className="form-error"
                                />
                            </div>

                            </div>

                        </>

                    )}

                    <button
                        type="submit"
                        className="feedback-submit"
                    >
                        Enviar
                    </button>

                </Form>
            )}
        </Formik>
    );
}