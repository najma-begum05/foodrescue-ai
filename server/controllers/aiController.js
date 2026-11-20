import mongoose from 'mongoose';
import FoodListing from '../models/FoodListing.js';
import { inMemoryListings } from './listingController.js';
import { evaluateMatch } from '../services/aiMatchingService.js';
import { classifyFoodUrgency, forecastSurplusVolume } from '../services/urgencyPredictionService.js';

/**
 * @route   GET /api/ai/recommendations
 * @desc    Get AI-ranked food surplus recommendations for the logged-in NGO
 * @access  Private (NGO / Admin)
 */
export const getNgoRecommendations = async (req, res) => {
  try {
    const ngoUser = req.user;

    let availableListings = [];

    if (mongoose.connection.readyState === 1) {
      availableListings = await FoodListing.find({
        status: 'Available',
        quantity: { $gt: 0 }
      }).lean();
    } else {
      availableListings = inMemoryListings.filter(l => l.status === 'Available' && l.quantity > 0);
    }

    const recommendations = availableListings.map(listing => {
      const matchResult = evaluateMatch(listing, ngoUser);
      const urgencyResult = classifyFoodUrgency(listing.category, listing.expiryDate, listing.storageRequirements);

      return {
        ...listing,
        aiMatchScore: matchResult.matchScore,
        distanceKm: matchResult.distanceKm,
        matchExplanation: matchResult.explanation,
        hoursRemaining: matchResult.hoursRemaining,
        scoreBreakdown: matchResult.breakdown,
        urgencyPriority: urgencyResult.priority,
        recommendedAction: urgencyResult.recommendedAction
      };
    });

    recommendations.sort((a, b) => b.aiMatchScore - a.aiMatchScore);

    return res.json({
      success: true,
      count: recommendations.length,
      recommendations
    });
  } catch (err) {
    console.error('AI recommendation error:', err);
    return res.status(500).json({ success: false, message: 'Error generating AI recommendations.' });
  }
};

/**
 * @route   POST /api/ai/evaluate
 * @desc    Evaluate match score between arbitrary listing & custom NGO criteria
 * @access  Public
 */
export const evaluateArbitraryMatch = async (req, res) => {
  try {
    const { listing, ngoCriteria } = req.body;
    if (!listing || !ngoCriteria) {
      return res.status(400).json({ success: false, message: 'Please provide listing and NGO criteria.' });
    }

    const result = evaluateMatch(listing, ngoCriteria);
    return res.json({ success: true, result });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error evaluating match score.' });
  }
};

/**
 * @route   POST /api/ai/predict-urgency
 * @desc    Predict expiry urgency priority (Critical, Urgent, Moderate, Low)
 * @access  Public
 */
export const predictUrgency = async (req, res) => {
  try {
    const { category, expiryDate, storageCondition } = req.body;
    if (!category || !expiryDate) {
      return res.status(400).json({ success: false, message: 'Please provide category and expiry date.' });
    }

    const result = classifyFoodUrgency(category, expiryDate, storageCondition);
    return res.json({ success: true, result });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error classifying urgency.' });
  }
};

/**
 * @route   POST /api/ai/forecast-surplus
 * @desc    Predict end-of-day food surplus volume based on preparation batch & day
 * @access  Public
 */
export const forecastSurplus = async (req, res) => {
  try {
    const { preparedQuantity, category, dayOfWeek, eventType } = req.body;
    if (!preparedQuantity || !category) {
      return res.status(400).json({ success: false, message: 'Please provide prepared quantity and category.' });
    }

    const result = forecastSurplusVolume(preparedQuantity, category, dayOfWeek, eventType);
    return res.json({ success: true, result });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error forecasting surplus volume.' });
  }
};
