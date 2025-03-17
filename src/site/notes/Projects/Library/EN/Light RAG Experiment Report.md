---
{"dg-publish":true,"title":"Light RAG Experiment Report","description":null,"permalink":"/projects/library/en/light-rag-experiment-report/","dgPassFrontmatter":true,"noteIcon":"0","created":"2025-03-17T18:15:39.081+09:00","updated":"2025-03-18T01:05:37.332+09:00"}
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

| Mode       | Embedding<br>Tokens | Embedding<br>Requests | GetKeywords<br>Input | GetKeywords<br>Output | Real Query<br>Input                                       | Real Query<br>Output | Cache<br>Status             | Cache<br>Mechanism           |
| ---------- | ------------------- | --------------------- | -------------------- | --------------------- | --------------------------------------------------------- | -------------------- | --------------------------- | ---------------------------- |
| **Naive**  | 12                  | 1                     | N/A                  | N/A                   | **2,879**<br>(System: 2,870)                              | 307                  | Enabled                     | Simple vector similarity     |
| **Local**  | 12                  | 1                     | 427<br>(Format 405)  | 42                    | **4,349**<br>(Doc data: 4,334)                            | 288                  | Enabled                     | Single entity-centric search |
| **Global** | 18                  | 1                     | 426<br>(Format 405)  | 47                    | **5,143**<br>(Doc data: 5,128)                            | 332                  | Enabled                     | Relationship pattern-based   |
| **Hybrid** | 120                 | 2                     | 426<br>(Format: 411) | 47                    | **6,538**<br>(Doc data: 6,898)                            | 370                  | Enabled                     | Local + Global combination   |
| **Mix**    | 26                  | 3                     | 471<br>(Format:456)  | 45                    | 9144<br>(introduction how to extract keyword format 9129) | 460                  | Only first Query<br>Enabled | Vector + Graph integration   |
|            |                     |                       |                      |                       |                                                           |                      |                             |                              |


## Update Token Usage Comparison (Including Initial Indexing)
**Caution**: Some data may lack precision due to unaccounted execution order; use it only as a trend reference.

I was particularly interested in how LightRAG handles **updates to existing data**, as it claims to support incremental updates. However, my tests revealed that adding new documents and updating existing ones behave differently. Here are the results:
## Document A: Sequential Update Analysis

| Update Stage               | Embedding<br>Input | Embedding<br>Requests | Chat<br>Input | Chat<br>Output | Chat<br>Requests | Process 1<br>Total | Process 1<br>Input                 | Process 1<br>Output            | Process 2<br>Total | Process 2<br>Input                         | Process 2<br>Output            |
| -------------------------- | ------------------ | --------------------- | ------------- | -------------- | ---------------- | ------------------ | ---------------------------------- | ------------------------------ | ------------------ | ------------------------------------------ | ------------------------------ |
| **Initial Indexing**       | 4,175              | 3                     | 21,485        | 3,244          | 6                | N/A                | N/A                                | N/A                            | N/A                | N/A                                        | N/A                            |
| **+17 Tokens Update**      | 4,826              | 3                     | 5,828         | 750            | 2                | **2,890**          | 2,509<br>(Instruction + full text) | 381<br>(Entity + relationship) | **3,690**          | 3,319<br>(Previous conversation + command) | 371<br>(Entity + relationship) |
| **+17 +209 Tokens Update** | 5,242              | 3                     | 6,300         | 1,072          | 2                | **3,153**          | 2,718<br>(Instruction + full text) | 435<br>(Entity + relationship) | **4,221**          | 3,582<br>(Previous conversation + command) | 639<br>(Entity + relationship) |
|                            |                    |                       |               |                |                  |                    |                                    |                                |                    |                                            |                                |


**Regardless of how much content is added, the entire document is embedded, and the conversation repeats until entities and relations are extracted from all tokens.**

## Document B: New Document Addition (104 tokens)

_Added after Document A was already updated_

| Metric                         | Embedding<br>Input | Embedding<br>Requests | Chat<br>Input | Chat<br>Output | Chat<br>Requests | Process 1<br>Total | Process 1<br>Input                   | Process 1<br>Output            | Process 2<br>Total | Process 2<br>Input                         | Process 2<br>Output            |
| ------------------------------ | ------------------ | --------------------- | ------------- | -------------- | ---------------- | ------------------ | ------------------------------------ | ------------------------------ | ------------------ | ------------------------------------------ | ------------------------------ |
| **Document B<br>(104 tokens)** | 330                | 2                     | 3,300         | 570            | 1                | **2,871**          | 2,384<br>(Command + document source) | 487<br>(Entity + relationship) | **3,871**          | 3,300<br>(Previous conversation + command) | 571<br>(Entity + relationship) |

When adding a new document, only the tokens from the newly added document are considered, independent of existing documents.


## Key Findings from Single Document Update:

- **Embedding Input Token Analysis**: LightRAG appears to re-embed the entire file during updates, not just the added tokens
- **ChatCompletion Input Token Analysis**: During incremental updates, input tokens scale efficiently with added tokens and generally, instructions or context are included in the input as a prefix.
- **ChatCompletion Output Token Analysis**: Output remains stable or decreases regardless of input size, possibly due to simplification or deduplication of existing relationships




When adding new documents, embedding tokens start low but gradually increase, while LLM-related tokens drop significantly, confirming LightRAG’s incremental benefits.

### Single Document Update Analysis
Here’s the token usage for updating a single document:

| Metric                           |     |     |     |     |
| -------------------------------- | --- | --- | --- | --- |
| **Embedding Input Tokens**       |     |     |     |     |
| **ChatCompletion Input Tokens**  |     |     |     |     |
| **ChatCompletion Output Tokens** |     |     |     |     |
| **Current File Token Count**     |     |     |     |     |

- **Embedding Input Token Analysis**: Despite a 15-token increase (302 → 317), embedding tokens rose by 352 (1,156 → 1,508). This suggests LightRAG re-embeds the entire file, not just the added tokens.
- **ChatCompletion Input Token Analysis**: Baseline input requires thousands of tokens (including system prompts and GraphRAG results). During incremental updates, input tokens scale with added tokens (e.g., 15-token increase → 13-token rise), showcasing efficient reuse of existing data.
- **ChatCompletion Output Token Analysis**: Output remains stable or decreases (1,127 → 1,028) regardless of input size, possibly due to simplification or deduplication of existing relationships.

## Conclusion
LightRAG drastically reduces token usage compared to GraphRAG, enhancing efficiency with incremental updates and caching. However, its high token consumption during initial indexing and full re-embedding during updates remain limitations. If it evolves to support partial embedding or maximizes cache usage, LightRAG could become an even lighter, more optimized model for small-scale updates.



