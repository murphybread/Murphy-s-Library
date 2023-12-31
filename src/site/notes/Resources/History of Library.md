---
{"dg-publish":true,"permalink":"/Resources/History of Library/","noteIcon":"0","created":"2023-12-31T20:39:20.070+09:00","updated":"2024-01-01T03:07:41.222+09:00"}
---

#Hompage #[[Resources/Hompage\|Hompage]] 

# Guest book

problem: record reaction of users in all notes

solution: using external service [joey](https://joey.team/)

| Feature | Expected Value | Joey |
| ---- | ---- | ---- |
| Implementation Required | html tag | html (iframe) |
| Coverage | All Notes | All Notes |
| User Reaction Recording | Anonymity , private user, no login  | Anonymity , no private ,no login,  |
| Customization Options | Not to much | title , placeholder , color |
| Integration Complexity | Low | Low |
| Cost | Affordable | Free up to 3 blocks(no limited response, block is component in Joey) |
| Operational Management | One Endpoint | one site (can see all history and users) |


구글 애널리틱스 (도메인 구입 및 연결, visit counter 임베딩 구현후 각 페이지별로는 못 구해서 해당 서비스사용)

# src/site/_includes/layouts/note.njk 에 analytics & 방명록 일괄 적용
모든페이지에 들어가는 항목의 경우 각 각의 md파일에 대한 템플릿아닌, 적용되는 웹페에지에 적용

구글 아날리틱스는 모든페이지 헤드에 있는게 일반적
보안도 딱히 관리해야하는 것없음

I frame은 글을 읽은 다음 쓸 수 있게 페이지 맨 아래에 위치
```
<!DOCTYPE html>
<html lang="{{ meta.mainLanguage }}">
  <head>
    ...
    {%include "components/pageheader.njk"%}
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-QHF8SF84LT"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-QHF8SF84LT');
    </script>
    ...
  </head>
  <body>
    ...
    {{ content | hideDataview | link | taggify | safe}}
    
    <!-- Iframe Content -->
    <iframe src="https://joey.team/block/?id=4zfONMIb0udThRYvgsJesRl8BG13&block_id=LVHLMUlfRfZ9t0EyPdOI" 
        width="600" 
        height="400" 
        style="border: 10px solid #2e2e2e;border-radius: 10px;"
        allowfullscreen>
    </iframe>
    ...
  </body>
</html>

```



# 구글 번역기능


구글 번역 구현
body에서 첫번쨰 end for 다음에 위치


언어 추가
보더 추가
위치 변경


google.translate.TranslateElement.InlineLayout.SIMPLE 추가
  
The `layout` option in the Google Translate widget configuration specifies the appearance of the translate widget on your webpage. When you set `layout` to `google.translate.TranslateElement.InlineLayout.SIMPLE`, it instructs the widget to use a simple inline layout without any additional dropdown menus or complex formatting.

label lnaguage는 client brower language

google 위젯 크기 조정
```
.goog-te-gadget-simple {
  font-size: 0.9em; /* Smaller font size might reduce the widget size */
}

.goog-te-gadget-icon {
  display: none; /* This can hide the dropdown icon, making the button simpler */
}

```



```
    {% include imp %}
    {% endfor %}
    {{ content | hideDataview | link | taggify | safe}}
<!-- Google Translate div -->
<div id="google_translate_element" style="position: absolute; top: 20px; right: 20px;"></div>

<!-- Google Translate Initialization Script -->
<script type="text/javascript">
  function googleTranslateElementInit() {
    new google.translate.TranslateElement({pageLanguage: 'en', includedLanguages: 'ko'}, 'google_translate_element');
  }
</script>

<!-- Google Translate API Script -->
<script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>

```

css  에서 조정하기 (구글 default css box size등이 문제 같음)
src/site/styles/custom-style.scss
```
body {
    /***
      ADD YOUR CUSTOM STYLIING HERE. (INSIDE THE body {...} section.)
      IT WILL TAKE PRECEDENCE OVER THE STYLING IN THE STYLE.CSS FILE.
   ***/
    //  background-color: white;
    //  .content {
    //   font-size: 14px;
    //  }
    //  h1 {
    //   color: black;
    //  }
}


.goog-te-gadget-simple {
    font-size: 0.9em; /* Smaller font size might reduce the widget size */
    display: inline-block; /* Ensures the widget takes only necessary space */
    min-width: auto; /* Lets the widget size adjust to content */
    min-height: auto; /* Adjusts the height based on content */
}


.goog-te-gadget-icon {
    display: none; /* This can hide the dropdown icon, making the button simpler */
}
```

1시도 변화없음
.goog-te-gadget-simple {
    font-size: 0.9em; /* Smaller font size might reduce the widget size */
    display: inline-block; /* Ensures the widget takes only necessary space */
    min-width: auto; /* Lets the widget size adjust to content */
    min-height: auto; /* Adjusts the height based on content */
}

2시도 변화없음
.goog-te-gadget-simple {
    font-size: 0.9em; /* Smaller font size might reduce the widget size */
    display: inline-block; /* Ensures the widget takes only necessary space */
    width: auto; /* Lets the widget size adjust to content */
    height: auto; /* Adjusts the height based on content */
}

3시도 콘솔창에서 확인후 수동 변경
.goog-te-gadget-simple {
    font-size: 0.9em; /* Smaller font size might reduce the widget size */
    display: inline-block; /* Ensures the widget takes only necessary space */
    width: 80px; /* Or set a specific width if necessary */
    height: 25px; /* Or set a specific height if necessary */
}


# index.njk 알기
홈페이지에 관한 것은 index.njk파일에서 관리