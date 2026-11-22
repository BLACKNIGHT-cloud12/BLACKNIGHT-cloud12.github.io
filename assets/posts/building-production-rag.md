# Architecting Production-Grade RAG: Hybrid Search and Re-Ranking

Naive Retrieval-Augmented Generation (RAG)—chunking documents, computing cosine similarity over dense vector embeddings, and dumping top-$K$ chunks into an LLM context prompt—frequently fails in production. It struggles with exact keyword matching (part numbers, acronyms, code identifiers) and semantic drift.

To build reliable RAG pipelines that power mission-critical applications, we need **Hybrid Search**, **Reciprocal Rank Fusion (RRF)**, and **Cross-Encoder Re-Ranking**.

---

## Architecture of a High-Accuracy RAG Pipeline

```
┌─────────────────┐       ┌─────────────────┐
│ Dense Embeddings│       │ Sparse Retrieval│
│  (Vector / BGE) │       │ (BM25 / SPLADE) │
└────────┬────────┘       └────────┬────────┘
         │                         │
         └───────────┬─────────────┘
                     ▼
        ┌─────────────────────────┐
        │ Reciprocal Rank Fusion  │
        │    (RRF Score Merge)    │
        └────────────┬────────────┘
                     ▼ Top-50 Candidates
        ┌─────────────────────────┐
        │ Cross-Encoder Re-ranker │
        │     (bge-reranker)      │
        └────────────┬────────────┘
                     ▼ Top-5 Precision Chunks
        ┌─────────────────────────┐
        │ LLM Generation Context  │
        └─────────────────────────┘
```

---

## 1. Why Dense Search Alone Fails

Dense vector embeddings represent broad semantic concepts effectively, but they often lose fine-grained lexical signals. For example:
- A search for `"Error code 0x80070005"` might match general permissions documentation instead of the exact error code troubleshooting guide.
- Adding **BM25** or sparse learned representations (**SPLADE**) guarantees high-recall lexical precision alongside dense semantic discovery.

---

## 2. Reciprocal Rank Fusion (RRF)

Rather than trying to normalize and blend dissimilar score distributions between cosine similarities and BM25 scores, RRF combines results based strictly on their **ordinal rank**:

$$RRF(d) = \sum_{m \in M} \frac{1}{k + r_m(d)}$$

Where $k$ is a smoothing constant (typically 60), and $r_m(d)$ is document $d$'s rank in retrieval method $m$.

```python
def reciprocal_rank_fusion(dense_ranks, sparse_ranks, k=60):
    rrf_scores = {}
    
    for rank, doc_id in enumerate(dense_ranks):
        rrf_scores[doc_id] = rrf_scores.get(doc_id, 0) + 1.0 / (k + rank + 1)
        
    for rank, doc_id in enumerate(sparse_ranks):
        rrf_scores[doc_id] = rrf_scores.get(doc_id, 0) + 1.0 / (k + rank + 1)
        
    # Sort documents by combined RRF score
    return sorted(rrf_scores.items(), key=lambda x: x[1], reverse=True)
```

---

## 3. Two-Stage Retrieval with Cross-Encoders

Bi-encoder models compute query and document representations independently, allowing billions of vectors to be compared rapidly with approximate nearest neighbor (ANN) indexes.

However, a **Cross-Encoder** evaluates the query and document simultaneously across all cross-attention layers, capturing subtle relationships that bi-encoders miss.

```python
from sentence_transformers import CrossEncoder

reranker = CrossEncoder('BAAI/bge-reranker-large')

# Pass candidate pairs from the first retrieval stage
candidate_pairs = [[query, doc.text] for doc in top_50_candidates]
scores = reranker.predict(candidate_pairs)

# Select top-5 highest scoring chunks for the LLM
top_precision_chunks = [top_50_candidates[i] for i in scores.argsort()[::-1][:5]]
```

## Summary

By pairing sparse lexical indexing with dense semantic embeddings, merging candidates via RRF, and refining results with a cross-encoder, you eliminate hallucinations and deliver precise, cited answers.
