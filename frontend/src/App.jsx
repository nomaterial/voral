import { useState } from "react";
import axios from "axios";

export default function App() {
  const [src, setSrc] = useState(null);    // fichier source
  const [ref, setRef] = useState(null);    // voix de référence
  const [jobId, setJobId] = useState(null); // identifiant du job
  const [status, setStatus] = useState(""); // statut du job
  const [url, setUrl] = useState("");       // URL du result.wav

  // Fonction pour envoyer les fichiers à l'API
  const handleSubmit = async () => {
    const fd = new FormData();
    fd.append("src", src);
    fd.append("ref", ref);
    const res = await axios.post("http://162.19.137.112:8000/jobs", fd);
    setJobId(res.data.jobId);
    poll(res.data.jobId);
  };

  // Fonction de polling → interroge GET /jobs/{id} toutes les 3 secondes
  const poll = (id) => {
    const timer = setInterval(async () => {
      const r = await axios.get(`http://162.19.137.112:8000/jobs/${id}`);
      setStatus(r.data.status);
      if (r.data.status === "done") {
        setUrl(`http://162.19.137.112:9000/voral/${r.data.url}`);
        clearInterval(timer);
      }
    }, 3000);
  };

  return (
    <div className="container">
      <h1>Voral.ai – Voice Transfer</h1>

      <p>Source audio (ce que je veux dire) :</p>
      <input type="file" accept="audio/*" onChange={(e) => setSrc(e.target.files[0])} />

      <p>Voix de référence (comment je veux que ça sonne) :</p>
      <input type="file" accept="audio/*" onChange={(e) => setRef(e.target.files[0])} />

      <button onClick={handleSubmit}>Convert</button>

      {jobId && <p>Job ID : {jobId}</p>}
      {status && <p>Status : {status}</p>}
      {url && <audio controls src={url}></audio>}
    </div>
  );
}
