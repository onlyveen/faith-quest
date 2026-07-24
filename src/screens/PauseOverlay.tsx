import { Modal } from "../components/Modal";
import { GlossyButton } from "../components/GlossyButton";
import { useLanguage } from "../i18n/LanguageContext";
import { useQuiz } from "../state/QuizContext";

export function PauseOverlay() {
  const { t } = useLanguage();
  const { dispatch } = useQuiz();

  const quit = () => {
    if (window.confirm(t.question.confirmQuitTitle)) {
      dispatch({ type: "GO_TO_HOME" });
    }
  };

  return (
    <Modal
      title={t.question.pause}
      footer={
        <>
          <GlossyButton variant="blue" onClick={quit}>
            {t.question.quit}
          </GlossyButton>
          <GlossyButton
            variant="purple"
            onClick={() => dispatch({ type: "RESUME" })}
          >
            {t.question.resume}
          </GlossyButton>
        </>
      }
    >
      <p className="text-white/70">⏸</p>
    </Modal>
  );
}
