import FeedbackForm from "../components/FeedbackForm.jsx";

export default function PageFeedback() {

    return (
        <main className="content-page feedback-page">

            <h1>Feedback</h1>

            <p>
                Sua opinião ajuda a melhorar o Historiando.
                Avalie o site ou relate algum problema que
                você encontrou.
            </p>

            <FeedbackForm />

        </main>
    );
}