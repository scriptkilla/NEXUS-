import React, { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { MicIcon, MicOffIcon, VideoIcon, VideoOffIcon, PhoneOffIcon } from '../icons/Icons';
import type { User, Conversation } from '../../types';

interface VideoCallViewProps {
    conversation: Conversation;
    onEndCall: () => void;
}

const VideoCallView: React.FC<VideoCallViewProps> = ({ conversation, onEndCall }) => {
    const context = useContext(AppContext);
    const { currentUser } = context || {};

    const [isMicMuted, setMicMuted] = useState(false);
    const [isCameraOff, setCameraOff] = useState(false);
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    // Refs for WebRTC objects
    const localStreamRef = useRef<MediaStream | null>(null);
    const peerConnection1 = useRef<RTCPeerConnection | null>(null);
    const peerConnection2 = useRef<RTCPeerConnection | null>(null);

    const otherParticipant = conversation.participants.find(p => p.id !== currentUser?.id);

    useEffect(() => {
        const startCall = async () => {
            try {
                // 1. Get user media
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                localStreamRef.current = stream;
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                // 2. Create PeerConnections for loopback
                const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
                peerConnection1.current = new RTCPeerConnection(configuration);
                peerConnection2.current = new RTCPeerConnection(configuration);
                
                // 3. Set up ICE candidate exchange between the two local peers
                peerConnection1.current.onicecandidate = e => e.candidate && peerConnection2.current?.addIceCandidate(e.candidate);
                peerConnection2.current.onicecandidate = e => e.candidate && peerConnection1.current?.addIceCandidate(e.candidate);

                // 4. Set up remote stream handling (when pc2 receives tracks from pc1)
                peerConnection2.current.ontrack = e => {
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = e.streams[0];
                    }
                };
                
                // 5. Add local stream to the first peer connection
                stream.getTracks().forEach(track => peerConnection1.current?.addTrack(track, stream));

                // 6. Create offer and establish connection (the mock signaling part)
                const offer = await peerConnection1.current.createOffer();
                await peerConnection1.current.setLocalDescription(offer);
                await peerConnection2.current.setRemoteDescription(offer);

                const answer = await peerConnection2.current.createAnswer();
                await peerConnection2.current.setLocalDescription(answer);
                await peerConnection1.current.setRemoteDescription(answer);

            } catch (err) {
                console.error("Error starting call:", err);
                alert("Could not start video call. Please check permissions.");
                onEndCall();
            }
        };

        startCall();

        // Cleanup on component unmount
        return () => {
            localStreamRef.current?.getTracks().forEach(track => track.stop());
            peerConnection1.current?.close();
            peerConnection2.current?.close();
            peerConnection1.current = null;
            peerConnection2.current = null;
        };
    }, [conversation, onEndCall]);

    const handleToggleMic = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach(track => track.enabled = !track.enabled);
            setMicMuted(prev => !prev);
        }
    };

    const handleToggleCamera = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getVideoTracks().forEach(track => track.enabled = !track.enabled);
            setCameraOff(prev => !prev);
        }
    };
    
    const handleEndCall = () => {
        onEndCall();
    };

    if (!otherParticipant) {
        // Handle case where conversation is invalid
        useEffect(() => {
            onEndCall();
        }, [onEndCall]);
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col animate-fade-in">
            {/* Remote Video */}
            <div className="flex-1 relative bg-[var(--bg-secondary)] flex items-center justify-center">
                <video ref={remoteVideoRef} autoPlay playsInline className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="flex flex-col items-center opacity-50">
                        <img src={otherParticipant.avatar} alt={otherParticipant.name} className="w-32 h-32 rounded-full border-4 border-white/20 mb-4" />
                        <h2 className="text-2xl font-bold text-white drop-shadow-lg">Calling {otherParticipant.name}...</h2>
                    </div>
                </div>
            </div>

            {/* Local Video */}
            <video ref={localVideoRef} autoPlay playsInline muted className="absolute bottom-24 right-4 w-32 h-48 md:w-40 md:h-56 object-cover rounded-xl border-2 border-white/50 bg-black" />

            {/* Controls */}
            <div className="bg-black/50 backdrop-blur-md h-20 flex-shrink-0 flex items-center justify-center gap-4">
                 <button onClick={handleToggleMic} className="w-14 h-14 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white">
                    {isMicMuted ? <MicOffIcon className="w-7 h-7" /> : <MicIcon className="w-7 h-7" />}
                </button>
                 <button onClick={handleToggleCamera} className="w-14 h-14 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white">
                    {isCameraOff ? <VideoOffIcon className="w-7 h-7" /> : <VideoIcon className="w-7 h-7" />}
                </button>
                 <button onClick={handleEndCall} className="w-20 h-14 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-700 transition-colors text-white">
                    <PhoneOffIcon className="w-7 h-7" />
                </button>
            </div>
        </div>
    );
};

export default VideoCallView;