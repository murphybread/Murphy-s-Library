---
{"dg-publish":true,"title":"2025년 3월 1주차 회고 포트폴리오만들기 먼저 커스텀 UI 라이브러리 만들기","description":"이번주는 포트폴리오 목적을 상기시키고 자체 UI라이브러리를 만들었던 한 주였습니다. 직접 Material UI를 사용하면서 느꼈던 아쉬운점으로 결국 직접 만드는게 좋겠다고 판단하였습니다.","permalink":"/projects/library/kr/p300/p310/kr-p-310-p/","dgPassFrontmatter":true,"noteIcon":"0","created":"2025-03-04T14:09:51.539+09:00","updated":"2025-03-10T00:06:30.918+09:00"}
---

현재 노트: [[Projects/Library/KR/P300/P310/KR-P-310 p\|KR-P-310 p]] 
상위 분류: [[Projects/Library/KR/P300/P310/KR-P-310\|KR-P-310]] 주간 회고

#주간

# 이번 주 목표

1달 안에 project-log 완성하기로 목표 설정
- 포트폴리오 수준으로
완성하면서 채용공고에 요구하는 조건을 충족하기 및 업데이트
> 진행 중

styled-components 지양하게 된 이유 글 쓰기 ➕2025-03-04 🛫2025- 03-04 📅 2025-03-09 ✅ 2025-03-04
> [[Projects/Library/KR/000/010/010.10/KR-010.10 d\|KR-010.10 d]]


# 이번 주 활동
> 이번 주는 주로 커스텀 UI 라이브러리를 만드는 한 주 였습니다.

목표로 이번 달안에 취업을 위한 포트폴리오를 완성하자고 정하였습니다. project-log라는 프로젝트이며 제가 작업하는 기록을 브랜딩하기 좋게 기록하기 위한 사이트로 시작하였고,  취업을 위한 포트폴리오를 위해 필요한 요구사항을 이번 기회에 녹여보자는 목표를 세웠습니다.
https://github.com/murphybread/project-log

프로젝트를 완성하기 위해 이번 주에 한 메인 활동은은 커스텀 UI 라이브러리 만들기였습니다. Material UI를 써보면서 느낀 것을 토대로 나만의 커스텀 UI 라이브러리를 만드는게 추후에 필요할 것 같기에 이를 구현하였습니다. Material UI를 레퍼런스삼으면서도 필요한 기능을 원하는 대로 수정 할 수 있는 UI 컴포넌트를 만들게 됐습니다.



#### project-log에 들어가기 위한 포트폴리오에 적용 시킬 요소 정리
**React를 활용한 프로젝트**라는항목에 적합한 프로젝트로
현재 project log가 **어떤 점에서 포트폴리오로서 장점이 될지 생각**해보기

- (필수) 기능과 관련된 상태 관리(프로젝트,  커밋, 추가, 수정)
- (필수) 여러 React Component 개념 및 Hooks활용
- (필수) React 트러블 슈팅
- 서버 통신?은 강하지 않은 편 수정 필요
- (필수) Mock 테스트 프레임워크 필요
- (필수) 최적화 경험 필요
- (옵션) storybook을 통한 컴포넌트 관리
- (필수) HTML 및 CSS 구현 프로젝트에서
- (옵션) zustand 상태 관리 라이브러리 사용여부
- (옵션) webpack 번들 라이브러리



#   ui 라이브러리 대신 자체 ui 라이브러리구축하기
장점
 - 커스텀 원활
 - 번들 사이즈 줄이기
 - 의존성 감소
 - 점진적 구현
단점
- 개발 시간 증가
- 테스트 부담 증가
- 기능 제한
- 일관성 유지 어려움




