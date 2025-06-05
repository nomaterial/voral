import subprocess, tempfile, shutil, pathlib

DEMUC_MODEL = "htdemucs"
SAMPLE_RATE = 16000
TMP_PREFIX  = "voral_prep_"

def _run(cmd: list, desc: str):
    print("🔧", desc, ":", " ".join(map(str, cmd)))
    subprocess.run(list(map(str, cmd)), check=True)

def clean(input_path: str, output_path: str):
    with tempfile.TemporaryDirectory(prefix=TMP_PREFIX) as tmpdir:
        tmp = pathlib.Path(tmpdir)

        # 1️⃣ Demucs → vocals.wav (on cherche récursivement)
        _run(
            ["demucs", "-n", DEMUC_MODEL, "--two-stems", "vocals",
             "-o", str(tmp), str(input_path)],
            "Séparation Demucs"
        )
        vocals_wav = next(tmp.rglob("vocals.wav"))        # ← changement clé

        # 2️⃣ WAV → RAW mono 48 kHz (format requis par rnnoise_demo)
        vocals_raw = tmp / "vocals.raw"
        _run(
            ["ffmpeg", "-y", "-i", str(vocals_wav),
             "-ac", "1", "-ar", "48000", "-f", "s16le", str(vocals_raw)],
            "Conversion PCM pour RNNoise"
        )

        # 3️⃣ RNNoise
        denoise_raw = tmp / "denoise.raw"
        _run(
            ["rnnoise_demo", str(vocals_raw), str(denoise_raw)],
            "Denoise RNNoise"
        )

        # 4️⃣ RAW → WAV mono 16 kHz normalisé
        _run(
            ["ffmpeg", "-y", "-f", "s16le", "-ar", "48000", "-ac", "1",
             "-i", str(denoise_raw),
             "-ac", "1", "-ar", str(SAMPLE_RATE),
             "-af", "loudnorm", str(output_path)],
            "Export clean.wav"
        )
        print("✅ clean.wav prêt →", output_path)
