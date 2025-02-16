---
{"dg-publish":true,"title":"예시 제목","description":null,"permalink":"/projects/library/entrance/agent/","dgPassFrontmatter":true,"noteIcon":"0","created":"2025-02-09T01:35:19.667+09:00","updated":"2025-02-16T23:40:19.179+09:00"}
---

현재 노트: [[Projects/Library/Entrance/Agent\|Agent]] 
상위 분류: [[]] <pre class="dataview dataview-error">Evaluation Error: TypeError: Cannot read properties of undefined (reading 'title')
    at eval (eval at &lt;anonymous&gt; (plugin:dataview), &lt;anonymous&gt;:1:59)
    at DataviewInlineApi.eval (plugin:dataview:18885:16)
    at evalInContext (plugin:dataview:18886:7)
    at asyncEvalInContext (plugin:dataview:18896:32)
    at DataviewJSRenderer.render (plugin:dataview:18922:19)
    at DataviewJSRenderer.onload (plugin:dataview:18464:14)
    at DataviewJSRenderer.load (app://obsidian.md/app.js:1:1214050)
    at DataviewApi.executeJs (plugin:dataview:19465:18)
    at eval (plugin:digitalgarden:10886:17)
    at Generator.next (&lt;anonymous&gt;)</pre>

#A

# Required Features
- Speach to Text (human voice to Text)
- LLM (Text to Text)

## ASR (Automatic speech recognition)
#### [openai/whisper-large-v3-turbo](https://huggingface.co/openai/whisper-large-v3-turbo)

Reddit User Opinions -> 대체로 아직까지 (2025년 2월 기준) 최선의 Open Source 모델. 기능성, 속도, 멀티 언어
https://www.reddit.com/r/LocalLLaMA/comments/1hc1qzi/is_whispercpp_still_the_king_of_stt/

Arena Leader Board -> 약 10위 권
https://huggingface.co/spaces/hf-audio/open_asr_leaderboard



# TTS (Text to Speach)

후보
- https://huggingface.co/spaces/hexgrad/Kokoro-TTS
	- kokoro wrapper https://github.com/remsky/Kokoro-FastAPI
	- clone 지원 안함, 정해진 음성에서 선택
	- 매우 빠른 추론 속도
	- comfyui workflow https://github.com/stavsap/comfyui-kokoro




TTS Arena
https://huggingface.co/spaces/Pendrokar/TTS-Spaces-Arena



### 현재 프로그램
1. [STT](https://github.com/KoljaB/RealtimeTTS)  프로그램을 통해 fast-whisper를 사용하여 음성인식 (현재 push to talk방식)
2. TTS https://github.com/remsky/Kokoro-FastAPI

기존 realtiemSTT의 advanced 기능에 로컬 kokoro fast-api wrapper 연동
Push to talk 방식
2. python 파일 실행
3. 준비가 되면 space 누른 후 말하기
4. 말하기가 완료된 space 다시 누름
5. 대답 텍스트가 출력되며 음성이 출력됨
6. 2~4 반복
`realtimeSTT/test/advanced_talk.py`
```py
from RealtimeSTT import AudioToTextRecorder
import os

import openai
import keyboard
import time
import requests
import pyaudio

os.environ["PYTHONIOENCODING"] = "utf-8"

if __name__ == '__main__':
    
    
    print("\nInitializing\n")
    

    openai.api_key = os.environ.get("OPENAI_API_KEY")

    character_personality = """
    You are Sophia, a passionate girl... and don't use emoji. answer concise. we talking with people so too much answer is not good.
    You have to answer maximum 6 lines. 
    """

    openai_model = "chatgpt-4o-latest"
    whisper_speech_to_text_model = "distil-large-v3"

    recorder = AudioToTextRecorder(model=whisper_speech_to_text_model)

    # TTS server settings
    TTS_SERVER_URL = "http://localhost:8880/v1/audio/speech"

    # PyAudio setup (for PCM output)
    player = pyaudio.PyAudio().open(format=pyaudio.paInt16, channels=1, rate=24000, output=True)

    def text_to_speech(text):
        """Sends text to the 8880 TTS server and returns the audio data."""
        data = {
            "model": "kokoro",  # TTS server model setting
            "voice": "af_bella(1)+af_alloy(0.15)",  # TTS server voice setting.
            "input": text,
            "response_format": "pcm",  # Request PCM format
        }
        with requests.post(TTS_SERVER_URL, json=data, stream=True) as response:
            response.raise_for_status()  # Raise an exception for bad status codes
            for chunk in response.iter_content(chunk_size=1024):
                if player:
                    player.write(chunk)

    system_prompt = {
        'role': 'system',
        'content': character_personality
    }

    history = []

    def generate(messages):
        """Generates text responses from OpenAI's chat completions API with streaming."""
        response = openai.chat.completions.create(model=openai_model, messages=messages, stream=True)
        for chunk in response:
            if chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content

    while True:
        # Wait until user presses space bar
        print("\n\n[[[Tap space for start record ", end="", flush=True)
        keyboard.wait('space')
        while keyboard.is_pressed('space'):  # Wait until space bar is released
            pass

        # Record from microphone until user presses space bar again
        print("\n-----------\nTap space for end record]]]\n")
        recorder.start()
        while not keyboard.is_pressed('space'):
            time.sleep(0.1)
        user_text = recorder.stop().text()
        print(f'User >>> {user_text}\nAssistant>>> ', end="", flush=True)  # Print user input
        history.append({'role': 'user', 'content': user_text})

        # Generate and stream output
        full_response = ""
        for text_chunk in generate([system_prompt] + history[-10:]):
            full_response += text_chunk
            print(text_chunk, end="", flush=True)  # Print LLM response in real-time

        history.append({'role': 'assistant', 'content': full_response})
        text_to_speech(full_response)  # Send the full response to TTS

    # Clean up PyAudio object
    if player:
        player.stop_stream()
        player.close()




```