#### UI UX 참고 사이트
  - [https://www.awwwards.com/](https://www.awwwards.com/) [https://ecomm.design/](https://ecomm.design/
  - [https://www.siteinspire.com/](https://www.siteinspire.com/) 
  - [https://mobbin.com/browse/ios/apps](https://mobbin.com/browse/ios/apps)
  - [https://dribbble.com/](https://dribbble.com/)
  - [https://refero.design/](https://refero.design/)



UI / UX 라이브러리
https://uiverse.io/cards

mui Color 쉽게 보기
https://bareynol.github.io/mui-theme-creator/#Chip



Card.jsx 필요한 것 정리
- CardHeader
	- title
	- subtitle
	- action
	- className
- CardContent
	- children
	- spacing
	- disableSpacing
- CardMedia.
	- Media
	- src
	- width
	- height
- CardAction(필요하면 만들기)
- CardActionArea(필요하면 만들기)

Devider 추가 ( CardHeader 구현시 title과  subtitle구분하려는데 이 때만 구분선 안 쓰고 다른데도 쓸거 같아서 + width맞추기가 w-max로 해야하는데 컨텐츠에 맞추려고한다면 구분선이 컨텐츠에 의존적이라 나중에 문제 생길 것같아서 관심산 분리)
- variant
- thickness
- spacing
- className



`overflow`
> content가 넘칠 때 바꿀 수 있는 속성

**부모**에게 할 것 . 부모 요소의 경계를 벗어나는 모든 자식 콘텐츠를 숨겨라라는 의미이기 떄문
```css
overflow: visible /*default*/
overflow: hidden /*숨김*/
overflow: scroll /*스크롤로 이동*/
...

```


`object-fit`
> `<img>`나 `<video>`의 크기를 컨테이너에 맞게 조절하기

```css

object-fit: fill /*기본값이며 주어진 크기를 채우도록 늘어나거나 줄어듬*/
object-fit: cover /*종횡비를 유지하면서 이미지에 맞게 잘림*/

object-fit: contain; /*종회비 유지*/
...

```

>![help] h-64와 h-full인데도 이미지가 h-64로 덮어지는 이유
>잘모르겠음. 그냥 없애서 해결함. calssName뒤에 위치했음에도 불구하고 ㅁ여시한 높이가 우선순위가 높게 적용됨



Typography 컴포넌트
- children,
- variant,
- color,
- align,
- weight,
- whitespace ,
- className,


# 중첩 구조 문제 해결하기


현재 상태 구조
```
      divider: {
        base: "border-gray-900",
        horizontal: "w-full border-t",
        vertical: "h-full border-l",
        thin: "border-[0.5px]",
        medium: "border-[1px]",
        thick: "border-[2px]",
        sm: "my-1",
        md: "my-2",
        lg: "my-4",
      },
```

사용방식
```
  const baseClasses = useTheme((state) => state.getComponentStyle("divider")["base"]);
  const variantClasses = useTheme((state) => state.getComponentStyle("divider")[variant]);
```

가져오는 방식
```
  getComponentStyle: (component) => {
    const state = get();

    return state.styles[state.mode][component];
  },
```

장점은 컴포넌트만 입력하면 되고, 이후 1차원으로 형성된 해당 **"컴포넌트"** 기준의 속성값을 쉽게 가져올 수 있음.

하지만 단점으로는 컴포넌트의 속서잉 많아지면 관리가 어려워짐
예를들어 15개의 속성중 1~7은 variant값이고, 8~10은 size값이고 11~15는 color값인 경우 구분이 어려워짐.


그래서 초기에는 컴포넌트 > 속성이름 > 속성 값형태로 구조를 바꿀까 생각을 했지만 그럴 경우 사용방법이 다음과 같이 됨
```
  const baseClasses = useTheme((state) => state.getComponentStyle("divider", "variant")[variant]);
```

컴포넌트> 속성이름> 실제 props로받는값으로 표현되니 개인적으로 보기 안좋아보였음. 나중에 실수하기 쉬워보임.



그래서 AI랑 이야기하면서 고민한 결과는 다음과 같음
속성의 이름값에 정보를 추가함으로써 1차원으로 표현하면서도, 속성이 많아져도 구분하기 어려운 문제를 해결함
```
divider: {
  // variant 관련
  variant_horizontal: "w-full border-t",
  variant_vertical: "h-full border-l",
  variant_primary: "border-gray-800",
  
  // thickness 관련
  thickness_thin: "border-[0.5px]",
  thickness_medium: "border-[1px]",
  thickness_thick: "border-[2px]",
  
  // spacing 관련
  spacing_sm: "my-1",
  spacing_md: "my-2",
  spacing_lg: "my-4",
  
  // 기본
  base: "border-gray-900",
}
```

사용시 다음과 같이 한번에 사용하는 형태로변경
**이전에는 함수값에 대해 결과값이 어떤값인지 모르는상황에서 객체의 키값으로 접근**이었다면, **이제는 함수 파라미터에서 접근하는 키값자체가 `속성_변수 문자열`형태임을 알기에 헷갈림을 줄였다고 판단**
```
const variantClass = useTheme((state) => state.getComponentStyle("divider", `variant_${variant}`));
```



# whitespace CSS
줄바꿈 관련 특히

| Class                     | Styles                       |
| ------------------------- | ---------------------------- |
| `whitespace-normal`       | `white-space: normal;`       |
| `whitespace-nowrap`       | `white-space: nowrap;`       |
| `whitespace-pre`          | `white-space: pre;`          |
| `whitespace-pre-line`     | `white-space: pre-line;`     |
| `whitespace-pre-wrap`     | `white-space: pre-wrap;`     |
| `whitespace-break-spaces` | `white-space: break-spaces;` |


# 윤곽선 표시에서 outline 속성 대신 border를 사용하는 이유
> 결국 outline속성은 모든면에 대해 딱딱하게 수정만 가능하고 그리고
> 레이아웃의 길이가 예를들어 border까지 포함해서계산하는경우가 많기 때문에
> width에 영향을 주기에 평소에는 transparent로 설정을 하다 props를 받아서 색을 표시하는것도 하나의 팁




`break-word`
> 긴 url같은 텍스의 줄바꿈 관련 속성

```
overflow-wrap: normal;
overflow-wrap: break-word;
overflow-wrap: anywhere;
```


# AI Agent
AI 활용 기술인 Agent 쪽 통합 프로젝트 따로 진행중
Comfyui쪽 generate 텍스트 대체 시스템 프롬프트 작성
글 작성

현재 Local ASR(RealtimeSTT) + Kokoro82M TTS +LLM (gpt4o-mini) + RAG(qdrant) + Comfy UI

현재 로컬에서 ASR과 TTS가 구현되며, LLM과  RAG기능을 통해 대화하듯이 이야기가 가능한 상태. 추가로 Comfy UI를 통해 이미지 생성 기능까지 추가

AI agent 레퍼런스
- Deepseek+Exaone+Docling으로 오픈소스 Reasoning RAG 구축하기 참고용 유튜브 비디오 https://www.youtube.com/watch?v=4j6J-9hxfhk&t=290s
- Docling pdf와 같은  데이터 전처리용 프로젝트 https://github.com/DS4SD/docling


user_id column에 추가하는 기능 하나 넣기
qdrant_memory에서 추가하고 테스트->
qdrant_memory를 참조하는 state_server에서 수정
state_server를 참조하는 backedn_serverd에서 수정

End to End 테스트
에러 발생. 키워드값이 user_id에 들어감.
update_or_append_conversation기준으로 전부 수정했지만 qudrant_memory의 리턴값이 save_conversation에서 에러가발생

테스트 케이스 2개로 넣는게 좋은듯. qdrant memory테스트에서 
1. 세션이 없는 경우
2. 세션이 있는 경우



Comfyui t2i 자연어제공 및 빠른 속도모델 링크
https://huggingface.co/tensorart/stable-diffusion-3.5-large-TurboX/tree/main

https://stability.ai/learning-hub/stable-diffusion-3-5-prompt-guide





