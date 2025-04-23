---
{"title":"2025년 3월 3주차 코딩테스트 공부","description":"주로 코딩테스트 공부","dg-publish":true,"permalink":"/projects/library/kr/p300/p310/kr-p-310-r/","dgPassFrontmatter":true,"noteIcon":"0","created":"2025-03-06T23:20:59.614+09:00","updated":"2025-04-23T18:45:38.871+09:00"}
---

현재 노트: [[Projects/Library/KR/P300/P310/KR-P-310 r\|KR-P-310 r]] 
상위 분류: [[Projects/Library/KR/P300/P310/KR-P-310\|KR-P-310]] 

#주간회고 

🔒 Some Hidden Content
	

## openai vector store 테스트
[[Projects/Library/Entrance/openai vector store\|openai vector store]]

2025년 3월11일 업데이트한 기능을 참고하여 무료로 제공되는 수준의 openai RAG의 비용, 성능 테스트.
비용 발생 메커니즘
1. 파일 임베딩된 후 벡터 용량의 비용 $0.1/GB
	1. 매 시간마다 용량 측정
	2. 하루가 넘는 시점에서 1GB보다 작은 경우 무료
	3. 1GB초과분만큼 $0.1달로 비용 발생
2. file search tool 호출 비용 $2.5/1k
3. RAG결과  chat completion LLM 비용 모델별로 발생
	- gpt4o-mini
		-  input $0.15/ 1M tokens
		- ouput $0.60/1M tokens

---

React-Router 프로젝트에 적용하며 학습

BrowerRouter
Routes
Route

UseNavigate


---

타입스크립트 필요한 부분만 독서 완료
1~4장 기본형 , 타입선언 등


---
Claude MCP 서버 테스트

MCP server를 통해 llm이 명령을 내림
MCP server는 해당 명령으로 외부 또는 내부소스에 접근해서 데이터 제공


Node설치
버전이 제대로 나오는지 확인
```
node --version
npm --version
```

Claude APP
`C:\Users\YOURUSERNAME\AppData\Roaming\Claude` -> `claude_desktop_config.json`

restart



## npm run 방식의 특징

1. **초기 설정 필요**:
    - 각 MCP 서버마다 `package.json`, `tsconfig.json` 등 설정 파일을 만들고 구성해야 합니다.
    - 필요한 의존성을 명시적으로 설치해야 합니다 (`npm install`).
    - 빌드 스크립트, 실행 스크립트 등을 직접 구성해야 합니다.
2. **장점: 커스터마이징과 제어**:
    - 서버의 세부 동작을 직접 제어하고 수정할 수 있습니다.
    - 특정 버전의 의존성을 고정해서 사용할 수 있습니다.
    - 프로젝트에 맞게 최적화가 가능합니다.
    - 개발 중인 MCP 서버나 커스텀 서버를 만들 때 적합합니다.

## npx 방식의 특징 (JSON config 방식)

1. **간소화된 운영 관리**:
    - 설정 파일 없이 바로 실행 가능합니다.
    - 별도의 설치 과정이 필요 없습니다.
    - 버전 관리가 자동으로 이루어집니다(최신 버전 사용).
2. **장점: 편의성과 빠른 시작**:
    - 설정 부담 없이 바로 시작할 수 있습니다.
    - 공식 MCP 서버를 사용할 때 특히 편리합니다.
    - 디스크 공간을 덜 차지합니다(임시 설치).
    - 여러 MCP 서버를 쉽게 전환해서 사용할 수 있습니다.


공식 사이트

github repo
https://github.com/modelcontextprotocol/servers?tab=readme-ov-file

한눈에 보기 좋은 사이트
https://www.pulsemcp.com/servers


![Pasted image 20250320171741.png](/img/user/images/Pasted%20image%2020250320171741.png)


![Pasted image 20250320172009.png](/img/user/images/Pasted%20image%2020250320172009.png)


`C:\Users\YOURUSERNAME\AppData\Roaming\Claude\logs` 로그 남음
![Pasted image 20250320172525.png](/img/user/images/Pasted%20image%2020250320172525.png)


