import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_nvidia_ai_endpoints import ChatNVIDIA
# Load .env variables
load_dotenv()

def ChatOpenRouter(
    model="moonshotai/kimi-k2:free",
    temperature=0.7,
    streaming=False,
    tokens=1024,
    callbacks=None
):
    return ChatOpenAI(
        model="openai/gpt-oss-120b",
        base_url = "https://integrate.api.nvidia.com/v1",
        api_key=os.getenv("NIM_API"),
        temperature=temperature,
        streaming=True,
        max_tokens=tokens, 
        callbacks=callbacks
    )
    # return ChatNVIDIA(
    #         model="microsoft/phi-4-mini-flash-reasoning",
    #         api_key=os.getenv("NIM_API"),
    #         temperature=0.6,
    #         top_p=0.95,
    #         max_tokens=8192,  # ✅ NVIDIA expects this, not max_tokens
    #         callbacks=callbacks
    # )

    # return ChatOpenAI(
    #     model=model,
    #     temperature=temperature,
    #     streaming=streaming,
    #     max_tokens=tokens,
    #     base_url="https://openrouter.ai/api/v1",
    #     api_key=os.getenv("OPENROUTER_API_KEY"),
    #     callbacks=callbacks  # ✅ Now accepts callbacks
    # )

