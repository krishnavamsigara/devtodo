import { registerUser, loginUser, getCurrentUser } from '../services/auth.service.js';
import { sendSuccess } from '../utils/response.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const result = await registerUser({ name, email, password });
    return sendSuccess(res, result, 'User registered successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });
    return sendSuccess(res, result, 'Logged in successfully', 200);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  return sendSuccess(res, null, 'Logged out successfully', 200);
};

export const getMe = async (req, res, next) => {
  try {
    const user = await getCurrentUser(req.user.id);
    return sendSuccess(res, { user }, 'User retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};
