---
{"dg-publish":true,"permalink":"/resources/history-of-library/","noteIcon":"0","created":"2023-12-31T20:39:20.070+09:00","updated":"2024-01-05T01:30:12.672+09:00"}
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




# code font and color change
just code element not working so , important used
code {
    background-color: #c4b7b7 !important;
    color: #1077ffcb !important;
    padding: 2px !important;
    font-weight: bolder !important;
}


# markdown badge image position
original is too much right
original is src/site/styles/obsidian-base.scss
```
  .external-link {
    color: var(--link-external-color);
    text-decoration-line: var(--link-external-decoration);
    background-position: center right;
    background-repeat: no-repeat;
    background-image: linear-gradient(transparent, transparent), url('/img/outgoing.svg');
    background-size: 13px;
    padding-right: 16px;
    background-position-y: 4px;
    cursor: var(--cursor-link);
    filter: var(--link-external-filter);
  }
```


I guess this code is cause
`background-position: center right;`


So I annotated this line
src/site/styles/custom-style.scss
```
  .external-link {
    color: var(--link-external-color);
    text-decoration-line: var(--link-external-decoration);
    background-position: center right;
    background-repeat: no-repeat;
    background-image: linear-gradient(transparent, transparent), url('/img/outgoing.svg');
    background-size: 13px;
    padding-right: 16px;
    background-position-y: 4px;
    cursor: var(--cursor-link);
    filter: var(--link-external-filter);
  }
```

but not work so i find element that
markdown-rendered img
only works when using !important
```
.markdown-rendered img {
        float: left !important;

    }
```

![find style using develop tool.png](/img/user/images/find%20style%20using%20develop%20tool.png)


add new line after badge
```

.markdown-rendered img {
        float: left !important;

    }

.external-link::after {
    content: "";
    display: block;
    clear: both;

}
```



# change img soruce width and clear

`p::before` and `clear`
```
.markdown-rendered p::before {
    content: ""; /* Creates a pseudo-element */
    display: table; /* Ensures the content is treated as a block-level table */
    clear: both; /* Clears the float */
}
```


# add pre code block style
```
/*code block style test */
pre {
    background-color: #f4f4f4; /* Light grey background */
    border: 3px solid #d4c7c7b0; /* Light grey border */
    border-left: 3px solid #f36d33; /* Highlighted left border for emphasis */
    padding: 1em; /* Padding inside the pre element */
    margin: 1em 0; /* Margin above and below the pre element */
    overflow: auto; /* Adds a scrollbar if the content overflows */
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace; /* Monospaced font for better code readability */
    white-space: pre-wrap; /* Ensures the text wraps and preserves spaces and line breaks */
    word-break: break-all; /* Allows long words to be able to break and wrap onto the next line */
    line-height: 1.5; /* Line height for better readability */
}
```


# code and pre tags style by ai
```
/* Style for code blocks */
pre {
    background-color: #f7f7f7; /* Light gray background */
    border: 1px solid #e1e1e8; /* Light border color */
    border-left: 4px solid #6699cc; /* Thicker left border for emphasis, blue color */
    padding: 0.5em; /* Padding inside the pre element */
    overflow-x: auto; /* Horizontal scrollbar if the content is too wide */
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace; /* Monospaced font for better readability */
    white-space: pre; /* Preserves whitespace and line breaks as they are in the code */
    color: #333; /* Dark grey color for the text */
}

/* Style for inline code */
code {
    background-color: #eff0f1; /* Slightly different background color for inline code */
    border: 1px solid #dcdcdc; /* Subtle border for inline code */
    border-radius: 3px; /* Rounded corners for inline code */
    padding: 0.2em 0.4em; /* Padding around the inline code */
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace; /* Monospaced font for better readability */
    font-size: 0.9em; /* Slightly smaller font size for inline code */
    color: #c7254e; /* Reddish color for the text, often used for inline code */
}
```

