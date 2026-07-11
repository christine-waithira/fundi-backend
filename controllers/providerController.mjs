import Provider from '../models/provider.mjs';

//  GET ALL PROVIDERS FROM DATABASE
export const getAllProviders = async (req, res) => {
  try {
    // .find() fetches every single provider stored inside MongoDB
    const providers = await Provider.find();
    res.status(200).json(providers);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve providers", error: error.message });
  }
};

//  REGISTER A NEW PROVIDER
export const registerProvider = async (req, res) => {
  try {
    const { name, skill, location, experience, bio } = req.body;

    // Create a new document block using our Mongoose Schema blueprint
    const newProvider = new Provider({
      name,
      skill,
      location,
      experience: `${experience} years`,
      bio,
      reviews: [{ client: "System", comment: "New provider joined the network!", stars: "5 ★" }]
    });

    // Save the provider permanently into the MongoDB database collections
    const savedProvider = await newProvider.save();
    res.status(201).json(savedProvider);
  } catch (error) {
    res.status(400).json({ message: "Failed to create professional profile", error: error.message });
  }
};