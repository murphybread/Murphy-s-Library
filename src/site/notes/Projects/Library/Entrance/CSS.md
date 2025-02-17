---
{"dg-publish":true,"title":"CSS 단위 규칙 레이아웃 선택자와 속성","description":null,"permalink":"/projects/library/entrance/css/","dgPassFrontmatter":true,"noteIcon":"0","created":"2025-01-27T00:39:47.308+09:00","updated":"2025-02-18T00:48:33.305+09:00"}
---

현재 노트: [[Projects/Library/Entrance/CSS\|CSS]] 
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


# 글 작성 이유

중요한 단위 rem과 em같은 `단위`, @keyframe과 같은 `@-규칙`,  flexbox와 같은 `레이아웃`, `선택자`와 `속성`등 디자인 요소보다는 CSS의 프로그래밍 요소 중 직접 써서 나중에도 볼만한 것들을 기록해 놓기 위하여 글을 작성합니다.


# 단위

#### `rem`
**The root element's font-size**

#### `em`
**my parent element's font-size**

# @-규칙



# 레이아웃


# 선택자와 속성
#### **_pseudo-class_(가상 클래스)**
선택된 요소의 특정 상태를 스타일링 하는데 사용되는 추가 클래스
가상 클래스는 콜론( `:`) 뒤에 가상 클래스 이름(예: `:hover`)이 오는 방식으로 구성됩니다.

#### border: `thickness` `style` `color`
- `thickness`: pixel(px) 단위로 지정 ex) 5px ...
- `style`: 테두리 스타일 지정 ex) solid, dotted ...
- `color`: 색상명. 문자열, hex, rgb 등 ex) blue, `#FF0000`, rgb(255, 0, 0)

`cursor`: 마우스 hover시 모양
- `pointer`: 포인터 모양
- `wait`: 기다리는 표시인 모래시계
- `not-allowed`: 금지 표지판

`transition: [property] [duration] [timing-function] [delay]`: 애니메이션 효과를 스타일링
- `property`: 기본값은 **all** 모든 속성에 적용하기
- `duration`: 03s와 같이 애니메이션이 지속되는 시간
- `timing-function`: 애니메이션의 변화 분기점을 조절가능 **ease**, **ease-in**, **ease-out**, **ease-in-out**, **linear** 이외에 커스텀하게 변화를 주기 위해서는 **cubic-bezier(x1, y1, x2, y2)** 사용 [cubic-bezier참조사이트](https://cubic-bezier.com/#.17,.67,.83,.67)
	- Y값 범위 효과
		- Y>1 요소가 종료 지점을 넘었다가 돌아옴(**튕김**)
		- Y<0 요소가 시작 지점 뒤로 뻇다가 진행(**탄성**)
- `dealy`: 해당 애니메이션이 동작하기전 지연 시간 0.5s 같은 형태


