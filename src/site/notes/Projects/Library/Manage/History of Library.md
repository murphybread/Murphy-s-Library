---
{"dg-publish":true,"permalink":"/projects/library/manage/history-of-library/","noteIcon":"0","created":"2023-12-31T20:39:20.070+09:00","updated":"2024-03-20T02:03:19.578+09:00"}
---

#History #Versioning_Strategy 
# Versioning Standard
[[Projects/Library/000/020/020.00/020.00 c\|020.00 c]]



# 0.4.0-PY
## create template file for initial RAG state

Before we implement RAG, we want to break it down into two stages. After all, when we first implement RAG, we will be passing the context in the form of an LLM, which is inefficient in terms of speed and ocst if it contains all the content.
First stage without content (000.010,010.00 etc.) and second stage with content (010.00 a, 010.00 etc.)
Create a file that only knows the descriptions of the files containing content files by pulling their filenames and descriptions from the first stage.

What we've updated in this version is a python file that creates a template for the primary stage
The important things in that file are paths and Regex.

Executable path some_path/Managed/create_base_template.py
Reading path some_path/Library/Managed/...
Writing file path some_path/Managed/Librarian/template.md

It's important to make sure the path is readable, and which regular expression is used to read the file.
The module has two functions
The first one extracts the description. The main point is to extract the content from the footer via `r'^---\n(.*?)\n---'` and then extract the description via metadata.group(1), i.e. the data must be in the promised format.
The second is recursively searching through rglob and returning by mdfile starting with 3 digits via regular expression



# 0.3.4-LB
## Using gist for centralized management for code snippets

WYSIWIG
Key point is .pibb. for using my web
```
<iframe src="https://gist.github.com/murphybread/a0a351e489cde4b2064fcd3a7855d885.pibb?file=automation.py" width="100%" height="300"></iframe>
```

# 0.3.3-PY
## Overwrite the article's tag line

Modify exist `add_tags_to_md_files` function
What i want to do is overwrite the files' tag line. It is because a new tag is being added to an already existing tag
So I modify this part. first get distinguish body. by the split function divide tag and contents. And Combine these properly


```
                        if "---" in content and new_tag:
                            parts = content.split("---", 2)
                            if len(parts) == 3:
                                header, middle, body = parts                              
                                body_lines = body.split('\n', 2)
                                
                                modified_body = f"{new_tag}\n{body_lines[2]}" if len(body_lines) > 1 else new_tag
                                new_content = f"---{middle}---\n{modified_body}"  # Reassemble the new content
                                
                                f.write(new_content)
                                f.truncate()  # Remove the rest of the old content
                                print(f"Added tag to {new_tag}")
```

# 0.3.2-LB

## Two template post formats, depending on whether the content has a source or not


## **Template 1: For Content with a Source**

<div class="transclusion internal-embed is-loaded"><a class="markdown-embed-link" href="/projects/library/manage/template-source/" aria-label="Open link"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg></a><div class="markdown-embed">




# Title
#Tag


## Audience
Target audience or group
## Features
Key functionalities and benefits
## Usage
Step-by-step implementation guide.


</div></div>


## **Template 2: For Content without a Source**


<div class="transclusion internal-embed is-loaded"><a class="markdown-embed-link" href="/projects/library/manage/template-no-source/" aria-label="Open link"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg></a><div class="markdown-embed">




# Title
#Tag


## Audience
Target audience or group
## Overview
Summary of this article including background and table of contents
## Content
Body of the article 
## Conclusion
This section summarizes the key findings and suggests next steps



</div></div>




# 0.3.1-LB,OB

Structural management from one file  
  
In the case of `![[note_name]]` in obisidian's markdown grammar, it is called Wikilink, which shows the contents of the linked note. In other words, the mirroring method makes the two structures managed by Homepage and call-number-index manage in one place  
  
The result is easy to implement and easy to manage afterwards


# 0.3.0-LB,PY

This is what I want to do.

major md file tags `#[[800]]#test_major`
minor md file tags  `#[[800]]#test_major#[[810]]#test_minor`
sub md file tags  `#[[800]]#test_major#[[810]]#test_minor#[[810.00]]#test_sub`
books md file tags  `#[[800]]#test_major#[[810]]#test_minor#[[810.00]]#test_sub#[[810.00 a]]#test_book`

