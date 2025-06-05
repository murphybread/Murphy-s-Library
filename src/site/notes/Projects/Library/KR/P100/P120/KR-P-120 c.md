---
{"dg-publish":true,"title":"GPT-SoVITS를 이용한 AI로 TTS 생성(전처리부터 파인튜닝 및 추론까지) 가이드","description":null,"permalink":"/projects/library/kr/p100/p120/kr-p-120-c/","dgPassFrontmatter":true,"noteIcon":"0","created":"2025-05-28T23:01:53.789+09:00","updated":"2025-06-04T14:56:33.057+09:00"}
---

현재 노트: [[Projects/Library/KR/P100/P120/KR-P-120 c\|KR-P-120 c]] 
상위 분류: [[Projects/Library/KR/P100/P120/KR-P-120\|KR-P-120]] 

#취미 #TTS #Audio
프로젝트 링크: https://github.com/RVC-Boss/GPT-SoVITS

GPT-SoVITS v4를 기준으로 데이터전처리부터 추론까지의 과정을 직접 겪고, 트러블 슈팅한 기록입니다.

파인튜닝한 모델 기준으로 다음의 절차를 거치게됩니다.

초기환경 구축(라이브러리, exe파일, 모델파일 등)
1. 데이터셋 구하기(`.wav` 나 `.mp3` 등)
2. 데이터셋 전처리(`.list`파일)
3. 데이터셋 형식화(`logs` 폴더 및에 숫자 붙은 여러 파일및 폴더)
4. 모델 훈련(`ckpt`와 `pth`파일 생성)
5. 추론으로 TTS 음성 생성



파인튜닝 하지않는경우 Part5 추론파트부터 확인하시면 됩니다.


## **GPT-SoVITS 일본어 음성 복제(Fine-tuning) 가이드: 설치부터 데이터 준비까지**

이 가이드는 GPT-SoVITS WebUI를 사용하여 일본어 음성 복제 모델을 훈련하기 위한 기본적인 환경 설정과 데이터 전처리 과정을 설명합니다.

**목표:** 딥러닝 모델 훈련에 필요한 고품질의 음성-텍스트 쌍 데이터셋을 준비하는 것.

---

### **Part 1: 초기 환경 설정 및 모델 파일 준비**

이 섹션에서는 Python 가상 환경(`venv`) 활성화 후 필요한 라이브러리 및 모델 파일을 설치하고 배치하는 방법을 안내합니다.

#### **1. 필수 전제 조건**

*   Python 3.9 ~ 3.12 버전이 설치되어 있어야 합니다.
*   `venv` (가상 환경)이 생성되어 있고, 터미널에서 활성화할 수 있어야 합니다 (프롬프트에 `(your_venv_name)`이 표시되어야 함).
*   NVIDIA GPU (CUDA 지원) 및 호환되는 GPU 드라이버가 설치되어 있어야 합니다.
*   Git이 설치되어 있어야 합니다.

#### **2. PyTorch (GPU 버전) 설치**

**가장 중요하고 까다로운 부분입니다. 일반적인 `pip install torch`는 CPU 버전을 설치하므로 주의하세요!**

1.  **CUDA Toolkit 버전 확인:**
    *   터미널에서 `nvcc --version` 명령어를 입력하여 현재 시스템에 설치된 NVIDIA CUDA Toolkit 버전을 확인합니다. (예: `release 12.4` 또는 `release 12.8`)
2.  **기존 PyTorch 제거 (CPU 버전이 설치되어 있다면):**
    *   터미널에서 `pip uninstall torch torchvision torchaudio --yes` 명령어를 실행합니다.
