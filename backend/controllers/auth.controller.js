/**
 * Auth Controller
 * Handles admin login, logout, profile view, and password change.
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AdminModel = require('../models/Admin.model');
const { sendSuccess, sendError, sendUnauthorized, sendNotFound } = require('../utils/apiResponse');
const logger = require('../utils/logger');
require('dotenv').config();

const authController = {
  /**
   * POST /api/auth/login
   * Validates credentials and returns a signed JWT.
   */
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      const admin = await AdminModel.findByUsername(username);
      if (!admin) {
        return sendUnauthorized(res, 'Invalid username or password.');
      }

      const isMatch = await bcrypt.compare(password, admin.password_hash);
      if (!isMatch) {
        return sendUnauthorized(res, 'Invalid username or password.');
      }

      const payload = {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        full_name: admin.full_name,
        role: admin.role,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '8h',
      });

      await AdminModel.updateLastLogin(admin.id);

      logger.info(`Admin logged in: ${admin.username} (ID: ${admin.id})`);

      return sendSuccess(res, 'Login successful.', {
        token,
        admin: {
          id: admin.id,
          full_name: admin.full_name,
          username: admin.username,
          email: admin.email,
          role: admin.role,
        },
      });
    } catch (error) {
      logger.error(`Login error: ${error.message}`);
      return sendError(res, 'Login failed. Please try again.');
    }
  },

  /**
   * POST /api/auth/logout
   * Client-side logout — instructs client to discard token.
   * For enhanced security, a token blacklist can be added here in the future.
   */
  logout: async (req, res) => {
    logger.info(`Admin logged out: ${req.admin?.username}`);
    return sendSuccess(res, 'Logged out successfully.');
  },

  /**
   * GET /api/auth/profile
   * Returns the authenticated admin's profile.
   */
  getProfile: async (req, res) => {
    try {
      const admin = await AdminModel.findById(req.admin.id);
      if (!admin) {
        return sendNotFound(res, 'Admin profile not found.');
      }
      return sendSuccess(res, 'Profile retrieved successfully.', admin);
    } catch (error) {
      logger.error(`Get profile error: ${error.message}`);
      return sendError(res, 'Failed to retrieve profile.');
    }
  },

  /**
   * PUT /api/auth/profile
   * Update admin profile (full_name, email)
   */
  updateProfile: async (req, res) => {
    try {
      const { full_name, email } = req.body;

      // Check email uniqueness (excluding current admin)
      const existing = await AdminModel.findByEmail(email);
      if (existing && existing.id !== req.admin.id) {
        return sendError(res, 'Email is already in use by another admin.', 409);
      }

      await AdminModel.updateProfile(req.admin.id, { full_name, email });
      const updated = await AdminModel.findById(req.admin.id);

      logger.info(`Admin profile updated: ${req.admin.username}`);
      return sendSuccess(res, 'Profile updated successfully.', updated);
    } catch (error) {
      logger.error(`Update profile error: ${error.message}`);
      return sendError(res, 'Failed to update profile.');
    }
  },

  /**
   * PUT /api/auth/change-password
   * Change admin password after verifying current password.
   */
  changePassword: async (req, res) => {
    try {
      const { current_password, new_password } = req.body;

      const admin = await AdminModel.findByIdWithPassword(req.admin.id);
      if (!admin) {
        return sendNotFound(res, 'Admin not found.');
      }

      const isMatch = await bcrypt.compare(current_password, admin.password_hash);
      if (!isMatch) {
        return sendError(res, 'Current password is incorrect.', 400);
      }

      const saltRounds = 12;
      const newHash = await bcrypt.hash(new_password, saltRounds);
      await AdminModel.updatePassword(req.admin.id, newHash);

      logger.info(`Admin changed password: ${admin.username}`);
      return sendSuccess(res, 'Password changed successfully.');
    } catch (error) {
      logger.error(`Change password error: ${error.message}`);
      return sendError(res, 'Failed to change password.');
    }
  },
};

module.exports = authController;
