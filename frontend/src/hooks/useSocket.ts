import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAssignmentStore } from '../store/assignmentStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export function useSocket(assignmentId: string | null, onCompleted?: (resultId: string) => void) {
  const socketRef = useRef<Socket | null>(null);
  const setGenerationProgress = useAssignmentStore((state) => state.setGenerationProgress);
  const setGenerating = useAssignmentStore((state) => state.setGenerating);
  const setError = useAssignmentStore((state) => state.setError);

  const onCompletedRef = useRef(onCompleted);
  useEffect(() => {
    onCompletedRef.current = onCompleted;
  }, [onCompleted]);

  useEffect(() => {
    if (!assignmentId) return;

    console.log(`[WebSocket] Connecting to ${API_URL}`);
    const socket = io(API_URL, {
      transports: ['websocket'],
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log(`[WebSocket] Connected: ${socket.id}. Joining room ${assignmentId}`);
      socket.emit('join:assignment', assignmentId);
    });

    socket.on('generation:progress', (data: { progress: number; message: string }) => {
      console.log(`[WebSocket] Progress: ${data.progress}% - ${data.message}`);
      setGenerationProgress(data.progress, data.message);
    });

    socket.on('generation:completed', (data: { assignmentId: string; resultId: string }) => {
      console.log('[WebSocket] Generation complete:', data);
      setGenerating(false);
      if (onCompletedRef.current) {
        onCompletedRef.current(data.resultId);
      }
    });

    socket.on('generation:failed', (data: { error: string }) => {
      console.error('[WebSocket] Generation failed:', data.error);
      setGenerating(false);
      setError(data.error);
    });

    socket.on('disconnect', () => {
      console.log('[WebSocket] Disconnected');
    });

    return () => {
      console.log('[WebSocket] Cleaning up connection');
      socket.disconnect();
    };
  }, [assignmentId, setGenerationProgress, setGenerating, setError]);

  return socketRef.current;
}