3.  **PyTorch 공식 설치 (CUDA 버전에 맞춰):**
    *   [PyTorch 공식 웹사이트](https://pytorch.org/get-started/locally/)에 접속합니다.
    *   "Install PyTorch" 섹션에서 다음을 선택합니다:
        *   **PyTorch Build:** Stable (최신 안정 버전)
        *   **Your OS:** Windows
        *   **Package:** Pip
        *   **Language:** Python
        *   **Compute Platform:** `nvcc --version`에서 확인한 CUDA 버전에 해당하는 것을 선택합니다 (예: `CUDA 12.4` 또는 `CUDA 12.8`).
    *   웹사이트에서 제공하는 `pip install torch torchvision torchaudio ... --index-url ...` 명령어를 복사하여 터미널에 붙여넣고 실행합니다.
        *   **팁:** 만약 PyTorch 2.7.0과 CUDA 12.8 조합에서 설치 오류가 발생하면, `README.md`에서 테스트된 `PyTorch 2.5.1`과 `CUDA 12.4` 조합을 시도하거나, 시스템의 CUDA Toolkit을 12.8로 업그레이드하는 것을 고려해 보세요.
4.  **시스템 재시작:** 새로운 CUDA Toolkit을 설치했거나 드라이버를 업데이트했다면, 시스템을 **반드시 재시작**해야 변경 사항이 완전히 적용됩니다.
5.  **PyTorch 설치 확인:**
    *   터미널에서 `python`을 입력하여 Python 인터프리터를 실행합니다.
    *   `import torch`
    *   `print(f"PyTorch Version: {torch.__version__}")` (예: `2.7.0+cu128`처럼 `+cu`가 붙어야 GPU 버전임)
    *   `print(f"CUDA available: {torch.cuda.is_available()}")` (결과가 `True`여야 함)
    *   `exit()`를 입력하여 종료합니다.

#### **3. 기타 Python 패키지 설치**

*   GPT-SoVITS 프로젝트 루트 폴더에서 다음 명령어를 실행합니다:
    ```bash
    pip install -r extra-req.txt --no-deps
    pip install -r requirements.txt
    ```
*   `faster-whisper` 패키지 설치:
    ```bash
    pip install faster-whisper
    ```
    *   **`WinError 5: 액세스 거부` 오류 발생 시:**
        1.  명령어에 `--user` 추가
        2. 이 외에도 관리자권한 실행,`pyenv.cfg`파일의 `include-system-site-packages = true`옵션 변경 등이 있음
    

#### **4. FFmpeg 실행 파일 배치**

*   [ffmpeg.exe](https://huggingface.co/lj1995/VoiceConversionWebUI/blob/main/ffmpeg.exe) 와 [ffprobe.exe](https://huggingface.co/lj1995/VoiceConversionWebUI/blob/main/ffprobe.exe) 파일을 다운로드합니다.
*   다운로드한 두 파일을 **GPT-SoVITS 프로젝트의 루트 폴더** (즉, `webui.py` 파일이 있는 폴더)에 배치합니다.

#### **5. GPT-SoVITS 관련 모델 파일 다운로드 및 배치**

**Git LFS를 사용한 `git clone`이 가장 권장되는 방법입니다. 일일이 수동 다운로드는 비효율적입니다.**

1.  **Hugging Face 저장소 클론 (권장):**
    *   `GPT-SoVITS` 프로젝트의 **상위 폴더**로 이동합니다.
    *   터미널에서 다음 명령어를 실행합니다:
        ```bash
        git clone https://huggingface.co/lj1995/GPT-SoVITS
        ```
    *   이 명령어로 `GPT-SoVITS` 폴더가 생성되고, 그 안에 모든 코드 및 필수 모델 파일들이 `GPT_SoVITS/pretrained_models`와 같은 올바른 하위 경로에 자동으로 다운로드됩니다.
    *   **주의:** 만약 이전에 `GPT_SoVITS/pretrained_models` 폴더 안에서 `git clone`을 잘못 실행했다면, 중첩된 `GPT-SoVITS` 폴더를 삭제하고 올바른 상위 폴더에서 다시 클론하거나, 이미 다운로드된 파일들을 `...\GPT-SoVITS\GPT_SoVITS\pretrained_models` 경로로 **잘라내기-붙여넣기**로 옮겨야 합니다.

2.  **G2PW 모델 다운로드 및 배치 (중국어 TTS만 해당하지만, WebUI 시작 시 필수):**
    *   [Hugging Face (추천)](https://huggingface.co/XXXXRT/GPT-SoVITS-Pretrained/resolve/main/G2PWModel.zip) 또는 [ModelScope](https://www.modelscope.cn/models/XXXXRT/GPT-SoVITS-Pretrained/resolve/master/G2PWModel.zip)에서 `G2PWModel.zip` 파일을 다운로드합니다.
    *   압축을 해제한 후 나오는 `G2PWModel` 폴더 전체를 `GPT-SoVITS/GPT_SoVITS/text` 경로에 배치합니다.
    *   **팁:** WebUI 실행 시 `Downloading g2pw model...` 메시지가 뜨면서 멈추면, 이 단계를 수동으로 진행합니다.

3.  **Faster Whisper ASR 모델 다운로드 및 배치 (영어/일본어 ASR 사용 시):**
    *   [Systran/faster-whisper-large-v3](https://huggingface.co/Systran/faster-whisper-large-v3/tree/main) 페이지에서 다음 파일들을 다운로드합니다: `config.json`, `model.bin`, `preprocessor_config.json`, `tokenizer.json`, `vocabulary.json`.
    *   이 5개 파일을 `GPT-SoVITS/tools/asr/models` 폴더 안에 **`faster-whisper-large-v3`라는 새 폴더를 만들고 그 안에 배치합니다.** (예: `tools/asr/models/faster-whisper-large-v3/model.bin`)
    *   **`ModuleNotFoundError: No module named 'faster_whisper'` 또는 재다운로드 시도 시:**
        *   `pip install faster-whisper`로 라이브러리를 설치합니다.
        *   모델 파일의 폴더 구조를 위와 같이 `tools/asr/models/faster-whisper-large-v3/`로 변경했는지 확인합니다.

4.  **UVR5 모델 다운로드 및 배치 (선택 사항, 음성/반주 분리 필요 시):**
    *   [UVR5 Weights](https://huggingface.co/lj1995/VoiceConversionWebUI/tree/main/uvr5_weights) 페이지에서 모든 `.pth` 파일과 `onnx_dereverb_By_FoxJoy` 폴더를 다운로드합니다.
    *   이 모든 파일을 `GPT-SoVITS/tools/uvr5/uvr5_weights` 폴더에 배치합니다. (`onnx_dereverb_By_FoxJoy` 폴더는 통째로 넣습니다.)
    *   **팁:** 다른 Git 클론으로 `lj1995/VoiceConversionWebUI` 저장소를 통째로 받은 후, 그 안의 `uvr5_weights` 폴더만 잘라내어 붙여넣는 것이 편리합니다.

---
### **Part 2: 원본 오디오 데이터 준비 및 정제 (WebUI: "0-전처리 데이터셋 획득 도구" 탭)**

이 섹션은 파인튜닝할 원본 오디오 파일(예: 17분짜리 MP3)을 모델 훈련에 적합한 '깨끗하고', '정확하게 텍스트와 매칭된', '적절한 길이'의 데이터셋으로 만드는 과정입니다. 이 단계의 품질이 최종 모델 성능에 결정적인 영향을 미칩니다. 최종적으로 각 클립의 대사가 적힌 `.list`파일과 각 클립의 `.wav`파일들을 얻게됩니다.

#### **1. GPT-SoVITS WebUI 실행**
*   GPT-SoVITS 프로젝트 루트 폴더에서 가상 환경이 활성화된 터미널에 다음을 입력합니다:
    ```bash
    python webui.py
    ```
*   브라우저에 WebUI가 열리면, **"0-전처리 데이터셋 획득 도구" 탭**으로 이동합니다.

#### **2. 파인튜닝 대상 원본 오디오 준비**

*   파인튜닝할 일본어 음성 파일(예: 17분짜리 게임 대사 MP3)을 GPT-SoVITS 프로젝트 내의 `raw` 폴더에 복사합니다 (예: `raw\your_japanese_audio.mp3`). 데이터 양은 최소 1분 이상, 많을수록 좋습니다.


#### **(선택 사항) UVR5 보컬 및 반주 분리 도구 (0a-UVR5 Vocal Separation Tool)**

*   **목적:** 배경 음악, 게임 효과음(칼 소리, 키보드 소리 등), 환경음과 같은 **'비음성' 소리로부터 '사람 목소리(보컬)'만을 분리**하여 추출합니다. **특히 게임 대사처럼 배경음이 강한 오디오인 경우, 이 도구를 먼저 사용하면 데이터 정제가 훨씬 수월해집니다.**
*   **방법:** `켜기 보컬 분리 WebUI` 버튼을 클릭하여 별도 UI를 열고, 원본 오디오(`raw\your_japanese_audio.mp3`)를 입력하여 보컬 파일만 분리합니다.
*   **이후 단계 연결:** UVR5로 보컬 파일만 얻었다면, **그 보컬 파일(들)을 3.3단계 `음성 분할 도구`의 입력으로 사용**하여 이후 단계를 진행합니다.
*   **주의:** 만약 UVR5를 건너뛰고 3.4단계로 진행했다면, ASR 결과에 잡음이 많이 포함될 수 있으며, 수동 교정(`0d` 단계)에서 더 많은 노력과 시간이 필요합니다.

#### **3. 음성 분할 도구 (0b-Speech Slicing Tool)**

*   **목적:** 긴 원본 오디오 파일을 짧고 관리하기 쉬운 여러 오디오 클립으로 자동으로 자릅니다. 오디오 편집 및 훈련 효율을 높입니다.
*   **방법:**
    *   `오디오 자동 분리 입력 경로`: 원본 MP3 파일 경로 (`raw\your_japanese_audio.mp3`) 입력.
    *   `분리된 하위 오디오의 출력 기본 디렉터리`: `output/slicer_opt` (기본값 확인).
    *   **`켜기 음성 분할`** 버튼 클릭.
*   **결과:** `output/slicer_opt`에 짧은 `.wav` 클립들이 생성됩니다.

#### **4. 음성 잡음 제거 도구 (0bb-Speech Denoising Tool)**

*   **목적:** 히스 노이즈, 험(hum), 약한 배경 잡음 등을 제거하여 음질을 향상시킵니다.
*   **방법:**
    *   `폴더 경로 입력`: `output/slicer_opt` (3.3단계의 출력 폴더) 입력.
    *   `출력 폴더 경로`: `output/denoise_opt` (기본값 확인).
    *   **`켜기 음성 잡음 제거`** 버튼 클릭.
*   **결과:** `output/denoise_opt`에 노이즈 제거된 `.wav` 클립들이 생성됩니다. (**주의:** 이 도구는 게임 효과음이나 순간적인 잡음을 완벽하게 제거하지 못할 수 있습니다.)



#### **5. 음성 인식 도구 (0c-Speech Recognition Tool - ASR)**

*   **목적:** 처리된 오디오 클립들에서 텍스트 대본을 자동으로 추출하여 `.list` 파일을 만듭니다.
*   **방법:**
    *   `폴더 경로 입력`: 3.4단계의 출력 폴더 경로 (`output/denoise_opt`) 또는 UVR5 보컬 분리 결과 폴더 입력.
    *   `출력 폴더 경로`: `output/asr_opt` (기본값 확인).
    *   `ASR 모델`: `Faster Whisper (多语种)` 선택.
    *   `ASR 언어 설정`: `ja` (Japanese) 선택.
    *   다른 설정 확인 후, **`켜기 음성 인식`** 버튼 클릭.
*   **결과:** `output/asr_opt` 폴더에 ASR 결과인 `denoise_opt.list`와 같은 `.list` 파일이 생성됩니다.

#### **6. 음성 텍스트 교정 및 주석 도구 (0d-Speech-to-Text Proofreading Tool) - **가장 중요!****

*   **목적:** ASR 결과는 오류가 포함될 수 있으므로, 사람이 직접 각 오디오 클립의 텍스트 대본을 **수동으로 교정**하여 정확도를 100%로 만듭니다. 불필요한 오디오 클립을 삭제하고, 필요한 클립을 병합/분할하는 작업도 여기서 수행합니다. **이 단계의 꼼꼼함이 최종 모델 품질을 결정합니다.**
*   **방법:**
    1.  `주석 파일 경로`: 3.5단계에서 생성된 `.list` 파일 경로 입력 (예: `output/asr_opt/denoise_opt.list`). **반드시  실제 파일이 들어간 경로로 변경해야 합니다. `raw` 폴더의 파일은 사용하지 마세요!**
    2.  **`켜기 오디오 주석 WebUI`** 버튼 클릭. 새 브라우저 탭에 교정 UI가 열립니다.
    3.  **교정 작업 (매우 중요!):**
        *   각 오디오 클립의 **재생 버튼을 눌러 소리를 듣습니다.**
        *   **텍스트 수정:** ASR이 인식한 텍스트를 실제 음성과 비교하여 오타, 누락, 잘못된 인식 등을 수정합니다. **음성이 아닌 소리(잡음, 효과음)가 텍스트로 인식된 부분은 반드시 삭제**합니다.
        *   **불필요한 클립 삭제:** 대사 없이 잡음/효과음만 있거나, 또한 너무 빠르거나 느린경우 **1초에25음소이상,3음소이하의 클립은 훈련에 제외되니 이런 훈련에 적합하지 않은 데이터도 제거**해줍니다.옆의 `Choose Audio` 체크박스를 선택하고 **`Delete Audio` 버튼을 눌러 삭제**합니다.
        *   **클립 분할 (`Split Audio`):** 긴 클립 중간에 잡음이 있거나 여러 문장이 섞여 있다면, 분할 지점(초 단위)을 설정하고 `Split Audio`로 나눕니다. 나눈 후 불필요한 클립은 삭제합니다. (예: 1초~2초만 남기려면, 2초에서 분할 후 뒷부분 삭제 -> 남은 클립을 1초에서 분할 후 앞부분 삭제)
        *   **클립 병합 (`Merge Audio`):** ASR이 하나의 자연스러운 문장을 여러 짧은 클립으로 나눴다면, 해당 클립들을 선택하고 `Merge Audio`로 합칩니다. (길이는 1~10초 내외의 의미 있는 문장 단위가 이상적)
        *   **핵심 원칙:** 각 오디오 클립은 **대사가 포함된 깨끗한 고품질 음성**이어야 하며, **텍스트와 오디오가 정확히 1대1 매칭**되어야 합니다.
    4.  **저장 (★★★★★):** 현재 페이지의 모든 편집 내용을 완료하면, **반드시 `Submit Text` 버튼을 클릭**합니다. 이 버튼은 변경 사항을 `.list` 파일에 저장합니다. 저장하지 않고 페이지를 이동하거나 WebUI를 끄면 모든 작업이 날아갑니다.
    5.  **다음/이전 페이지 이동:** 모든 클립에 대해 교정 작업을 반복합니다.

*   **결과:** 모든 클립의 교정이 완료되면, 고품질의 훈련 데이터셋 `.list` 파일및 클립들 `.wav`파일들이이 완성됩니다.

---

### **Part 3: 데이터셋 형식화 및 특징 추출 (WebUI: "1-GPT-SoVITS-TTS" 탭 -> "1A-훈련 데이터셋 포맷팅 도구" 서브탭)**

**목적:** 교정된 `.list` 파일과 오디오 클립들을 기반으로, GPT 및 SoVITS 모델 훈련에 필요한 다양한 특징(BERT, SSL, 시맨틱 토큰)들을 추출하고 형식화합니다.

#### **1. WebUI 이동 및 설정**

*   WebUI에서 **"1-GPT-SoVITS-TTS" 탭**으로 이동하고, 그 아래 **"1A-훈련 데이터셋 포맷팅 도구" 서브탭**을 선택합니다.
*   **`*실험/모델 이름`**: 모델 이름을 입력합니다 (예: `MyJapaneseVoice`).
*   **`*텍스트 주석 파일`**: 교정을 완료한 `.list` 파일의 정확한 경로를 다시 입력합니다 (예: `output/asr_opt/denoise_opt.list`).
*   **`*훈련 세트 오디오 파일 디렉터리`**: 노이즈 제거된 오디오 폴더 경로를 입력합니다 (예: `output/denoise_opt`).
*   GPU 설정 등 다른 설정은 기본값을 확인합니다. 사전 훈련된 모델 경로(BERT, SSL, SoVITS-G)가 올바른지 확인합니다.

#### **2. 데이터 형식화 실행**

*   **`1Aabc-훈련 데이터셋 포맷팅 원클릭 실행`** 섹션에서 **`켜기 훈련 데이터셋 포맷팅 원클릭 실행` 버튼을 클릭**합니다.
*   이 버튼은 `1Aa`, `1Ab`, `1Ac` 단계를 순차적으로 실행합니다.
*   터미널 로그를 주시하며 오류 없이 진행되는지 확인합니다.

#### **3. 트러블슈팅: `KeyError: ''` 발생 시 (재현될 경우)**

*   **원인:** `.list` 파일에 음소 변환이 불가능한 데이터(빈 텍스트, 특정 특수문자, 오류 클립 등)가 포함되어 있습니다.
*   **해결:**
    1.  터미널에서 `Ctrl+C`로 프로세스 강제 종료.
    2.  `0d-음성 텍스트 교정 및 주석 도구` WebUI로 돌아가서 `.list` 파일을 다시 엽니다.
    3.  **빈 텍스트 클립, 너무 짧은 클립, 잡음만 있는 클립 등을 꼼꼼히 찾아 `Delete Audio`로 삭제**하고 **`Submit Text`로 저장**합니다.
    4.  **`logs\실험이름\` 폴더로 이동하여, `2-`, `3-`, `4-`, `5-`, `6-`으로 시작하는 모든 파일과 폴더를 삭제합니다.**
    5.  WebUI를 다시 시작하고 `1A-훈련 데이터셋 포맷팅 도구` 탭에서 **`*텍스트 주석 파일` 경로가 올바른지 다시 확인** 후, **`켜기 훈련 데이터셋 포맷팅 원클릭 실행`을 다시 클릭**합니다.

*   **결과:** 이 단계가 완료되면, `logs\실험이름\` 폴더에 훈련에 필요한 모든 형식화된 데이터 파일들이 생성됩니다.

---

### **Part 4: 모델 미세 조정 훈련 (WebUI: "1-GPT-SoVITS-TTS" 탭 -> "1B-Fine-Tuning" 서브탭)**

**목적:** 준비된 형식화 데이터셋을 사용하여 SoVITS 모델과 GPT 모델을 훈련시킵니다. 여기서 최종 모델 파일(`.pth`, `.ckpt`)이 생성됩니다.

#### **1. WebUI 이동 및 설정**

*   WebUI에서 **"1B-미세 조정 훈련" 탭**으로 이동합니다. 이후 v4와같이 훈련하고자하는 버전을 라디오오버튼에서 선택합니다.
*   `*실험/모델 이름`이 `1Aabc` 단계에서 지정한 이름과 일치하는지 확인합니다.
*   `1Ba-SoVITS 훈련` 및 `1Bb-GPT 훈련` 섹션의 설정을 검토합니다.
    *   `각 그래픽 카드의 배치 크기`: GPU 메모리(VRAM)에 맞춰 조절합니다. (오류 발생 시 감소)
    *   `총 훈련 라운드 수 (total_epoch)`: 훈련 횟수입니다. 데이터 양에 따라 적절히 설정합니다 
    *   `저장 빈도 (각 라운드마다)`: 몇 에포크마다 모델을 저장할지 설정합니다.
    *   `디스크 공간을 절약하기 위해 최신 가중치 파일만 저장할지 여부`: `False`로 설정하여 모든 에포크 모델을 저장하는 것을 권장합니다 (공간 여유 시).

#### **2. SoVITS 모델 훈련**

*   `1Ba-SoVITS 훈련` 섹션에서 **`켜기 SoVITS 훈련` 버튼을 클릭**합니다.
*   터미널 창에서 훈련 진행 상황을 모니터링합니다. `training done` 메시지가 뜨면 완료된 것입니다.
*   **결과:** SoVITS 모델 가중치 파일(`.pth`)이 `SoVITS_weights_vX\실험이름\` 폴더에 생성됩니다 (X는 버전에 따라 2 또는 4).

#### **3. GPT 모델 훈련**

*   **SoVITS 훈련이 완료된 후** `1Bb-GPT 훈련` 섹션에서 **`켜기 GPT 훈련` 버튼을 클릭**합니다.
*   터미널 창에서 훈련 진행 상황을 모니터링합니다. `max_epochs=XX reached.` 메시지가 뜨면 완료된 것입니다.

#### **4. 트러블슈팅: GPT 훈련이 너무 빠르게 종료될 경우 (예: 2분만에 끝남)**

*   **원인:** 이전 훈련 시도에서 생성된 GPT 체크포인트 파일(`logs_s1_vX/ckpt/epoch=YY-step=ZZ.ckpt`)이 남아있어, 훈련이 그 지점부터 재개되어 설정된 총 에포크에 빠르게 도달했기 때문입니다.
*   **해결:**
    1.  터미널에서 `Ctrl+C`로 프로세스 강제 종료.
    2.  **`logs\실험이름\` 폴더로 이동하여 `logs_s1/` 폴더와 `logs_s1_vX/` 폴더 두 개를 삭제합니다.**
    3.  WebUI를 다시 시작하고 `1B-미세 조정 훈련` 탭에서 GPT 훈련의 `총 훈련 라운드 수 (total_epoch)`를 원하는 값으로 재설정합니다.
    4.  **`켜기 GPT 훈련` 버튼을 다시 클릭**하여 0 에포크부터 완전히 새로 훈련을 시작합니다.

*   **결과:** GPT 모델 가중치 파일(`.ckpt`)이 `GPT_weights_vX\실험이름\` 폴더에 생성됩니다.

---

### **Part 5: 음성 추론 (Inference) (WebUI: "1-GPT-SoVITS-TTS" 탭 -> "1C-Inference" 서브탭)**

**목적:** 훈련된 GPT 및 SoVITS 모델을 사용하여 새로운 일본어 텍스트를 입력하고, 참고 음성을 제공하여 특정 화자의 음성으로 새로운 음성을 합성합니다. 파인튜닝을 하던, 기본모델을 쓰던 **음성샘플 3~10초의 음성파일은 필수**이며 해당 샘플의 텍스트는 선택입니다. 기본 GPTSoVits모델을 사용시에는 훈련된 내용에서 샘플과 최대한 유사한 보이스가 생성되며, **파인튜닝의 경우 파인튜닝 데이터(강세, 숨소리, 어투 등)가 더 반영된 샘플기반의 보이스가 생성**됩니다.
그래서 A라는 캐릭터를 파인튜닝한 경우 
- A 보이스 샘플 + 기본GPT SoVITS->가볍게 들었을 때 샘플과 유사하지만 디테일(어투, 강세 등)이 부족한 보이스
- A 보이스 샘플 + A보이스 파인튜닝 GPT SoVITS -> 샘플과 유사한 A 보이스의 특징이 훨씬 살아있는 보이스

#### **1. WebUI 이동 및 모델 선택**

*   WebUI에서 **"1C-추론" 탭**으로 이동합니다.
*   `Refreshing model paths` 버튼을 클릭하여 모델 목록을 새로고침합니다.
*   `GPT 모델 목록` 드롭다운에서 Part 4에서 훈련한 **GPT 모델(`.ckpt`)**을 선택합니다 (일반적으로 가장 최근 에포크 파일).
*   `SoVITS 모델 목록` 드롭다운에서 Part 4에서 훈련한 **SoVITS 모델(`.pth`)**을 선택합니다.

#### **2. 참고 정보 및 합성할 텍스트 입력**

*   **`*참고 정보를 업로드하고 입력하십시오`:**
    *   `Drop Audio Here` 또는 `Click to Upload` 영역에 **합성하고 싶은 목소리의 특징을 담은 3~10초 길이의 깨끗한 참고 오디오 파일**을 업로드합니다. (파인튜닝에 사용했던 깨끗한 원본 클립 중 하나 권장)
    *   `참고 오디오의 언어`: `일본어`를 선택합니다.
    *   `참고 오디오의 텍스트`: 참고 오디오의 정확한 텍스트를 알고 있다면 입력합니다. 모른다면 "참고 텍스트 없이 모드를 활성화합니다"를 체크합니다.
*   **`*합성할 목표 텍스트와 언어 모드를 입력하세요`:**
    *   `합성해야 할 텍스트`: 합성하고 싶은 새로운 일본어 텍스트를 입력합니다.
    *   `합성해야 할 언어`: `일본어`를 선택합니다.

#### **3. 추론 설정 및 실행**

*   `Inference Settings` (샘플링 스텝, 언어 속도, 문장 간 정지 시간 등)를 필요에 따라 조절합니다. 처음에는 기본값으로 시도해 봅니다.
*   **`Start Inference` 버튼을 클릭**합니다.

#### **4. 결과 확인 및 다운로드**

*   합성이 완료되면 `출력 음성` 섹션에 오디오가 나타납니다. 재생하여 들어봅니다.
*   오디오 플레이어 오른쪽의 **다운로드 아이콘 (⬇)**을 클릭하여 음성 파일을 다운로드합니다.

---

**추가 중요 주의사항:**

*   **데이터 품질이 핵심:** 파인튜닝 결과의 품질은 사용된 오디오 데이터의 깨끗함, 정확성, 다양성에 크게 좌우됩니다. 수동 교정 단계에 가장 많은 시간과 노력을 투자하세요.
*   **모델 버전:** GPT와 SoVITS 모델은 특정 버전에 맞춰 사용해야 합니다. `README.md`나 WebUI의 설정을 따라 올바른 버전의 모델 파일들을 사용하고 배치해야 합니다.
*   **GPU 리소스:** 훈련 과정은 많은 GPU 메모리와 처리 시간을 요구합니다. 시스템 사양에 맞춰 배치 크기 등을 조절해야 하며, 훈련 중에는 다른 GPU 사용 프로그램을 종료하는 것이 좋습니다.
