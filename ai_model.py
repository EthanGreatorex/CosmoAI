
from groq import Groq

GROQ_API_KEY = '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'

def get_resp(prompt: str, context : str, prevchat : str, mood: str) -> str:

    client = Groq(
        api_key=GROQ_API_KEY
    )

    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": f"You are a {mood} assitant named Cosmo. Make sure your language matches your mood but never swear or use offensive language. Your answer to any question must relate to the content of the url, markdown, csv data or user prompts if one is provided. Use nice formatting such as bullet points.Make use of emojis to enhance user experience but don't use a lot. You will also be given a prompt. You will also be given your previous conversation. CONTEXT: {context} PROMPT (may be a document in text form): {prompt} PREVIOUS CHATS: {prevchat}",
                }
            ],
            model="llama-3.3-70b-versatile",
        )
    except Exception as e:
        print(e)
        if str(e).startswith('Error code: 429') or str(e).startswith('Error code: 400'):
            try:
                chat_completion = client.chat.completions.create(
                    messages=[
                        {
                            "role": "user",
                            "content": f"You are a {mood} assitant named Cosmo. Make sure your language matches your mood but never swear. Your answer to any question must relate to the content of the url, markdown, csv data or user prompts if one is provided. Use nice formatting such as bullet points.Make use of emojis to enhance user experience but don't use a lot. You will also be given a prompt. You will also be given your previous conversation. CONTEXT: {context} PROMPT (may be a document in text form): {prompt} PREVIOUS CHATS: {prevchat}",
                        }
                    ],
                    model="gemma2-9b-it",
                )
            except Exception as e:
                print(e)
                if str(e).startswith('Error code 429:') or str(e).startswith('Error code: 400'):
                    return "TOKENS USED", None, None, None
            else:
                message = chat_completion.choices[0].message.content
                token_usage = chat_completion.usage.total_tokens
                time_taken = chat_completion.usage.total_time
                return message, token_usage, time_taken,'gemma2-9b-it'
        print("Error")    
        return "ERROR", None, None, None
    else:
        message = chat_completion.choices[0].message.content
        if message == 'safe':
            return "ERROR", None, None, None
        token_usage = chat_completion.usage.total_tokens
        time_taken = chat_completion.usage.total_time
        return message, token_usage, time_taken,'llama-3.3-70b-versatile'
