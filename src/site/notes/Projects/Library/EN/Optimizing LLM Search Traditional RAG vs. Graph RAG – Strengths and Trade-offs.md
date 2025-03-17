---
{"dg-publish":true,"title":"Optimizing LLM Search Traditional RAG vs. Graph RAG – Strengths and Trade-offs","description":"We'll discuss the advantages and limitations of using traditional RAGs, and the advantages and limitations of the alternative, graph RAGs.","permalink":"/projects/library/en/optimizing-llm-search-traditional-rag-vs-graph-rag-strengths-and-trade-offs/","dgPassFrontmatter":true,"noteIcon":"0","created":"2025-03-17T17:38:13.953+09:00","updated":"2025-03-18T01:32:32.793+09:00"}
---


#graphRAG  #RAG
[[Projects/Library/EN/Light RAG Experiment Report\|Light RAG Experiment Report]]

## What if we want LLM to use our company's own data to answer questions?
Normally, you can just copy and paste the files, but what if you need to do that dozens or hundreds of times, or if you have a huge number of files?

**Retrieval-Augmented Generation (RAG)** technology enhances Large Language Models (LLMs) by providing custom documents to supplement the model's knowledge. This augmented search capability helps LLMs access information using vectorDB so that can access fast and scalable.

### How Traditional RAG Works

In conventional RAG systems, documents are embedded into vectors, and similarity comparisons are performed to retrieve relevant information. When a query is received, the system:

1. Converts the query into a vector representation
2. Searches for the most similar document vectors
3. Retrieves the matching documents
4. Provides these documents as additional context to the LLM
5. The LLM generates a response based on both its internal knowledge and the retrieved information

This process is essentially similar to copying and pasting specific document information into the LLM's context window. For example, when asked "What fruit did I buy today?", a RAG system would search for data about "today's purchased fruits" and feed that information to the LLM.

### The Value of RAG

Despite similarities to direct document uploads, RAG offers significant advantages, particularly in terms of search efficiency. By utilizing vector embeddings for storage and retrieval, RAG can quickly identify relevant information from large document collections without requiring the entire corpus to be loaded into the LLM's context.

### Critical Limitations of Traditional RAG

However, using these RAGs has led me to consider two major issues.

#### 1. Scaling issues

The RAG system compares a query vector to all document vectors in the database. This is fine for a few tens or hundreds of documents, but when much more documents are stored, the search time and computational cost becomes increasingly prohibitive. This can lead to the following consequences

- Longer response times.
- Increased token consumption
- Increased operational costs
- Memory constraints


#### 2. Query format mismatch

Often, a mismatch between the format and structure of the stored data and the query causes problems with search. For example

- A simple query like “What's the weather like today?” can match a variety of conversation formats.
- However, for the data I store, in a database containing conversation transcripts labeled “user” and “assistant,” 20 conversations that explicitly mention “today's weather” may have a lower similarity score than 3 conversations that vaguely mention the weather.
- Structural differences between queries and documents can lead to suboptimal retrieval despite semantic relevance.


## The Emergence of Graph RAG

Graph RAG emerged as a solution to address these limitations by incorporating knowledge graph structures into the retrieval process.

### Core Concept of Graph RAG

Graph RAG builds a knowledge graph representing entities and their relationships extracted from documents. This structural representation allows the system to:

1. Identify semantic connections between information pieces
2. Navigate relationships between concepts
3. Perform more targeted retrievals based on query intent rather than just lexical similarity

### How Graph RAG Works

The Graph RAG process typically involves three key stages:

#### 1. Knowledge Graph Construction

- Documents are divided into manageable chunks
- An LLM analyzes each chunk to extract entities and their relationships
- These entities and relationships are added to a knowledge graph, creating a structured representation of the content
- The graph is continuously updated as new documents are processed

#### 2. Vector Database Integration

- Nodes in the knowledge graph are associated with vector embeddings
- Key-value pairs link graph nodes to their corresponding vector representations
- This integration enables both structural (graph-based) and semantic (vector-based) search capabilities
- Node IDs or chunk IDs typically serve as keys to connect graph elements with vector embeddings

#### 3. Query Processing

- When a query is received, an LLM first analyzes it to identify relevant entities and relationships
- The system searches the knowledge graph for these elements
- Using the associated keys, it retrieves the corresponding embeddings from the vector database
- The retrieved information is provided to the LLM as context for generating a response

### Advantages of Graph RAG

1. **Improved Scalability**: By performing targeted retrievals through the knowledge graph rather than exhaustive vector comparisons
2. **Better Semantic Understanding**: Through explicit representation of relationships between entities
3. **More Accurate Retrievals**: By leveraging both graph structure and vector similarity
4. **Format Flexibility**: Reduced sensitivity to the format differences between queries and documents

### Challenges with Graph RAG Implementation

Despite its advantages, Graph RAG implementations face significant challenges:

1. **Complex Management**: Maintaining and updating knowledge graphs requires specialized expertise
2. **High Token Consumption**: LLM usage for entity and relationship extraction consumes substantial tokens
3. **Infrastructure Requirements**: Running dual systems (knowledge graph and vector database) increases complexity
4. **Update Overhead**: Keeping the knowledge graph synchronized with changing information requires additional processing


# The graph RAGs below are the ones I've been exploring.

1. **Microsoft GraphRAG**
Source: https://github.com/microsoft/graphrag
Pros: One of the most popular Graph RAG solutions
Cons: High cost, complex management

2. **ZEP Graphity**
Features: Another popular Graph RAG implementation
Cons: Costly, difficult to manage


3. **LightRAG**
Source: https://github.com/HKUDS/LightRAG
Features:
Lightweight Graph RAG introduced in a recent paper
Can be searched in 100 tokens or less compared to Microsoft GraphRAG (610,000 tokens)
Advantages: Cost-effective, lightweight


4. **MiniRAG**
Source: https://github.com/HKUDS/MiniRAG
Features:
Announced by the LightRAG team, January 2025
Smaller, more efficient variant of Graph RAG


## I tried the most recent technology, MiniRAG, but it didn't work properly with the following error.

-> Errors when running **MiniRAG** tests 
1. package doesn't perform properly even if installed the way it was installed
2. command doesn't work as per default usage.
3. `main.py` is more than 5GB, but it seems that the error will continue to occur even after downloading, so I gave up.


	