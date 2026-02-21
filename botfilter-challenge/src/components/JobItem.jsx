import { useMemo, useState } from "react";
import { applyToJob } from "../api";

const GITHUB_REPO_REGEX =
  /^https?:\/\/(www\.)?github\.com\/[^/.\s][^/\s]*\/[^/.\s][^/\s]*\/?$/i;

export default function JobItem({ job, candidate, candidateReady }) {
  const [repoUrl, setRepoUrl] = useState("");
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const normalizedRepoUrl = useMemo(() => repoUrl.trim(), [repoUrl]);
  const repoUrlIsValid = useMemo(
    () => GITHUB_REPO_REGEX.test(normalizedRepoUrl),
    [normalizedRepoUrl]
  );

  const canSubmit = useMemo(() => {
    return Boolean(candidateReady && normalizedRepoUrl && repoUrlIsValid);
  }, [candidateReady, normalizedRepoUrl, repoUrlIsValid]);

  async function handleSubmit() {
    if (!candidateReady) {
      setStatus({
        state: "error",
        message: "Primero cargá los datos de candidato con tu email.",
      });
      return;
    }

    if (!repoUrlIsValid) {
      setStatus({
        state: "error",
        message: "Ingresá una URL válida de GitHub con formato usuario/repositorio.",
      });
      return;
    }

    setStatus({ state: "loading", message: "" });
    try {
      const body = {
        uuid: candidate.uuid,
        jobId: job.id,
        candidateId: candidate.candidateId,
        repoUrl: normalizedRepoUrl,
      };

      const res = await applyToJob(body);

      if (res?.ok === true) {
        setStatus({ state: "success", message: "Postulación enviada (ok: true)." });
      } else {
        setStatus({ state: "success", message: "Postulación enviada (respuesta 200)." });
      }
    } catch (e) {
      setStatus({ state: "error", message: e.message || "Error desconocido." });
    }
  }

  return (
    <div className="card">
      <div className="cardHeader">
        <div>
          <div className="title">{job.title}</div>
          <div className="subtitle">Job ID: {job.id}</div>
        </div>
      </div>

      <div className="row">
        <input
          className="input"
          placeholder="https://github.com/tu-usuario/tu-repo"
          value={repoUrl}
          onChange={(e) => {
            setRepoUrl(e.target.value);
            if (status.state !== "idle") {
              setStatus({ state: "idle", message: "" });
            }
          }}
          aria-label={`URL del repo para ${job.title}`}
        />
        <button className="button" onClick={handleSubmit} disabled={!canSubmit || status.state === "loading"}>
          {status.state === "loading" ? "Submitting..." : "Submit"}
        </button>
      </div>

      {!candidateReady ? (
        <div className="hint">Primero cargá tu candidato con el email (arriba).</div>
      ) : null}

      {normalizedRepoUrl && !repoUrlIsValid ? (
        <div className="hint warningHint">
          Usá una URL de repo GitHub válida, por ejemplo:
          https://github.com/tu-usuario/tu-repo
        </div>
      ) : null}

      {status.state === "error" ? (
        <div className="error" role="alert">
          Error: {status.message}
        </div>
      ) : null}
      {status.state === "success" ? (
        <div className="success" aria-live="polite">
          {status.message}
        </div>
      ) : null}
    </div>
  );
}