## 3 steps
### Checking
Use Regex
```py
    major_regex = re.compile(r'^([0-9]{1}00)\.md$') 
    minor_regex = re.compile(r'^([0-9]{1}[1-9][0-9])\.md$') 
    subcategory_regex = re.compile(r'^([0-9]{1}[1-9][0-9])\.([0-9]{2})\.md$') 
    book_regex = re.compile(r'^([0-9]{1}[1-9][0-9])\.([0-9]{2})\s([a-z])\.md$', re.IGNORECASE)
```

### Making code
Think about data
when not major, convert major
when sub or book, consider position of function argument

```py
    major_code, minor_code, sub_code, book_code = "", "", "", ""
    
    
    if major_regex.match(file_name):
        major_code = major_regex.match(file_name).group(1)
    elif minor_regex.match(file_name):
        major_code = minor_regex.match(file_name).group(1)[:1] + '00'
        minor_code = minor_regex.match(file_name).group(1)
    elif subcategory_regex.match(file_name):
        major_code = subcategory_regex.match(file_name).group(1)[:1] + '00'
        minor_code = subcategory_regex.match(file_name).group(1)
        sub_code = subcategory_regex.match(file_name).group(2)
    elif book_regex.match(file_name):
        major_code = book_regex.match(file_name).group(1)[:1] + '00'
        minor_code = book_regex.match(file_name).group(1)
        sub_code = book_regex.match(file_name).group(2)
        book_code = book_regex.match(file_name).group(3)
```

### Making tag
If you know how to use get for recursive contents in JSON, function become very easy
Understanding data structures and creating variables with JSON enables this recursive structure
```py
    tag = ""
    
    if major_code:
        major_info = json_structure.get("MajorCategories", {}).get(major_code, {})
        tag += f"#[[{major_code}]]#{major_info.get('title', '').replace(' ', '_')}"
    if minor_code:
        minor_info = major_info.get("MinorCategories", {}).get(minor_code, {})
        tag += f"#[[{minor_code}]]#{minor_info.get('title', '').replace(' ', '_')}"
    if sub_code:
        sub_info = minor_info.get("Subcategories", {}).get(f"{minor_code}.{sub_code}", {})
        tag += f"#[[{minor_code}.{sub_code}]]#{sub_info.get('title', '').replace(' ', '_')}"
    if book_code:
        book_info = sub_info.get("Books", {}).get(f"{minor_code}.{sub_code} {book_code}", "")
        tag += f"#[[{minor_code}.{sub_code} {book_code}]]#{book_info.replace(' ', '_')}"
    
    
    print(major_code, minor_code , sub_code, book_code)
    
    
    return tag

```


#  0.2.3-OB
## Change dataview query

```dataview-exmaple
TABLE file.name AS title, file.path, file.mtime
FROM "Projects/Library"
WHERE dg-publish = true
SORT file.ctime DESC
LIMIT 7
```

Add Table attrivutes modifed time path and remove link
Specifify query path "Projects/Library"
Increase Limit to 7

# 0.2.2-LB
## Using GitHub to Share Synchronized Python Files Across Different Platforms

### Problem

The current Obsidian sync functionality only supports synchronization for files with Python file extensions, excluding files in other formats such as Markdown (md).

Initial attempts involved converting Python files into Markdown (md) or inserting Python code into Markdown files. However, this approach resulted in excessive fragmentation and posed challenges for management.

### Solution

https://github.com/murphybread/Library

To address this issue, the solution is to utilize GitHub links for syncing files between different platforms, such as Mac and Windows. This can be achieved by performing a 'git pull' to ensure synchronization with the latest version when starting work through the GitHub link.



# 0.2.1-PY
## dg-publish frontmatter position
### Problem
Notes not showing up on the homepage
Reasoning
There are some things that work and some things that don't, and in particular, there is a 404 in the case of the latter, so it seems that there is a problem with publishing.

If the tag of the note that doesn't work is separated by a line like this, it is judged as a problem.
problem form
```
---


dg-publish: true

---
```


### Solution.
Tested some notes by moving the tags as follows and confirmed normal operation.
Then I added a function called `update_content_and_position` in the python file.
duplicate_tag.py to automate it.

