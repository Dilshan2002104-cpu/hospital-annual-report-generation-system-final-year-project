import { useState, useEffect, useRef, useCallback } from 'react';

const useAnalyticsWebSocket = (onAnalyticsUpdate) => {
  const [wsConnected, setWsConnected] = useState(false);
  const [wsError, setWsError] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);

  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000;

  const connect = useCallback(() => {
    try {
      // Determine WebSocket URL based on current location
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      const wsUrl = `${protocol}//${host}/ws/pharmacy/analytics`;

      console.log('Attempting to connect to Analytics WebSocket:', wsUrl);

      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('Analytics WebSocket connected');
        setWsConnected(true);
        setWsError(null);
        reconnectAttemptsRef.current = 0;

        // Send subscription message for analytics updates
        if (wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: 'SUBSCRIBE',
            topic: 'PHARMACY_ANALYTICS'
          }));
        }
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('Analytics WebSocket message received:', message);

          // Handle different types of analytics updates
          switch (message.type) {
            case 'ANALYTICS_UPDATE':
              if (onAnalyticsUpdate) {
                onAnalyticsUpdate(message.data);
              }
              break;
            case 'INVENTORY_ALERT':
              // Handle inventory alerts that affect analytics
              if (onAnalyticsUpdate) {
                onAnalyticsUpdate({
                  type: 'ALERT_UPDATE',
                  alert: message.data
                });
              }
              break;
            case 'PRESCRIPTION_STATS_UPDATE':
              // Handle real-time prescription statistics updates
              if (onAnalyticsUpdate) {
                onAnalyticsUpdate({
                  type: 'PRESCRIPTION_UPDATE',
                  stats: message.data
                });
              }
              break;
            case 'REVENUE_UPDATE':
              // Handle real-time revenue updates
              if (onAnalyticsUpdate) {
                onAnalyticsUpdate({
                  type: 'REVENUE_UPDATE',
                  revenue: message.data
                });
              }
              break;
            default:
              console.log('Unknown analytics message type:', message.type);
          }
        } catch (error) {
          console.error('Error parsing Analytics WebSocket message:', error);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log('Analytics WebSocket disconnected:', event.code, event.reason);
        setWsConnected(false);

        // Attempt to reconnect if it wasn't a normal closure
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          console.log(`Analytics WebSocket reconnect attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts}`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectDelay);
        } else {
          setWsError('Analytics WebSocket connection lost');
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('Analytics WebSocket error:', error);
        setWsError('Analytics WebSocket connection failed');
      };

    } catch (error) {
      console.error('Failed to create Analytics WebSocket connection:', error);
      setWsError('Failed to establish analytics connection');
    }
  }, [onAnalyticsUpdate]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    if (wsRef.current) {
      wsRef.current.close(1000, 'Component unmounting');
      wsRef.current = null;
    }

    setWsConnected(false);
    setWsError(null);
  }, []);

  const sendMessage = useCallback((message) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      return true;
    }
    return false;
  }, []);

  // Request specific analytics updates
  const requestAnalyticsUpdate = useCallback((period = '7d') => {
    return sendMessage({
      type: 'REQUEST_ANALYTICS_UPDATE',
      period: period
    });
  }, [sendMessage]);

  const subscribeToPrescriptionUpdates = useCallback(() => {
    return sendMessage({
      type: 'SUBSCRIBE',
      topic: 'PRESCRIPTION_STATS'
    });
  }, [sendMessage]);

  const subscribeToInventoryUpdates = useCallback(() => {
    return sendMessage({
      type: 'SUBSCRIBE',
      topic: 'INVENTORY_ALERTS'
    });
  }, [sendMessage]);

  const subscribeToRevenueUpdates = useCallback(() => {
    return sendMessage({
      type: 'SUBSCRIBE',
      topic: 'REVENUE_UPDATES'
    });
  }, [sendMessage]);

  // Initialize connection on mount
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    wsConnected,
    wsError,
    connect,
    disconnect,
    sendMessage,
    requestAnalyticsUpdate,
    subscribeToPrescriptionUpdates,
    subscribeToInventoryUpdates,
    subscribeToRevenueUpdates
  };
};

export default useAnalyticsWebSocket;