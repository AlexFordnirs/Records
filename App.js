import React, { useState, useEffect } from 'react';
import { View, Button } from 'react-native';
import { Audio } from 'expo-av';
import * as Permissions from 'expo-permissions';

export default function App() {
    const [recording, setRecording] = useState(null);
    const [isRecording, setIsRecording] = useState(false);

    useEffect(() => {
        askForPermissions();
    }, []);

    const askForPermissions = async () => {
        const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
        if (status !== 'granted') {
            alert('Permission to access audio recording was denied.');
        }
    };

    const startRecording = async () => {
        try {
            const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
            if (status !== 'granted') {
                alert('Permission to access audio recording was denied.');
                return;
            }
            const recording = new Audio.Recording();
            await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
            await recording.startAsync();
            setRecording(recording);
            setIsRecording(true);
            console.log('Recording started');
        } catch (error) {
            console.error(error);
        }
    };

    const stopRecording = async () => {
        try {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            setRecording(null);
            setIsRecording(false);
            console.log('Recording stopped');
            console.log('Recorded audio URI:', uri);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View>
            <Button
                title={isRecording ? 'Stop Recording' : 'Start Recording'}
                onPress={isRecording ? stopRecording : startRecording}
            />
        </View>
    );
}