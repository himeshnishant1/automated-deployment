import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_ROUTES, API_CONFIG } from '../config/api';

export default function useTodos(limit = null) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return {
      ...API_CONFIG.headers,
      Authorization: `Bearer ${token}`
    };
  }, []);

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = limit ? { limit } : {};
      const response = await axios.get(API_ROUTES.TODOS, {
        ...API_CONFIG,
        headers: getAuthHeaders(),
        params
      });
      setTodos(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }, [limit, getAuthHeaders]);

  const addTodo = useCallback(async (title, description = '') => {
    try {
      const response = await axios.post(API_ROUTES.TODOS, 
        { title, description },
        {
          ...API_CONFIG,
          headers: getAuthHeaders()
        }
      );
      setTodos(prev => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    }
  }, [getAuthHeaders]);

  const updateTodo = useCallback(async (id, updates) => {
    try {
      const response = await axios.put(`${API_ROUTES.TODOS}/${id}`, 
        updates,
        {
          ...API_CONFIG,
          headers: getAuthHeaders()
        }
      );
      setTodos(prev => prev.map(todo => 
        todo.id === id ? response.data : todo
      ));
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    }
  }, [getAuthHeaders]);

  const toggleTodo = useCallback(async (id) => {
    try {
      const response = await axios.patch(`${API_ROUTES.TODOS}/${id}/toggle`, 
        {},
        {
          ...API_CONFIG,
          headers: getAuthHeaders()
        }
      );
      setTodos(prev => prev.map(todo => 
        todo.id === id ? response.data : todo
      ));
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    }
  }, [getAuthHeaders]);

  const deleteTodo = useCallback(async (id) => {
    try {
      await axios.delete(`${API_ROUTES.TODOS}/${id}`, {
        ...API_CONFIG,
        headers: getAuthHeaders()
      });
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return {
    todos,
    loading,
    error,
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    refetch: fetchTodos
  };
} 