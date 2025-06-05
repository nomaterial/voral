# worker/Dockerfile
FROM ubuntu:22.04
ENV DEBIAN_FRONTEND=noninteractive
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# --- Dépendances système ---
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential git autoconf automake libtool pkg-config \
        ffmpeg wget ca-certificates python3 python3-pip && \
    rm -rf /var/lib/apt/lists/*

# --- PyTorch + Demucs + torchaudio en mode CPU ---
ARG TORCH_VER=2.2.2
RUN pip3 install --no-cache-dir \
      torch==${TORCH_VER}+cpu \
      torchaudio==${TORCH_VER}+cpu \
      -f https://download.pytorch.org/whl/torch_stable.html && \
    pip3 install --no-cache-dir demucs==4.0.1 soundfile tqdm boto3 python-dotenv

# --- RNNoise (copie du vrai binaire) ---
RUN git clone --depth=1 https://github.com/xiph/rnnoise.git /tmp/rn && \
    cd /tmp/rn && ./autogen.sh && ./configure --prefix=/usr && make -j$(nproc) && make install && \
    install -Dm755 examples/.libs/rnnoise_demo /usr/local/bin/rnnoise_demo && \
    ldconfig && rm -rf /tmp/rn

# --- Code de l’app ---
COPY audio_prep.py worker_swap.py db.py requirements.txt* ./
RUN pip3 install -r requirements.txt || true

ENTRYPOINT ["python3", "worker_swap.py"]
