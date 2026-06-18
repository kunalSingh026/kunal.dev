const Project = require('../models/Project');

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      order: [
        ['order', 'ASC'],
        ['createdAt', 'DESC']
      ]
    });
    return res.status(200).json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    return res.status(500).json({ message: 'Server error retrieving projects.' });
  }
};

exports.createProject = async (req, res) => {
  const { title, description, tags, githubUrl, liveUrl, imagePath, order } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required.' });
  }

  try {
    const project = await Project.create({
      title,
      description,
      tags,
      githubUrl,
      liveUrl,
      imagePath,
      order: order || 0
    });
    return res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    return res.status(500).json({ message: 'Server error creating project.' });
  }
};

exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const { title, description, tags, githubUrl, liveUrl, imagePath, order } = req.body;

  try {
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    await project.update({
      title: title !== undefined ? title : project.title,
      description: description !== undefined ? description : project.description,
      tags: tags !== undefined ? tags : project.tags,
      githubUrl: githubUrl !== undefined ? githubUrl : project.githubUrl,
      liveUrl: liveUrl !== undefined ? liveUrl : project.liveUrl,
      imagePath: imagePath !== undefined ? imagePath : project.imagePath,
      order: order !== undefined ? order : project.order
    });

    return res.status(200).json(project);
  } catch (error) {
    console.error('Update project error:', error);
    return res.status(500).json({ message: 'Server error updating project.' });
  }
};

exports.deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    await project.destroy();
    return res.status(200).json({ message: 'Project deleted successfully.' });
  } catch (error) {
    console.error('Delete project error:', error);
    return res.status(500).json({ message: 'Server error deleting project.' });
  }
};