```
---
dg-publish: true



---
```

# 0.2.0-PY

## Change the call number index structure and modify the convert file

### Problem
`obisidian use ![[filename]] preview of note, but line break and indentation was wrong`

Major category indent was wrong

As-is Used this structure pattern
```
[[000]] IT Knowledge
- [[010]] Develop Knowledge
	- [[010.00]] Develop Computer Science Knowledge
		- [[010.00 a]] Essential Developer Insights
	- [[010.10]] Develop Programming Language
		- [[010.10 a]] Bash shell

```

Major Category don't use hypen.
That makes preview error indent and line break

### Solution

### First Change call number md file like this
```
- [[000]] IT Knowledge
	- [[010]] Develop Knowledge
		- [[010.00]] Develop Computer Science Knowledge
			- [[010.00 a]] Essential Developer Insights
		- [[010.10]] Develop Programming Language
			- [[010.10 a]] Bash shell
```

### Second Change convert_josn.py 
Important point is just change a little bit. Because I don't want to change output.json, filename, path etc...
only consider point is major and minor category variable.

```
major_match = re.match(r"- \[\[(\d0\d)\]\]\s*(.*)", line)
minor_match = re.match(r"- \[\[(\d[1-9]\d)\]\]\s*(.*)", line)
```


# 0.1.1-PY
### Managing Only Programming Files with .gitignore: Excluding Content Files

## Problem

In the process of starting git pull first, a conflict issue occurs if there is a change in the content file.
It is appropriate to manage .md files other than .py only using the Sync function of the Obisidan tool.

