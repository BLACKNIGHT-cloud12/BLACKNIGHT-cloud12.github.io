# Mastering Distributed Model Training in PyTorch: FSDP vs DeepSpeed

Training and fine-tuning billion-parameter neural networks exceeds the memory capacity of single GPUs. While standard Distributed Data Parallel (DDP) replicates the entire model across each device, training modern foundation models requires sharding model states across multiple accelerators.

In this guide, we break down **Fully Sharded Data Parallel (FSDP)** and **DeepSpeed ZeRO**, analyzing their memory-reduction trade-offs and communication communication overhead.

---

## The GPU Memory Breakdown

During training with AdamW and FP16/BF16 mixed precision, memory usage consists of three major components:

1. **Model Parameters**: 2 bytes per parameter ($2 \Phi$)
2. **Gradients**: 2 bytes per parameter ($2 \Phi$)
3. **Optimizer States**: 12 bytes per parameter for AdamW (FP32 master weights + FP32 momentum + FP32 variance) ($12 \Phi$)

Total state memory alone equals **16 bytes per parameter**. A 13B parameter model requires over 208 GB of VRAM solely to hold states—before accounting for activations or batch data!

---

## ZeRO Stages & FSDP Mapping

Microsoft's **ZeRO (Zero Redundancy Optimizer)** and PyTorch's native **FSDP** eliminate redundancy by sharding states across ranks:

| Stage / Strategy | What is Sharded? | Memory Reduction | Communication Cost |
| :--- | :--- | :--- | :--- |
| **ZeRO-1 / FSDP `SHARD_OPTIMIZER`** | Optimizer States only | ~4x memory reduction | Equal to DDP |
| **ZeRO-2 / FSDP `GRAD_AND_OPTIMIZER`**| Optimizer States + Gradients | ~8x memory reduction | Equal to DDP |
| **ZeRO-3 / FSDP `FULL_SHARD`** | States + Gradients + Parameters | Linear with GPU count ($N$) | 1.5x DDP communication |

---

## PyTorch Native FSDP Implementation

PyTorch's built-in `FullyShardedDataParallel` provides first-class support for full model sharding with minimal boilerplate:

```python
import torch
from torch.distributed.fsdp import (
    FullyShardedDataParallel as FSDP,
    ShardingStrategy,
    MixedPrecision
)

# Configure mixed precision
mixed_precision_policy = MixedPrecision(
    param_dtype=torch.bfloat16,
    reduce_dtype=torch.bfloat16,
    buffer_dtype=torch.bfloat16
)

# Wrap model with full sharding
model = FSDP(
    base_model,
    sharding_strategy=ShardingStrategy.FULL_SHARD,
    mixed_precision=mixed_precision_policy,
    device_id=torch.cuda.current_device(),
    limit_all_gathers=True
)

optimizer = torch.optim.AdamW(model.parameters(), lr=1e-4)
```

---

## Key Best Practices for High Throughput

1. **Activation Checkpointing**: Recomputing activations during the backward pass instead of storing them all in memory cuts peak activation memory by up to 70%.
2. **FlashAttention-2**: Always ensure your attention layers utilize fused kernels like FlashAttention-2 or PyTorch's `scaled_dot_product_attention`.
3. **NCCL Tuning**: Set `NCCL_DEBUG=INFO` and verify all GPU interconnects are operating over NVLink or high-bandwidth InfiniBand fabrics.
