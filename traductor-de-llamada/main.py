import io
import subprocess
from google.cloud import speech
from google.cloud import translate_v2 as translate
from google.cloud import texttospeech
from pydub import AudioSegment
import os



def transcribe_audio(audio_file, language_code="en-US"):
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/Users/abraham/PycharmProjects/hack2024/credentials.json"

    audio = AudioSegment.from_wav(audio_file)
    audio = audio.set_channels(1)
    mono_audio_file = "mono_audio.wav"
    audio.export(mono_audio_file, format="wav")

    client = speech.SpeechClient()

    with io.open(mono_audio_file, "rb") as audio_file:
        content = audio_file.read()

    audio = speech.RecognitionAudio(content=content)

    config = {
        "encoding": speech.RecognitionConfig.AudioEncoding.LINEAR16,
        "sample_rate_hertz": 48000,
        "language_code": language_code,
    }

    response = client.recognize(config=config, audio=audio)

    transcript = ""
    for result in response.results:
        transcript += result.alternatives[0].transcript

    return transcript


def translate_text(text, target_language):
    translate_client = translate.Client()

    translation = translate_client.translate(
        text,
        target_language=target_language
    )

    return translation['translatedText']


def text_to_speech(text, output_file, language_code="es-ES"):
    client = texttospeech.TextToSpeechClient()

    input_text = texttospeech.SynthesisInput(text=text)
    voice = texttospeech.VoiceSelectionParams(
        language_code=language_code,
        ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
    )

    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )

    response = client.synthesize_speech(input=input_text, voice=voice, audio_config=audio_config)

    with open(output_file, "wb") as out:
        out.write(response.audio_content)

    print(f"Audio generado y guardado como {output_file}")



def extract_audio_from_video(video_file, audio_output):
    command = f"ffmpeg -i {video_file} -q:a 0 -map a {audio_output}"
    subprocess.call(command, shell=True)
    print(f"Audio extraído como {audio_output}")



def add_subtitles_to_video(video_file, subtitles_file, output_video):
    command = f"ffmpeg -i {video_file} -vf subtitles={subtitles_file} {output_video}"
    subprocess.call(command, shell=True)
    print(f"Subtítulos agregados al video {output_video}")


def add_audio_to_video(video_file, audio_file, output_video):
    command = f"ffmpeg -i {video_file} -i {audio_file} -c:v copy -c:a aac -strict experimental {output_video}"
    subprocess.call(command, shell=True)
    print(f"Audio añadido al video {output_video}")



def create_srt(translated_text, output_srt_file):
    with open(output_srt_file, "w") as f:
        f.write("1\n00:00:00,000 --> 00:00:10,000\n")
        f.write(translated_text + "\n")
    print(f"Archivo SRT creado en {output_srt_file}")



def main():
    video_file = input("Por favor, introduce el nombre del archivo de video (con extensión): ")

    if not os.path.isfile(video_file):
        print("El archivo no existe. Asegúrate de que la ruta sea correcta.")
        return

    extracted_audio_file = "extracted_audio.wav"
    srt_file = "translated_subtitles.srt"
    output_audio_file = "translated_audio.mp3"
    final_video_with_subtitles = "video_with_subtitles.mp4"
    final_video_with_audio = "final_video_with_audio.mp4"

    extract_audio_from_video(video_file, extracted_audio_file)

    transcript = transcribe_audio(extracted_audio_file, language_code="en-US")
    print(f"Transcripción: {transcript}")

    translated_text = translate_text(transcript, target_language="es")
    print(f"Texto traducido: {translated_text}")

    create_srt(translated_text, srt_file)

    text_to_speech(translated_text, output_audio_file, language_code="es-ES")

    add_subtitles_to_video(video_file, srt_file, final_video_with_subtitles)

    add_audio_to_video(final_video_with_subtitles, output_audio_file, final_video_with_audio)


main()