## Solution
1. Delete .md files from remove server (when command is worked not delete immedately. you shoud commit and push)
```
git rm --cached -r "*.md"
```
1. Register files with md extension (fileanme should be `.gitignore)
```
.gitignore
*.md
```

if command worked and file is created,
next step is commit and push
`git commit -m "Managing Only Programming Files with .gitignore: Excluding Content Files"`
`git push`



# 0.1.0-LB
## automated tag from filename <- key point

This was hard because it is a backwards and forwards type, so if it is major.md, it is different from minor.md, sub.md, and books.md, and we aimed for a function that gets the value corresponding to the key in the structure.json file and processes it.

So, to simplify things a bit more, we went from filename-based to a situation where the exact filename is strictly enforced by the policy, and then we can automate it appropriately.

The key point is filenames, and only for content files.
Later on, we'll also apply it to uncharacterized category files, but that's for later...

# 0.0.4-OB
# DataView modified
This query is used for Recent Post in homepage.
I delete file.path and add file.tags
tags doesn't display backlink tags

```dataview-example
TABLE file.name AS Title, file.tags AS Tags
FROM "Projects/Library"
WHERE dg-publish = true
SORT file.ctime DESC
LIMIT 7
```



# 0.0.3-PY
## Add Tag using structure,json in contents file

Adopting the approach of using filenames to create tag numbers was beneficial.
Upon updating to Dataview , I realized that attaching tags from book contents enhances usefulness.
Consequently, I integrated a 'booksTag' function.

Initially, I experimented with a function from another file, which utilized a 'title' variable.
However, to avoid dependencies, I ultimately developed the function within 'automation.py'.
I then opted to modify only a single function, as adding more could complicate matters. Incorporating the tagging functionality into an existing function proved sufficient.


# 0.0.2-OB
## Modify the table to provide more useful information to the readers.
Easily see which files have been modified, and see the tags they have at a glance

- Change the standard modification time not the create time `file.ctime -> file.mtime`
- Exclude md file that have the tag `#Library` 

```dataview-example
TABLE file.name AS Title, file.tags AS Tags
FROM "Projects/Library" AND -#Library
WHERE dg-publish = true
SORT file.mtime DESC
LIMIT 7
```





# 0.0.1-LB
## The Library Cleaning

Changing History of Library.md from hardcoding to github gist
Better viewing of code on screen in the UI

### Before
![before.png](/img/user/images/before.png)

### After
![short.png](/img/user/images/short.png)







# Initialize
# 0.0.0-LB

Major: The change creates a new process that may not work with the old process and requires significant consideration. Set version criteria more granularly
Keep major, which generally means not backwards compatible, intact

Minor: The change affects current processes and will require attention in the future. Minors are listed as feature additions. File creation, module additions, etc.
However, some minors may be incompatible. Because they don't mean exactly the same thing
For example, if a Python file in a certain version references example.txt, but you change it to base_template, it will not work in previous versions, but the purpose is for testing purposes, so it is considered MINOR in terms of impact.

Patch: The change is minimal or don't require much attention after the change. especially Patches are improvements such as variable names, bug fixes, refactorings, etc. 



The reason for the change is that I didn't have an explicit criterion for considering the version impact, and now it's explicit.







---


# ADD-Ons
## Guest book 

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

##  Apply Google Analytics in bulk to all pages

`src/site/_includes/layouts/note.njk`
Initially, I attempted to insert an HTML script into all MD files, but I realized that it was too difficult. So, I looked for a template file that the MD files use to apply to the actual webpages
the template file is note.njk file

About Homepage is managed by index.njk


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
## Google Translation
Implementing Google Translation
Add script in position that after body's first 'end for'


After install, custom settings

Add Languages
Add a Border
Change location

### Google Translation-CSS
```
.goog-te-gadget-simple {
    font-size: 0.9em; /* Smaller font size might reduce the widget size */
    display: inline-block; /* Ensures the widget takes only necessary space */
    width: 80px; /* Or set a specific width if necessary */
    height: 25px; /* Or set a specific height if necessary */
}


.goog-te-gadget-icon {
    display: none; /* This can hide the dropdown icon, making the button simpler */
}
```
### Google Translation-HTML
```
    {% include imp %}
    {% endfor %}
    {{ content | hideDataview | link | taggify | safe}}
<!-- Google Translate div -->
<div id="google_translate_element" style="position: absolute; top: 20px; right: 20px;"></div>

<!-- Google Translate Initialization Script -->
<script type="text/javascript">
  function googleTranslateElementInit() {
    new google.translate.TranslateElement({pageLanguage: 'en', includedLanguages: 'en,ja,zh-CN,zh-TW'}, 'google_translate_element');
  }
</script>

<!-- Google Translate API Script -->
<script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>

```

# Hompage Custom
## code font and color change
just code element not working so , important used

src/site/styles/custom-style.scss

```
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


Even I changed CSS, It's not applied. So i find the element and modify it.
markdown-rendered img
only works when using !important
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

## Change img soruce width and clear

`p::before` and `clear`
```
.markdown-rendered p::before {
    content: ""; /* Creates a pseudo-element */
    display: table; /* Ensures the content is treated as a block-level table */
    clear: both; /* Clears the float */
}
```


## add pre code block style
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

## code and pre tags style by ai
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

before
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

After
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


## modify js and apply css

It seems like why css not wokred propery, maybe becasue of this wrong path in js function.
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

## hr for new line
In markdown `---` horizon line makes new line. In html to makes new line defualt.
but my case not worked. So I inspect why, because no margin and padding in hr styles
So I just add it approximately 20px

`I need to distinguish which HRs should have the style applied to that`

If you're unsure about which tags are affected by a specific tag, you can use a developer tool like F12 to check.

```
.markdown-rendered hr {
    margin-top: 20px;  /* Adds 20 pixels of space above the <hr> */
    margin-bottom: 20px;  /* Adds 20 pixels of space below the <hr> */
}



```


# Python Files

## automation.py

<iframe src="https://gist.github.com/murphybread/a0a351e489cde4b2064fcd3a7855d885.pibb?file=automation.py" width="100%" height="300"></iframe>



## conver_to json.
using one python file convert from md to json
<iframe src="https://gist.github.com/murphybread/e99137ae5f1706bdc6a2ed4efdaace7d.pibb?file=convert_to_json.py" width="700" height="300"></iframe>


## structure.json
matching with current directory structure
<iframe src="https://gist.github.com/murphybread/e99137ae5f1706bdc6a2ed4efdaace7d.pibb?file=structure.json" width="700" height="300"></iframe>


## create_base_template.py
For RAG, I thought there is need one default tempalte file, structure is 2 stages. first one is default parent file, and second is child file
<iframe src="https://gist.github.com/murphybread/a0a351e489cde4b2064fcd3a7855d885.pibb?file=create_base_template.py" width="70%" height="300"></iframe>