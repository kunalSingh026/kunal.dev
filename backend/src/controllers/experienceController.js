const Experience = require('../models/Experience');

exports.getAllExperiences = async (req, res) => {
  try {
    const experiences = await Experience.findAll({
      order: [
        ['order', 'ASC'],
        ['createdAt', 'DESC']
      ]
    });
    return res.status(200).json(experiences);
  } catch (error) {
    console.error('Get experiences error:', error);
    return res.status(500).json({ message: 'Server error retrieving experiences.' });
  }
};

exports.createExperience = async (req, res) => {
  const { role, company, period, description, location, order } = req.body;

  if (!role || !company || !period || !description) {
    return res.status(400).json({ message: 'Role, company, period, and description are required.' });
  }

  try {
    const experience = await Experience.create({
      role,
      company,
      period,
      description,
      location,
      order: order || 0
    });
    return res.status(201).json(experience);
  } catch (error) {
    console.error('Create experience error:', error);
    return res.status(500).json({ message: 'Server error creating experience.' });
  }
};

exports.updateExperience = async (req, res) => {
  const { id } = req.params;
  const { role, company, period, description, location, order } = req.body;

  try {
    const experience = await Experience.findByPk(id);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found.' });
    }

    await experience.update({
      role: role !== undefined ? role : experience.role,
      company: company !== undefined ? company : experience.company,
      period: period !== undefined ? period : experience.period,
      description: description !== undefined ? description : experience.description,
      location: location !== undefined ? location : experience.location,
      order: order !== undefined ? order : experience.order
    });

    return res.status(200).json(experience);
  } catch (error) {
    console.error('Update experience error:', error);
    return res.status(500).json({ message: 'Server error updating experience.' });
  }
};

exports.deleteExperience = async (req, res) => {
  const { id } = req.params;

  try {
    const experience = await Experience.findByPk(id);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found.' });
    }

    await experience.destroy();
    return res.status(200).json({ message: 'Experience deleted successfully.' });
  } catch (error) {
    console.error('Delete experience error:', error);
    return res.status(500).json({ message: 'Server error deleting experience.' });
  }
};