### before
```
code {
    background-color: #c4b7b7 !important;
    color: #0146a1cb !important;
    padding: 2px !important;
    font-weight: bolder !important;
}

pre {
    background-color: #f4f4f4; /* Light grey background */
    border: 3px solid #d4c7c7b0; /* Light grey border */
    border-left: 3px solid #f36d33; /* Highlighted left border for emphasis */
    padding: 1em; /* Padding inside the pre element */
    margin: 1em 0; /* Margin above and below the pre element */
    overflow: auto; /* Adds a scrollbar if the content overflows */
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace; /* Monospaced font for better code readability */
    white-space: pre-wrap; /* Ensures the text wraps and preserves spaces and line breaks */
    word-break: break-all; /* Allows long words to be able to break and wrap onto the next line */
    line-height: 1.5; /* Line height for better readability */
}

```
![codestyle.png](/img/user/images/codestyle.png)

### After
white background web site, so black window
```
.markdown-rendered pre code {
    background-color: #242121; /* Black background for inline code */
    color: #ff6347; /* Reddish color for text */
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 0.9em;
}

/* Specificity increased with .markdown-rendered to ensure override */
.markdown-rendered pre {
    background-color: #000; /* Black background for code blocks */
    color: #f5f5f5; /* Light grey, almost white color for text */
    border-left: 4px solid #ff6347; /* Reddish color for the left border */
    padding: 1em;
    overflow: auto;
    font-family: var(--font-monospace); /* Using the CSS variable for monospace font */
    white-space: pre-wrap;
    word-wrap: break-word;
    border: none; /* Override any existing borders */
}

.markdown-rendered pre code {
    /* Styles for inline code */
    background-color: #000; /* Black background for inline code */
    color: #ff6347; /* Reddish color for text */
    padding: 0.2em 0.4em;
    border: none; /* Remove border */
    border-radius: 2px; /* Keep rounded corners if desired */
    font-family: var(--font-monospace); /* Using the CSS variable for monospace font */
    font-size: var(--code-size); /* Using the CSS variable for code size */
}

.markdown-rendered code {
    /* Styles for inline code */
    background-color: #000; /* Black background for inline code */
    color: #ff6347; /* Reddish color for text */
    padding: 0.2em 0.4em;
    border: none; /* Remove border */
    border-radius: 2px; /* Keep rounded corners if desired */
    font-family: var(--font-monospace); /* Using the CSS variable for monospace font */
    font-size: var(--code-size); /* Using the CSS variable for code size */
}


```




# modify js and apply css


from html search order css
but note.njk  like this
```
  {% for imp in dynamics.common.head %}
  {% include imp %}
```

so find dynamics.js

AI Suggest Style path incorrect.  Because I ask i don have /user directory but it used in function
and second is order for custom.css

before
`const STYLE_PATH = "src/site/styles/users";`

after
`const STYLE_PATH = "src/site/styles/";`
```

const STYLE_PATH = "src/site/styles/";


// const generateStylesPaths = async () => {
//   try {
//     const tree = await fsFileTree(`${STYLE_PATH}`);
//     let comps = Object.keys(tree).map((p) =>
//       `/styles/user/${p}`.replace(".scss", ".css")
//     );
//     comps.sort();
//     return comps;
//   } catch {
//     return [];
//   }
// };

const generateStylesPaths = async () => {
  try {
    // Adjusted to the correct styles directory
    const tree = await fsFileTree(`src/site/styles/`);
    let comps = Object.keys(tree)
      .map((p) => `/styles/${p}`.replace('.scss', '.css'))
      // Remove custom-style.css if it's already in the array to re-add it later
      .filter((path) => !path.endsWith('custom-style.css'));
    // Sort the array to maintain a consistent order
    comps.sort();
    // Add custom-style.css at the end to ensure it's the last stylesheet
    comps.push('/styles/custom-style.css');
    return comps;
  } catch {
    return [];
  }
};
```


# hr for new line
In markdown `---` horizon line makes new line. In html to makes new line defualt.
but my case not worked. So I inspect why, because no margin and padding in hr styles
So I just add it approximately 20px

### Causion
`I need to distinguish which HRs should have the style applied to that`

If you're unsure about which tags are affected by a specific tag, you can use a developer tool like F12 to check.

```
.markdown-rendered hr {
    margin-top: 20px;  /* Adds 20 pixels of space above the <hr> */
    margin-bottom: 20px;  /* Adds 20 pixels of space below the <hr> */
}
```