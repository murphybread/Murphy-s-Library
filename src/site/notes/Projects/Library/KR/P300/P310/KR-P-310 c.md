---
{"dg-publish":true,"title":"2024년12월1주차 회고: hydration 트러블 슈팅과 프론트엔드의 핵심 state와 component","description":"이번 주의 경우 개인 프로젝트 magic-prompt의 업그레이드 및 hydration 트러블 슈팅과 현직 웹 프론트 개발자강에서 배운 state와 component의 깊이를 느꼈습니다.","permalink":"/projects/library/kr/p300/p310/kr-p-310-c/","dgPassFrontmatter":true,"noteIcon":"0","created":"2024-12-09T19:46:01.103+09:00","updated":"2024-12-09T20:48:14.588+09:00"}
---

현재 노트: [[Projects/Library/KR/P300/P310/KR-P-310 c\|KR-P-310 c]] 2024년12월1주차 회고: hydration 트러블 슈팅과 프론트엔드의 핵심 state와 component
상위 분류: [[Projects/Library/KR/P300/P310/KR-P-310\|KR-P-310]] 주간회고

#회고 #주간회고 

12월 1주차
![Pasted image 20241209194612.png](/img/user/images/Pasted%20image%2020241209194612.png)


저번 주(2024/11 4 주차) 목표 피드백
- 계속 진행중인 내가 가지고 있는것 장점 정리하기-> 11월20일자 작성한 태그인데 아직도 진행중. 진행되지 않는 이유로는 날잡고 하기에 너무 큰 단위라, 메소드처럼 기능을 잘게 쪼갤 필요가 있음.
- 작업하던 프로젝트 매직프롬프트 좀더 수준높이기-> 대화기능인 멀티턴 방식 + structured output 기능까지 구현 완료
- 원티드 프론트엔드챌린지 수,금 잘 참여하기 -> 참여는 했는데 실습및 과제는 못함. 추후에
- 우테코6기 프론트엔드문제 풀어보기-> 못풀음. 이번에 풀것


2024년 12월 1주차 Keywords
- `hydration 에러 styled-component와 framer-motion 여러 라이브러리 사용시 발생`
- `노드 성능 최적화 멀티프로세서 Cluster API와 멀티스레드 Worker Threads`: 직접 테스트해보고 느낀 성능의 최적화를 위한 답을 고르는 법
- `AI 코딩의존성 줄이기`: 의존성을 적당히 줄이기
- `프론트엔드 개발자 강의 들은후`: 첫 선언부터 react는 `state`다 라는 말부터 느끼게된 웹 프론트


#### `hydration 에러 styled-component와 framer-motion 여러 라이브러리 사용시 발생`
관련 문서 [[Projects/Library/KR/000/010/010.00/KR-010.00 a\|KR-010.00 a]] 

자세한 내용은 해당 문서에 기재돼있습니다. 간략하게 설명하면 Next.js로 컴포넌트를 구현하는 과정에서 hydration에러가 발생하였습니다. 그런데 해당 에러를 해결하는 과정에서 SSR과 가상 DOM이 불일치하는 hydration이라는 개념을 학습하고, 추가적으로 CSS-In-JS 방식의 styled-component와 실제 DOM으로 props를 전달하는 framer-motion이 복합적으로 작용하면서 생긴 문제를 트러블 슈팅하는 일이 있었습니다.


#### `노드 성능 최적화 멀티프로세서 Cluster API와 멀티스레드 Worker Threads`: 직접 테스트해보고 느낀 성능의 최적화를 위한 답을 고르는 법
관련 문서 [[Projects/Library/KR/000/010/010.40/KR-010.40 a\|KR-010.40 a]]

JS의 싱글 스레드를 한계를 극복하기위해 멀티프로세스인 Cluster API와 멀티 스레드인 Worker Threads를 간단하게 테스해봤을때 흥미로운 결과를 얻었습니다. 1부터 n까지 덧셈을 연산했을떄 그 n의 결과에 따라 best 성능을 구현하는 방법이 달라졌습니다.
![](https://i.imgur.com/EyxKkGj.png)
(데이터 구간의 경우 실제 테스트하지 않고 선형 방식으로 예측)
`10^7`일경우에는 숫자가 작기에 Single Thread가 제일 빠른 반응을 보이고, Cluster API의 경우 최소 시간이 크지만 데이터값이 증가해도 안정적으로 증가하는 것을 볼수 있었습니다. 즉 single thread, cluster API, worker Threads 3개의 방법이 데이터 값에 따라 적절하게 선택할 필요가 있다는 것을 느꼈습니다


#### `AI 코딩의존성 줄이기`: 의존성을 적당히 줄이기
요즘 AI코딩을 많이쓰다보니 문득 든 생각이라 의존성을 좀 줄여보자고 생각하였습니다. 의존성이라는 말처럼 쓰긴 쓰되, 컴퓨터 프로그래밍 원리의 Single Responsibility Principle 처럼 AI에 적당한 책임을 저야한다고 느꼈습니다. 

#### `프론트엔드 개발자 강의 들은후`: 첫 선언부터 react는 `state`다 라는 말부터 느끼게된 웹 프론트

현역 웹 프론트 개발자분으로부터 강의를 들으면서 느낀것이 react의 `state`와 `component`를 이제야 좀 제대로 안 느낌입니다. 특히 `state`를 관리, 중복을 줄이기위한 커스텀 훅, 간단한 프로젝트에 좋은 설치가 필요없는 ContextAPI와 규모가 커지면 적합한 ReCoil등
그리고 `component`의 종류 역할, 쪼개기, 구조, 최적화를 위한 LCP개선등... 실습을 하지는 못했지만



다음주 (2024년12월2주차) 목표
- 우테코6기 프론트엔드 코딩테스트 문제 풀어보기
- 7기 프리코스 편의점 문제 다시풀어보기
- 12월 14일 토요일 코딩테스트 준비, 세팅, 문제 등



