import { useState, useRef, useCallback } from 'react';
import type { RecordingState } from '../types';

export const useAudioRecorder = () => {
    const [recordingState, setRecordingState] = useState<RecordingState>({
        isRecording: false,
        duration: 0,
        audioBlob: null,
        audioURL: null,
    });

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
                const audioURL = URL.createObjectURL(audioBlob);

                setRecordingState(prev => ({
                    ...prev,
                    isRecording: false,
                    audioBlob,
                    audioURL,
                }));

                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();

            setRecordingState(prev => ({
                ...prev,
                isRecording: true,
                duration: 0,
            }));

            // Start timer
            timerRef.current = setInterval(() => {
                setRecordingState(prev => ({
                    ...prev,
                    duration: prev.duration + 1,
                }));
            }, 1000);

        } catch (error) {
            console.error('Error starting recording:', error);
            alert('Failed to access microphone');
        }
    }, []);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && recordingState.isRecording) {
            mediaRecorderRef.current.stop();

            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    }, [recordingState.isRecording]);

    const resetRecording = useCallback(() => {
        if (recordingState.audioURL) {
            URL.revokeObjectURL(recordingState.audioURL);
        }

        setRecordingState({
            isRecording: false,
            duration: 0,
            audioBlob: null,
            audioURL: null,
        });
    }, [recordingState.audioURL]);

    return {
        recordingState,
        startRecording,
        stopRecording,
        resetRecording,
    };
};