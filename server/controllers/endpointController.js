import Endpoint from '../models/Endpoint.js';

// @desc    Fetch all endpoints for the logged-in user
// @route   GET /api/endpoints
const getEndPoints = async (req, res) => {
  try {
    // SECURE: Finds only endpoints where the owner matches the logged-in user's ID.
    const endpoints = await Endpoint.find({ owner: req.user._id });
    res.json(endpoints);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new endpoint for the logged-in user
// @route   POST /api/endpoints
const createEndPoint = async (req, res) => {
  const { name, url } = req.body;

  if (!name || !url) {
    return res.status(400).json({ message: 'Please provide a name and URL' });
  }

  try {
    const newEndpoint = new Endpoint({
      name,
      url,
      // SECURE: The owner is now the ID of the authenticated user.
      owner: req.user._id,
    });

    const savedEndpoint = await newEndpoint.save();
    res.status(201).json(savedEndpoint);
  } catch (error) {
    // Note: A small typo was here ("Sever Error"), corrected to "Server Error"
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get a single endpoint by ID
// @route   GET /api/endpoints/:id
const getEndpointById = async (req, res) => {
  try {
    const endpoint = await Endpoint.findById(req.params.id);

    // First, check if the endpoint exists at all.
    if (!endpoint) {
      return res.status(404).json({ message: 'Endpoint not found' });
    }

    // SECURE: Check if the logged-in user is the owner.
    if (endpoint.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // If both checks pass, send the data.
    res.json(endpoint);
    
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update an endpoint
// @route   PUT /api/endpoints/:id
const updateEndPoint = async (req, res) => {
  const { name, url } = req.body;
  try {
    const endpoint = await Endpoint.findById(req.params.id);

    if (!endpoint) {
      return res.status(404).json({ message: 'Endpoint not found' });
    }

    // SECURE: Ensure the user trying to update is the owner.
    if (endpoint.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    endpoint.name = name || endpoint.name;
    endpoint.url = url || endpoint.url;

    const updatedEndpoint = await endpoint.save();
    // A small variable name inconsistency was here, corrected for clarity.
    res.json(updatedEndpoint);

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete an endpoint
// @route   DELETE /api/endpoints/:id
const deleteEndPoint = async (req, res) => {
  try {
    const endpoint = await Endpoint.findById(req.params.id);

    if (!endpoint) {
      return res.status(404).json({ message: 'Endpoint not found' });
    }

    // SECURE: Ensure the user trying to delete is the owner.
    if (endpoint.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await endpoint.deleteOne();
    res.json({ message: 'Endpoint removed' });
    
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


// EXPORTING YOUR EXACT FUNCTION NAMES
export {
  getEndPoints,
  createEndPoint,
  getEndpointById,
  updateEndPoint,
  deleteEndPoint,
};