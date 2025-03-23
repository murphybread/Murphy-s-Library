---
{"dg-publish":true,"title":"Building a Voice-Driven AI Assistant: Integrating ASR, TTS, LLM, RAG, and Text-to-Image","description":"Discover how to build a high-quality voice-enabled chatbot with memory using open-source models. This comprehensive guide explores ASR with Whisper, TTS with Kokoro-82M, RAG with Qdrant and BGE-M3, and image generation with Stable Diffusion—balancing performance and cost for an optimal AI assistant implementation.","permalink":"/projects/library/en/create-conversation-ai-with-rag-and-voice-integrate/","dgPassFrontmatter":true,"noteIcon":"0","created":"2025-02-09T01:35:19.667+09:00","updated":"2025-03-19T15:35:22.008+09:00"}
---


#ASR #TTS #LLM #RAG #T2I #STT

#Kokoro82m #chagpt #openai-realtimeAPI #bge-m3 #qdrant #ComfyUI

# Why I make it?
These days open sources that about voices are become very high quality.
So I decided to start integration project text and voice.

This page notes why I choose it and the concerns I had while implementing it, troubleshooting, informativity tips, etc.

# Project Flow
1. Human start conversation by **voice**
2. ASR (Automatic Speech Recognition) convert **voice** -> **text**
3. Converted **text** is sended to **LLM**(Large Language model)
4. **LLM** create **response** 
5. **TTS**(Text to Speech) make **response** to **voice**
	1. `save` keyword make whole coversation to **embedding** 
	2. `remember` keyword **retrieve** from vectorDB
	3. `draw` keyword **draw** image from local comfyUI server


