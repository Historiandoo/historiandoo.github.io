import * as Yup from 'yup';

const feedbackSchemas = Yup.object({
    nome: Yup.string()
        .required("Digite seu nome."),

    email: Yup.string()
        .email("Digite um e-mail válido.")
        .required("Digite seu e-mail."),

    tipo: Yup.string()
        .oneOf(["avaliacao", "problema"])
        .required("Selecione uma opção."),

    nota: Yup.number()
        .when("tipo", {
            is: "avaliacao",
            then: (schema) =>
                schema
                    .required("Selecione uma nota.")
                    .min(1, "A nota mínima é 1.")
                    .max(5, "A nota máxima é 5."),
            otherwise: (schema) => schema.nullable(),
        }),

    conteudo: Yup.string(),

    tipoProblema: Yup.string()
        .when("tipo", {
            is: "problema",
            then: (schema) =>
                schema.required("Selecione o tipo de problema."),
            otherwise: (schema) => schema,
        }),

    pagina: Yup.string(),

    mensagem: Yup.string()
        .required("Digite uma mensagem.")
        .min(10, "A mensagem deve ter pelo menos 10 caracteres."),
});

export default feedbackSchemas;