import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_nvidia_ai_endpoints import ChatNVIDIA
# Load .env variables
load_dotenv()

def ChatOpenRouter(
    model="nvidia/usdcode-llama-3.1-70b-instruct",
    temperature=0.7,
    streaming=True,
    tokens=1024,
    callbacks=None
):
    return ChatNVIDIA(
        model=model,
        api_key=os.getenv("NIM_API"),
        temperature=temperature,
        streaming=streaming,
        top_p=1,
        max_output_tokens=tokens,  # ✅ NVIDIA expects this, not max_tokens
        callbacks=callbacks
    )
    # return ChatOpenAI(
    #     model=model,
    #     temperature=temperature,
    #     streaming=streaming,
    #     max_tokens=tokens,
    #     base_url="https://openrouter.ai/api/v1",
    #     api_key=os.getenv("OPENROUTER_API_KEY"),
    #     callbacks=callbacks  # ✅ Now accepts callbacks
    # )

