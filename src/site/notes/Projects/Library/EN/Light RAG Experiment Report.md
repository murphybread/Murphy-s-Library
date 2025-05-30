---
{"dg-publish":true,"title":"Light RAG Experiment Report","description":null,"permalink":"/projects/library/en/light-rag-experiment-report/","dgPassFrontmatter":true,"noteIcon":"0","created":"2025-03-17T18:15:39.081+09:00","updated":"2025-03-18T01:47:12.055+09:00"}
---

#RAG #LightRAG #graphRAG
## Overcoming GraphRAG’s Limitations with LightRAG: A Direct Token Usage Comparison

Microsoft’s **graphRAG** consumes significantly more tokens than traditional RAG for tasks like Knowledge Graph construction and query processing (e.g., 610,000 tokens). To address these limitations, new architectures have emerged, and the one I tested this time is **LightRAG**.

What caught my attention was a claim in the LightRAG paper: "While GraphRAG consumes 610,000 tokens, LightRAG can perform searches with fewer than 100 tokens." However, the term "**search tokens**" felt vague to me, so I decided to implement it myself and compare token usage directly. (Source: [LightRAG GitHub](https://github.com/HKUDS/LightRAG))

### Initial Indexing: Setting the Baseline

This token consumption reflects the initial indexing process and serves as a key baseline for understanding LightRAG’s core behavior.


## Token Usage Summary

|Metric|Value|
|---|---|
|Document Token Count|2,412 tokens|
|Embedding Input Tokens|4,175|
|Embedding Model Requests|3|
|ChatCompletion Input Tokens|21,485|
|ChatCompletion Output Tokens|3,244|
|ChatCompletion Model Requests|6|

## Document Details

|Metric|Value|
|---|---|
|Document Size|11kb|
|Query|"What are the top themes in this story?" (15 tokens)|
|Extracted Entities|19 entities (first try), 20 entities (second try)|
|Extracted Relationships|23 relationships (first try), 22 relationships (second try)|
|Execution Time|26.1074 seconds|

_Note: A second try was performed with slightly different results._



## Query Result Comparison: Query modes
LightRAG offers two query processing modes: **Mix Mode** (combining vector search and Knowledge Graph) and **Local Mode** (entity-centric search). Below is the token usage for the same query in each mode:


## Query Token Usage by Mode

input query 15token

### **Check point**
**GetKeywords Input** Default Input Format Consumes about **405** tokens
**Real Query Input**, system instruct and full context are mostly used as input, except for input query **15token.**
For example, **in naive, 2870 was used as input context**, and in **MIx, 9129 was used as input context**

| Metric                 | Naive                | Local           | Global            | Hybrid         | Mix                           |
| ---------------------- | -------------------- | --------------- | ----------------- | -------------- | ----------------------------- |
| **Embedding Tokens**   | 12                   | 12              | 18                | 120            | 26                            |
| **Embedding Requests** | 1                    | 1               | 1                 | 2              | 3                             |
| **GetKeywords Input**  | N/A                  | 🔵**427**<br>   | 🔵**426**<br>     | 🔵**426**      | 🔵**471**                     |
| **GetKeywords Output** | N/A                  | 42              | 47                | 47             | 45                            |
| **Real Query Input**   | 🔴**2,879**<br>      | 🔴**4,349**<br> | 🔴**5,143**<br>   | 🔴**6,538**    | 🔴**9,144**                   |
| **Real Query Output**  | 307                  | 288             | 332               | 370            | 460                           |
| **Cache Status**       | Enabled              | Enabled         | Enabled           | Enabled        | Only first step               |
| **Cache Mechanism**    | vector<br>similarity | Single entity   | Multiple Entities | Local + Global | Vector + Graph<br>integration |


## Update Token Usage Comparison (Including Initial Indexing)
**Caution**: Some data may lack precision due to unaccounted execution order; use it only as a trend reference.

I was particularly interested in how LightRAG handles **updates to existing data**, as it claims to support incremental updates. However, my tests revealed that adding new documents and updating existing ones behave differently. Here are the results:
## Document A: Sequential Update Analysis

**Process 1 Input** :  Instruction + full text used
**Process 1 Output**: get entity and relationship information of chunk
**Process 2 Input**: Previous conversation + how to extract and rest data
**Process 2 Output**: All entity and relationship data

This is repeated until enitity and realationship are extracted from a chunk of all docs.

| Metric                 | Initial Indexing | +17 Tokens Update | +17 +209 Tokens Update |
| ---------------------- | ---------------- | ----------------- | ---------------------- |
| **Embedding Input**    | 4,175            | 4,826             | 5,242                  |
| **Embedding Requests** | 3                | 3                 | 3                      |
| **Chat Input**         | 21,485           | 5,828             | 6,300                  |
| **Chat Output**        | 3,244            | 750               | 1,072                  |
| **Chat Requests**      | 6                | 2                 | 2                      |
| **Process 1 Total**    | N/A              | 2,890             | 3,153                  |
| **Process 1 Input**    | N/A              | 🔵**2,509**       | 🔵**2,718**<br>        |
| **Process 1 Output**   | N/A              | 381<br>           | 435<br>                |
| **Process 2 Total**    | N/A              | 3,690             | 4,221                  |
| **Process 2 Input**    | N/A              | 🔴**3,319**<br>   | 🔴**3,582**<br>        |
| **Process 2 Output**   | N/A              | 371<br>           | 639<br>                |


**Regardless of how much content is added, the entire document is embedded, and the conversation repeats until entities and relations are extracted from all tokens.**

## Document B: New Document Addition (104 tokens)

**Process 1 Input** :  Instruction + full text used
**Process 1 Output**: get entity and relationship information of chunk
**Process 2 Input**: Previous conversation + how to extract and rest data
**Process 2 Output**: All entity and relationship data

This is repeated until enitity and realationship are extracted from a chunk of all docs.

| Metric                 | Value                       |
| ---------------------- | --------------------------- |
| **Embedding Input**    | 330                         |
| **Embedding Requests** | 2                           |
| **Chat Input**         | 3,300                       |
| **Chat Output**        | 570                         |
| **Chat Requests**      | 1                           |
| **Process 1 Total**    | 🔵**2,871**                 |
| **Process 1 Input**    | 2,384                       |
| **Process 1 Output**   | 487                         |
| **Process 2 Total**    | 🔴**3,871**                 |
| **Process 2 Input**    | 3,300                       |
| **Process 2 Output**   | 571 (Entity + relationship) |

When adding a new document, only the tokens from the newly added document are considered, independent of existing documents.


## Key Findings from Single Document Update:

- **Embedding Input Token Analysis**: LightRAG appears to re-embed the entire file during updates, not just the added tokens
- **ChatCompletion Input Token Analysis**: During incremental updates, input tokens scale efficiently with added tokens and generally, instructions or context are included in the input as a prefix.
- **ChatCompletion Output Token Analysis**: Output remains stable or decreases regardless of input size, possibly due to simplification or deduplication of existing relationships



## Conclusion
LightRAG drastically reduces token usage compared to GraphRAG, enhancing efficiency with incremental updates and caching. However, its high token consumption during initial indexing and full re-embedding during updates remain limitations. If it evolves to support partial embedding or maximizes cache usage, LightRAG could become an even lighter, more optimized model for small-scale updates.