![Pasted image 20250320172558.png](/img/user/images/Pasted%20image%2020250320172558.png)


![Pasted image 20250320172609.png](/img/user/images/Pasted%20image%2020250320172609.png)


cursor 어려운 이유

cursor가 동작하는 electron 프레임워크가 path를 못 읽어온다,
그래서 node 명령어를 인식 못하기해,  cmd로 명령을 사용하거나 node방식으로 사용하는 형태 또는 아예 전용 `.bat`파일을 만들어 해당 `.bat`파일을 실행하는 형태로 `mcp.json`을 만들어야한다.

커서 포럼의 비슷한 문제 상황들
- https://forum.cursor.com/t/mcp-servers-no-tools-found/49094/24
- https://forum.cursor.com/t/mcp-servers-on-windows-10-not-working-please-help-supabase-mcp-server/59427
- https://forum.cursor.com/t/mcp-feature-client-closed-fix/54651/10

windows기준 다음의 경로에서 mcp server의 log확인가능하며 , cursor실행시마다 log밑의 생성 폴더는 바뀝니다.
`C:\Users\YOURUSERNAME\AppData\Roaming\Cursor\logs\20250320T181022\window1\exthost\anysphere.cursor-always-local`

CUrsor MCP.log
```
2025-03-20 18:10:31.808 [info] arch: Handling CreateClient action
2025-03-20 18:10:31.808 [info] arch: getOrCreateClient for stdio server.  process.platform: win32 isElectron: true
2025-03-20 18:10:31.808 [info] arch: Starting new stdio process with command: npx -y @modelcontextprotocol/server-brave-search
2025-03-20 18:10:31.808 [error] arch: Client error for command A system error occurred (spawn npx ENOENT)
2025-03-20 18:10:31.808 [error] arch: Error in MCP: A system error occurred (spawn npx ENOENT)
2025-03-20 18:10:31.808 [info] arch: Client closed for command
2025-03-20 18:10:31.808 [error] arch: Error in MCP: Client closed
2025-03-20 18:10:31.808 [info] arch: Handling ListOfferings action
2025-03-20 18:10:31.808 [error] arch: No server info found

```


그나마 현실적인 방법으로는
전역 패키지 설치후 git clone하여 서버를 받은후, 해당 index.js를 실행하기
https://forum.cursor.com/t/mcp-servers-no-tools-found/49094/30

하지만 이러면 같은 MCP server기능을 위해서 git clone및 CUrsor용 문법 관리등 추가 작업이 필요하게 된다.
그래서 당장 cursor에서 필요한거 아니면 좋은 해결책이 나올 떄까지 기다려보는게 나을듯.

왜냐하면 현재로서는 claude에서 mcp server만 관리하는 것만으로도 벅차기 때문

---

Function Calling vs MCP

https://dev.to/fotiecodes/function-calling-vs-model-context-protocol-mcp-what-you-need-to-know-4nbo
https://www.reddit.com/r/ClaudeAI/comments/1h0w1z6/model_context_protocol_vs_function_calling_whats/#:~:text=In%20short%3A%20Function%20Calling%20happens,that%20talks%20to%20MCP%20server.

---

MCP 활용 후기
![Pasted image 20250320214607.png](/img/user/images/Pasted%20image%2020250320214607.png)

![Pasted image 20250320214623.png](/img/user/images/Pasted%20image%2020250320214623.png)


---


Open Manus  seo 명령 잘못했다가 4,800,000만 토큰 사용
아마 지정 사이트이외에 모든 사이트 검색을 시도한 것으로 추정
`Enter your prompt: search murphybooks.me and analysis seo score`

```
(OpenManus) 
    
    raise ValueError("I/O operation on closed pipe")
ValueError: I/O operation on closed pipe
(OpenManus) 
```
![Pasted image 20250321022230.png](/img/user/images/Pasted%20image%2020250321022230.png)

# 다음 주 목표 및 이번 주 피드백(3월23일 일요일 작성)
