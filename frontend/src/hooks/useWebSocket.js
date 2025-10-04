import { useEffect, useRef, useCallback, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

/**
 * Custom hook for WebSocket connection using STOMP over SockJS
 * @param {string} url - WebSocket endpoint URL
 * @param {Object} subscriptions - Object mapping topic paths to callback functions
 * @param {Object} options - Additional configuration options
 */
export const useWebSocket = (url, subscriptions = {}, options = {}) => {
  const clientRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const subscriptionsRef = useRef(subscriptions);

  // Update subscriptions ref when they change
  useEffect(() => {
    subscriptionsRef.current = subscriptions;
  }, [subscriptions]);

  // Connect to WebSocket
  const connect = useCallback(() => {
    try {
      // Create STOMP client
      const client = new Client({
        // Use SockJS as the WebSocket implementation
        webSocketFactory: () => new SockJS(url),

        // Connection options
        connectHeaders: options.headers || {},

        // Disable automatic reconnect (we'll handle manually if needed)
        reconnectDelay: 0,

        // Disable heartbeat to prevent unnecessary disconnects
        heartbeatIncoming: 0,
        heartbeatOutgoing: 0,

        // Debug logging
        debug: (str) => {
          if (options.debug) {
            console.log('[WebSocket]', str);
          }
        },

        // Connection callbacks
        onConnect: () => {
          console.log('✅ WebSocket connected successfully');
          setIsConnected(true);
          setError(null);

          // Subscribe to all topics
          Object.entries(subscriptionsRef.current).forEach(([topic, callback]) => {
            client.subscribe(topic, (message) => {
              try {
                const data = JSON.parse(message.body);
                callback(data);
              } catch (err) {
                console.error('Failed to parse WebSocket message:', err);
              }
            });
            console.log(`📡 Subscribed to topic: ${topic}`);
          });

          // Call custom onConnect if provided
          if (options.onConnect) {
            options.onConnect();
          }
        },

        onStompError: (frame) => {
          console.error('❌ STOMP error:', frame.headers['message']);
          console.error('Error details:', frame.body);
          setError(frame.headers['message']);
          setIsConnected(false);

          if (options.onError) {
            options.onError(frame);
          }
        },

        onWebSocketClose: () => {
          console.warn('⚠️ WebSocket connection closed');
          setIsConnected(false);

          if (options.onDisconnect) {
            options.onDisconnect();
          }
        },

        onWebSocketError: (error) => {
          console.error('❌ WebSocket error:', error);
          setError(error.message || 'WebSocket connection error');
          setIsConnected(false);
        }
      });

      // Activate the client
      client.activate();
      clientRef.current = client;

    } catch (err) {
      console.error('Failed to create WebSocket client:', err);
      setError(err.message);
    }
  }, [url, options]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.deactivate();
      clientRef.current = null;
      setIsConnected(false);
      console.log('🔌 WebSocket disconnected');
    }
  }, []);

  // Send message to server
  const sendMessage = useCallback((destination, body, headers = {}) => {
    if (clientRef.current && isConnected) {
      clientRef.current.publish({
        destination,
        body: JSON.stringify(body),
        headers
      });
      console.log(`📤 Message sent to ${destination}:`, body);
    } else {
      console.warn('Cannot send message: WebSocket not connected');
    }
  }, [isConnected]);

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only connect once on mount

  return {
    isConnected,
    error,
    sendMessage,
    disconnect,
    reconnect: connect
  };
};

export default useWebSocket;
