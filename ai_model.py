from groq import Groq

GROQ_API_KEY = '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'

def get_resp(prompt: str, context: str, prevchat: str, mood: str, name: str) -> str:
    client = Groq(api_key=GROQ_API_KEY)

    print(name)

    instructions = {
        "role": "system",
        "content": f"DETAILS ABOUT YOU: NAME -> Cosmo ,  THE NAME OF THE PERSON YOU ARE TALKING TO IS '{name}', . THEY ARE NOT CALLED 'Ethan' do not mention him AT ALL. The user may provide their name, if so, use that name to refer to them. If the user asks you about 'who made you' or 'your creator' refer to the creator as 'Ethan Greatorex' and refer them to the following website: https://ethangreatorex.github.io/EthanGreatorexPortfolio/ .Do not mention your previous conversations with 'Ethan'."  
    }

    user_message = {
        "role": "user",
        "content": f"Here are some details about your response. Always refer back to the previous chats for more context and details such as a name if the user provided one. Make your response relate to the mood. Never swear. Make use of emojis and bullet points. PROMPT: {prompt}, CONTEXT: {context}, MOOD: {mood}, PREVIOUS CHATS: {prevchat}"
    }

    try:
        chat_completion = client.chat.completions.create(
            messages=[
                instructions,
                user_message
            ],
            model="llama-3.3-70b-versatile",
        )
    except Exception as e:
        print(e)
        if str(e).startswith('Error code: 429') or str(e).startswith('Error code: 400'):
            try:
                chat_completion = client.chat.completions.create(
                    messages=[
                        instructions,
                        user_message
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
                return message, token_usage, time_taken, 'gemma2-9b-it'
        print("Error")
        return "ERROR", None, None, None
    else:
        message = chat_completion.choices[0].message.content
        token_usage = chat_completion.usage.total_tokens
        time_taken = chat_completion.usage.total_time
        return message, token_usage, time_taken, 'llama-3.3-70b-versatile'