### Used model
- Speach to Text
	- [Systran/faster-distil-whisper-large-v3](https://huggingface.co/Systran/faster-distil-whisper-large-v3)
		- required average 2.5GB VRAM (fp16)
-  TTS
	- [Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M)
- LLM
	- openai gpt4o-mini
- RAG
	- [Qdrant](https://qdrant.tech/)
- Text to Image
	- [tensorart/stable-diffusion-3.5-large-TurboX](https://huggingface.co/tensorart/stable-diffusion-3.5-large-TurboX)
		- finetuned model for inference speed
		- support natural language
		- lack of detail
		- Q8 required average 12GB VRAM
		- Q4 required average 8GB VRAM


# Model Selection

## Speach to Text, ASR (Automatic speech recognition)

factors of consideration
- vram usage
- speed
- multilingual
- WER


[Reddit User Opinions](https://www.reddit.com/r/LocalLLaMA/comments/1hc1qzi/is_whispercpp_still_the_king_of_stt/) -> After checking, it looks like the best model at the moment is the whisper model.
[Explore Top 10 Models on the Arena Leader Board](https://huggingface.co/spaces/hf-audio/open_asr_leaderboard)

first choice famos model [openai/whisper-large-v3-turbo](https://huggingface.co/openai/whisper-large-v3-turbo)

check vram usage , speed, WER [user benchmark](https://github.com/SYSTRAN/faster-whisper/issues/1030)


-> **Considering the inference speed, I decided that fastwhisper v3 was the most appropriate choice.**

---
## TTS (Text to Speach)

Candidates
- https://huggingface.co/spaces/hexgrad/Kokoro-TTS
	- kokoro wrapper https://github.com/remsky/Kokoro-FastAPI
	- no support voice clone. choice voice in model
	- very high inference speed
	- comfyui workflow https://github.com/stavsap/comfyui-kokoro

TTS Arena
https://huggingface.co/spaces/Pendrokar/TTS-Spaces-Arena

-> **I chose kokoro82M because it has an attractive enough size of 82M and a wrapper.**

> Test results show that it is fast enough, taking about 300ms to 500ms for inference.

---
##  RAG (Retrieval-Augmented Generation)

We need to think about the **vector DB** and the **embedding model** for RAG
Consider.

factors of consideration
- indexing and retrival speed
- cost
- open source
- local support
- community

The candidates for the search results are **Faiss** and **Qdrant**.  
The general opinion seems to be that *Qdrant is better in terms of quick reasoning speed and high performance.* So, I chose **Qdrant**.

[Qdrant Analysis in Blog Post](https://www.restack.io/p/vector-database-answer-qdrant-vs-faiss-cat-ai)

>After using Qdrant, I found that its free cloud plan and user-friendly UI make managing persistent data very easy

#### Vector DB

|                      | Qdrant                                                              | Faiss                                                                |
| -------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Use case             | Real-time applications, recommendation systems, personalized search | Large-scale data analysis, research applications                     |
| Features             | Semantic search, dynamic sharding, horizontal scalability           | Optimized for GPU and CPU computations, supports billions of vectors |
| Performance          | Low query latency, efficient memory usage                           | High throughput, especially with GPU resources                       |
| Other considerations | Easy to use, robust API                                             | Optimized for performance, lacks traditional database features       |
### caution: when using UI qdrant server, The way local and ui are mixed is quite problematic at the moment

Roughly, there were three options for continuously managing the vector DB.
- local cli
- local ui
- qdrant cloud

Here, considering the **speed** and **cost**, I tried to utilize the local cli to leverage the existing local embedding model and use the local ui for easy management.
However, *there are too many problems to integrate as if the ui itself was a later incorporated project*. There have been several problems, but for local cli, a directory called *collection is created* and the collection is stored, but for local ui, a directory called *collections and config are created.*

In other words, it didn't seem like the ones created in ui were unconditionally managed by ui and the existing ones created by the cli were used in ui.

So in conclusion, I decided to use **qdrant cloud** because the test results only consume 1-2 seconds and support quite a lot of requests with a free plan.

> For your information, my environment has caused a path problem in Windows called gitbash.



#### Imbedding model
Considerations of the embedding model will include the **price** and the **dimension and max-token** and **inference speed** and whether is open-source.  
In other words, we use open source if possible, and if there is a model that is high enough quality and easy to use, we can use external API and looked for it.

In my first attempt, I tried to find the *one with the highest accuracy!* so I used a high ranking model on the arena board.

[embed-qa-4](https://build.nvidia.com/nvidia/embed-qa-4/modelcard )
- Parameter Count: 335 million
- qdrant with nvidia # [nvidia](https://build.nvidia.com/nvidia)/embed-qa-4
- qdrant inference docs https://qdrant.tech/documentation/embeddings/nvidia/
- inference docs of nvidia https://docs.api.nvidia.com/nim/reference/nvidia-embedding-2b-infer

>  Fast and accurate enough model, but give up due to **1000 limitations** on personal accounts (you can get up to **5000 extra but it's difficult to increase more than that**)


**[BAAI/bge-m3](https://huggingface.co/BAAI/bge-m3)**
- https://build.nvidia.com/baai/bge-m3/modelcard
- parameter 568M

After looking at reviews of multiple local models and checking the leader board  
I chose bge-m3, especially the size of the parameter.  
For other models, it is usually 1b 7b  
  
In addition, 8192 is a long sequence length, and it seems to be easy to manage as it is managed by a famous and large company

[reddit opinions](https://www.reddit.com/r/LocalLLaMA/comments/1ft17k8/how_do_you_choose_an_embedding_model/)

[embedding arena leaderboard](https://huggingface.co/spaces/mteb/leaderboard)


others candidates
- https://huggingface.co/intfloat/multilingual-e5-large-instruct
- https://huggingface.co/nomic-ai/nomic-embed-text-v2-moe?utm_source=chatgpt.com


#### Graph RAG **(Preparing for implementation)**

I looked up graph RAG to upgrade RAG a bit more.  
  
In the case of traditional RAGs, the more data you have, the longer *it costs or takes to retrieve*, because it compares the matching rate with all stored vectors and request vectors.  
  
The problem is that the longer the conversation, the lower the data match rate. This is because my storage method is to store all the record texts we've talked about so far when we store vectors.  
For example, in 20 conversations, my favorite color is blue sky blue, and in 3 conversations, my favorite color is blue like sapphire.  
  
If you have a vector for both conversations, and the query is "Exactly my favorite color?" the latter vector can have a high concordance rate.

*Graphrags are much more complicated than regular  RAG.*    
Because you need to create and manage the **Knowldege Graph.**  
  
There are several ways to create these Knowldege Graphs, but the approximate process is as follows.  
  
*Create Knowledge Graph*  
1. Decompose docs into **chunks.**  
2. Extract the **entity and relationship** through **LLM** for each decomposed chunk.  
3. Create a **knowledge graph** based on this information.  
  
*Create Vector DB* 
4. When you are embedding documents, set the **key-value**.  
5. In this Key-Value, the *Key value is a value to be accessed by the knowledge graph* and uses a value such as hash or UUID of the node.  
  
*Query*  
6. A user query to program  
7. Finds the **entity** in that query.  
8. Find the matching entity in the **knowledge graph** (it can be a single node or multiple nodes)  
9. Use the key-value to **find the information** associated with the node in the **vector DB** and decode it to obtain the text and *add it as the context*.  
10. *LLM answers with context.*  
  
>   To summarize, in addition to using the existing RAG, we find out which vector to embed through the knowledge graph.



Here, to create and manage the knowledge graph, a lot of computing resources are consumed by applying LLM to all documents and even embedding. That's why graph RAG is difficult when you think about management.

Examples include Microsoft's **graphRAG** or ZEP's **graphiti**.  
For large amounts of static data, **graphRAG** is appropriate, and **graphiti** is appropriate when changes in time are important.  
**GraphRAG** presupposes implementation in a **Azure** environment in an official document, which is extremely complex and costly.

> So in conclusion, it would be better to use rerank due to cost and management complexity.  
> So at the moment, the question of whether I should do it was the conclusion at first, but...


I found new RAG Architecute  **LightRAG**
https://www.youtube.com/watch?v=5EmRZcJIfnw
Impressively, experimental results show that **LigthRAG** is less than 100 tokens, compared to 610,000 retrive tokens in microsoft **graphRAG**.


# Text to Image
The text to image model is *much trickier than other models* when it comes to selection. As the *cost is high*, it is difficult to find the T2I model that has the **biggest VRAM constraints** and understands natural language.  
You also have to consider the style that the painting body supports (i.e., I thought it was around anime painting at first, so it was difficult to use a model that only supported realistic). And since the **inference speed** is the longest, this should be considered as well  
  
When I searched for other candidates who understand natural language, they were as follows.  

opensource: `Flux`, `SD 3.5`, `Lumina`
API services: `dall-e-3` , `imagen`

At first, I tried to use a noobAI model that understands natural language a little, but I couldn't understand it properly  

Since then, we've been at **two crossroads.**  
*One is to process the user's request once in the middle as a prompt for the model to process the image model.*  
*Another one is model that supports natural language itself.*  
  
The first method is used for models that have high quality but do not yet support natural language, such as a tag method such as *"blue sky and warm beach"* when the user asks to draw *blue sky, warm beach.*  
  
When **considered UX**, I decided that it would be appropriate to use a model that **supports natural language**. And API services are expensive, so we exclude them in the end  
`FLUX` or `Lumina` have good accuracy but fail due to **high VRAM consumption** and **slow inference speed** .
  
In conclusion, I decided to write **SD3.5**
And there are models  large, **large turbo**, medium  models.
For high natural language understanding and inference speed I choose**large turbo**

>But recently, a fine-tune model with 6x faster inference speed came out and I tried it.  [tensorart/stable-diffusion-3.5-large-TurboX](https://huggingface.co/tensorart/stable-diffusion-3.5-large-TurboX)
>It's about 18 seconds per chapter, so it's a speed and natural language processing ability that's convincing enough.
>information on [reddit](https://www.reddit.com/r/StableDiffusion/comments/1j406g1/sd35_large_turbox_just_released/)

![](https://images.squarespace-cdn.com/content/v1/6213c340453c3f502425776e/9405d88f-bf65-48e0-b0c1-0d15014ade23/hardware_compatibility_blog+%281%29.png?format=1500w)

prompt guide
https://stability.ai/learning-hub/stable-diffusion-3-5-prompt-guide

T5Encoder 256 max tokens
CLIPS G and L 77 max tokens


# Backend Server Configuration
**Websocket** + **FastAPI**

There is reference server config in RealtimSTT project.
This configuration make using AudiotoTextRecorder to recording from web

### update: Using singleton pattern for imbedding model and realtimeSTT engine initialize

Initial configuration occurs duplicate call when start sevlrver, even whenever connecting established.

For making once, create server state class file and import it.


### update: tts chunk by new line
Previously, voice conversion was performed after all input outputs.  
So for big inputs, the waiting time is long and I don't feel like I'm talking.

`\n` As a standard, it is received in chunks and converted into output.  
system message tell them to distinguish the line by `\n` 

### rollacked update: using openai realtime API
I tried to change it to the **openai realtime API** instead of the local tts I used before. The reason I tried to change it was because of its **naturalness**. First of all, I tried to change it because the function of **interrupting in conversation** and the **tone and accent** are more natural and changeable, unlike the existing method.

> However, in conclusion, I implemented it, but I rolled back again using the existing method of use. I somehow solved the technical problem, but the cost was very very **expensive.**

It's a shame that I rolled back in the end, but I've learned to solve problems that other people might be confused about while implementing, so I'm recording it.

*Settings for getting transcripts from openai realtime API*
https://community.openai.com/t/input-audio-transcription-in-realtime-api/1007401

add whisper model
```js
    body: JSON.stringify({
      model: "gpt-4o-mini-realtime-preview-2024-12-17",
      voice: "shimmer",
      input_audio_transcription: { model: "whisper-1" },
    }),
```


*getting transcript from openai reailtime API user audio transcript*  event is `conversation.item.input_audio_transcription.completed`
https://platform.openai.com/docs/api-reference/realtime-server-events/conversation/item/input_audio_transcription

Eventually, this text goes into the query. So if you received a strange answer in the conversation, you might want to check what the text of this voice input is like.  
For example, if you pronounce it as read, but the transcript is made with lead, you can check the situation
```
{
    "event_id": "event_2122",
    "type": "conversation.item.input_audio_transcription.completed",
    "item_id": "msg_003",
    "content_index": 0,
    "transcript": "Hello, how are you?"
}
```


*Get chat completion result text*
event is `"conversation.item.created"`
https://platform.openai.com/docs/api-reference/realtime-server-events/conversation/item/created

*The content of the message, applicable for message items.*
Message items of role system support only `input_text` content
Message items of role user support `input_text` and input_audio content
Message items of role assistant support `text` content.


Oh, that's too expensive. API costs... **Realtime API** Audio (including voice input and output):

| Type   | Model       | Input Tokens ($/1M) | Cached Input Tokens ($/1M) | Output Tokens ($/1M) |
|--------|------------|---------------------|----------------------------|----------------------|
| **Text**  | GPT-4o      | $5.00               | $2.50                      | $20.00               |
|        | GPT-4o mini | $0.60               | $0.30                      | $2.40                |
| **Audio** | GPT-4o      | $40.00              | $2.50                      | $80.00               |
|        | GPT-4o mini | $10.00              | $0.30                      | $20.00               |

The current code uses the GPT-4o model through the Realtime API, with prices as follows:  
- Text input: $5.00/1M token.  
- **Text output: $20.00/1M token.**  
- **Audio output: $80.00/1M token.**

Especially, I can see that the output token came out this much even though it wasn't that much(The result of playing for about an hour)
![Pasted image 20250302005902.png](/img/user/images/Pasted%20image%2020250302005902.png)


# Frontend Server configuration

after I got this error, I change file tts audio file extension from `pcm` to `mp3`
```
VoiceAssistantClient.jsx:239 Audio Decoding Error: EncodingError: Unable to decode audio data
(anonymous)@VoiceAssistantClient.jsx:239
localhost/:1 Uncaught (in promise) EncodingError: Unable to decode audio data
```


# ComfyUI server configuration

Using ComfyUI local program. Generating image required pretty high cost usage. So using own GPU is recomend


important point is understanding how to request call to comfyui api server.
first we can get comfyui workflow JSON  file from server.
second we can see api usage from comfyui server file
Two parameters are important.
**prompt** and **prefix**

prompt will be changed by user input.
prefix is path for download image

when quering to server -> use `/prompt` to JSON format
Check ongoing request queues -> from `/queue` can view
Check created result with meta data -> in `history` path

#### **Download image**
`/api/view?filename={prefix}_00001_.png` 


# Integrate Web Application with ComfyUI

first create `comfyui.py` and test it works.
second integrate backend with comfyui it works.
third frontend can call to back end

using draw keyworkd
frontend string(keyword draw) -> backend call to comfyUI(8000port) -> comfyUI 

---

# Thinking point
A collection of helpful tips I learned while implementing this agent project

> [!tips] Cache hit
> If update prompt, It should be update to last Index


requirements
- Minimum token length is 1024
- Check prefix whole conversation
benefit
- If matched inference speed and pricing lower up to 80% and 50%

Don't update like this
```PY
# Don't update like this
system_content = f"""{character_personality}
            
Memory Context:
{current_memory_context if current_memory_context else "None"}
"""
```

After Update
add memoy context to user question. Initialize value after query.
```py
        try:
            # Add user message to conversation log
            session["conversation_log"] += f"\nUser: {user_text}\n"
            
            # If memory search is needed
            if include_memory and self.memory_enabled:
                print("Searching previous conversation memories...")
                new_memory_context = await self.memory.retrieve_context(user_text)
                
                if new_memory_context:
                    print("Found relevant previous conversations.")
                    session["memory_context"] = "\n" + new_memory_context
                else:
                    print("No relevant previous conversations found.")
            
            memory_prefix = ""
            if session["memory_context"]:
                memory_prefix = f"Here is relevant context from past conversations:\n{session['memory_context']}\n\nMy question/request is: "
			session["memory_context"] = ""
```



> [!tips] audio file extension
> I recommend file extension mp3 file, first I choose pcm that speed and size. But Web Audio API doesn't support pcm file, for compatibility use mp3



> [!tips] appropriate chunk size 600
https://selectstar.ai/ko/blog/tech/rag-but-better-kor1/?utm_source=chatgpt.com




